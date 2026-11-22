# Refaz todos os PDFs a partir das imagens JPG (PDF "chapado").
# Assim qualquer app (J-Notes, GoodNotes etc.) mostra igualzinho, sem erro de degradê.
# Rodar depois dos geradores:  python3 folha-suspense/achatar.py
import os
import img2pdf

BASE = os.path.dirname(os.path.abspath(__file__))
A4 = (img2pdf.mm_to_pt(210), img2pdf.mm_to_pt(297))
A4_DEITADA = (A4[1], A4[0])


def montar(saida, imagens):
    def tamanho(w, h, _):
        return A4_DEITADA if w > h else A4
    caminhos = [os.path.join(BASE, i) for i in imagens]
    # cada página no tamanho A4 certo (em pé ou deitada)
    with open(os.path.join(BASE, saida), 'wb') as f:
        f.write(img2pdf.convert(caminhos, layout_fun=lambda iw, ih, d: (*tamanho(iw, ih, d), *tamanho(iw, ih, d))))
    print('ok', saida)


for tema in ['noite', 'dossie']:
    # folha original
    montar(f'folha-suspense-{tema}.pdf', [f'folha-suspense-{tema}.jpg'])

    # variações
    var = ['relatorio', 'evidencia', 'contagem', 'cena']
    for m in var:
        montar(f'modelos/{m}-{tema}.pdf', [f'modelos/{m}-{tema}.jpg'])
    montar(f'kit-suspense-{tema}.pdf', [f'modelos/{m}-{tema}.jpg' for m in var])

    # layouts diferentes
    dif = ['jornal', 'noir', 'livro', 'bilhete']
    for m in dif:
        montar(f'diferentes/{m}-{tema}.pdf', [f'diferentes/{m}-{tema}.jpg'])
    montar(f'kit-diferentes-{tema}.pdf', [f'diferentes/{m}-{tema}.jpg' for m in dif])

    # jornal completo
    jor = ['capa', 'interna']
    for m in jor:
        montar(f'jornal/jornal-{m}-{tema}.pdf', [f'jornal/jornal-{m}-{tema}.jpg'])
    montar(f'kit-jornal-{tema}.pdf', [f'jornal/jornal-{m}-{tema}.jpg' for m in jor])
