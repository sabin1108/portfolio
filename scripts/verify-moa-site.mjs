import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {chromium}=await import(pathToFileURL('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1116-1210-0_26.1116.1210.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright/index.mjs'));
const base=process.argv[2]||'http://127.0.0.1:4173';
const output=path.join(root,'tmp/moa-documents-20261118');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-gpu']});
const checks=[];
try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const [width,height] of [[390,844],[768,1024],[1440,1000],[1920,1080]]){
    await page.setViewportSize({width,height});
    for(const route of ['/','/GYEOLSOFT']){
      await page.goto(base+route);
      await page.locator('.document-page').first().waitFor();
      await page.locator('.page-image-button img').evaluateAll(images=>Promise.all(images.map(image=>{image.loading='eager';return image.decode();})));
      assert.equal(await page.locator('.document-page').count(),route==='/'?6:13);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      assert(!overflow,`${route} ${width} overflow`);
      const href=await page.locator('a.download').getAttribute('href');
      const pdf=await page.request.get(base+href);assert(pdf.ok());assert((await pdf.body()).subarray(0,4).toString()==='%PDF');
      if(width===1440||width===390)await page.screenshot({path:path.join(output,`web-${route==='/'?'main':'gyeolsoft'}-${width}.png`)});
      await page.locator('.page-image-button').first().click();
      await page.locator('dialog[open]').waitFor();
      await page.keyboard.press('Escape');
      await page.locator('dialog').waitFor({state:'detached'});
      if(route==='/GYEOLSOFT'){
        await page.getByRole('tab',{name:'이력서',exact:true}).click();
        await page.waitForFunction(()=>document.querySelectorAll('.document-page').length===2);
        await page.locator('.page-image-button img').evaluateAll(images=>Promise.all(images.map(image=>{image.loading='eager';return image.decode();})));
        assert.equal(new URL(page.url()).pathname,'/GYEOLSOFT');
        assert.equal(await page.getByRole('tab',{name:'이력서',exact:true}).getAttribute('aria-selected'),'true');
        assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)));
        if(width===1440||width===390)await page.screenshot({path:path.join(output,`web-resume-${width}.png`)});
      }
      checks.push({route,width,height,overflow:false,pdfDownload:true,zoomEscape:true});
    }
  }
  for(const route of ['/resume','/resume/bin_resume','/portfolio_bin','/frontend','/fullstack','/ai-portfolio','/ax','/not-a-page','/?resume=old']){
    await page.goto(base+route);await page.getByRole('heading',{name:'페이지를 찾을 수 없습니다.'}).waitFor();
    assert.equal(await page.locator('.document-page').count(),0);checks.push({route,blocked:true});
  }
  await page.goto(base+'/GYEOLSOFT#resume');await page.waitForFunction(()=>document.querySelectorAll('.document-page').length===2);
  checks.push({route:'/GYEOLSOFT#resume',directResume:true});
  assert.deepEqual(errors,[]);
  const rewrite=JSON.parse(await fs.readFile(path.join(root,'vercel.json'),'utf8'));
  assert.deepEqual(rewrite.rewrites,[{source:'/GYEOLSOFT',destination:'/index.html'}]);
  const imports=await fs.readFile(path.join(root,'src/app/App.tsx'),'utf8');assert(!/BinToss|PhotoMap|GameInfo|resumeRegistry/.test(imports));
  const build=await fs.readdir(path.join(root,'dist'));assert(!build.includes('archive'));
  await fs.writeFile(path.join(output,'web-checks.json'),JSON.stringify({base,checks,consoleErrors:errors,oldRoutesBlocked:9,activeHtmlRoutes:['/','/GYEOLSOFT'],publicArchive:false},null,2));
  console.log(JSON.stringify({checks:checks.length,viewports:4,consoleErrors:errors.length,oldRoutesBlocked:9}));
}finally{await browser.close();}
