const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { createServer } = await import('vite');
  const server = await createServer({ server: { host: '127.0.0.1', port: 5173, strictPort: true } });
  await server.listen();
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const viewport of [
      { width: 1100, height: 760 },
      { width: 1366, height: 768 },
      { width: 1440, height: 1000 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('http://127.0.0.1:5173/');
      await page.locator('.bin-deck.is-enhanced').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      for (const project of [0, 1]) {
        const slides = page.locator(`#project-${project} .bin-deck-page`);
        assert.equal(await slides.count(), 9);
        for (let i = 0; i < 9; i++) {
          await page.locator(`#project-${project}-scene-${i}`).evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
          await page.waitForTimeout(950);
          const slide = slides.nth(i);
          assert.equal(await slide.getAttribute('aria-hidden'), null);
          const bounds = await slide.evaluate(el => {
            const copy = el.querySelector('.bin-deck-copy');
            const frame = el.closest('.bin-deck-frame').getBoundingClientRect();
            const controls = el.querySelector('.bin-deck-controls').getBoundingClientRect();
            const content = [copy, ...copy.children].map(child => child.getBoundingClientRect());
            return {
              top: Math.min(...content.map(rect => rect.top)),
              bottom: Math.max(...content.map(rect => rect.bottom)),
              frameTop: frame.top,
              controlsTop: controls.top,
              horizontalOverflow: copy.scrollWidth > copy.clientWidth + 1,
            };
          });
          const label = JSON.stringify({ viewport, project, slide: i, ...bounds });
          assert.ok(bounds.top >= bounds.frameTop - 1, `Top clipping: ${label}`);
          assert.ok(bounds.bottom <= bounds.controlsTop + 1, `Controls overlap: ${label}`);
          assert.equal(bounds.horizontalOverflow, false, `Text overflow: ${label}`);
          if (viewport.width === 1366 && ((project === 0 && [2, 3, 5, 7].includes(i)) || (project === 1 && [2, 3].includes(i)))) {
            await slide.screenshot({ path: path.join('test-results', `portfolio-final-${project}-${i}.png`) });
          }
        }
      }
      console.log(`PASS 18 slide boundaries: ${viewport.width}x${viewport.height}`);
    }
    for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1366, height: 700 }]) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(100);
      assert.equal(await page.locator('.bin-deck.is-enhanced').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await page.locator('.bin-deck-page[aria-hidden="true"]').count(), 0);
      console.log(`PASS static layout: ${viewport.width}x${viewport.height}`);
    }
    assert.equal(await page.locator('.bin-deck-metric').count(), 2);
    assert.deepEqual(errors, []);
    console.log('PASS numeric result cards and runtime');
    await browser.close();
    browser = null;
    const { spawn } = require('node:child_process');
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ['scripts/verify-portfolio-wheel.cjs'], { stdio: 'inherit' });
      child.on('error', reject);
      child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Wheel verification exited ${code}`)));
    });
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
