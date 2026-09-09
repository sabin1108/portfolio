// Run against the local portfolio server; Playwright is available in the workspace.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const viewport of [{ width: 1366, height: 768 }, { width: 1440, height: 1000 }]) {
      await page.setViewportSize(viewport);
      await page.goto('http://127.0.0.1:5173/');
      await page.waitForLoadState('networkidle');
      for (const project of [0, 1]) {
        for (const delta of [900, -900]) {
          await page.locator('#project-' + project + '-scene-3').evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
          await page.waitForTimeout(750);
          const active = () => page.locator('#project-' + project + ' .bin-deck-page.is-active').getAttribute('data-page').then(Number);
          const before = await active();
          await page.mouse.move(1000, 400);
          await page.mouse.wheel(0, delta);
          await page.waitForTimeout(750);
          assert.equal(await active(), before + Math.sign(delta), 'one wheel input must not skip a slide');
        }
        await page.locator('#project-' + project + '-scene-6').evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
        await page.waitForTimeout(750);
        assert.equal(await page.locator('#project-' + project + ' .bin-deck-page.is-active').getAttribute('data-page'), '6');
      }
      console.log('PASS wheel directions and anchor navigation: ' + viewport.width);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.bin-deck.is-enhanced').count(), 0);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.bin-deck.is-enhanced').count(), 0);
    assert.deepEqual(errors, []);
    console.log('PASS reduced motion, mobile, runtime');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
