import json
import sys
from collections import Counter
from pathlib import Path

import pdfplumber
import pypdfium2 as pdfium
from pypdf import PdfReader

root = Path(sys.argv[1])
source = json.loads(Path(sys.argv[2]).read_text('utf-8'))[sys.argv[5] if len(sys.argv) > 5 else 'resume']
variant = sys.argv[4] if len(sys.argv) > 4 else 'gyeolsoft'
previews = Path(sys.argv[3])
previews.mkdir(parents=True, exist_ok=True)
mm = 72 / 25.4
reports = []

for paper, pages, width, height in [('A4', 2, 210, 297)]:
    path = root / f'{variant}-resume-{paper}.pdf'
    reader = PdfReader(path)
    assert len(reader.pages) == pages, (paper, 'Unexpected page count')
    actual = ''.join(''.join((page.extract_text() or '').split()) for page in reader.pages)
    for unit in source['units']:
        assert ''.join(unit.split()) in actual, (paper, 'Missing text', unit)
    paper_uris = []
    for page in reader.pages:
        assert abs(float(page.mediabox.width) / mm - width) < .2
        assert abs(float(page.mediabox.height) / mm - height) < .2
        for reference in page.get('/Annots', []):
            annotation = reference.get_object()
            action = annotation.get('/A')
            if action and '/URI' in action:
                paper_uris.append(str(action['/URI']))
            if '/Rect' in annotation:
                x0, y0, x1, y1 = map(float, annotation['/Rect'])
                assert 0 <= x0 <= x1 <= width * mm + .5
                assert 0 <= y0 <= y1 <= height * mm + .5
    font_sizes = Counter()
    with pdfplumber.open(path) as document:
        for page in document.pages:
            for char in page.chars:
                if not char['text'].strip():
                    continue
                assert char['x0'] >= -.5 and char['x1'] <= page.width + .5
                assert char['top'] >= -.5 and char['bottom'] <= page.height + .5
                font_sizes[round(char['size'], 2)] += 1
    assert abs(font_sizes.most_common(1)[0][0] - 12) < .05, (paper, 'Body size changed')
    document = pdfium.PdfDocument(path)
    for index, page in enumerate(document):
        image = page.render(scale=1.5).to_pil()
        image.save(previews / f'{paper}-page-{index + 1:02}.webp', 'WEBP', quality=92)
        image.close()
        page.close()
    document.close()
    reports.append({'paper': paper, 'pages': pages, 'widthMm': width, 'heightMm': height, 'bodyPt': 12, 'sourceUnits': len(source['units']), 'missingText': 0, 'links': len(paper_uris), 'path': str(path)})

(previews / 'checks.json').write_text(json.dumps(reports, ensure_ascii=False, indent=2), 'utf-8')
print(json.dumps(reports, ensure_ascii=False))
