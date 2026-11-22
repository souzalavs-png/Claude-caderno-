# Junta imagens num PDF A4 (em pé ou deitado), sem efeitos que confundem os apps.
# python3 pdf_de_imagens.py saida.pdf img1.jpg img2.jpg ...
import sys
import img2pdf

A4 = (img2pdf.mm_to_pt(210), img2pdf.mm_to_pt(297))


def tamanho(w, h, _):
    p = (A4[1], A4[0]) if w > h else A4
    return (*p, *p)


saida, *imagens = sys.argv[1:]
with open(saida, 'wb') as f:
    f.write(img2pdf.convert(imagens, layout_fun=tamanho))
