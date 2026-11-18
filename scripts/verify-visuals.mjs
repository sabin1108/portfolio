// Run via ego-browser nodejs with ?space=9&base=<URL>&baseline=<optional manifest path>.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const options=new URL(import.meta.url).searchParams;
const base=options.get('base')||'http://127.0.0.1:4174';
const task=await taskSpace(Number(options.get('space')||9));
const page=task.page('p1');
const manifest=JSON.parse(await fs.readFile(path.join(root,'public/documents/manifest.json'),'utf8'));
const baseline=options.get('baseline')?JSON.parse(await fs.readFile(options.get('baseline'),'utf8')):null;
const output=path.join(root,'tmp/visual-refinement');await fs.mkdir(output,{recursive:true});
const results=[],measurements=[];
async function check(name,run){try{await run();results.push({name,passed:true});}catch(error){results.push({name,passed:false,error:error.message});}}
await page.goto(base+'/GYEOLSOFT');await page.waitForSelector('.document-page');

if(baseline)await check('portfolio prose unchanged after removing new visual annotations',async()=>{
  const differences=await page.evaluate(({before,after})=>{
    const text=html=>{
      const doc=new DOMParser().parseFromString(html,'text/html');
      doc.querySelectorAll('.portfolio-visual:not([data-preserve-prose]),.tree-ellipsis,.tree-omission-note,.proof-badge,.evidence-condition,.project-links,.bin-classic-project-links').forEach(element=>element.remove());
      return doc.querySelector('.sheet').textContent.replace(/\s+/g,'');
    };
    return Object.entries(after.documents).filter(([id])=>id!=='resume').flatMap(([id,document])=>document.pages.filter(item=>text(item.html)!==text(before.documents[id].pages.find(old=>old.id===item.id).html)).map(item=>`${id}/${item.id}`));
  },{before:baseline,after:manifest});
  assert.deepEqual(differences,[]);
});
await check('introduction measurements are separate boxed outcome cards',async()=>{
  await page.click('loc=css:.toc-rail nav button >> nth=0');
  const cards=await page.evaluate(()=>[...document.querySelectorAll('.metrics>div')].map(element=>({border:parseFloat(getComputedStyle(element).borderTopWidth),font:parseFloat(getComputedStyle(element.querySelector('strong')).fontSize),text:element.textContent})));
  assert.equal(cards.length,4);assert(cards.every(card=>card.border>=1&&card.font>=32&&card.text.length>5));
});
await check('Moa repository and demo are available in portfolio and resume',async()=>{
  const expected=[manifest.profile.project.github,manifest.profile.project.demo].sort();
  const portfolio=await page.evaluate(()=>({header:[...document.querySelectorAll('.header-links a')].map(element=>element.href).filter(href=>href.startsWith('https:')).sort(),cover:[...document.querySelectorAll('.project-links a')].map(element=>({href:element.href,target:element.target}))}));
  assert.deepEqual(portfolio.header,expected);assert.deepEqual(portfolio.cover.map(link=>link.href).sort(),expected);assert(portfolio.cover.every(link=>link.target==='_blank'));
  await page.click('loc=css:#tab-resume');await page.waitForSelector('.resume-view');
  const resume=await page.evaluate(()=>[...document.querySelectorAll('.bin-classic-project-links a')].map(element=>element.href).sort());
  assert.deepEqual(resume,expected);
  await page.click('loc=css:#tab-portfolio');await page.waitForSelector('.deck-view');
});

const ids=['common-4-next','common-4-auth-workflow','common-4-components-cache','case-2','case-14','case-28','case-3','case-5','case-27','case-28-file-tree'];
for(const [width,height]of [[1265,864],[1920,1080],[2560,1440],[960,1080]]){
  await page.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await check(`evidence visuals, readable palette and layout ${width}x${height}`,async()=>{
    for(const id of ids){
      const index=manifest.documents.gyeolsoft.pages.findIndex(item=>item.id===id);
      assert(index>=0);await page.click(`loc=css:.toc-rail nav button >> nth=${index}`);
      await page.waitForFunction(n=>Number(document.querySelector('.document-page').dataset.page)===n,index);
      const state=await page.evaluate(()=>{
        const sheet=document.querySelector('.document-page .sheet');
        const reader=sheet.closest('.document-page'),readerRect=reader.getBoundingClientRect();
        const visual=sheet.querySelector('.portfolio-visual');
        const rect=visual?.getBoundingClientRect();
        const marks=visual?[...visual.querySelectorAll('.diagram-node,.diagram-caption,.diagram-note,.role-branch,.timeline-labels,.wire-list,.stable-rows,.metric-range,.metric-change,.evidence-condition')]:[];
        const clipping=visual?marks.filter(element=>{
          const bounds=element.getBoundingClientRect();
          return bounds.left<rect.left-2||bounds.right>rect.right+2||bounds.top<rect.top-2||bounds.bottom>rect.bottom+2||element.scrollWidth>element.clientWidth+2;
        }).map(element=>({class:element.className,text:element.textContent.slice(0,28)})):[];
        const luminance=color=>{
          const channels=color.match(/[\d.]+/g).slice(0,3).map(Number).map(value=>{value/=255;return value<=.04045?value/12.92:((value+.055)/1.055)**2.4;});
          return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
        };
        const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
        const paragraph=sheet.querySelector('.legacy-item>div,.decision-copy p,.body p');
        const background=getComputedStyle(sheet).backgroundColor;
        const ink=paragraph?getComputedStyle(paragraph).color:getComputedStyle(sheet).color;
        const imageText=visual?[...visual.querySelectorAll('.diagram-node,.diagram-caption,.diagram-note,.role-branch,.metric-before,.metric-after,.metric-change strong')].map(element=>contrast(getComputedStyle(element).color,getComputedStyle(visual).backgroundColor)):[];
        const contentMarks=[...marks,...sheet.querySelectorAll('.decision-note')];
        const lastMark=contentMarks.length?Math.max(...contentMarks.map(element=>element.getBoundingClientRect().bottom)):0;
        const medians=[...sheet.querySelectorAll('.metric-before,.metric-after')].map(element=>parseFloat(element.textContent));
        const reduction=parseFloat(sheet.querySelector('.metric-change strong')?.textContent);
        return{id:sheet.dataset.pageId,visual:visual?.dataset.visual,clipping,contrast:contrast(background,ink),background,imageContrasts:imageText,bodyFont:paragraph?parseFloat(getComputedStyle(paragraph).fontSize):18,usedHeight:(lastMark-readerRect.top)/readerRect.height,extra:reader.scrollHeight-reader.clientHeight,horizontal:reader.scrollWidth>reader.clientWidth+2,ellipses:sheet.querySelectorAll('.tree-ellipsis').length,medians,reduction,caption:visual?.textContent};
      });
      measurements.push({width,height,...state});
      assert(!state.horizontal,`${id} horizontal overflow`);
      assert(state.contrast>=4.5,`${id} body contrast ${state.contrast}`);
      assert(!state.background.includes('12, 16, 16'),'Old dark palette remains');
      assert(state.bodyFont>=18,`${id} body text shrunk`);
      if(id==='case-28-file-tree')assert.equal(state.ellipses,3);
      else{
        assert(state.visual,`${id} illustration missing`);
        assert.deepEqual(state.clipping,[],`${id} diagram text is clipped`);
        assert(state.imageContrasts.every(value=>value>=4.5),`${id} diagram label contrast`);
        if(width>=1920&&id.startsWith('common-4'))assert(state.usedHeight>=.72,`${id} lower area remains empty (${state.usedHeight})`);
      }
      if(id==='case-5'){
        assert.deepEqual(state.medians,[1.541,.675],'Metric card does not match recorded medians');
        assert(Math.abs(state.reduction-(1-.675/1.541)*100)<.05,'Reduction card disagrees with the measurements');
        assert(state.caption.includes('반복')&&state.caption.includes('36표본')&&state.caption.includes('변경 전→후→후→전'));
      }
      if(([1265,1920].includes(width)&&['common-4-next','common-4-auth-workflow','common-4-components-cache','case-2','case-3','case-5','case-28-file-tree'].includes(id))||(width===2560&&id.startsWith('common-4')))await page.screenshot({path:path.join(output,`${width}-${id}.png`)});
    }
  });
}
await fs.writeFile(path.join(output,'visual-checks.json'),JSON.stringify({base,results,measurements},null,2));
console.log(JSON.stringify({base,results,checkedPages:measurements.length}));
assert(results.every(result=>result.passed),'Visual refinements failed');
