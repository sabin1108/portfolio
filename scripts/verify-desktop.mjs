// Run through ego-browser nodejs with ?space=<id>&base=<URL>.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const options=new URL(import.meta.url).searchParams;
const base=options.get('base')||'http://127.0.0.1:4174';
const task=await taskSpace(Number(options.get('space')||9));
const page=task.page('p1');
const documents=JSON.parse(await fs.readFile(path.join(root,'public/documents/manifest.json'),'utf8')).documents;
const output=path.join(root,'tmp/single-page-review');await fs.mkdir(output,{recursive:true});
await page.cdp('egoAutomated.disable');await page.cdp('Runtime.enable');await page.events();
const results=[];
const innerScrolling=[];
async function check(name,run){try{await run();results.push({name,passed:true});}catch(error){results.push({name,passed:false,error:error.message});}}
async function open(route='/GYEOLSOFT'){await page.goto(base+route);await page.waitForSelector('.document-page');}
async function select(index){await page.click(`loc=css:.toc-rail nav button >> nth=${index}`);await page.waitForFunction(n=>Number(document.querySelector('.document-page').dataset.page)===n,index);}
async function wheel(delta){const frame=await page.evaluate(()=>document.querySelector('.slide-reader').getBoundingClientRect().toJSON());await page.mouse.move(frame.left+frame.width/2,frame.top+Math.min(frame.height/2,240));await page.mouse.wheel(0,delta);}
const currentPage=()=>page.evaluate(()=>Number(document.querySelector('.document-page').dataset.page));

await check('one page, narrow far-left rail and introduction metrics',async()=>{
  await open();
  const state=await page.evaluate(()=>({count:document.querySelectorAll('.document-page').length,rail:document.querySelector('.toc-rail')?.getBoundingClientRect().toJSON(),cover:!!document.querySelector('.layout-cover'),metrics:document.querySelectorAll('.metrics>div').length}));
  assert.equal(state.count,1,'Two document pages are present at once');
  assert(state.rail&&state.rail.left===0&&state.rail.width<=72,'Contents is not a thin left rail');
  assert(state.cover&&state.metrics===4,'Introduction structure is missing');
});
await check('contents opens as overlay without shifting the slide',async()=>{
  const before=await page.evaluate(()=>document.querySelector('.document-page').getBoundingClientRect().left);
  await page.click('loc=css:.toc-toggle');
  assert.equal(await page.evaluate(()=>document.querySelector('.toc-toggle').getAttribute('aria-expanded')),'true');
  assert.equal(await page.evaluate(()=>document.querySelector('.document-page').getBoundingClientRect().left),before);
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.evaluate(()=>document.querySelector('.document-page').dataset.page),'0','Arrow key changed slide behind open contents');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>document.querySelector('.toc-toggle').getAttribute('aria-expanded')),'false');
  assert.equal(await page.evaluate(()=>document.activeElement.className),'toc-toggle');
  await page.click('loc=css:.toc-toggle');
  await select(3);
  assert.equal(await page.evaluate(()=>document.querySelector('.toc-toggle').getAttribute('aria-expanded')),'false');
});
await check('previous/next, keyboard and endpoint bounds',async()=>{
  await select(0);
  assert.equal(await page.evaluate(()=>document.querySelector('.previous-page').disabled),true);
  await page.click('loc=css:.next-page');
  await page.waitForFunction(()=>document.querySelector('.document-page').dataset.page==='1');
  await page.evaluate(()=>getSelection()?.removeAllRanges());
  await page.focus('loc=css:#document');await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>document.querySelector('.document-page').dataset.page==='2');
  await page.keyboard.press('ArrowLeft');await page.waitForFunction(()=>document.querySelector('.document-page').dataset.page==='1');
  await select(documents.gyeolsoft.pages.length-1);
  assert.equal(await page.evaluate(()=>document.querySelector('.next-page').disabled),true);
});

for(const [width,height,dpr] of [[960,1080,1],[1280,900,1],[1280,1440,1],[1366,768,1],[1440,1000,1],[1920,1080,2],[2560,1440,1]]){
  await page.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:dpr,mobile:false});
  for(const [route,id] of [['/','main'],['/GYEOLSOFT','gyeolsoft']]){
    await check(`all ${id} slides, ${width}x${height} DPR${dpr}`,async()=>{
      await open(route);
      for(const [index,source] of documents[id].pages.entries()){
        await select(index);
        await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('.document-page img')].map(image=>image.decode()));});
        const state=await page.evaluate(async html=>{
          await new Promise(resolve=>requestAnimationFrame(resolve));
          const sheet=document.querySelector('.document-page .sheet');
          const frame=document.querySelector('.document-page').getBoundingClientRect();
          const source=new DOMParser().parseFromString(html,'text/html').querySelector('.sheet');
          const normalize=value=>value.replace(/\s+/g,'').trim();
          const fonts=[...sheet.querySelectorAll('.body p,.legacy-item>div')].filter(node=>!node.closest('.overview-meta,.overview-stack')).map(node=>parseFloat(getComputedStyle(node).fontSize));
          const reader=sheet.closest('.document-page');
          const media=sheet.querySelector('.legacy-media-row'),details=media?.nextElementSibling;
          return{count:document.querySelectorAll('.document-page').length,sameText:normalize(sheet.textContent)===normalize(source.textContent),horizontal:document.documentElement.scrollWidth>innerWidth,bodyScroll:document.documentElement.scrollHeight>innerHeight+1,frame:frame.toJSON(),width:innerWidth,height:innerHeight,fonts,inner:[reader].filter(element=>element.scrollHeight>element.clientHeight+3).map(element=>({className:element.className,extra:element.scrollHeight-element.clientHeight,overflow:getComputedStyle(element).overflowY})),clippedX:sheet.scrollWidth>sheet.clientWidth+2,layout:[...sheet.classList].some(name=>name.startsWith('layout-')),uncropped:[...sheet.querySelectorAll('img')].every(image=>getComputedStyle(image).objectFit==='contain'),screensAboveText:!media||media.getBoundingClientRect().bottom<=details.getBoundingClientRect().top+2};
        },source.html);
        assert.equal(state.count,1);
        assert(state.sameText,'Current page content changed');
        assert(!state.horizontal&&!state.bodyScroll&&!state.clippedX,'Slide overflows browser');
        assert(state.frame.top>=100&&state.frame.bottom<=height-50,'Slide escapes its screen slot');
        assert(state.fonts.every(size=>size>=18),'Primary body shrunk below18px');
        assert(state.inner.every(element=>element.overflow==='auto'||element.overflow==='scroll'),'Long text is inaccessible');
        assert(state.layout&&state.uncropped&&state.screensAboveText,'Page layout or full-image placement is wrong');
        if(state.inner.length)innerScrolling.push({document:id,page:index+1,width,extra:state.inner});
        if(width===1440&&[0,3,16].includes(index))await page.screenshot({path:path.join(output,`${id}-${index+1}-${width}.png`)});
      }
    });
  }
}
await check('wheel gesture advances once, locks inertia and allows a fresh reverse gesture',async()=>{
  await open();
  await wheel(120);await page.waitForFunction(()=>document.querySelector('.document-page').dataset.page==='1');
  await wheel(120);assert.equal(await currentPage(),1,'Immediate second input skipped a page');
  await open();
  await page.evaluate(async()=>{
    for(let index=0;index<45;index++){
      document.querySelector('.slide-reader').dispatchEvent(new WheelEvent('wheel',{deltaY:48,bubbles:true,cancelable:true}));
      await new Promise(resolve=>setTimeout(resolve,30));
    }
  });
  assert.equal(await currentPage(),1,'One long inertia burst skipped multiple pages');
  // These pauses are the timing contract under test, rather than a page-load wait.
  await page.waitForTimeout(220);await wheel(120);
  await page.waitForFunction(()=>document.querySelector('.document-page').dataset.page==='2');
  await wheel(-120);assert.equal(await currentPage(),2);
  await page.waitForTimeout(700);await wheel(-120);
  await page.waitForFunction(()=>document.querySelector('.document-page').dataset.page==='1');
});
await check('wheel units, zoom modifier, horizontal input and contents isolation',async()=>{
  for(const [deltaY,deltaMode]of [[3,1],[1,2]]){
    await open();await page.evaluate(({deltaY,deltaMode})=>document.querySelector('.slide-reader').dispatchEvent(new WheelEvent('wheel',{deltaY,deltaMode,bubbles:true,cancelable:true})),{deltaY,deltaMode});
    await page.waitForFunction(()=>document.querySelector('.document-page').dataset.page==='1');
  }
  await open();
  const bypassed=await page.evaluate(()=>[ {deltaY:120,ctrlKey:true}, {deltaY:80,deltaX:120} ].map(options=>document.querySelector('.slide-reader').dispatchEvent(new WheelEvent('wheel',{...options,bubbles:true,cancelable:true}))));
  assert(bypassed.every(Boolean));assert.equal(await currentPage(),0);
  await page.click('loc=css:.toc-toggle');await wheel(120);assert.equal(await currentPage(),0);await page.keyboard.press('Escape');
  await wheel(-120);assert.equal(await currentPage(),0,'First-page upper boundary is not fixed');
});
await check('landing on a long page stays fixed through trailing wheel input',async()=>{
  await page.cdp('Emulation.setDeviceMetricsOverride',{width:960,height:700,deviceScaleFactor:1,mobile:false});
  await open();await select(7);await page.waitForTimeout(700);
  await page.evaluate(()=>{const reader=document.querySelector('.slide-reader');reader.scrollTop=reader.scrollHeight;});
  await wheel(120);await page.waitForFunction(()=>document.querySelector('.document-page').dataset.page==='8');
  await wheel(120);await page.waitForTimeout(180);assert.equal(await page.evaluate(()=>document.querySelector('.slide-reader').scrollTop),0,'Inertia scrolled the newly opened page');
});
await check('small-window content scrolls first and needs a fresh gesture at either boundary',async()=>{
  await page.cdp('Emulation.setDeviceMetricsOverride',{width:960,height:700,deviceScaleFactor:1,mobile:false});
  await open();await select(8);await page.waitForTimeout(700);
  assert(await page.evaluate(()=>document.querySelector('.slide-reader').scrollHeight>document.querySelector('.slide-reader').clientHeight+100));
  await wheel(120);await page.waitForFunction(()=>document.querySelector('.slide-reader').scrollTop>20);assert.equal(await currentPage(),8);
  await page.evaluate(()=>{const reader=document.querySelector('.slide-reader');reader.dispatchEvent(new WheelEvent('wheel',{deltaY:40,bubbles:true,cancelable:true}));reader.scrollTop=reader.scrollHeight;reader.dispatchEvent(new WheelEvent('wheel',{deltaY:120,bubbles:true,cancelable:true}));});
  assert.equal(await currentPage(),8,'Reading inertia crossed the lower boundary');
  await page.waitForTimeout(220);await wheel(120);await page.waitForFunction(()=>document.querySelector('.document-page').dataset.page==='9');
  assert.equal(await page.evaluate(()=>document.querySelector('.slide-reader').scrollTop),0);
  await select(8);await page.waitForTimeout(700);await page.evaluate(()=>{document.querySelector('.slide-reader').scrollTop=180;});
  await wheel(-80);await page.waitForFunction(()=>document.querySelector('.slide-reader').scrollTop<160);assert.equal(await currentPage(),8);
  await page.evaluate(()=>{const reader=document.querySelector('.slide-reader');reader.dispatchEvent(new WheelEvent('wheel',{deltaY:-40,bubbles:true,cancelable:true}));reader.scrollTop=0;reader.dispatchEvent(new WheelEvent('wheel',{deltaY:-120,bubbles:true,cancelable:true}));});
  assert.equal(await currentPage(),8,'Reading inertia crossed the upper boundary');
  await page.waitForTimeout(220);await wheel(-120);await page.waitForFunction(()=>document.querySelector('.document-page').dataset.page==='7');
  await page.cdp('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
});
await check('text selection and Find apply to current visible slide',async()=>{
  await open('/');
  const selected=await page.evaluate(()=>{const p=document.querySelector('.cover-lead p');const range=document.createRange();range.selectNodeContents(p);getSelection().removeAllRanges();getSelection().addRange(range);return{length:getSelection().toString().length,width:range.getBoundingClientRect().width};});
  assert(selected.length>20&&selected.width>30);
  assert.equal(await page.evaluate(()=>{getSelection().removeAllRanges();return window.find('폴더 연결, 자료 검색과 질문');}),true);
});
await check('tab hash, Back/Forward and keyboard remain synchronized',async()=>{
  await open();await page.click('loc=css:#tab-resume');
  await page.waitForSelector('.resume-view');assert.equal(await page.evaluate(()=>location.hash),'#resume');
  await page.evaluate(()=>history.back());await page.waitForSelector('.deck-view');
  assert.equal(await page.evaluate(()=>document.querySelectorAll('.document-page').length),1);
  await page.evaluate(()=>history.forward());await page.waitForSelector('.resume-view');
  await page.focus('loc=css:#tab-resume');await page.keyboard.press('ArrowLeft');await page.waitForSelector('.deck-view');
  await page.evaluate(()=>{location.hash='resume';});await page.waitForSelector('.resume-view');
});
await check('resume separates introduction, motivation and verified history without repeated headings',async()=>{
  await open('/GYEOLSOFT#resume');
  const state=await page.evaluate(()=>{
    const first=document.querySelector('.resume-page');const cases=[...first.querySelectorAll('.bin-classic-achievements li')];const bounds=cases.map(e=>e.getBoundingClientRect());
    const name=first.querySelector('.bin-classic-header h1').getBoundingClientRect();const photo=first.querySelector('.bin-classic-photo').getBoundingClientRect();
    return{count:document.querySelectorAll('.resume-page').length,intro:!!first.querySelector('.bin-classic-intro'),motivationBelowIntro:first.querySelector('.bin-classic-intro').closest('.bin-classic-section').nextElementSibling.querySelector('h2')?.textContent==='지원동기',role:!!first.querySelector('.bin-classic-role-line'),caseCount:cases.length,stacked:bounds[1].top>=bounds[0].bottom,noRepeatedRules:cases.every(element=>parseFloat(getComputedStyle(element).borderTopWidth)===0),photoRight:photo.left>name.left,skills:document.querySelectorAll('.bin-classic-skill-row').length,headings:[...document.querySelectorAll('.bin-classic-section>h2')].map(e=>e.textContent),projectHeadings:document.querySelectorAll('.bin-classic-project-heading').length,runningHeaders:document.querySelectorAll('.sheet.resume>header').length,records:document.querySelectorAll('.bin-classic-records>li').length,training:document.querySelector('.bin-classic-training').textContent,text:document.querySelector('.resume-workspace').textContent,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  assert.equal(state.count,2);assert(state.intro&&state.motivationBelowIntro&&state.role&&state.stacked&&state.noRepeatedRules&&state.photoRight&&!state.overflow);assert.equal(state.caseCount,3);assert.equal(state.skills,4);assert.deepEqual(state.headings,['자기소개','지원동기','프로젝트 경험','기술 역량','학력 · 자격 · 교육','연구 · 특허 · 수상']);
  assert.equal(state.projectHeadings,1);assert.equal(state.runningHeaders,0);assert.equal(state.records,4);assert(state.training.includes('LG CNS AM Inspire Camp 7기')&&state.training.includes('교육 중'));
  for(const text of ['신뢰를 쌓는 프론트엔드','React SPA','아토믹 디자인','Better Auth','Stepper','searchParams','1.541초','0.675초','56.2%','76.27px','0px','입력 DOM도 더 이상 제거되지','36표본','특허 출원','우수상'])assert(state.text.includes(text),`Resume evidence missing: ${text}`);
  await page.screenshot({path:path.join(output,'resume-original-structure.png')});
});
await check('resume contents follows native page scrolling',async()=>{
  await page.evaluate(()=>document.querySelectorAll('.resume-page')[1].scrollIntoView({block:'start'}));
  await page.waitForFunction(()=>document.querySelector('.toc-rail nav button[aria-current="page"]').getAttribute('aria-label').startsWith('2페이지'),undefined,{timeout:1200});
});
await check('zoom closes to same slide and launcher',async()=>{
  await open();const index=documents.gyeolsoft.pages.findIndex(item=>item.title==='파일 구조');await select(index);
  await page.focus('loc=css:.page-zoom-button');await page.keyboard.press('Enter');await page.waitForSelector('dialog[open]');
  assert.equal(await page.evaluate(()=>!!document.querySelector('dialog .folder-tree')),true);
  await page.click('loc=css:.zoom-controls button[aria-label="확대"]');
  await page.waitForFunction(()=>document.querySelector('.zoom-reset').textContent==='125%');
  await page.mouse.move(2,2);await page.mouse.wheel(0,500);
  assert.equal(await page.evaluate(()=>scrollY),0);
  await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog'));
  assert.equal(await page.evaluate(()=>Number(document.querySelector('.document-page').dataset.page)),index);
  assert.equal(await page.evaluate(()=>document.activeElement.className),'page-zoom-button');
});
await check('three PDF downloads remain valid',async()=>{
  for(const [id,document] of Object.entries(documents)){
    const response=await page.fetch(document.pdf,{saveAs:path.join(output,`${id}.pdf`)});assert.equal(response.status,200);assert.equal((await fs.readFile(path.join(output,`${id}.pdf`))).subarray(0,4).toString(),'%PDF');
  }
});
await check('old routes stay blocked',async()=>{
  for(const route of ['/resume','/portfolio_bin','/frontend','/fullstack','/ai-portfolio','/ax','/?resume=old']){await page.goto(base+route);await page.waitForSelector('loc=role:heading[name="페이지를 찾을 수 없습니다."]');assert.equal(await page.evaluate(()=>document.querySelectorAll('.document-page').length),0);}
});
await check('no uncaught browser errors',async()=>{const events=await page.events();assert.deepEqual(events.filter(event=>event.method==='Runtime.exceptionThrown'||(event.method==='Runtime.consoleAPICalled'&&event.params.type==='error')),[]);});
await fs.writeFile(path.join(output,'checks.json'),JSON.stringify({base,results,innerScrolling},null,2));
console.log(JSON.stringify({base,results,scrollingPages:innerScrolling.length}));assert(results.every(result=>result.passed),'Desktop regressions failed');
