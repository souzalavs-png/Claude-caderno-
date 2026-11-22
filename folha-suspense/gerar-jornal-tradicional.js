// Gera o jornal tradicional (6 páginas) em preto e branco e na versão escura.
// node folha-suspense/gerar-jornal-tradicional.js
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const paginas = ['capa', 'policia', 'reportagem', 'interrogatorio', 'obituarios', 'procurados'];
const temas = { pb: 'preto-e-branco', noite: 'escuro' };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3 });
  const html = 'file://' + path.join(__dirname, 'jornal.html');

  for (const [tema, nome] of Object.entries(temas)) {
    const pasta = path.join(__dirname, 'jornal-tradicional', nome);
    fs.mkdirSync(pasta, { recursive: true });
    const jpgs = [];
    for (const [i, p] of paginas.entries()) {
      await page.goto(`${html}?tema=${tema}&layout=${p}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.pronto === true);
      const jpg = path.join(pasta, `${i + 1}-${p}.jpg`);
      await page.screenshot({ path: jpg, type: 'jpeg', quality: 88 });
      jpgs.push(jpg);
      console.log('ok', nome, p);
    }
    // PDFs "chapados" (imagem): abrem igual em qualquer app
    const py = path.join(__dirname, 'pdf_de_imagens.py');
    for (const j of jpgs) execFileSync('python3', [py, j.replace(/\.jpg$/, '.pdf'), j]);
    execFileSync('python3', [py, path.join(__dirname, `kit-jornal-tradicional-${nome}.pdf`), ...jpgs]);
  }
  await browser.close();
})();
