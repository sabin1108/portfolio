// Requires Playwright in the environment. Run against an existing local Vite server.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const baseUrl = 'http://localhost:5173';
const viewports = [
  { width: 390, height: 768 },
  { width: 768, height: 1000 },
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 1000 },
];

async function goto(page, route) {
  await page.goto(`${baseUrl}${route}`);
  await page.waitForLoadState('networkidle');
}

async function scrollSceneIntoFocus(page, sceneIndex, projectIndex = 0) {
  await page.evaluate(
    ({ projectIndex, sceneIndex }) => document.getElementById(`project-${projectIndex}-scene-${sceneIndex}`)?.scrollIntoView({ block: 'center', behavior: 'instant' }),
    { projectIndex, sceneIndex }
  );
}

async function assertNoHorizontalOverflow(page, label) {
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    false,
    `${label}: document overflow`
  );

  const offenders = await page.locator(
    '.bin-work-nav, .bin-work-container, .bin-work-hero, .bin-work-stage, .bin-work-scene, .bin-work-case, .bin-work-implementation article, .bin-work-button, .bin-work-chapters a, .bin-classic-story'
  ).evaluateAll(elements => elements
    .map(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        className: element.className,
        text: (element.textContent || '').trim().slice(0, 80),
        left: rect.left,
        right: rect.right,
        width: rect.width,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        overflowX: style.overflowX,
      };
    })
    .filter(item =>
      item.width > 0 &&
      (item.left < -1 ||
        item.right > window.innerWidth + 1 ||
        (item.overflowX !== 'visible' && item.scrollWidth > item.clientWidth + 1))
    ));

  assert.deepEqual(offenders, [], `${label}: contained elements overflow`);
}

async function assertImagesLoad(page) {
  for (const img of await page.locator('img').all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(el => el.complete ? undefined : new Promise(resolve => {
      el.onload = resolve;
      el.onerror = resolve;
    }));
    assert.ok(await img.evaluate(el => el.naturalWidth > 0), `broken image: ${await img.getAttribute('src')}`);
  }
}

async function assertResume(page, width) {
  assert.equal(await page.locator('.bin-classic-story h4').count(), 4);
  assert.equal(await page.locator('.bin-classic-kicker').count(), 0);
  assert.ok((await page.locator('.bin-classic-story').first().innerText()).includes('실제 사용자 통계가 아닌 합성 실험 결과입니다.'));
  assert.equal(await page.locator('nav a').last().getAttribute('href'), '/portfolio_bin');

  if (width > 700) {
    const rows = await page.locator('.bin-classic-story').evaluateAll(groups => groups.map(group =>
      [...group.children].map(card => [...card.children].map(row => row.getBoundingClientRect().top))));
    for (const pair of rows) {
      for (let i = 0; i < pair[0].length; i++) {
        assert.ok(Math.abs(pair[0][i] - pair[1][i]) < 1, 'resume rows misaligned');
      }
    }
  }
}



async function assertPresentation(page, width, height, reduced = false) {
  const enhanced = width>=1100 && height>=760 && !reduced;
  assert.equal(await page.locator('.bin-deck').count(),2);
  assert.equal(await page.locator('.bin-deck-page').count(),18);
  assert.equal(await page.locator('.bin-deck-evidence article').count(),8);
  assert.equal(await page.locator('.bin-deck-process li').count(),20);
  assert.equal(await page.locator('dialog, a[href^="/architecture/"]').count(),0);
  assert.equal(await page.locator('.bin-work-editorial img').count(),0,'cover should not repeat project photo');
  assert.equal(await page.locator('.bin-deck-architecture img[src$="-dark-preview.png"]').count(),2,'use original architecture assets');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollbarWidth),'none');
  assert.equal(await page.locator('.bin-deck.is-enhanced').count(),enhanced?2:0);
  if(enhanced) {
    const gap=await page.locator('#project-0').evaluate(el=>{
      const markers=el.querySelectorAll('.bin-deck-marker');
      return (markers[1].getBoundingClientRect().top-markers[0].getBoundingClientRect().top)/innerHeight;
    });
    assert.ok(Math.abs(gap-.66)<.01,'scroll interval should be 66vh');
    await page.locator('#project-0-scene-2').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
    await page.waitForFunction(()=>document.querySelector('#project-0 .bin-deck-page.is-active')?.getAttribute('data-page')==='2');
    const motion=await page.locator('#project-0 .bin-deck-page.is-active').evaluate(el=>({title:getComputedStyle(el.querySelector('h2')).animationName,copy:getComputedStyle(el.querySelector('.bin-deck-process li')).animationName}));
    assert.equal(motion.title,'bin-title-enter');assert.equal(motion.copy,'bin-copy-enter');
  }
  for(const project of [0,1]) for(let i=0;i<9;i++) {
    const target=page.locator('#project-'+project+'-scene-'+i);
    await target.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    const slide=page.locator('#project-'+project+' .bin-deck-page[data-page="'+i+'"]');
    if(enhanced) {
      await page.waitForFunction(({project,i})=>document.querySelector('#project-'+project+' .bin-deck-page.is-active')?.getAttribute('data-page')===String(i),{project,i});
      await page.waitForTimeout(680);
      assert.equal(await slide.evaluate(e=>e.inert),false);
      assert.equal(await page.locator('#project-'+project+' .bin-deck-page[inert]').count(),8);
      const panels=await slide.locator('.bin-deck-copy,.bin-deck-sidebar,.bin-deck-controls').evaluateAll(es=>es.map(e=>({name:e.className,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom})));
      panels.forEach(p=>assert.ok(p.top>=68&&p.bottom<=height+1,'panel clipped '+JSON.stringify({width,height,project,i,p})));
      assert.ok(panels[0].bottom<=panels[panels.length-1].top+1,'content overlaps controls');
    } else {
      assert.equal(await slide.evaluate(e=>e.inert),false);
      assert.notEqual(await slide.evaluate(e=>getComputedStyle(e).position),'absolute');
    }
    for(const image of await slide.locator('img').all()) {
      if(!(await image.isVisible()))continue;
      await image.evaluate(e=>e.complete?undefined:new Promise(resolve=>{e.onload=resolve;e.onerror=resolve;}));
      assert.ok(await image.evaluate(e=>e.naturalWidth>0),'broken project image');
    }
    await assertNoHorizontalOverflow(page,'portfolio '+width);
  }
}
async function assertNavigationAndMotion(page) {
  await goto(page,'/portfolio_bin#project-0-scene-1');
  await page.waitForFunction(()=>document.querySelector('#project-0 .bin-deck-page.is-active')?.getAttribute('data-page')==='1');
  await page.waitForTimeout(700);
  const next=page.locator('#project-0 .bin-deck-page.is-active .bin-deck-controls a').last();
  await next.focus();await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('#project-0 .bin-deck-page.is-active')?.getAttribute('data-page')==='2');
  await page.waitForTimeout(100);
  const during=await page.locator('#project-0 .bin-deck-page.is-active').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m41);
  assert.ok(during>0,'incoming page should move horizontally');
  await page.waitForTimeout(650);
  const after=await page.locator('#project-0 .bin-deck-page.is-active').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m41);
  assert.ok(Math.abs(after)<1,'page should settle in viewport');
  const chapter=page.locator('#project-0 .bin-deck-page.is-active .bin-deck-chapters a[href="#project-0-scene-6"]');
  await chapter.click();await page.waitForFunction(()=>document.querySelector('#project-0 .bin-deck-page.is-active')?.getAttribute('data-page')==='6');
  await page.waitForTimeout(700);
  const before=await page.evaluate(()=>scrollY);await page.keyboard.press('PageDown');await page.waitForTimeout(450);
  assert.ok(await page.evaluate(y=>scrollY>y,before),'native scrolling should remain available');
}
(async()=>{
 const browser=await chromium.launch();const errors=[];
 try{
  for(const {width,height} of viewports){
   const context=await browser.newContext({viewport:{width,height}});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   try{
    await goto(page,'/resume/bin_resume');await assertResume(page,width);await assertNoHorizontalOverflow(page,'resume');
    assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('bin-presentation-page')),false);
    await goto(page,'/portfolio_bin');await assertPresentation(page,width,height);
    if(width===1440)await assertNavigationAndMotion(page);
    await goto(page,'/resume/bin_resume');assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('bin-presentation-page')),false);
    console.log('PASS resume + portfolio '+width+'x'+height);
   }finally{await context.close();}
  }
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await goto(p,'/portfolio_bin');await assertPresentation(p,1440,1000,true);await context.close();
  assert.deepEqual(errors,[],'runtime errors');console.log('PASS original architecture, horizontal transition, keyboard, complete text, reduced motion, route isolation');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
