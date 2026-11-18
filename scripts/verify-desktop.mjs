// Run with ego-browser nodejs -e "await import('file:///.../verify-desktop.mjs?space=9&base=http://127.0.0.1:4174')"
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const options=new URL(import.meta.url).searchParams;
const base=options.get('base')||'http://127.0.0.1:4174';
const task=await taskSpace(Number(options.get('space')||9));
const page=task.page('p1');
await page.cdp('egoAutomated.disable');
await page.cdp('Runtime.enable');
await page.events();
const output=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../tmp/desktop-review-20261118');
await fs.mkdir(output,{recursive:true});
const results=[];
async function check(name,run){
  try{await run();results.push({name,passed:true});}
  catch(error){results.push({name,passed:false,error:error.message});}
}
async function open(route='/GYEOLSOFT'){
  await page.goto(base+route);
  await page.waitForSelector('.document-page');
}

await check('visible text is selectable, not a raster page',async()=>{
  await open();
  const text=await page.evaluate(()=>{
    const p=document.querySelector('.document-sheet .body p');
    if(!p)return '';
    const range=document.createRange();range.selectNodeContents(p);
    const selection=getSelection();selection.removeAllRanges();selection.addRange(range);
    return selection.toString();
  });
  assert(text.length>20,'Visible body text cannot be selected');
});
await check('hash changes synchronize the resume tab',async()=>{
  await open();
  await page.evaluate(()=>{location.hash='resume';});
  await page.waitForFunction(()=>document.querySelector('[role=tab][aria-selected=true]')?.textContent==='이력서',undefined,{timeout:3000});
  assert.equal(await page.evaluate(()=>document.querySelectorAll('.document-page').length),2);
});
await check('zoom backdrop does not scroll the background',async()=>{
  await open();
  const selector=await page.evaluate(()=>document.querySelector('.page-zoom-button')?'.page-zoom-button':'.page-image-button');
  await page.click(`loc=css:${selector} >> nth=0`);
  await page.waitForSelector('dialog[open]');
  const before=await page.evaluate(()=>scrollY);
  await page.mouse.move(2,2);await page.mouse.wheel(0,600);
  const after=await page.evaluate(()=>scrollY);
  await page.keyboard.press('Escape');
  assert.equal(after,before,'Background moved while zoom dialog was open');
});

await check('tabs support Back, Forward, hash links and keyboard',async()=>{
  await open();
  await page.click('loc=css:#tab-resume');
  await page.waitForFunction(()=>document.querySelectorAll('.document-page').length===2);
  assert.equal(await page.evaluate(()=>location.hash),'#resume');
  await page.evaluate(()=>history.back());
  await page.waitForFunction(()=>document.querySelectorAll('.document-page').length===13);
  assert.equal(await page.evaluate(()=>location.hash),'');
  await page.evaluate(()=>history.forward());
  await page.waitForFunction(()=>document.querySelectorAll('.document-page').length===2);
  await page.focus('loc=css:#tab-resume');
  await page.keyboard.press('ArrowLeft');
  await page.waitForFunction(()=>document.querySelectorAll('.document-page').length===13);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'tab-portfolio');
  await page.keyboard.press('End');
  await page.waitForFunction(()=>document.querySelectorAll('.document-page').length===2);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'tab-resume');
});

for(const [width,height,dpr] of [[1280,900,1],[1440,1000,1],[1920,1080,2],[1024,720,1.25],[960,540,2]]){
  await page.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:dpr,mobile:false});
  for(const [route,count,label] of [['/',6,'main'],['/GYEOLSOFT',13,'gyeolsoft'],['/GYEOLSOFT#resume',2,'resume']]){
    await check(`desktop layout ${label} ${width}px DPR${dpr}`,async()=>{
      await open(route);
      await page.waitForFunction(n=>document.querySelectorAll('.document-page').length===n,count);
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('.document-sheet img')].map(image=>image.decode()));});
      const state=await page.evaluate(()=>({
        overflow:document.documentElement.scrollWidth>innerWidth,
        headerHeight:document.querySelector('.site-header').clientHeight,
        rasterPages:document.querySelectorAll('.page-image-button').length,
        pages:[...document.querySelectorAll('.document-pages .document-sheet')].map(element=>{
          const sheet=element.querySelector('.sheet');
          const content=sheet.querySelector('.page-content').getBoundingClientRect();
          const footer=sheet.querySelector('footer').getBoundingClientRect();
          const bounds=sheet.getBoundingClientRect();
          const frame=element.closest('.document-surface').getBoundingClientRect();
          const scale=new DOMMatrix(getComputedStyle(element).transform).a;
          const bodyFonts=[...sheet.querySelectorAll('.body>p,.block,.experience p,.stack p')].map(node=>parseFloat(getComputedStyle(node).fontSize)*scale);
          return{text:sheet.innerText.replace(/\s+/g,' ').trim(),gap:footer.top-content.bottom,extraWidth:bounds.width-frame.width,extraHeight:bounds.height-frame.height,bodyFonts};
        })
      }));
      assert(!state.overflow,'Horizontal browser overflow');
      assert.equal(state.headerHeight,82,'Document CSS leaked into site header');
      assert.equal(state.rasterPages,0,'Raster page remains');
      assert.equal(state.pages.length,count);
      assert(state.pages.every(p=>p.bodyFonts.every(size=>size>=17)),`Default body text below17px: ${JSON.stringify(state.pages.map(p=>p.bodyFonts))}`);
      assert(state.pages.every(p=>p.gap>=6&&p.extraWidth<=1&&p.extraHeight<=1),'Page content is clipped or overlaps footer');
      const manifest=(await page.fetch('/documents/manifest.json')).body;
      const documentData=typeof manifest==='string'?JSON.parse(manifest):manifest;
      assert.deepEqual(state.pages.map(p=>p.text),documentData.documents[label].pages.map(p=>p.text.replace(/\s+/g,' ').trim()),'Web text differs from PDF authoring');
      const downloadPath=await page.evaluate(()=>document.querySelector('a.download').getAttribute('href'));
      const response=await page.fetch(downloadPath,{saveAs:path.join(output,`${label}.pdf`)});
      assert.equal(response.status,200);
      assert.equal((await fs.readFile(path.join(output,`${label}.pdf`))).subarray(0,4).toString(),'%PDF');
      if(width===1440)await page.screenshot({path:path.join(output,`${label}-${width}.png`)});
    });
  }
}

await check('Find targets real visible text',async()=>{
  await open('/');
  const found=await page.evaluate(()=>{
    getSelection()?.removeAllRanges();
    const matched=window.find('폴더 연결, 자료 검색과 질문');
    const selection=getSelection();
    const element=selection?.anchorNode?.parentElement;
    return{matched,inDocument:Boolean(element?.closest('.document-sheet')),width:selection?.getRangeAt(0).getBoundingClientRect().width};
  });
  assert(found.matched&&found.inDocument&&found.width>20,'Find selected hidden or absent text');
});

await check('table of contents follows all pages while scrolling',async()=>{
  await open();
  for(const index of [0,4,8,9,12,5,1]){
    await page.click(`loc=css:.page-index nav button >> nth=${index}`);
    await page.waitForFunction(n=>document.querySelector('.page-index [aria-current] .page-number')?.textContent===String(n+1).padStart(2,'0'),index);
    const visible=await page.evaluate(()=>{
      const top=document.querySelector('.document-bar').getBoundingClientRect().bottom;
      const pages=[...document.querySelectorAll('.document-page')].map((e,index)=>{const b=e.getBoundingClientRect();return{index,overlap:Math.max(0,Math.min(b.bottom,innerHeight)-Math.max(b.top,top))};});
      return{expected:pages.sort((a,b)=>b.overlap-a.overlap)[0].index,current:Number(document.querySelector('.page-index [aria-current] .page-number').textContent)-1,toolbarTop:document.querySelector('.document-bar').getBoundingClientRect().top};
    });
    assert.equal(visible.current,visible.expected);
    assert(visible.toolbarTop>=-1,'Sticky document controls scrolled away');
  }
  await page.mouse.move(1400,600);
  await page.mouse.wheel(0,450);
  await page.waitForFunction(()=>{
    const top=document.querySelector('.document-bar').getBoundingClientRect().bottom;
    const pages=[...document.querySelectorAll('.document-page')].map((e,index)=>{const b=e.getBoundingClientRect();return{index,overlap:Math.max(0,Math.min(b.bottom,innerHeight)-Math.max(b.top,top))};});
    return Number(document.querySelector('.page-index [aria-current] .page-number').textContent)-1===pages.sort((a,b)=>b.overlap-a.overlap)[0].index;
  });
});

await check('zoom preserves text, reading position and launcher focus',async()=>{
  await open();
  await page.click('loc=css:.page-index nav button >> nth=9');
  const launcher='loc=css:.page-zoom-button >> nth=9';
  await page.focus(launcher);
  const before=await page.evaluate(()=>scrollY);
  await page.keyboard.press('Enter');
  await page.waitForSelector('dialog[open]');
  assert.equal(await page.evaluate(()=>Boolean(document.querySelector('dialog .folder-tree'))),true,'Native file tree absent');
  await page.click('loc=css:.zoom-controls button[aria-label="확대"]');
  await page.waitForFunction(()=>document.querySelector('.zoom-reset').textContent==='125%');
  await page.click('loc=css:.zoom-controls button[aria-label="확대"]');
  await page.waitForFunction(()=>document.querySelector('.zoom-reset').textContent==='150%');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:path.join(output,'tree-zoom-dpr2.png')});
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.querySelector('dialog'));
  const after=await page.evaluate(()=>({scrollY,focus:document.activeElement.getAttribute('aria-label'),overflow:document.body.style.overflow}));
  assert.equal(after.scrollY,before);
  assert(after.focus.startsWith('10페이지'));
  assert.equal(after.overflow,'');
});

await check('legacy routes remain blocked',async()=>{
  for(const route of ['/resume','/portfolio_bin','/frontend','/fullstack','/ai-portfolio','/ax','/?resume=old']){
    await page.goto(base+route);
    await page.waitForSelector('loc=role:heading[name="페이지를 찾을 수 없습니다."]');
    assert.equal(await page.evaluate(()=>document.querySelectorAll('.document-page').length),0);
  }
});

await check('no uncaught browser errors',async()=>{
  const events=await page.events();
  const errors=events.filter(event=>event.method==='Runtime.exceptionThrown'||(event.method==='Runtime.consoleAPICalled'&&event.params.type==='error'));
  assert.deepEqual(errors,[]);
});

await fs.writeFile(path.join(output,'checks.json'),JSON.stringify({base,results},null,2));
console.log(JSON.stringify({base,results}));
assert(results.every(r=>r.passed),'Desktop regressions failed');
