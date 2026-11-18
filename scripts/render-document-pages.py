import sys
import json
from pathlib import Path
import pypdfium2 as pdfium
from pypdf import PdfReader

root = Path(sys.argv[1])
expected = json.loads(sys.argv[2])
for doc_id, filename in [('main', 'main-portfolio.pdf'), ('gyeolsoft', 'gyeolsoft-portfolio.pdf'), ('resume', 'gyeolsoft-resume.pdf')]:
    source = root / filename
    document = pdfium.PdfDocument(str(source))
    destination = root / doc_id
    destination.mkdir(exist_ok=True)
    reader = PdfReader(str(source))
    assert len(reader.pages) == len(document)
    assert len(document) == expected[doc_id], (doc_id, len(document), expected[doc_id])
    for old_page in destination.glob('page-*.webp'):
        if int(old_page.stem.split('-')[-1]) > len(document):
            old_page.unlink()
    for index, page in enumerate(document):
        image = page.render(scale=2).to_pil()
        image.save(destination / f'page-{index + 1:02}.webp', 'WEBP', quality=90, method=6)
        text = reader.pages[index].extract_text() or ''
        assert len(text.strip()) > 10, (doc_id, index, 'empty text')
    print(f'{doc_id}: {len(document)} pages')
