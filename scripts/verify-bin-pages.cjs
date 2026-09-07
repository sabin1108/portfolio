// Requires Playwright in the environment. Run against an existing local Vite server.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  try {
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ['/resume/bin_resume', '/portfolio_bin']) {
        await page.goto(`http://localhost:5173${route}`);
        await page.waitForLoadState('networkidle');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route}: overflow at ${width}`);
        if (route === '/portfolio_bin') {
          assert.equal(await page.locator('.bin-work-case').count(), 4);
          assert.equal(await page.locator('.bin-work-implementation article').count(), 4);
          assert.equal(await page.getByText('FRONT-END DEVELOPER', { exact: true }).count(), 0);
          assert.equal(await page.getByText('화면 흐름을 다듬은 사례', { exact: true }).count(), 0);
          assert.equal(await page.getByText('연락하기', { exact: true }).count(), 0);
          assert.equal(await page.locator('.portfolio-bin-device').count(), 0);
          if (width > 800) {
            const rows = await page.locator('.bin-work-cases, .bin-work-implementation').evaluateAll(groups => groups.map(group =>
              [...group.children].map(card => [...card.children].map(row => row.getBoundingClientRect().top))));
            for (const pair of rows) for (let i = 0; i < pair[0].length; i++) assert.ok(Math.abs(pair[0][i] - pair[1][i]) < 1, 'case rows misaligned');
          }
          await page.locator('.bin-work-button').click();
          assert.equal(new URL(page.url()).hash, '#projects');
          await page.locator('summary').first().click();
          assert.equal(await page.locator('details').first().getAttribute('open'), '');
        } else {
          assert.equal(await page.locator('.bin-classic-story h4').count(), 4);
          assert.equal(await page.locator('.bin-classic-kicker').count(), 0);
          assert.ok((await page.locator('.bin-classic-story').first().innerText()).includes('실제 사용자 통계가 아닌 합성 실험 결과입니다.'));
          assert.equal(await page.locator('nav a').last().getAttribute('href'), '/portfolio_bin');
          if (width > 700) {
            const rows = await page.locator('.bin-classic-story').evaluateAll(groups => groups.map(group =>
              [...group.children].map(card => [...card.children].map(row => row.getBoundingClientRect().top))));
            for (const pair of rows) for (let i = 0; i < pair[0].length; i++) assert.ok(Math.abs(pair[0][i] - pair[1][i]) < 1, 'resume rows misaligned');
          }
        }
        // Trigger lazy images before checking load failures.
        for (const img of await page.locator('img').all()) {
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(el => el.complete ? undefined : new Promise(resolve => { el.onload = resolve; el.onerror = resolve; }));
          assert.ok(await img.evaluate(el => el.naturalWidth > 0), `broken image: ${await img.getAttribute('src')}`);
        }
        console.log(`PASS ${route} ${width}px`);
      }
    }
    assert.deepEqual(errors, [], 'browser runtime errors');
    console.log('PASS runtime, links, images, responsive containment and paired rows');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
