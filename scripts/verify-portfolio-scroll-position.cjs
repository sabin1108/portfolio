const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const { createServer } = await import('vite');
  const server = await createServer({ server: { host: '127.0.0.1', port: 5183, strictPort: true } });
  await server.listen();
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    for (const viewport of [{ width: 1100, height: 760 }, { width: 1366, height: 768 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.goto('http://127.0.0.1:5183/');
    await page.locator('.bin-deck.is-enhanced').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const project of [0, 1]) {
      const active = () => page.locator(`#project-${project} .bin-deck-page.is-active`).getAttribute('data-page').then(Number);
      const stops = await page.locator(`#project-${project} .bin-deck-marker`).evaluateAll(markers => markers.map(el => el.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(el).scrollMarginTop)));
      const sample = async offsets => {
        const values = new Map();
        for (const offset of offsets) {
          await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), stops[3] + offset);
          await page.waitForTimeout(40);
          values.set(offset, await active());
        }
        return values;
      };
      const step = stops[4] - stops[3];
      const offsets = Array.from({ length: 25 }, (_, i) => Math.round(step * i / 24));
      const down = await sample(offsets);
      const up = await sample([...offsets].reverse());
      const mismatches = offsets.filter(offset => down.get(offset) !== up.get(offset));
      assert.deepEqual(mismatches, [], `Active slide depends on scroll direction: ${JSON.stringify(mismatches.map(offset => ({offset,down:down.get(offset),up:up.get(offset)})))}`);
      for (let i = 0; i < stops.length; i++) {
        await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), stops[i]);
        await page.waitForTimeout(80);
        assert.equal(await active(), i, `Scene ${i} must align with its anchor`);
      }
      await page.evaluate(y => scrollTo({top: y, behavior: 'instant'}), stops[1]);
      await page.waitForTimeout(80);
      for (let i = 2; i < 8; i++) {
        await page.mouse.wheel(0, step);
        await page.waitForTimeout(100);
        assert.equal(await active(), i, 'Equal wheel distances must advance equally');
      }
      console.log(`PASS position/direction/anchor/equal wheel distance: ${viewport.width}, project ${project}`);
    }
    }
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
