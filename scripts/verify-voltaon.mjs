// Run through ego-browser nodejs with ?space=<id>&base=<URL>.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const options=new URL(import.meta.url).searchParams;
const base=options.get('base')||'http://127.0.0.1:4174';
assert(options.has('space'),'An existing task space is required');
const task=await taskSpace(Number(options.get('space'))),page=task.page('p1');
const data=JSON.parse(await fs.readFile(path.join(root,'content/voltaon.json'),'utf8'));
const final=JSON.parse(await fs.readFile(path.join(root,'content/portfolio.json'),'utf8'));
const resume=JSON.parse(await fs.readFile(path.join(root,'content/voltaon-resume.json'),'utf8'));
const finalResume=JSON.parse(await fs.readFile(path.join(root,'content/resume.json'),'utf8'));
assert.deepEqual(data.selectedCases,[13,12,14,2,28,3,6,27]);assert.deepEqual(data.common,final.common);
assert.equal(resume.introduction,finalResume.introduction);
for(const id of [2,14,28,3,27]){assert.deepEqual(data.voltaon.find(p=>p.sourceCase===id),final.gyeol.find(p=>p.sourceCase===id));assert.equal(resume.caseOverrides['case-'+id],finalResume.caseOverrides['case-'+id]);}
const results=[];
for(const [width,height]of [[960,700],[1280,900],[1920,1080]]){
 await page.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
 await page.goto(base+'/VoltaON');await page.waitForSelector('.deck-view');
 assert.equal(await page.evaluate(()=>document.querySelectorAll('.toc-rail nav button').length),19);
 for(let index=0;index<19;index++){
  await page.click(`loc=css:.toc-rail nav button >> nth=${index}`);
  await page.waitForFunction(index=>Number(document.querySelector('.document-page').dataset.page)===index,index);
  const state=await page.evaluate(()=>({count:document.querySelectorAll('.document-page').length,overflow:document.documentElement.scrollWidth>innerWidth,title:document.title,body:document.querySelector('.document-page').textContent}));
  assert.equal(state.count,1);assert(!state.overflow);assert(state.title.startsWith('볼타온'));
 }
 await page.click('loc=css:#tab-resume');await page.waitForSelector('.resume-view');
 const state=await page.evaluate(()=>({url:location.pathname+location.hash,count:document.querySelectorAll('.resume-page').length,cases:[...document.querySelectorAll('.bin-classic-achievements li')].map(e=>e.dataset.caseId),photo:document.querySelector('.bin-classic-photo').getBoundingClientRect().width,overflow:document.documentElement.scrollWidth>innerWidth,text:document.querySelector('.resume-workspace').textContent}));
 assert.equal(state.url,'/VoltaON#resume');assert.equal(state.count,2);assert.equal(state.photo,108);assert(!state.overflow);assert(!state.text.includes('결소프트'));
 assert.deepEqual(state.cases,data.selectedCases.map(id=>'case-'+id));
 results.push({width,height,portfolioPages:19,resumePages:2,caseOrder:state.cases,overflow:false});
}
await page.evaluate(()=>history.back());await page.waitForSelector('.deck-view');assert.equal(await page.evaluate(()=>location.pathname),'/VoltaON');
await page.evaluate(()=>history.forward());await page.waitForSelector('.resume-view');
const output=path.join(root,'tmp/voltaon-20261119');await fs.mkdir(output,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const file of ['voltaon-portfolio.pdf','voltaon-resume.pdf']){
 const target=path.join(output,'download-'+file),response=await page.fetch('/documents/'+file,{saveAs:target});assert.equal(response.status,200);
 assert.equal(hash(await fs.readFile(target)),hash(await fs.readFile(path.join(root,'public/documents',file))));
}
for(const route of ['/','/GYEOLSOFT']){await page.goto(base+route);await page.waitForSelector('.deck-view');}
await page.goto(base+'/GYEOLSOFT#resume');await page.waitForSelector('.resume-view');assert.equal(await page.evaluate(()=>document.querySelectorAll('.bin-classic-achievements li').length),6);
for(const route of ['/resume','/voltaon','/VoltaON?resume=old','/frontend']){await page.goto(base+route);await page.waitForSelector('loc=role:heading[name="페이지를 찾을 수 없습니다."]');}
const report={base,results,sharedSourceUnchanged:true,pdfMatches:true,routeHistory:true,legacyRoutesBlocked:true};
await fs.writeFile(path.join(output,'web-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
