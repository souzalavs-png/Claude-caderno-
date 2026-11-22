// Gera os layouts diferentes: node folha-suspense/gerar-diferentes.js
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const modelos = [['jornal', false], ['noir', false], ['livro', true], ['bilhete', false]];
const temas = ['noite', 'dossie'];

(async () => {
  const pasta = path.join(__dirname, 'diferentes');
  fs.mkdirSync(pasta, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 3 });
  const html = 'file://' + path.join(__dirname, 'modelos.html');

  for (const tema of temas) {
    const pdfs = [];
    for (const [m, deitada] of modelos) {
      await page.setViewportSize(deitada ? { width: 1123, height: 794 } : { width: 794, height: 1123 });
      await page.goto(`${html}?tema=${tema}&layout=${m}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.pronto === true);
      const arq = path.join(pasta, `${m}-${tema}.pdf`);
      await page.pdf({ path: arq, width: deitada ? '297mm' : '210mm', height: deitada ? '210mm' : '297mm',
        printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
      await page.screenshot({ path: path.join(pasta, `${m}-${tema}.jpg`), type: 'jpeg', quality: 92 });
      pdfs.push(arq);
      console.log('ok', m, tema);
    }
    // kit com os 4 juntos (um por página)
    execFileSync('pdfunite', [...pdfs, path.join(__dirname, `kit-diferentes-${tema}.pdf`)]);
  }
  await browser.close();
})();
