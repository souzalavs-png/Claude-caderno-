// Gera o jornal completo (capa + página de dentro): node folha-suspense/gerar-jornal.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const pasta = path.join(__dirname, 'jornal');
  fs.mkdirSync(pasta, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3 });
  const html = 'file://' + path.join(__dirname, 'modelos.html');
  const pdf = (arq) => page.pdf({ path: arq, width: '210mm', height: '297mm', printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 } });

  for (const tema of ['noite', 'dossie']) {
    await page.goto(`${html}?tema=${tema}&layout=jornalCompleto`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.pronto === true);
    await pdf(path.join(__dirname, `kit-jornal-${tema}.pdf`));

    for (const m of ['capa', 'interna']) {
      await page.goto(`${html}?tema=${tema}&layout=${m}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.pronto === true);
      await pdf(path.join(pasta, `jornal-${m}-${tema}.pdf`));
      await page.screenshot({ path: path.join(pasta, `jornal-${m}-${tema}.jpg`), type: 'jpeg', quality: 92 });
      console.log('ok', m, tema);
    }
  }
  await browser.close();
})();
