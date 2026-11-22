// Gera PDF e PNG das folhas: node folha-suspense/gerar.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3 });
  const html = 'file://' + path.join(__dirname, 'folha.html');

  for (const tema of ['noite', 'dossie']) {
    await page.goto(`${html}?tema=${tema}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.pronto === true);
    await page.pdf({
      path: path.join(__dirname, `folha-suspense-${tema}.pdf`),
      width: '210mm', height: '297mm', printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    await page.screenshot({ path: path.join(__dirname, `folha-suspense-${tema}.jpg`), type: "jpeg", quality: 92 });
    console.log('ok', tema);
  }
  await browser.close();
})();
