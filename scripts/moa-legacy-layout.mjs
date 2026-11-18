import assert from 'node:assert/strict';

const escape = value => String(value).replace(/[&<>"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));
const chapters = ['서비스 소개', '아키텍처', '사용자 흐름', '기술 선택', '핵심 기능', '트러블슈팅'];

export function createLegacyPages(sourcePages, {renderTokens, lex, inline, folderTree, profile}) {
  const pages = [];
  const byKind = kind => {
    const page = sourcePages.find(item => item.kind === kind);
    assert(page, `Missing Moa manuscript section: ${kind}`);
    return page;
  };
  const tokens = page => lex(page.markdown.replace(/!\[\[[^\]]+\]\]/g, '').replace(/^#\s+[^\n]+\n/, '')).filter(token => token.type !== 'space' && token.type !== 'hr');
  const html = (items, kind) => renderTokens(items, kind);
  const item = (label, content, result = false) => {
    const embedded = label ? null : content.match(/^\*\*([^*]+)\*\*<br\s*\/?>([\s\S]*)$/i);
    return `<article class="legacy-item${result ? ' legacy-result' : ''}"><h3>${inline(embedded?.[1] || label)}</h3><div>${inline(embedded?.[2] ?? content)}</div></article>`;
  };
  const cells = table => table.rows.flatMap((row, rowIndex) => row.map((cell, index) => cell.text.trim() ? {
    label: rowIndex === 0 ? table.header[index].text : '', text: cell.text,
  } : null).filter(Boolean));
  const picture = src => `<figure class="legacy-picture"><img src="${src}" alt="예시 자료로 보는 모아 화면"><figcaption>예시 자료로 보는 모아 화면</figcaption></figure>`;
  const screens = images => `<div class="legacy-media-row">${images.map(picture).join('')}</div>`;
  const grid = content => `<div class="editorial-grid">${content}</div>`;
  const add = ({id, title, content, chapter, kind = 'story', layout = 'cards', accent = 'coral', eyebrow = chapters[chapter]}) => {
    pages.push({id, title, content, kind, layout, accent, eyebrow});
  };

  const intro = byKind('intro');
  const introTokens = lex(intro.markdown.split('\n').slice(2).join('\n').trim()).filter(token => token.type !== 'space');
  const introParagraphs = introTokens.filter(token => token.type === 'paragraph');
  const metrics = introTokens.find(token => token.type === 'table');
  assert.equal(introParagraphs.length, 4, 'Intro expects the four preserved manuscript paragraphs');
  assert(metrics, 'Intro measurement table missing');
  add({id: intro.id, title: intro.title, kind: 'intro', layout: 'cover', chapter: 0,
    content: `<div class="cover-lead">${html(introParagraphs.slice(1, 2), 'intro')}</div>${grid(introParagraphs.slice(2).map(token => `<div>${html([token], 'intro')}</div>`).join(''))}<div class="legacy-cover-flow">${html(introParagraphs.slice(0, 1), 'intro')}</div>${html([metrics], 'intro')}`});

  const overview = byKind('overview');
  const overviewTokens = tokens(overview);
  assert.equal(overviewTokens.length, 4, 'Overview expects metadata, introduction, problem and skills');
  add({id: overview.id, title: overview.title, chapter: 0, layout: 'overview',
    content: `<div class="overview-meta">${html(overviewTokens.slice(0, 1), 'overview')}</div>${grid(overviewTokens.slice(1, 3).map(token => `<div>${html([token], 'overview')}</div>`).join(''))}<div class="overview-bottom">${picture('/media/moa-workspace.png')}<div class="overview-stack">${html(overviewTokens.slice(3), 'overview')}</div></div>`});
  add({id: `${overview.id}-architecture`, title: '서비스 구성도', chapter: 1, kind: 'diagram', layout: 'diagram', accent: 'blue',
    content: '<figure class="legacy-full-diagram"><img src="/media/moa-architecture-dark.svg" alt="모아 프론트엔드 아키텍처"></figure>'});

  const role = byKind('role');
  const roleTokens = tokens(role);
  const roleTables = roleTokens.filter(token => token.type === 'table');
  assert.equal(roleTables.length, 3, 'Role expects flow, responsibilities and structure');
  const responsibility = cells(roleTables[1]);
  const structure = cells(roleTables[2]);
  assert.equal(responsibility.length, 3);
  assert.equal(structure.length, 2);
  add({id: `${role.id}-flow`, title: role.title, chapter: 2, layout: 'flow',
    content: `${html(roleTokens.filter(token => token.type !== 'table'), 'role')}${html([roleTables[0]], 'role')}${grid(responsibility.slice(0, 2).map(cell => item(cell.label, cell.text)).join(''))}`});
  add({id: `${role.id}-structure`, title: '계획 검토·실행과 구조 개선', chapter: 2, layout: 'structure',
    content: `${item(responsibility[2].label, responsibility[2].text)}${grid(structure.map(cell => item(cell.label, cell.text)).join(''))}`});

  const decisions = byKind('decisions');
  const decisionTokens = tokens(decisions);
  const decisionTables = decisionTokens.filter(token => token.type === 'table');
  const decisionCopy = decisionTokens.filter(token => token.type !== 'table');
  assert.equal(decisionTables.length, 2, 'Decision expects two comparison tables');
  add({id: `${decisions.id}-next`, title: decisions.title, chapter: 3,
    content: grid(`<section class="decision-copy">${html(decisionCopy.slice(0, 2), 'decisions')}</section><section class="decision-copy">${html(decisionCopy.slice(2), 'decisions')}</section>`)});
  add({id: `${decisions.id}-auth-workflow`, title: '인증과 작업 단계', chapter: 3, accent: 'blue',
    content: grid(cells(decisionTables[0]).map(cell => item(cell.label, cell.text)).join(''))});
  add({id: `${decisions.id}-components-cache`, title: '컴포넌트와 캐시', chapter: 3,
    content: grid(cells(decisionTables[1]).map(cell => item(cell.label, cell.text)).join(''))});

  const implementation = byKind('implementation');
  const implementationTokens = tokens(implementation);
  const implementationTables = implementationTokens.filter(token => token.type === 'table');
  assert.equal(implementationTables.length, 2, 'Implementation expects two feature tables');
  add({id: `${implementation.id}-files-chat`, title: implementation.title, chapter: 4, layout: 'features',
    content: `${html(implementationTokens.filter(token => token.type !== 'table'), 'implementation')}${screens(['/media/moa-files.png', '/media/moa-chat.png'])}${grid(cells(implementationTables[0]).map(cell => item(cell.label, cell.text)).join(''))}`});
  add({id: `${implementation.id}-execution-recovery`, title: '정리 계획·실행과 편집·복구', chapter: 4, layout: 'features', accent: 'blue',
    content: `${screens(['/media/moa-files.png', '/media/moa-workspace.png'])}${grid(cells(implementationTables[1]).map(cell => item(cell.label, cell.text)).join(''))}`});

  for (const entry of sourcePages.filter(page => page.kind === 'case')) {
    const caseTokens = tokens(entry);
    const table = caseTokens.find(token => token.type === 'table');
    assert(table?.rows.length >= 2 && table.header.length === 2, `Unexpected troubleshooting table: ${entry.id}`);
    const rest = table.rows.slice(1).flatMap(row => row.map(cell => cell.text.trim()).filter(Boolean));
    add({id: entry.id, title: entry.title, chapter: 5, kind: 'case', layout: 'case', accent: 'blue',
      content: grid(`<div class="legacy-case-column"><section class="legacy-case-context">${html(caseTokens.filter(token => token.type !== 'table'), 'case')}</section>${item(table.header[0].text, table.rows[0][0].text)}</div><div class="legacy-case-column">${item(table.header[1].text, table.rows[0][1].text)}${rest.map(text => item('', text, text.startsWith('**결과**'))).join('')}</div>`)});
    if (entry.id === 'case-28') add({id: `${entry.id}-file-tree`, title: '파일 구조', chapter: 5, kind: 'diagram', layout: 'diagram', accent: 'blue', content: folderTree()});
  }

  return pages.map((page, index) => ({
    id: page.id, title: page.title, kind: page.kind,
    markup: `<section class="sheet legacy-sheet legacy-${page.kind} legacy-${page.accent} layout-${page.layout}" data-page-id="${page.id}"><header><span>${escape(profile.name)} <b>/</b> ${escape(profile.role)}</span><span>Project_Moa</span></header><div class="page-content"><div class="legacy-wide-content"><div class="legacy-heading"><div class="legacy-eyebrow">${escape(page.eyebrow)}</div><h1>${escape(page.title)}</h1></div><div class="body">${page.content}</div></div></div><footer><span>${String(index + 1).padStart(2, '0')} <b>/</b> ${String(pages.length).padStart(2, '0')} · ${escape(page.eyebrow)}</span><span>${escape(profile.email)}</span></footer></section>`,
  }));
}

export const legacyPortfolioCss = `
.sheet.legacy-sheet{--legacy-bg:#0c1010;--legacy-panel:#131a1a;--legacy-text:#f2f0ea;--legacy-muted:#b5beb8;--legacy-line:#2c3533;--legacy-accent:#e39a80;position:relative;width:297mm;height:210mm;padding:25px 36px 38px;background:var(--legacy-bg);color:var(--legacy-text);font-family:Pretendard,SUIT,"Malgun Gothic",sans-serif;break-after:page}
.sheet.legacy-blue{--legacy-accent:#87c5dc}
.legacy-sheet>header{display:flex;justify-content:space-between;align-items:center;padding:0 0 12px;font-size:11px;color:var(--legacy-muted)}
.legacy-sheet>header b{font-weight:400;color:var(--legacy-line);margin:0 8px}
.legacy-sheet>.page-content{padding-top:18px}
.legacy-sheet>footer{position:absolute;left:36px;right:36px;bottom:19px;display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid var(--legacy-line);font-size:11px;color:var(--legacy-muted)}
.legacy-sheet>footer>span:first-child{color:var(--legacy-accent)}
.legacy-sheet>footer b{font-weight:400;color:var(--legacy-muted);margin:0 5px}
.legacy-sheet .legacy-heading{margin-bottom:24px}
.legacy-sheet h1{font-size:30px;line-height:1.3;letter-spacing:-.035em;font-weight:700;color:var(--legacy-text);margin:10px 0 0;word-break:keep-all;overflow-wrap:break-word}
.legacy-sheet h2,.legacy-sheet h3,.legacy-sheet h4{font-size:18px;line-height:1.5;color:var(--legacy-text);letter-spacing:-.02em}
.legacy-sheet .body,.legacy-sheet p,.legacy-sheet .legacy-item>div{font-size:18px;line-height:1.6;color:var(--legacy-muted);word-break:keep-all;overflow-wrap:break-word}
.legacy-sheet .body p{margin:0 0 15px}
.legacy-sheet .body strong{color:var(--legacy-text);font-weight:650}
.legacy-sheet .legacy-eyebrow{font-size:12px;line-height:1.5;color:var(--legacy-accent);letter-spacing:.03em}
.legacy-sheet .editorial-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;align-items:start}
.legacy-sheet .editorial-grid:has(>:only-child){grid-template-columns:1fr}
.legacy-sheet .legacy-item{min-width:0;border-top:2px solid var(--legacy-line);padding:16px 0 0}
.legacy-sheet .legacy-item h3{font-size:15px;color:var(--legacy-accent);margin:0 0 12px;line-height:1.5}
.legacy-sheet .legacy-item h3:empty{display:none}
.legacy-sheet .legacy-result{padding:16px 18px;border-top-color:var(--legacy-accent);background:var(--legacy-panel)}
.legacy-sheet .legacy-picture{min-width:0;margin:0}
.legacy-sheet .legacy-picture img{display:block;width:100%;height:220px;object-fit:contain;background:var(--legacy-panel);border:1px solid #ffffff24;border-radius:6px}
.legacy-sheet .legacy-picture figcaption{font-size:11px;line-height:1.5;color:var(--legacy-muted);margin-top:7px}
.legacy-sheet .legacy-media-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin:0 0 22px}
.legacy-sheet.layout-cover .legacy-heading{margin-bottom:28px}
.legacy-sheet.layout-cover h1{font-size:42px;line-height:1.2}
.legacy-sheet .cover-lead{max-width:860px;margin-bottom:24px}
.legacy-sheet .legacy-cover-flow{border-left:2px solid var(--legacy-accent);padding-left:15px;margin:24px 0}
.legacy-sheet .legacy-cover-flow p{margin:0;color:var(--legacy-accent)}
.legacy-sheet .metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;border-top:1px solid var(--legacy-line);padding-top:22px;margin-top:24px}
.legacy-sheet .metrics>div+div{border:0;padding:0}
.legacy-sheet .metrics strong{display:block;font-size:32px;line-height:1.2;color:var(--legacy-text);letter-spacing:-.04em}
.legacy-sheet .metrics span{display:block;font-size:13px;line-height:1.5;margin-top:9px}
.legacy-sheet .overview-meta{font-size:14px;margin-bottom:20px}
.legacy-sheet .overview-meta p{font-size:14px;line-height:1.5}
.legacy-sheet .overview-bottom{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:18px;padding-top:18px;border-top:1px solid var(--legacy-line);align-items:center}
.legacy-sheet .overview-bottom .legacy-picture img{height:200px}
.legacy-sheet .overview-stack p{font-size:17px;line-height:1.8;margin:0}
.legacy-sheet .steps{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin:28px 0 36px;padding:18px 0;border-top:1px solid var(--legacy-line);border-bottom:1px solid var(--legacy-line)}
.legacy-sheet .steps>div{border-left:1px solid var(--legacy-line);padding-left:12px}
.legacy-sheet .steps>div:first-child{border:0;padding-left:0}
.legacy-sheet .steps span{display:block;font-size:12px;color:var(--legacy-accent);margin-bottom:8px}
.legacy-sheet .steps strong{font-size:16px;line-height:1.5}
.legacy-sheet.layout-structure .body>.legacy-item,.legacy-sheet.layout-case-solution .body>.legacy-item{margin-bottom:28px}
.legacy-sheet .decision-copy{border-top:2px solid var(--legacy-accent);padding-top:18px}
.legacy-sheet .legacy-case-context>p:first-child{font-size:20px;color:var(--legacy-text);margin-bottom:24px}
.legacy-sheet .legacy-case-context>p:has(>strong:only-child){margin-top:22px;color:var(--legacy-accent)}
.legacy-sheet .legacy-case-column>.legacy-item{margin-top:20px}
.legacy-sheet .legacy-case-column>.legacy-item:first-child{margin-top:0}
.legacy-sheet.layout-case .legacy-case-context>p:first-child{font-size:18px;line-height:1.6;margin-bottom:18px}
.legacy-sheet.layout-case .legacy-case-context>p:has(>strong:only-child){margin-top:16px;margin-bottom:10px}
.legacy-sheet[data-page-id="case-5"] .legacy-case-column>.legacy-item:nth-child(2) strong,.legacy-sheet[data-page-id="case-2"] .legacy-case-column>.legacy-item:nth-child(2) strong{display:inline-block;font-size:26px;color:var(--legacy-text);margin:6px 0}
.legacy-sheet .legacy-full-diagram{margin:0;height:570px;display:flex;align-items:center;justify-content:center}
.legacy-sheet .legacy-full-diagram img{width:100%;height:100%;object-fit:contain}
.legacy-sheet .tree-name{color:var(--legacy-text)}
.legacy-sheet .tree-name svg{stroke:var(--legacy-accent);fill:var(--legacy-panel)}
.legacy-sheet .tree-description{color:var(--legacy-muted)}
.legacy-sheet .tree-children{border-left-color:var(--legacy-line)}
.legacy-sheet .tree-children>li:before{border-top-color:var(--legacy-line)}
.legacy-sheet .tree-children>li:last-child:after{background:var(--legacy-bg)}
`;
