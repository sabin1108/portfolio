import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const bundle='C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1116-1210-0_26.1116.1210.0_x64__3k8sg7r9htsxt/dependencies';
const {marked}=await import(pathToFileURL(bundle+'/node/node_modules/marked/lib/marked.esm.js'));
const {chromium}=await import(pathToFileURL(bundle+'/node/node_modules/playwright/index.mjs'));
const data=JSON.parse(await fs.readFile(path.join(root,'content/portfolio.json'),'utf8'));
const profile=JSON.parse(await fs.readFile(path.join(root,'content/profile.json'),'utf8'));
const output=path.join(root,'public/documents');
const work=path.join(root,'tmp/moa-documents-20261118');
await fs.mkdir(output,{recursive:true});await fs.mkdir(work,{recursive:true});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inline=s=>marked.parseInline(s.replace(/^\*\*([^*\n]*\S)[ \t]+\*\*$/,'**$1**'),{gfm:true,breaks:true});
function renderTokens(tokens,kind){
  return tokens.map(token=>{
    if(token.type==='table'){
      if(token.header.length===4 && kind==='intro')return `<div class="metrics">${token.header.map((h,i)=>`<div><strong>${inline(h.text)}</strong><span>${inline(token.rows[0][i].text)}</span></div>`).join('')}</div>`;
      if(token.header.length===6)return `<div class="steps">${token.header.map((h,i)=>`<div><span>${inline(h.text)}</span><strong>${inline(token.rows[0][i].text)}</strong></div>`).join('')}</div>`;
      return `<div class="blocks columns-${token.header.length}">${token.rows.map((row,ri)=>row.map((cell,i)=>cell.text.trim()?`<article class="block">${ri===0?`<h3>${inline(token.header[i].text)}</h3>`:''}<div>${inline(cell.text)}</div></article>`:'').join('')).join('')}</div>`;
    }
    if(token.type==='heading')return `<h${Math.min(token.depth+1,4)}>${inline(token.text)}</h${Math.min(token.depth+1,4)}>`;
    if(token.type==='paragraph')return `<p>${inline(token.text)}</p>`;
    if(token.type==='space'||token.type==='hr')return '';
    return marked.parser([token],{gfm:true,breaks:true});
  }).join('');
}
function expand(pages){return pages.flatMap(page=>{
  const pictures=[...page.markdown.matchAll(/!\[\[([^\]]+)\]\]/g)].map(m=>m[1]);
  const markdown=page.markdown.replace(/!\[\[[^\]]+\]\]/g,'');
  return [{...page,markdown},...pictures.map((name,i)=>({id:page.id+'-diagram-'+i,kind:'diagram',title:data.images[name]==='/media/moa-folder-tree.png'?'파일 구조':'서비스 구성도',markdown:'',image:data.images[name],sourceCase:page.sourceCase}))];
});}
function folderTree(){
  const entries=[
    {name:'src/',description:'프론트엔드 소스',children:[
      {name:'app/',description:'페이지 구성 · 기능 연결'},
      {name:'features/',description:'기능별 구현',children:[
        {name:'local-folders/',description:'로컬 파일·폴더 기능',children:[
          {name:'destination-picker/',description:'폴더 선택 부품'},
          {name:'creation/',description:'새 파일·폴더 생성 부품'}
        ]}
      ]},
      {name:'components/ui/',description:'여러 기능에서 쓰는 공통 부품',children:[
        {name:'WorkflowStepper.tsx',description:'진행 단계 표시'},
        {name:'feedback/',description:'',children:[
          {name:'StatusNotice.tsx',description:'오류·상태 안내'}
        ]}
      ]},
      {name:'server/',description:'인증·API 등 서버 처리'},
      {name:'shared/',description:'여러 기능이 공유하는 코드'}
    ]}
  ];
  const render=(nodes,depth=0)=>`<ul class="${depth===0?'folder-tree':'tree-children'}">${nodes.map(node=>{
    const icon=node.name.endsWith('/')?'<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>':'<path d="M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6m-6 4h6"/>';
    return `<li><div class="tree-row" style="--depth:${depth}"><span class="tree-name"><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span>${escape(node.name)}</span></span><span class="tree-description">${escape(node.description)}</span></div>${node.children?render(node.children,depth+1):''}</li>`;
  }).join('')}</ul>`;
  return `<div class="tree-diagram">${render(entries)}</div>`;
}
function portfolioPage(page,index,count){
  let markdown=page.markdown;
  let eyebrow=page.kind==='case'?'TROUBLESHOOTING':page.kind==='intro'?'project_moa':'PROJECT MOA';
  if(page.kind==='intro')markdown=markdown.split('\n').slice(2).join('\n').trim();
  else markdown=markdown.replace(/^#\s+[^\n]+\n/, '');
  const body=page.kind==='diagram'?(page.image==='/media/moa-folder-tree.png'?folderTree():`<figure class="diagram"><img src="${pathToFileURL(path.join(root,'public',page.image))}" alt="${escape(page.title)}"></figure>`):renderTokens(marked.lexer(markdown,{gfm:true,breaks:true}),page.kind);
  return `<section class="sheet ${page.kind}" data-page-id="${page.id}"><header><span>${escape(profile.name)} <b>/</b> ${escape(profile.role)}</span><span>${eyebrow}</span></header><div class="page-content"><h1>${escape(page.title)}</h1><div class="body">${body}</div></div><footer><span>PROJECT MOA</span><span>${String(index+1).padStart(2,'0')} <b>/</b> ${String(count).padStart(2,'0')}</span></footer></section>`;
}
const css=`
@page{size:A4 landscape;margin:0}*{box-sizing:border-box}html,body{margin:0;background:#fffefa;color:#172335;font-family:'Malgun Gothic','Noto Sans KR',Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}a{color:inherit;text-decoration:none}.sheet{position:relative;width:297mm;height:210mm;padding:35px 56px 40px;break-after:page;background:#fffefa}.sheet:last-child{break-after:auto}header,footer{display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#647084;letter-spacing:.06em}header{border-bottom:1px solid #d9dfe7;padding-bottom:13px}header b,footer b{font-weight:400;margin:0 7px;color:#b4bdca}footer{position:absolute;bottom:25px;left:56px;right:56px;border-top:1px solid #d9dfe7;padding-top:11px}.page-content{padding-top:25px}h1{font-size:30px;line-height:1.45;letter-spacing:-.06em;margin:0 0 22px;font-weight:750;max-width:98%}.body{font-size:14px;line-height:1.8;word-break:keep-all;overflow-wrap:break-word}p{margin:0 0 14px}strong{font-weight:700}h2,h3,h4{margin:15px 0 10px;line-height:1.5;font-size:16px;letter-spacing:-.025em}h3:first-child{margin-top:0}.blocks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px;margin:18px 0}.blocks.columns-3{grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.block{border-top:1px solid #cfd6e2;padding:14px 0 16px;break-inside:avoid;font-size:13px;line-height:1.8}.block h3{color:#2d4e91;font-size:15px;margin:0 0 10px}.block strong{color:#172335}.block br+br{display:block;content:'';margin-top:9px}.steps{display:flex;border-top:1px solid #cfd6e2;border-bottom:1px solid #cfd6e2;padding:13px 0;gap:12px;margin:22px 0}.steps>div{flex:1}.steps span{display:block;color:#2d4e91;font-size:12px;margin-bottom:8px}.steps strong{font-size:13px}.intro h1{font-size:45px;margin-top:23px;margin-bottom:25px;max-width:760px}.intro .body{max-width:930px;font-size:15px;line-height:1.9}.intro .body>p:first-child{color:#2d4e91;font-size:15px;border-left:3px solid #2d4e91;padding-left:16px;margin:26px 0}.metrics{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #cfd6e2;margin-top:30px;padding-top:20px}.metrics>div+div{border-left:1px solid #d9dfe7;padding-left:20px}.metrics strong{display:block;font-size:32px;letter-spacing:-.04em;line-height:1.25}.metrics span{display:block;font-size:12px;color:#647084;margin-top:10px}.case h1{font-size:29px;max-width:970px;margin-bottom:18px}.case .body>p:first-child{font-size:14px;color:#647084}.case .blocks{margin-top:17px}.case .block{font-size:13.4px}.case .body>p{margin-bottom:10px}.diagram h1{font-size:25px;margin-bottom:10px}.diagram figure{margin:0;display:flex;justify-content:center;align-items:center;height:586px}.diagram img{max-width:100%;max-height:100%;object-fit:contain}.decisions .blocks{gap:0 25px;margin:11px 0}.decisions .block{font-size:12.8px;line-height:1.72;padding-top:11px;padding-bottom:12px}.decisions .body>p{font-size:13.2px;line-height:1.7;margin-bottom:10px}.role .block{font-size:12.6px;line-height:1.75}.implementation .block{font-size:14px;line-height:1.9;padding-top:18px;padding-bottom:23px}.overview .body{font-size:15px;line-height:1.85;max-width:950px}.overview .body>p{margin-bottom:25px}.resume{width:210mm;height:297mm;padding:36px 48px 45px}.resume footer{left:48px;right:48px}.resume h1{font-size:32px;letter-spacing:-.04em}.resume .page-content{padding-top:23px}.resume .body{font-size:13px;line-height:1.85}.profile-top{display:flex;gap:25px;align-items:flex-start;margin-bottom:25px}.portrait{width:86px;height:108px;object-fit:cover}.profile-top h1{margin:0 0 5px}.profile-top p{margin:0 0 5px;font-size:12px}.resume h2{font-size:17px;color:#2d4e91;border-top:1px solid #cfd6e2;padding-top:12px;margin-top:23px}.resume .experience{border-top:1px solid #d9dfe7;margin-top:16px;padding-top:10px}.resume .experience h3{font-size:14px;margin:0 0 7px}.resume .experience p{font-size:12.4px;line-height:1.75;margin:0}.education{display:grid;grid-template-columns:1fr 1fr;gap:15px;font-size:12px}.resume .stack p{margin:0;font-size:12px}
.tree-diagram{height:586px;display:flex;align-items:center;padding:14px 25px}.folder-tree,.tree-children{list-style:none;padding:0;margin:0;width:100%}.folder-tree{font-family:Consolas,'Courier New',monospace;font-size:17px;line-height:1.4}.folder-tree li{position:relative;margin:0;padding:0}.tree-row{display:grid;grid-template-columns:calc(430px - var(--depth)*36px) minmax(0,1fr);align-items:center;min-height:40px;gap:24px}.tree-name{display:flex;align-items:center;gap:12px;white-space:nowrap;color:#253b60}.tree-name svg{width:20px;height:20px;flex-shrink:0;stroke:#7083a0;stroke-width:1.5;fill:#edf1f7;stroke-linecap:round;stroke-linejoin:round}.tree-description{font-family:'Malgun Gothic','Noto Sans KR',Arial,sans-serif;font-size:14px;color:#697587;letter-spacing:-.02em}.tree-children{margin-left:10px;padding-left:25px;border-left:1px solid #d4dce8;width:calc(100% - 10px)}.tree-children>li:before{content:'';position:absolute;left:-25px;top:20px;width:23px;border-top:1px solid #d4dce8}.tree-children>li:last-child:after{content:'';position:absolute;left:-26px;top:21px;bottom:0;width:1px;background:#fffefa}.folder-tree>.tree-row,.folder-tree>li>.tree-row{font-weight:700}.folder-tree>li>.tree-row .tree-description{font-weight:400}
`;
// Print can span multiple physical pages; web sections retain their existing HTML and layout.
const pdfCss=`
@page{margin:10mm}
.sheet,.sheet.resume{width:auto;height:auto;padding:0;break-after:page}
.sheet:last-child{break-after:auto}
.sheet>header,.sheet>footer{display:none}
.sheet .page-content{padding-top:0}
.sheet h1{font-size:32px;line-height:1.4;max-width:none;margin:0 0 22px;break-after:avoid}
.sheet.intro h1{font-size:40px;margin:8px 0 24px;max-width:none}
.sheet h2,.sheet h3,.sheet h4{font-size:20px;line-height:1.5;break-after:avoid}
.sheet .body,.sheet.intro .body,.sheet.overview .body,.sheet.resume .body{font-size:18px;line-height:1.7;max-width:none}
.sheet .body>p,.sheet.intro .body>p:first-child,.sheet.case .body>p:first-child,.sheet.decisions .body>p{font-size:18px;line-height:1.7;margin:0 0 16px;orphans:3;widows:3}
.sheet.intro .body>p:first-child{margin:0 0 24px}
.sheet .blocks,.sheet .blocks.columns-3{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px;margin:12px 0 0}
.sheet .block,.sheet.case .block,.sheet.decisions .block,.sheet.role .block,.sheet.implementation .block{font-size:18px;line-height:1.7;padding:10px 0;break-inside:avoid}
.sheet .block:last-child:nth-child(odd){grid-column:1/-1}
.sheet .block h3{font-size:20px;margin-bottom:10px}
.sheet .steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 24px;margin:22px 0;padding:16px 0;break-inside:avoid}
.sheet .steps span{font-size:14px}.sheet .steps strong{font-size:17px}
.sheet .metrics{margin-top:26px;padding-top:20px;break-inside:avoid}
.sheet .metrics strong{font-size:36px}.sheet .metrics span{font-size:15px;line-height:1.6}
.sheet.diagram figure{height:auto;break-inside:avoid}.sheet.diagram img{width:100%;height:auto;max-height:none}
.sheet .tree-diagram{height:auto;padding:10px 0;break-inside:avoid}
.sheet .folder-tree{font-size:18px}.sheet .tree-description{font-size:17px}.sheet .tree-row{min-height:44px}
.sheet.resume .profile-top{margin-bottom:24px;break-inside:avoid}
.sheet.resume .profile-top h1{margin:0 0 8px}
.sheet.resume .profile-top p{font-size:16px;line-height:1.7;margin-bottom:6px}
.sheet.resume .portrait{width:96px;height:120px}
.sheet.resume h2{font-size:20px;margin-top:24px;padding-top:14px}
.sheet.resume .experience{margin-top:12px;padding-top:10px;break-inside:avoid}
.sheet.resume .experience h3{font-size:20px;line-height:1.4;margin-bottom:8px}
.sheet.resume .experience p,.sheet.resume .stack p,.sheet.resume .education{font-size:18px;line-height:1.7}
.sheet.resume .education{break-inside:avoid}.sheet.resume .education p{margin:6px 0 0}
`;
function resumeSheets(){
  const paragraphs=data.common[0].markdown.split(/\n\s*\n/).filter(Boolean);
  const intro=paragraphs[1], role=paragraphs[2],skills=data.common[1].markdown.match(/\*\*Frontend:[\s\S]*?(?=\n\s*!\[\[|$)/)?.[0]||'';
  assert(intro&&role);
  const body1=`<div class="profile-top"><img class="portrait" src="${pathToFileURL(path.join(root,'public/media/portrait.jpg'))}" alt="${profile.name}"><div><h1>${profile.name}</h1><p>${profile.role}</p><p><a href="mailto:${profile.email}">${profile.email}</a></p><p><a href="${profile.github}">${profile.github}</a></p></div></div><h2>Project_Moa</h2><p>2026.09~2026.11 · 1인</p><p>${inline(intro)}</p><p>${inline(role)}</p><h2>기술</h2><div class="stack">${marked.parse(skills,{gfm:true,breaks:true})}</div><h2>학력 · 자격</h2><div class="education"><div><strong>${profile.education.school}</strong><p>${profile.education.degree} · ${profile.education.status}<br>${profile.education.period}<br>${profile.education.gpa}</p></div><div><strong>${profile.certificates[0].name}</strong><p>${profile.certificates[0].issuer}<br>${profile.certificates[0].date}</p></div></div>`;
  const entries=data.gyeol.filter(p=>p.kind==='case').map(p=>{
    const table=marked.lexer(p.markdown).find(t=>t.type==='table');
    assert(table,`Case table missing ${p.id}`);
    return `<article class="experience"><h3>${escape(p.title)}</h3><p>${inline(table.rows[0][0].text)}</p></article>`;
  });
  return [
    {id:'resume-profile',title:'프로필 · 모아 프로젝트',html:body1},
    {id:'resume-experience',title:'프로젝트 경험',html:`<h1>프로젝트 경험</h1>${entries.join('')}`}
  ].map((p,index)=>({...p,kind:'resume',markup:`<section class="sheet resume" data-page-id="${p.id}"><header><span>${profile.name} / ${profile.role}</span><span>GYEOLSOFT · RESUME</span></header><div class="page-content"><div class="body">${p.html}</div></div><footer><span>${profile.email}</span><span>${index+1} / 2</span></footer></section>`}));
}
const documents=[
  {id:'main',title:'포트폴리오',file:'main-portfolio.pdf',pages:expand(data.common)},
  {id:'gyeolsoft',title:'결소프트 포트폴리오',file:'gyeolsoft-portfolio.pdf',pages:expand(data.gyeol)},
  {id:'resume',title:'결소프트 이력서',file:'gyeolsoft-resume.pdf',pages:resumeSheets()}
];
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-gpu']});
const {source:profileSource,...publicProfile}=profile;
const manifest={profile:publicProfile,sourceSha256:data.source.sha256,stylesheet:'/documents/document.css',documents:{}};
const layout=[];
const pdfSourceText={};
const printChecks=[];
let documentCss='';
try{
  const page=await browser.newPage({viewport:{width:1400,height:1000}});
  for(const doc of documents){
    const html=`<!doctype html><html lang="ko"><meta charset="utf-8"><title>${profile.name} · ${doc.title}</title><style>${css}${doc.id==='resume'?'@page{size:A4 portrait}':''}</style><body>${doc.pages.map((p,i)=>p.markup||portfolioPage(p,i,doc.pages.length)).join('')}</body></html>`;
    const htmlPath=path.join(work,doc.id+'.html');await fs.writeFile(htmlPath,html);
    await page.goto(pathToFileURL(htmlPath).href);
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
    const metrics=await page.evaluate(()=>[...document.querySelectorAll('.sheet')].map(sheet=>{
      const box=sheet.getBoundingClientRect(),content=sheet.querySelector('.page-content').getBoundingClientRect(),footer=sheet.querySelector('footer').getBoundingClientRect();
      return{id:sheet.dataset.pageId,bottom:content.bottom-box.top,footer:footer.top-box.top,overflow:content.bottom>footer.top-12};
    }));
    layout.push({document:doc.id,pages:metrics});
    if(metrics.some(m=>m.overflow)){console.log(JSON.stringify({overflow:doc.id,pages:metrics}));throw Error('Document content overflow');}
    const webDocument=await page.evaluate(publicUrl=>{
      const rules=[...document.styleSheets[0].cssRules].filter(rule=>rule.type===CSSRule.STYLE_RULE);
      const scopedRules=rules.map(rule=>{
        const selectors=rule.selectorText.split(',').flatMap(selector=>{
          const value=selector.trim();
          if(value==='html'||value==='body')return ['.document-sheet'];
          if(value==='*')return ['.document-sheet','.document-sheet *'];
          return [`.document-sheet ${value}`];
        });
        return `${[...new Set(selectors)].join(',')}{${rule.style.cssText}}`;
      });
      const pages=[...document.querySelectorAll('.sheet')].map(sheet=>{
        const bounds=sheet.getBoundingClientRect();
        const clone=sheet.cloneNode(true);
        for(const element of clone.querySelectorAll('[src],[href]')){
          for(const attribute of ['src','href']){
            const value=element.getAttribute(attribute);
            if(value?.startsWith(publicUrl))element.setAttribute(attribute,'/'+value.slice(publicUrl.length));
          }
        }
        if(clone.textContent!==sheet.textContent)throw Error('Web text differs from PDF authoring text');
        const html=clone.outerHTML;
        if(/file:\/\//i.test(html))throw Error('Local file URL in public HTML');
        const content=sheet.querySelector('.page-content');
        const walker=document.createTreeWalker(content,NodeFilter.SHOW_TEXT);
        const units=[];while(walker.nextNode()){if(walker.currentNode.textContent.trim())units.push(walker.currentNode.textContent);}
        return {html,text:sheet.innerText,width:bounds.width,height:bounds.height,sourceText:{units,bodyText:content.textContent}};
      });
      return {css:scopedRules.join('\n'),pages};
    },pathToFileURL(path.join(root,'public')+path.sep).href);
    if(documentCss)assert.equal(webDocument.css,documentCss,'All documents must share authoring styles');
    else documentCss=webDocument.css;
    assert(webDocument.pages.every(p=>p.width>0&&p.height>0&&p.html.includes('class="body"')));
    pdfSourceText[doc.id]={units:webDocument.pages.flatMap(p=>p.sourceText.units),bodyText:webDocument.pages.map(p=>p.sourceText.bodyText).join('\n')};
    manifest.documents[doc.id]={id:doc.id,title:doc.title,pdf:'/documents/'+doc.file,pages:doc.pages.map((p,i)=>{
      const {sourceText,...webPage}=webDocument.pages[i];
      return {id:p.id,title:p.title,image:`/documents/${doc.id}/page-${String(i+1).padStart(2,'0')}.webp`,...webPage};
    })};
    await page.setContent(`<!doctype html><html lang="ko"><style>body{margin:0}#scope-sentinel{color:rgb(1,2,3);display:block}${documentCss}</style><body><header id="scope-sentinel">Viewer chrome</header>${webDocument.pages.map(p=>`<div class="document-sheet">${p.html}</div>`).join('')}</body></html>`);
    const webChecks=await page.evaluate(()=>({
      selectors:[...document.styleSheets[0].cssRules].slice(2).map(rule=>rule.selectorText),
      sentinel:getComputedStyle(document.querySelector('#scope-sentinel')).color,
      sheets:[...document.querySelectorAll('.document-sheet .sheet')].map(sheet=>({width:sheet.getBoundingClientRect().width,height:sheet.getBoundingClientRect().height,text:sheet.innerText})),
      localFiles:document.querySelectorAll('[src^="file:"],[href^="file:"]').length
    }));
    assert(webChecks.selectors.every(selector=>selector.split(',').every(value=>value.trim().startsWith('.document-sheet'))),'Unscoped document CSS');
    assert.equal(webChecks.sentinel,'rgb(1, 2, 3)');
    assert.equal(webChecks.localFiles,0);
    assert.deepEqual(webChecks.sheets,webDocument.pages.map(({width,height,text})=>({width,height,text})),'Web text or authoring dimensions differ');
    await page.goto(pathToFileURL(htmlPath).href);
    await page.addStyleTag({content:pdfCss});
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode()));});
    const printState=await page.evaluate(()=>({
      bodyText:[...document.querySelectorAll('.sheet .page-content')].map(element=>element.textContent).join('\n'),
      fonts:[...document.querySelectorAll('.body>p,.block,.experience p,.stack p')].map(element=>parseFloat(getComputedStyle(element).fontSize))
    }));
    assert.equal(printState.bodyText,pdfSourceText[doc.id].bodyText,'Print styling changed content');
    assert(printState.fonts.every(size=>size>=18),'Print primary text must be18px or larger');
    printChecks.push({document:doc.id,minimumBodyPx:Math.min(...printState.fonts),textPreserved:true});
    const headerTemplate=`<div style="font-family:Arial,sans-serif;font-size:11px;color:#647084;width:100%;padding:0 10mm;display:flex;justify-content:space-between"><span>${escape(profile.name)} / ${escape(profile.role)}</span><span>${escape(doc.title)}</span></div>`;
    const footerTemplate=`<div style="font-family:Arial,sans-serif;font-size:11px;color:#647084;width:100%;padding:0 10mm;display:flex;justify-content:space-between"><span>${escape(profile.email)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
    await page.pdf({path:path.join(output,doc.file),preferCSSPageSize:true,printBackground:true,tagged:true,displayHeaderFooter:true,headerTemplate,footerTemplate});
  }
}finally{await browser.close();await fs.writeFile(path.join(work,'layout-checks.json'),JSON.stringify(layout,null,2));}
await fs.writeFile(path.join(work,'pdf-source-text.json'),JSON.stringify(pdfSourceText,null,2));
const renderReportPath=path.join(work,'pdf-render-report.json');
const render=spawnSync(bundle+'/python/python.exe',['-X','utf8',path.join(root,'scripts/render-document-pages.py'),output,JSON.stringify(Object.fromEntries(documents.map(d=>[d.id,d.pages.length]))),renderReportPath],{encoding:'utf8'});
if(render.status!==0)throw Error(render.stderr||render.stdout);
const rendered=JSON.parse(await fs.readFile(renderReportPath,'utf8'));
const normalized=value=>value.replace(/\s+/g,'');
for(const doc of documents){
  const actual=rendered[doc.id];
  manifest.documents[doc.id].pdfPageCount=actual.pdfPageCount;
  manifest.documents[doc.id].pdfPages=actual.pages.map(({text,...preview})=>preview);
  let start=0;
  for(const logical of manifest.documents[doc.id].pages){
    const found=actual.pages.findIndex((p,i)=>i>=start&&normalized(p.text).includes(normalized(logical.title)));
    if(found>=0)start=found;
    logical.image=actual.pages[start].image;
    logical.pdfStartPage=start+1;
  }
}
await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2));
await fs.writeFile(path.join(output,'document.css'),documentCss+'\n');
const exportPath=path.resolve(root,'../output/pdf/20261118');await fs.mkdir(exportPath,{recursive:true});
for(const doc of documents)await fs.copyFile(path.join(output,doc.file),path.join(exportPath,doc.file));
await fs.writeFile(path.join(root,'content/build-report.json'),JSON.stringify({source:data.source,selectedCases:data.selectedCases,documents:documents.map(d=>({id:d.id,webSections:d.pages.length,pdfPages:rendered[d.id].pdfPageCount,pdf:d.file})),layoutChecks:layout,printChecks},null,2));
console.log(JSON.stringify({documents:documents.map(d=>({id:d.id,webSections:d.pages.length,pdfPages:rendered[d.id].pdfPageCount})),pdfDirectory:exportPath,render:render.stdout.trim()}));
