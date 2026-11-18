from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
from pypdf import PdfReader
from collections import Counter
import pdfplumber
import json
import sys

root = Path(sys.argv[1])
work = root / 'tmp/moa-documents-20261118'
manifest = json.loads((root / 'public/documents/manifest.json').read_text('utf-8'))
source_path = work / 'pdf-source-text.json'
sources = json.loads(source_path.read_text('utf-8'))

def normalize(text):
    return ''.join(text.replace('\u00ad', '').split())

tiles = []
results = []
document_checks = []
main_pages = manifest['documents']['main'].get('pdfPages', manifest['documents']['main']['pages'])
for key, document in manifest['documents'].items():
    pdf_path = root / 'public' / document['pdf'].lstrip('/')
    reader = PdfReader(str(pdf_path))
    pdf_pages = document.get('pdfPages', document['pages'])
    assert len(reader.pages) == len(pdf_pages)
    assert document.get('pdfPageCount', len(pdf_pages)) == len(reader.pages)
    extracted = '\n\n'.join(page.extract_text() or '' for page in reader.pages)
    actual = normalize(extracted)
    source = sources[key]
    missing = [unit for unit in source['units'] if normalize(unit) and normalize(unit) not in actual]
    assert not missing, (key, 'PDF text missing', missing[:5])
    lost_characters = Counter(normalize(source['bodyText'])) - Counter(actual)
    assert not lost_characters, (key, 'PDF character counts decreased', dict(lost_characters))

    font_sizes = Counter()
    with pdfplumber.open(pdf_path) as pdf:
        for page_number, page in enumerate(pdf.pages, 1):
            for char in page.chars:
                if not char['text'].strip():
                    continue
                font_sizes[round(char['size'], 2)] += 1
                assert char['x0'] >= -.5 and char['x1'] <= page.width + .5, (key, page_number, 'horizontal text clipping', char['text'])
                assert char['top'] >= -.5 and char['bottom'] <= page.height + .5, (key, page_number, 'vertical text clipping', char['text'])
                if char['size'] >= 12.75:
                    assert char['top'] >= 20 and char['bottom'] <= page.height - 20, (key, page_number, 'body enters header/footer margin', char['text'])
    dominant_size = font_sizes.most_common(1)[0][0]
    assert abs(dominant_size - 13.5) <= .05, (key, 'Expected dominant 18px / 13.5pt body', dominant_size)
    document_checks.append({
        'document': key,
        'pdfPages': len(reader.pages),
        'sourceUnits': len(source['units']),
        'missingUnits': 0,
        'lostCharacters': 0,
        'dominantBodyFontPt': dominant_size,
        'fontSizes': dict(font_sizes.most_common()),
    })
    for index, page in enumerate(reader.pages):
        text = page.extract_text() or ''
        assert 'Troubleshooting' not in text
        assert '여기부터는' not in text
        assert 'PhotoMap' not in text and 'Game Information Platform' not in text
        results.append({'document': key, 'page': index + 1, 'characters': len(text)})
        if key == 'gyeolsoft' and index < len(main_pages):
            continue
        image = Image.open(root / 'public' / pdf_pages[index]['image'].lstrip('/')).convert('RGB')
        tile = Image.new('RGB', (600, 460), '#e9ecf0')
        scaled = ImageOps.contain(image, (580, 410))
        tile.paste(scaled, ((600-scaled.width)//2, 30))
        ImageDraw.Draw(tile).text((12, 9), f'{key} / {index + 1}', fill='#172335')
        tiles.append(tile)
    (work / f'{key}-extracted.txt').write_text(extracted, 'utf-8')
columns = 3
sheet = Image.new('RGB', (columns*600, ((len(tiles)+columns-1)//columns)*460), '#e9ecf0')
for index, tile in enumerate(tiles):
    sheet.paste(tile, ((index%columns)*600, (index//columns)*460))
sheet.save(work / 'pdf-contact-sheet.png')
(work / 'pdf-text-checks.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), 'utf-8')
(work / 'pdf-document-checks.json').write_text(json.dumps(document_checks, ensure_ascii=False, indent=2), 'utf-8')
print(json.dumps({'pdfPages':len(results), 'uniqueVisualPages':len(tiles), 'contactSheet':str(work / 'pdf-contact-sheet.png'), 'documents':document_checks}))
