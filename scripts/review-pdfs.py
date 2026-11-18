from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
from pypdf import PdfReader
import json
import sys

root = Path(sys.argv[1])
work = root / 'tmp/moa-documents-20261118'
manifest = json.loads((root / 'public/documents/manifest.json').read_text('utf-8'))
tiles = []
results = []
for key, document in manifest['documents'].items():
    reader = PdfReader(str(root / 'public' / document['pdf'].lstrip('/')))
    assert len(reader.pages) == len(document['pages'])
    for index, page in enumerate(reader.pages):
        text = page.extract_text() or ''
        assert 'Troubleshooting' not in text
        assert '여기부터는' not in text
        assert 'PhotoMap' not in text and 'Game Information Platform' not in text
        results.append({'document': key, 'page': index + 1, 'characters': len(text)})
        if key == 'gyeolsoft' and index < len(manifest['documents']['main']['pages']):
            continue
        image = Image.open(root / 'public' / document['pages'][index]['image'].lstrip('/')).convert('RGB')
        tile = Image.new('RGB', (600, 460), '#e9ecf0')
        scaled = ImageOps.contain(image, (580, 410))
        tile.paste(scaled, ((600-scaled.width)//2, 30))
        ImageDraw.Draw(tile).text((12, 9), f'{key} / {index + 1}', fill='#172335')
        tiles.append(tile)
    (work / f'{key}-extracted.txt').write_text('\n\n'.join(page.extract_text() or '' for page in reader.pages), 'utf-8')
columns = 3
sheet = Image.new('RGB', (columns*600, ((len(tiles)+columns-1)//columns)*460), '#e9ecf0')
for index, tile in enumerate(tiles):
    sheet.paste(tile, ((index%columns)*600, (index//columns)*460))
sheet.save(work / 'pdf-contact-sheet.png')
(work / 'pdf-text-checks.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), 'utf-8')
print(json.dumps({'pdfPages':len(results), 'uniqueVisualPages':len(tiles), 'contactSheet':str(work / 'pdf-contact-sheet.png')}))
