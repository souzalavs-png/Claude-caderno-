// Gera os modelos extras: node folha-suspense/gerar-modelos.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const modelos = ['relatorio', 'evidencia', 'contagem', 'cena'];
const temas = ['noite', 'dossie'];

(async () => {
  const pasta = path.join(__dirname, 'modelos');
  fs.mkdirSync(pasta, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3 });
  const html = 'file://' + path.join(__dirname, 'modelos.html');
  const pdf = (arq) => page.pdf({ path: arq, width: '210mm', height: '297mm', printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 } });

  for (const tema of temas) {
    // kit com todos os modelos juntos (1 por página)
    await page.goto(`${html}?tema=${tema}&layout=todos`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.pronto === true);
    await pdf(path.join(__dirname, `kit-suspense-${tema}.pdf`));

    for (const m of modelos) {
      await page.goto(`${html}?tema=${tema}&layout=${m}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.pronto === true);
      await pdf(path.join(pasta, `${m}-${tema}.pdf`));
      await page.screenshot({ path: path.join(pasta, `${m}-${tema}.jpg`), type: 'jpeg', quality: 92 });
      console.log('ok', m, tema);
    }
  }
  await browser.close();
})();
