import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {legacyPortfolioCss,createLegacyPages} from './moa-legacy-layout.mjs';
import {portfolioVisualCss} from './moa-portfolio-visuals.mjs';
import {legacyResumeCss,createResumeSheets} from './moa-resume-theme.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const bundle='C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1116-1210-0_26.1116.1210.0_x64__3k8sg7r9htsxt/dependencies';
const {marked}=await import(pathToFileURL(bundle+'/node/node_modules/marked/lib/marked.esm.js'));
const {chromium}=await import(pathToFileURL(bundle+'/node/node_modules/playwright/index.mjs'));
const data=JSON.parse(await fs.readFile(path.join(root,'content/portfolio.json'),'utf8'));
const profile=JSON.parse(await fs.readFile(path.join(root,'content/profile.json'),'utf8'));
const resume=JSON.parse(await fs.readFile(path.join(root,'content/resume.json'),'utf8'));
if(profile.project)for(const url of Object.values(profile.project))assert.equal(new URL(url).protocol,'https:','Project links must use HTTPS');
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
function folderTree(){
  const entries=[
    {name:'src/',description:'프론트엔드 소스',children:[
      {name:'app/',description:'페이지 구성 · 기능 연결'},
      {name:'features/',description:'기능별 구현',children:[
        {name:'local-folders/',description:'로컬 파일·폴더 기능',children:[
          {name:'destination-picker/',description:'폴더 선택 부품'},
          {name:'creation/',description:'새 파일·폴더 생성 부품'},
          {omitted:true}
        ]},
        {omitted:true}
      ]},
      {name:'components/ui/',description:'여러 기능에서 쓰는 공통 부품',children:[
        {name:'WorkflowStepper.tsx',description:'진행 단계 표시'},
        {name:'feedback/',description:'',children:[
          {name:'StatusNotice.tsx',description:'오류·상태 안내'}
        ]},
        {omitted:true}
      ]},
      {name:'server/',description:'인증·API 등 서버 처리'},
      {name:'shared/',description:'여러 기능이 공유하는 코드'}
    ]}
  ];
  const render=(nodes,depth=0)=>`<ul class="${depth===0?'folder-tree':'tree-children'}">${nodes.map(node=>{
    if(node.omitted)return `<li class="tree-ellipsis"><div class="tree-row" style="--depth:${depth}"><span class="tree-name" aria-label="일부 폴더와 파일 생략">…</span></div></li>`;
    const icon=node.name.endsWith('/')?'<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>':'<path d="M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6m-6 4h6"/>';
    return `<li><div class="tree-row" style="--depth:${depth}"><span class="tree-name"><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span>${escape(node.name)}</span></span><span class="tree-description">${escape(node.description)}</span></div>${node.children?render(node.children,depth+1):''}</li>`;
  }).join('')}</ul>`;
  return `<div class="tree-diagram">${render(entries)}</div><div class="tree-omission-note">… 일부 폴더와 파일 생략</div>`;
}
const css=`
@page{size:A4 landscape;margin:0}*{box-sizing:border-box}html,body{margin:0;font-family:'Malgun Gothic',Arial,sans-serif;background:#f4f2ed;-webkit-print-color-adjust:exact;print-color-adjust:exact}a{color:inherit;text-decoration:none}.sheet{break-after:page}.sheet:last-child{break-after:auto}p,h1,h2,h3,h4,figure{margin:0}
.tree-diagram{height:586px;display:flex;align-items:center;padding:14px 25px}.folder-tree,.tree-children{list-style:none;padding:0;margin:0;width:100%}.folder-tree{font-family:Consolas,'Courier New',monospace;font-size:17px;line-height:1.4}.folder-tree li{position:relative;margin:0;padding:0}.tree-row{display:grid;grid-template-columns:calc(430px - var(--depth)*36px) minmax(0,1fr);align-items:center;min-height:40px;gap:24px}.tree-name{display:flex;align-items:center;gap:12px;white-space:nowrap;color:#253b60}.tree-name svg{width:20px;height:20px;flex-shrink:0;stroke:#7083a0;stroke-width:1.5;fill:#edf1f7;stroke-linecap:round;stroke-linejoin:round}.tree-description{font-family:'Malgun Gothic','Noto Sans KR',Arial,sans-serif;font-size:14px;color:#697587;letter-spacing:-.02em}.tree-children{margin-left:10px;padding-left:25px;border-left:1px solid #d4dce8;width:calc(100% - 10px)}.tree-children>li:before{content:'';position:absolute;left:-25px;top:20px;width:23px;border-top:1px solid #d4dce8}.tree-children>li:last-child:after{content:'';position:absolute;left:-26px;top:21px;bottom:0;width:1px;background:#fffefa}.folder-tree>.tree-row,.folder-tree>li>.tree-row{font-weight:700}.folder-tree>li>.tree-row .tree-description{font-weight:400}
`+legacyPortfolioCss+portfolioVisualCss+`
.legacy-sheet .tree-diagram{height:auto;padding:8px 0}.legacy-sheet .folder-tree{font-size:18px}.legacy-sheet .tree-description{font-size:17px}.legacy-sheet .tree-row{min-height:40px}.legacy-sheet .tree-ellipsis .tree-row{min-height:20px;line-height:20px}.legacy-sheet .tree-ellipsis:before{top:10px}.legacy-sheet .tree-ellipsis:last-child:after{top:11px}.legacy-sheet .tree-omission-note{font-size:12px;line-height:1.4;color:#5c6d6b;margin-top:6px}
`+legacyResumeCss;
// Preserve project prose independently; resume-only additions have a separate editable source.
function expectedResumeSource(){
  const paragraphs=data.common[0].markdown.split(/\n\s*\n/).filter(Boolean);
  const intro=resume.projectSummary||paragraphs[1], role=resume.role||paragraphs[2],skills=data.common[1].markdown.match(/\*\*Frontend:[\s\S]*?(?=\n\s*!\[\[|$)/)?.[0]||'';
  assert(intro&&role);
  const body1=`<div class="profile-top"><img class="portrait" src="${pathToFileURL(path.join(root,'public/media/portrait.jpg'))}" alt="${profile.name}"><div><h1>${profile.name}</h1><p>${profile.role}</p><p><a href="mailto:${profile.email}">${profile.email}</a></p><p><a href="${profile.github}">${profile.github}</a></p></div></div><h2>Project_Moa</h2><p>2026.09~2026.11 · 1인</p><p>${inline(intro)}</p><p>${inline(role)}</p><h2>기술</h2><div class="stack">${marked.parse(skills,{gfm:true,breaks:true})}</div><h2>학력 · 자격</h2><div class="education"><div><strong>${profile.education.school}</strong><p>${profile.education.degree} · ${profile.education.status}<br>${profile.education.period}<br>${profile.education.gpa}</p></div><div><strong>${profile.certificates[0].name}</strong><p>${profile.certificates[0].issuer}<br>${profile.certificates[0].date}</p></div></div>`;
  const entries=data.gyeol.filter(p=>p.kind==='case').map(p=>{
    const table=marked.lexer(p.markdown).find(t=>t.type==='table');
    assert(table,`Case table missing ${p.id}`);
    return `<article class="experience"><h3>${escape(resume.caseTitles?.[p.id]||p.title)}</h3><p>${inline(resume.caseOverrides?.[p.id]||table.rows[0][0].text)}</p>${resume.caseNotes?.[p.id]?`<small>${escape(resume.caseNotes[p.id])}</small>`:''}</article>`;
  });
  return [
    {id:'resume-profile',title:'프로필 · 모아 프로젝트',html:body1},
    {id:'resume-experience',title:'프로젝트 경험',html:`<h1>프로젝트 경험</h1>${entries.join('')}<p>${inline(resume.motivation)}</p>${resume.introduction?marked.parse(resume.introduction):''}${resume.training.map(entry=>`<p>${escape(entry.name)} · ${escape(entry.status)}</p>`).join('')}${[...resume.research,...resume.awards].map(entry=>`<article><h3>${escape(entry.title)}</h3><p>${escape(entry.details)}</p></article>`).join('')}`}
  ].map((p,index)=>({...p,kind:'resume',markup:`<section class="sheet resume" data-page-id="${p.id}"><header><span>${profile.name} / ${profile.role}</span><span>GYEOLSOFT · RESUME</span></header><div class="page-content"><div class="body">${p.html}</div></div><footer><span>${profile.email}</span><span>${index+1} / 2</span></footer></section>`}));
}
function resumeSheets(){return createResumeSheets(data,profile,resume,{inline,marked,escape,portraitUrl:pathToFileURL(path.join(root,'public/media/portrait.jpg')).href});}
const layoutHelpers={renderTokens,lex:markdown=>marked.lexer(markdown,{gfm:true,breaks:true}),inline,folderTree,profile};
const documents=[
  {id:'main',title:'포트폴리오',file:'main-portfolio.pdf',pages:createLegacyPages(data.common,layoutHelpers)},
  {id:'gyeolsoft',title:'결소프트 포트폴리오',file:'gyeolsoft-portfolio.pdf',pages:createLegacyPages(data.gyeol,layoutHelpers)},
  {id:'resume',title:'결소프트 이력서',file:'gyeolsoft-resume.pdf',pages:resumeSheets()}
];
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-gpu']});
const {source:profileSource,...publicProfile}=profile;
const manifest={profile:publicProfile,sourceSha256:data.source.sha256,stylesheet:'/documents/document.css',documents:{}};
const layout=[];
const pdfSourceText={};
const printChecks=[];
const baselineSources={};
function manuscriptContent(pages){
  return pages.map(source=>{
    const diagrams=[...source.markdown.matchAll(/!\[\[([^\]]+)\]\]/g)].map(match=>match[1]);
    let markdown=source.markdown.replace(/!\[\[[^\]]+\]\]/g,'');
    markdown=source.kind==='intro'?markdown.split('\n').slice(2).join('\n').trim():markdown.replace(/^#\s+[^\n]+\n/,'');
    const figures=diagrams.map(name=>data.images[name]==='/media/moa-folder-tree.png'?`<h1>파일 구조</h1>${folderTree()}`:'<h1>서비스 구성도</h1>').join('');
    return `<div class="page-content"><h1>${escape(source.title)}</h1>${renderTokens(marked.lexer(markdown,{gfm:true,breaks:true}),source.kind)}${figures}</div>`;
  });
}
const sourceCatalog={main:manuscriptContent(data.common),gyeolsoft:manuscriptContent(data.gyeol),resume:expectedResumeSource().map(page=>page.markup)};
let documentCss='';
try{
  const page=await browser.newPage({viewport:{width:1400,height:1000}});
  const assertResumeLayout=async()=>{
    const state=await page.evaluate(()=>{
      const intro=document.querySelector('.bin-classic-intro');
      const introBlock=intro.closest('.bin-classic-section')||intro;
      const items=[...document.querySelectorAll('.bin-classic-achievements li')];
      const headings=items.map(item=>{const style=getComputedStyle(item.querySelector('h4'));return[style.fontSize,style.fontWeight,style.lineHeight].join('/');});
      return{motivationBelowIntro:introBlock.nextElementSibling.querySelector('h2')?.textContent==='지원동기',count:items.length,headings,ruleWidths:items.map(item=>parseFloat(getComputedStyle(item).borderTopWidth))};
    });
    assert(state.motivationBelowIntro,'Motivation must directly follow the introduction');
    assert.equal(state.count,6);assert.equal(new Set(state.headings).size,1,'Case heading styles differ');
    assert(state.ruleWidths.every(width=>width<=1),'A case has a thicker separator');
  };
  for(const [id,sourcePages] of Object.entries(sourceCatalog)){
    baselineSources[id]=await page.evaluate(pages=>{
      const units=[];let bodyText='';
      for(const source of pages){
        const doc=new DOMParser().parseFromString(source,'text/html');
        const content=doc.querySelector('.page-content');
        const walker=doc.createTreeWalker(content,NodeFilter.SHOW_TEXT);
        while(walker.nextNode()){if(walker.currentNode.textContent.trim())units.push(walker.currentNode.textContent);}
        bodyText+=content.textContent+'\n';
      }
      return{units,bodyText};
    },sourcePages);
  }
  for(const doc of documents){
    const markup=doc.pages.map(p=>p.markup).join('').replaceAll('src="/media/',`src="${pathToFileURL(path.join(root,'public/media')+path.sep).href}`);
    const html=`<!doctype html><html lang="ko"><meta charset="utf-8"><title>${profile.name} · ${doc.title}</title><style>${css}${doc.id==='resume'?'@page{size:A4 portrait}':''}</style><body>${markup}</body></html>`;
    const htmlPath=path.join(work,doc.id+'.html');await fs.writeFile(htmlPath,html);
    await page.goto(pathToFileURL(htmlPath).href);
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
    if(doc.id==='resume')await assertResumeLayout();
    const metrics=await page.evaluate(()=>[...document.querySelectorAll('.sheet')].map(sheet=>{
      const box=sheet.getBoundingClientRect(),content=sheet.querySelector('.page-content').getBoundingClientRect(),footer=sheet.querySelector('footer').getBoundingClientRect();
      return{id:sheet.dataset.pageId,bottom:content.bottom-box.top,footer:footer.top-box.top,overflow:content.bottom>footer.top-12};
    }));
    const visualClipping=await page.evaluate(()=>[...document.querySelectorAll('.portfolio-visual')].flatMap(figure=>{
      const box=figure.getBoundingClientRect();
      return [...figure.querySelectorAll('.diagram-node,.diagram-note,.diagram-caption,.role-branch,.timeline-labels,.wire-list,.stable-rows,.metric-range,.metric-change,.evidence-condition')].filter(element=>{
        const bounds=element.getBoundingClientRect();
        return bounds.left<box.left-2||bounds.right>box.right+2||bounds.top<box.top-2||bounds.bottom>box.bottom+2||element.scrollWidth>element.clientWidth+2;
      }).map(element=>({visual:figure.dataset.visual,className:element.className,text:element.textContent.slice(0,40)}));
    }));
    assert.deepEqual(visualClipping,[],`${doc.id}: diagram text escapes its frame`);
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
    assert(webDocument.pages.every(p=>p.width>0&&p.height>0&&/class="[^"]*\bbody\b[^"]*"/.test(p.html)));
    const newSourceText={units:webDocument.pages.flatMap(p=>p.sourceText.units),bodyText:webDocument.pages.map(p=>p.sourceText.bodyText).join('\n')};
    const flat=value=>value.replace(/\s+/g,'');
    const missing=baselineSources[doc.id].units.filter(unit=>!flat(newSourceText.bodyText).includes(flat(unit)));
    assert.deepEqual(missing,[],`${doc.id}: preserved manuscript text missing`);
    pdfSourceText[doc.id]=baselineSources[doc.id];
    manifest.documents[doc.id]={id:doc.id,title:doc.title,pdf:'/documents/'+doc.file,pages:doc.pages.map((p,i)=>{
      const {sourceText,...webPage}=webDocument.pages[i];
      const picture=p.markup.match(/<aside class="legacy-sidebar">[\s\S]*?<img src="([^"]+)"/);
      return {id:p.id,title:p.title,kind:p.kind,visual:picture?.[1]||'/media/moa-workspace.png',image:`/documents/${doc.id}/page-${String(i+1).padStart(2,'0')}.webp`,...webPage};
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
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode()));});
    const printState=await page.evaluate(()=>({
      bodyText:[...document.querySelectorAll('.sheet .page-content')].map(element=>element.textContent).join('\n'),
      fonts:[...document.querySelectorAll('.body>p,.block,.experience p,.stack p,.legacy-item>div,.bin-classic-achievements p,.bin-classic-intro,.bin-classic-role-line,.bin-classic-skill-row dd')].map(element=>parseFloat(getComputedStyle(element).fontSize))
    }));
    assert.equal(printState.bodyText,newSourceText.bodyText,'Print styling changed content');
    const minimumBodyPx=doc.id==='resume'?16:18;
    assert(printState.fonts.every(size=>size>=minimumBodyPx),`${doc.id}: primary text is below ${minimumBodyPx}px`);
    printChecks.push({document:doc.id,minimumBodyPx:Math.min(...printState.fonts),textPreserved:true});
    await page.pdf({path:path.join(output,doc.file),preferCSSPageSize:true,printBackground:true,tagged:true});
  }
  const [a3]=createResumeSheets(data,profile,resume,{inline,marked,escape,portraitUrl:pathToFileURL(path.join(root,'public/media/portrait.jpg')).href,paper:'A3'});
  const a3HtmlPath=path.join(work,'resume-a3.html');
  await fs.writeFile(a3HtmlPath,`<!doctype html><html lang="ko"><meta charset="utf-8"><title>${profile.name} · 결소프트 이력서 · A3</title><style>${css}@page{size:A3 landscape}</style><body>${a3.markup}</body></html>`);
  await page.goto(pathToFileURL(a3HtmlPath).href);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode()));});
  await assertResumeLayout();
  const a3State=await page.evaluate(()=>{
    const sheet=document.querySelector('.sheet'),box=sheet.getBoundingClientRect(),content=sheet.querySelector('.page-content').getBoundingClientRect(),footer=sheet.querySelector('footer').getBoundingClientRect();
    const columns=[...sheet.querySelectorAll('.bin-classic-a3-columns>main,.bin-classic-a3-columns>aside')].map(element=>({...element.getBoundingClientRect().toJSON(),sections:[...element.children].map(child=>({title:child.querySelector('h2,h1')?.textContent,height:child.getBoundingClientRect().height,bottom:child.getBoundingClientRect().bottom}))}));
    return{bottom:content.bottom-box.top,footer:footer.top-box.top,overflow:content.bottom>footer.top-12,horizontal:sheet.scrollWidth>sheet.clientWidth+2,text:sheet.querySelector('.page-content').textContent,columns};
  });
  layout.push({document:'resume-a3',pages:[a3State]});
  assert(!a3State.overflow&&!a3State.horizontal,`A3 content overflow: ${JSON.stringify({...a3State,text:undefined})}`);
  assert.equal(a3State.columns.length,2);assert(a3State.columns[0].right<a3State.columns[1].left,'A3 must use two separate columns');
  for(const unit of baselineSources.resume.units)assert(a3State.text.replace(/\s+/g,'').includes(unit.replace(/\s+/g,'')),`A3 text missing: ${unit}`);
  await page.pdf({path:path.join(work,'gyeolsoft-resume-A3.pdf'),preferCSSPageSize:true,printBackground:true,tagged:true});
}finally{await browser.close();await fs.writeFile(path.join(work,'layout-checks.json'),JSON.stringify(layout,null,2));}
for(const [pdf,width,height] of [[path.join(output,'gyeolsoft-resume.pdf'),210,297],[path.join(work,'gyeolsoft-resume-A3.pdf'),420,297]]){
  const normalize=spawnSync(bundle+'/python/python.exe',['-X','utf8',path.join(root,'scripts/normalize-pdf-paper-box.py'),pdf,String(width),String(height)],{encoding:'utf8'});
  if(normalize.status!==0)throw Error(normalize.stderr||normalize.stdout);
}
await fs.writeFile(path.join(work,'pdf-source-text.json'),JSON.stringify(pdfSourceText,null,2));
const renderReportPath=path.join(work,'pdf-render-report.json');
const render=spawnSync(bundle+'/python/python.exe',['-X','utf8',path.join(root,'scripts/render-document-pages.py'),output,JSON.stringify(Object.fromEntries(documents.map(d=>[d.id,d.pages.length]))),renderReportPath],{encoding:'utf8'});
if(render.status!==0)throw Error(render.stderr||render.stdout);
const rendered=JSON.parse(await fs.readFile(renderReportPath,'utf8'));
for(const doc of documents){
  const actual=rendered[doc.id];
  assert.equal(actual.pdfPageCount,doc.pages.length,`${doc.id}: physical pages must match authored scenes`);
  manifest.documents[doc.id].pdfPageCount=actual.pdfPageCount;
  manifest.documents[doc.id].pdfPages=actual.pages.map(({text,...preview})=>preview);
  for(const [index,logical] of manifest.documents[doc.id].pages.entries()){
    logical.image=actual.pages[index].image;
    logical.pdfStartPage=index+1;
  }
}
await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2));
await fs.writeFile(path.join(output,'document.css'),documentCss+'\n');
const exportPath=path.resolve(root,'../output/pdf/20261118');await fs.mkdir(exportPath,{recursive:true});
for(const doc of documents)await fs.copyFile(path.join(output,doc.file),path.join(exportPath,doc.file));
await fs.copyFile(path.join(output,'gyeolsoft-resume.pdf'),path.join(exportPath,'gyeolsoft-resume-A4.pdf'));
await fs.copyFile(path.join(work,'gyeolsoft-resume-A3.pdf'),path.join(exportPath,'gyeolsoft-resume-A3.pdf'));
const paperReview=spawnSync(bundle+'/python/python.exe',['-X','utf8',path.join(root,'scripts/review-resume-paper-sizes.py'),exportPath,path.join(work,'pdf-source-text.json'),path.join(work,'paper-review')],{encoding:'utf8'});
if(paperReview.status!==0)throw Error(paperReview.stderr||paperReview.stdout);
const paperSizes=JSON.parse(paperReview.stdout);
await fs.writeFile(path.join(root,'content/build-report.json'),JSON.stringify({source:data.source,selectedCases:data.selectedCases,documents:documents.map(d=>({id:d.id,webSections:d.pages.length,pdfPages:rendered[d.id].pdfPageCount,pdf:d.file})),layoutChecks:layout,printChecks},null,2));
console.log(JSON.stringify({documents:documents.map(d=>({id:d.id,webSections:d.pages.length,pdfPages:rendered[d.id].pdfPageCount})),pdfDirectory:exportPath,paperSizes,render:render.stdout.trim()}));
