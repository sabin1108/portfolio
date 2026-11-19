import sys
import json
from pathlib import Path
import pypdfium2 as pdfium
from pypdf import PdfReader

root = Path(sys.argv[1])
expected = json.loads(sys.argv[2])
report_path = Path(sys.argv[3])
report = {}
for doc_id, spec in expected.items():
    source = root / spec['file']
    document = pdfium.PdfDocument(str(source))
    destination = root / doc_id
    destination.mkdir(exist_ok=True)
    reader = PdfReader(str(source))
    assert len(reader.pages) == len(document)
    assert len(document) == spec['pages'], (doc_id, len(document), spec['pages'])
    pages = []
    for old_page in destination.glob('page-*.webp'):
        if int(old_page.stem.split('-')[-1]) > len(document):
            old_page.unlink()
    for index, page in enumerate(document):
        image = page.render(scale=2).to_pil()
        image.save(destination / f'page-{index + 1:02}.webp', 'WEBP', quality=90, method=6)
        text = reader.pages[index].extract_text() or ''
        assert len(text.strip()) > 10, (doc_id, index, 'empty text')
        pages.append({
            'image': f'/documents/{doc_id}/page-{index + 1:02}.webp',
            'width': image.width,
            'height': image.height,
            'text': text,
        })
        image.close()
        page.close()
    report[doc_id] = {'pdfPageCount': len(document), 'pages': pages}
    print(f'{doc_id}: {len(document)} pages')
    document.close()
report_path.parent.mkdir(parents=True, exist_ok=True)
report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), 'utf-8')
