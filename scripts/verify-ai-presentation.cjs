const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

(async () => {
  const { createServer } = await import('vite');
  const server = await createServer({ server: { host: '127.0.0.1', port: 5196, strictPort: true } });
  await server.listen();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const output = 'test-results/ai-presentation';
  await fs.mkdir(output, { recursive: true });
  await fs.mkdir('../output/pdf', { recursive: true });
  try {
    for (const viewport of [{ width: 1100, height: 760 }, { width: 1366, height: 768 }, { width: 1440, height: 1000 }]) {
      await page.setViewportSize(viewport);
      const geometry = async route => {
        await page.goto(`http://127.0.0.1:5196${route}`);
        await page.locator('.bin-deck.is-enhanced').first().waitFor();
        return page.locator('.bin-deck').first().evaluate(root => {
          const markers = root.querySelectorAll('.bin-deck-marker');
          const frame = getComputedStyle(root.querySelector('.bin-deck-frame'));
          const slide = getComputedStyle(root.querySelector('.bin-deck-page'));
          return { step: markers[1].offsetTop - markers[0].offsetTop, top: frame.top, height: frame.height, position: frame.position, transition: slide.transition, track: root.querySelector('.bin-deck-track').style.height };
        });
      };
      const original = await geometry('/portfolio_bin');
      assert.deepEqual(await geometry('/ai-portfolio'), original, 'AI must use the same scroll geometry and transitions');
      const text = await page.locator('main').innerText();
      assert.ok(!/PhotoMap|GameInfo|Game Information Platform|mock-evidence/.test(text));
      await page.evaluate(() => document.fonts.ready);
      for (const project of [0, 1]) {
        const slides = page.locator(`#project-${project} .bin-deck-page`);
        assert.equal(await slides.count(), 9);
        for (let i = 0; i < 9; i++) {
          await page.locator(`#project-${project}-scene-${i}`).evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
          await page.waitForTimeout(520);
          const slide = slides.nth(i);
          assert.equal(await slide.getAttribute('aria-hidden'), null);
          const bounds = await slide.evaluate(el => {
            const copy = el.querySelector('.bin-deck-copy');
            const frame = el.closest('.bin-deck-frame').getBoundingClientRect();
            const controls = el.querySelector('.bin-deck-controls').getBoundingClientRect();
            const content = [copy, ...copy.children].map(child => child.getBoundingClientRect());
            return { top: Math.min(...content.map(r => r.top)), bottom: Math.max(...content.map(r => r.bottom)), frameTop: frame.top, controlsTop: controls.top, overflow: copy.scrollWidth > copy.clientWidth + 1 };
          });
          const label = JSON.stringify({ viewport, project, slide: i, ...bounds });
          assert.ok(bounds.top >= bounds.frameTop - 1, `Top clipping: ${label}`);
          assert.ok(bounds.bottom <= bounds.controlsTop + 1, `Controls overlap: ${label}`);
          assert.equal(bounds.overflow, false, `Text overflow: ${label}`);
          assert.equal(await slides.evaluateAll(elements => elements.filter(el => !el.inert).length), 1);
          if (viewport.width === 1366) await page.screenshot({ path: `${output}/slide-${project}-${i}.png` });
        }
        const stops = await page.locator(`#project-${project} .bin-deck-marker`).evaluateAll(markers => markers.map(el => el.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(el).scrollMarginTop)));
        const active = () => page.locator(`#project-${project} .bin-deck-page.is-active`).getAttribute('data-page').then(Number);
        const offsets = [0, .2, .49, .51, .8, 1];
        const values = [];
        for (const fraction of [...offsets, ...offsets.slice().reverse()]) {
          await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), stops[3] + fraction * (stops[4] - stops[3]));
          await page.waitForTimeout(50);
          values.push(await active());
        }
        assert.deepEqual(values.slice(0, 6), values.slice(6).reverse(), 'Direction independence');
        await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), stops[1]);
        await page.waitForTimeout(100);
        await page.mouse.wheel(0, stops[2] - stops[1]);
        await page.waitForTimeout(200);
        assert.equal(await active(), 2);
        await slides.nth(2).getByRole('link', { name: '다음 장', exact: true }).click();
        await page.waitForTimeout(550);
        assert.equal(await active(), 3);
      }
      console.log(`PASS shared scroll geometry, 18 panels, bounds, wheel, anchors, inert: ${viewport.width}x${viewport.height}`);
    }
    for (const viewport of [{ width: 320, height: 844 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1366, height: 700 }]) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(100);
      assert.equal(await page.locator('.bin-deck.is-enhanced').count(), 0);
      assert.equal(await page.locator('.bin-deck-page[aria-hidden=true]').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.goto('http://127.0.0.1:5196/ai-resume');
      assert.equal(await page.locator('.ai-project').count(), 2);
      assert.ok(!/PhotoMap|GameInfo|Game Information Platform|mock-evidence/.test(await page.locator('main').innerText()));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.goto('http://127.0.0.1:5196/ai-portfolio');
      console.log(`PASS portfolio/resume static reflow, two projects: ${viewport.width}x${viewport.height}`);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.bin-deck.is-enhanced').count(), 0);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('http://127.0.0.1:5196/ai-portfolio#project-1-scene-3');
    await page.waitForTimeout(700);
    assert.equal(await page.locator('#project-1 .bin-deck-page.is-active').getAttribute('data-page'), '3');
    for (const route of ['ai-portfolio', 'ai-resume']) {
      await page.goto(`http://127.0.0.1:5196/${route}`);
      await page.evaluate(async () => {
        document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
        await Promise.all([...document.images].map(img => img.decode()));
        await document.fonts.ready;
        document.querySelectorAll('a[href^="/"]').forEach(link => { link.href = new URL(link.getAttribute('href'), 'https://binportfolio.site').href; });
      });
      await page.emulateMedia({ media: 'print' });
      await page.pdf({ path: `../output/pdf/min-sabin-${route}.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true });
      await page.emulateMedia({ media: 'screen' });
    }
    assert.deepEqual(errors, []);
    await fs.writeFile(`${output}/verification.json`, JSON.stringify({ passed: true, panels: 18, projects: 2, sameScrollEngine: true, errors }, null, 2));
    console.log('PASS reduced motion, deep-link reload, PDFs, no runtime errors');
  } finally { await browser.close(); await server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
