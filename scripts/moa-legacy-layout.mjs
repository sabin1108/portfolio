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
    label: rowIndex === 0 ? table.header[index].text : '',
    text: cell.text,
  } : null).filter(Boolean));
  const picture = (src, caption = '예시 자료로 보는 모아 화면') => `<figure class="legacy-picture"><img src="${src}" alt="${escape(caption)}"><figcaption>${escape(caption)}</figcaption></figure>`;
  const sidebar = (chapter, image) => `<aside class="legacy-sidebar"><div class="legacy-project-name"><span>01</span>Project_Moa</div>${picture(image)}<div class="legacy-chapters">${chapters.map((label, index) => `<div class="${index === chapter ? 'is-current' : ''}"><span>${String(index + 1).padStart(2, '0')}</span>${label}</div>`).join('')}</div></aside>`;
  const add = ({id, title, content, chapter, image = '/media/moa-workspace.png', kind = 'story', wide = false, accent = 'coral', eyebrow = chapters[chapter]}) => {
    pages.push({id, title, kind, chapter, accent, content, image, eyebrow, wide});
  };

  const intro = byKind('intro');
  const introTokens = lex(intro.markdown.split('\n').slice(2).join('\n').trim()).filter(token => token.type !== 'space');
  const introParagraphs = introTokens.filter(token => token.type === 'paragraph');
  const metrics = introTokens.find(token => token.type === 'table');
  assert.equal(introParagraphs.length, 4, 'Intro layout expects the four preserved manuscript paragraphs');
  assert(metrics, 'Intro measurement table missing');
  add({id: intro.id, title: intro.title, kind: 'intro', chapter: 0, wide: true,
    content: `<div class="legacy-cover-grid"><div class="legacy-cover-title"><div class="legacy-project-name"><span>01</span>Project_Moa</div>${picture('/media/moa-workspace.png')}</div><div class="legacy-cover-copy"><span class="legacy-eyebrow">project_moa</span><h1>${escape(intro.title)}</h1>${html(introParagraphs.slice(1), 'intro')}</div></div><div class="legacy-cover-flow">${html(introParagraphs.slice(0, 1), 'intro')}</div>${html([metrics], 'intro')}`});

  const overview = byKind('overview');
  add({id: overview.id, title: overview.title, chapter: 0, content: html(tokens(overview), 'overview')});
  add({id: `${overview.id}-architecture`, title: '서비스 구성도', chapter: 1, kind: 'diagram', wide: true, accent: 'blue',
    content: '<figure class="legacy-full-diagram"><img src="/media/moa-architecture-dark.svg" alt="모아 프론트엔드 아키텍처"></figure>'});

  const role = byKind('role');
  const roleTokens = tokens(role);
  const roleTables = roleTokens.filter(token => token.type === 'table');
  assert.equal(roleTables.length, 3, 'Role layout expects flow, responsibilities and structure tables');
  const responsibility = cells(roleTables[1]);
  const structure = cells(roleTables[2]);
  assert.equal(responsibility.length, 3);
  assert.equal(structure.length, 2);
  add({id: `${role.id}-flow`, title: role.title, chapter: 2, image: '/media/moa-review.png',
    content: `${html(roleTokens.filter(token => token.type !== 'table'), 'role')}${html([roleTables[0]], 'role')}${responsibility.slice(0, 2).map(cell => item(cell.label, cell.text)).join('')}`});
  add({id: `${role.id}-structure`, title: '계획 검토·실행과 구조 개선', chapter: 2, image: '/media/moa-review.png',
    content: [responsibility[2], ...structure].map(cell => item(cell.label, cell.text)).join('')});

  const decisions = byKind('decisions');
  const decisionTokens = tokens(decisions);
  const decisionTables = decisionTokens.filter(token => token.type === 'table');
  assert.equal(decisionTables.length, 2, 'Decision layout expects the two existing comparison tables');
  add({id: `${decisions.id}-next`, title: decisions.title, chapter: 3, content: html(decisionTokens.filter(token => token.type !== 'table'), 'decisions')});
  add({id: `${decisions.id}-auth-workflow`, title: '인증과 작업 단계', chapter: 3, image: '/media/moa-review.png', accent: 'blue',
    content: cells(decisionTables[0]).map(cell => item(cell.label, cell.text)).join('')});
  add({id: `${decisions.id}-components-cache`, title: '컴포넌트와 캐시', chapter: 3,
    content: cells(decisionTables[1]).map(cell => item(cell.label, cell.text)).join('')});

  const implementation = byKind('implementation');
  const implementationTokens = tokens(implementation);
  const implementationTables = implementationTokens.filter(token => token.type === 'table');
  assert.equal(implementationTables.length, 2, 'Implementation layout expects the two existing feature tables');
  add({id: `${implementation.id}-files-chat`, title: implementation.title, chapter: 4, image: '/media/moa-files.png',
    content: `${html(implementationTokens.filter(token => token.type !== 'table'), 'implementation')}${cells(implementationTables[0]).map(cell => item(cell.label, cell.text)).join('')}`});
  add({id: `${implementation.id}-execution-recovery`, title: '정리 계획·실행과 편집·복구', chapter: 4, image: '/media/moa-review.png', accent: 'blue',
    content: cells(implementationTables[1]).map(cell => item(cell.label, cell.text)).join('')});

  for (const entry of sourcePages.filter(page => page.kind === 'case')) {
    const caseTokens = tokens(entry);
    const table = caseTokens.find(token => token.type === 'table');
    assert(table?.rows.length >= 2 && table.header.length === 2, `Unexpected troubleshooting table: ${entry.id}`);
    const before = caseTokens.filter(token => token.type !== 'table');
    const image = entry.id === 'case-14' ? '/media/moa-chat.png' : entry.id === 'case-5' ? '/media/moa-workspace.png' : '/media/moa-files.png';
    add({id: `${entry.id}-problem`, title: entry.title, chapter: 5, image, kind: 'case', eyebrow: '트러블슈팅 · 문제와 선택',
      content: `${html(before, 'case')}${item(table.header[0].text, table.rows[0][0].text)}`});
    const rest = table.rows.slice(1).flatMap(row => row.map(cell => cell.text.trim()).filter(Boolean));
    add({id: `${entry.id}-solution`, title: entry.title, chapter: 5, image, kind: 'case', accent: 'blue', eyebrow: '트러블슈팅 · 해결과 확인',
      content: `${item(table.header[1].text, table.rows[0][1].text)}${rest.map(text => item('', text, text.startsWith('**결과**'))).join('')}`});
    if (entry.id === 'case-28') add({id: `${entry.id}-file-tree`, title: '파일 구조', chapter: 5, kind: 'diagram', wide: true, accent: 'blue', content: folderTree()});
  }

  return pages.map((page, index) => {
    const body = page.wide
      ? `<div class="legacy-wide-content">${page.kind === 'intro' ? '' : `<div class="legacy-eyebrow">${escape(page.eyebrow)}</div><h1>${escape(page.title)}</h1>`}<div class="body">${page.content}</div></div>`
      : `<div class="legacy-page-grid">${sidebar(page.chapter, page.image)}<div class="legacy-copy"><div class="legacy-eyebrow">${escape(page.eyebrow)}</div><h1>${escape(page.title)}</h1><div class="body">${page.content}</div></div></div>`;
    return {
      id: page.id,
      title: page.title,
      kind: page.kind,
      markup: `<section class="sheet legacy-sheet legacy-${page.kind}${page.wide ? ' legacy-wide' : ''} legacy-${page.accent}" data-page-id="${page.id}"><header><span>${escape(profile.name)} <b>/</b> ${escape(profile.role)}</span><span>Project_Moa</span></header><div class="page-content">${body}</div><footer><span>${String(index + 1).padStart(2, '0')} <b>/</b> ${String(pages.length).padStart(2, '0')} · ${escape(page.eyebrow)}</span><span>${escape(profile.email)}</span></footer></section>`,
    };
  });
}

// The archived PhotoMap/GameInfo palette and editorial sidebar are retained for Moa.
export const legacyPortfolioCss = `
.sheet.legacy-sheet{--legacy-bg:#0c1010;--legacy-panel:#131a1a;--legacy-text:#f2f0ea;--legacy-muted:#b5beb8;--legacy-line:#2c3533;--legacy-accent:#e39a80;position:relative;width:297mm;height:210mm;padding:25px 36px 38px;background:var(--legacy-bg);color:var(--legacy-text);font-family:Pretendard,SUIT,"Malgun Gothic",sans-serif;break-after:page}
.sheet.legacy-blue{--legacy-accent:#87c5dc}
.legacy-sheet>header{display:flex;justify-content:space-between;align-items:center;border:0;padding:0 0 12px;font-size:11px;color:var(--legacy-muted);letter-spacing:.02em}
.legacy-sheet>header b{font-weight:400;color:var(--legacy-line);margin:0 8px}
.legacy-sheet>.page-content{padding-top:12px}
.legacy-sheet>footer{position:absolute;left:36px;right:36px;bottom:19px;display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--legacy-line);font-size:11px;color:var(--legacy-muted)}
.legacy-sheet>footer>span:first-child{color:var(--legacy-accent)}
.legacy-sheet>footer b{font-weight:400;color:var(--legacy-muted);margin:0 5px}
.legacy-sheet .legacy-page-grid{display:grid;grid-template-columns:300px minmax(0,1fr);gap:44px;align-items:start}
.legacy-sheet .legacy-copy{min-width:0;padding-top:8px}
.legacy-sheet h1{font-size:30px;line-height:1.3;letter-spacing:-.035em;max-width:none;font-weight:700;color:var(--legacy-text);margin:13px 0 23px;word-break:keep-all;overflow-wrap:break-word}
.legacy-sheet h2,.legacy-sheet h3,.legacy-sheet h4{font-size:18px;line-height:1.5;color:var(--legacy-text);letter-spacing:-.02em}
.legacy-sheet .body,.legacy-sheet p,.legacy-sheet .legacy-item>div{font-size:18px;line-height:1.65;color:var(--legacy-muted);word-break:keep-all;overflow-wrap:break-word}
.legacy-sheet .body p{margin:0 0 15px}
.legacy-sheet .body strong{color:var(--legacy-text);font-weight:650}
.legacy-sheet .legacy-eyebrow{font-size:12px;line-height:1.5;color:var(--legacy-accent);letter-spacing:.03em}
.legacy-sheet .legacy-sidebar{min-width:0;padding-top:4px}
.legacy-sheet .legacy-project-name{display:flex;align-items:center;gap:12px;font-size:15px;font-weight:650;margin-bottom:18px}
.legacy-sheet .legacy-project-name>span{font-size:11px;color:var(--legacy-accent)}
.legacy-sheet .legacy-picture{margin:0}
.legacy-sheet .legacy-picture img{display:block;width:100%;height:300px;object-fit:contain;object-position:center;background:var(--legacy-panel);border:1px solid #ffffff24;border-radius:10px}
.legacy-sheet .legacy-picture figcaption{font-size:11px;line-height:1.6;color:#a7b4ad;margin-top:9px}
.legacy-sheet .legacy-chapters{display:none;margin-top:22px;padding-top:9px;border-top:1px solid var(--legacy-line)}
.legacy-sheet .legacy-chapters>div{display:flex;align-items:baseline;gap:12px;border-left:2px solid transparent;padding:8px 10px;color:var(--legacy-muted);font-size:12px;line-height:1.6}
.legacy-sheet .legacy-chapters>div>span{font-size:10px}
.legacy-sheet .legacy-chapters .is-current{color:var(--legacy-accent);border-left-color:var(--legacy-accent);background:color-mix(in srgb,var(--legacy-accent) 7%,transparent)}
.legacy-sheet .legacy-item{border-top:1px solid var(--legacy-line);padding:14px 0 2px;margin:17px 0 0}
.legacy-sheet .legacy-item h3{font-size:14px;color:var(--legacy-accent);margin:0 0 10px;line-height:1.5}
.legacy-sheet .legacy-result{padding:14px 18px;border-top:0;border-left:2px solid var(--legacy-accent);background:color-mix(in srgb,var(--legacy-accent) 7%,transparent)}
.legacy-sheet .legacy-cover-grid{display:grid;grid-template-columns:310px minmax(0,1fr);gap:44px;align-items:start}
.legacy-sheet .legacy-cover-copy h1{font-size:39px;line-height:1.23;margin-top:13px;margin-bottom:22px}
.legacy-sheet .legacy-cover-copy{padding-top:0}
.legacy-sheet .legacy-cover-copy p{font-size:18px;line-height:1.65;margin-bottom:18px}
.legacy-sheet .legacy-cover-flow{border-left:2px solid var(--legacy-accent);padding:0 0 0 15px;margin:23px 0 0}
.legacy-sheet .legacy-cover-flow p{font-size:17px;line-height:1.6;margin:0;color:var(--legacy-accent)}
.legacy-sheet .metrics{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--legacy-line);padding-top:18px;margin-top:24px;gap:18px}
.legacy-sheet .metrics>div+div{border-left:0;padding-left:0}
.legacy-sheet .metrics strong{display:block;color:var(--legacy-text);font-size:32px;line-height:1.2;letter-spacing:-.04em}
.legacy-sheet .metrics span{display:block;font-size:13px;line-height:1.6;color:var(--legacy-muted);margin-top:8px}
.legacy-sheet .steps{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;border-top:1px solid var(--legacy-line);border-bottom:1px solid var(--legacy-line);margin:18px 0 20px;padding:13px 0}
.legacy-sheet .steps span{display:block;font-size:11px;color:var(--legacy-accent);margin-bottom:4px}
.legacy-sheet .steps strong{font-size:13px;color:var(--legacy-text);line-height:1.4}
.legacy-sheet[data-page-id="common-3-flow"] .steps{margin:14px 0 16px}
.legacy-sheet .legacy-wide-content>h1{margin-bottom:24px}
.legacy-sheet[data-page-id="common-3-structure"] .legacy-item{margin-top:12px;padding-top:10px}
.legacy-sheet .legacy-full-diagram{margin:0;display:flex;align-items:center;justify-content:center;height:590px}
.legacy-sheet .legacy-full-diagram img{width:100%;height:auto;max-height:100%;object-fit:contain}
.legacy-sheet.legacy-diagram h1{font-size:30px;margin-bottom:12px}
.legacy-sheet .tree-name{color:var(--legacy-text)}
.legacy-sheet .tree-name svg{stroke:var(--legacy-accent);fill:var(--legacy-panel)}
.legacy-sheet .tree-description{color:var(--legacy-muted)}
.legacy-sheet .tree-children{border-left-color:var(--legacy-line)}
.legacy-sheet .tree-children>li:before{border-top-color:var(--legacy-line)}
.legacy-sheet .tree-children>li:last-child:after{background:var(--legacy-bg)}
`;
