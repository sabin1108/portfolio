import sys
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, RectangleObject

path = Path(sys.argv[1])
width = float(sys.argv[2]) * 72 / 25.4
height = float(sys.argv[3]) * 72 / 25.4
reader = PdfReader(path)
writer = PdfWriter()
writer.clone_document_from_reader(reader)
for page in writer.pages:
    # Chromium rounds paper dimensions; fix the boxes without scaling content.
    assert abs(float(page.mediabox.width) - width) < 3
    assert abs(float(page.mediabox.height) - height) < 3
    for key in ['/MediaBox', '/CropBox', '/BleedBox', '/TrimBox', '/ArtBox']:
        page[NameObject(key)] = RectangleObject([0, 0, width, height])
temporary = path.with_name(path.stem + '-paper-box.tmp.pdf')
writer.write(temporary)
temporary.replace(path)
