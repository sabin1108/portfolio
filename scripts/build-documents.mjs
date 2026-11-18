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
  return [{...page,markdown},...pictures.map((name,i)=>({id:page.id+'-diagram-'+i,kind:'diagram',title:page.title,markdown:'',image:data.images[name],sourceCase:page.sourceCase}))];
});}
function portfolioPage(page,index,count){
  let markdown=page.markdown;
  let eyebrow=page.kind==='case'?'TROUBLESHOOTING':page.kind==='intro'?'project_moa':'PROJECT MOA';
  if(page.kind==='intro')markdown=markdown.split('\n').slice(2).join('\n').trim();
  else markdown=markdown.replace(/^#\s+[^\n]+\n/, '');
  const body=page.kind==='diagram'?`<figure class="diagram"><img src="${pathToFileURL(path.join(root,'public',page.image))}" alt="${escape(page.title)}"></figure>`:renderTokens(marked.lexer(markdown,{gfm:true,breaks:true}),page.kind);
  return `<section class="sheet ${page.kind}" data-page-id="${page.id}"><header><span>${escape(profile.name)} <b>/</b> ${escape(profile.role)}</span><span>${eyebrow}</span></header><div class="page-content"><h1>${escape(page.title)}</h1><div class="body">${body}</div></div><footer><span>PROJECT MOA</span><span>${String(index+1).padStart(2,'0')} <b>/</b> ${String(count).padStart(2,'0')}</span></footer></section>`;
}
const css=`
@page{size:A4 landscape;margin:0}*{box-sizing:border-box}html,body{margin:0;background:#fffefa;color:#172335;font-family:'Malgun Gothic','Noto Sans KR',Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}a{color:inherit;text-decoration:none}.sheet{position:relative;width:297mm;height:210mm;padding:35px 56px 40px;break-after:page;background:#fffefa}.sheet:last-child{break-after:auto}header,footer{display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#647084;letter-spacing:.06em}header{border-bottom:1px solid #d9dfe7;padding-bottom:13px}header b,footer b{font-weight:400;margin:0 7px;color:#b4bdca}footer{position:absolute;bottom:25px;left:56px;right:56px;border-top:1px solid #d9dfe7;padding-top:11px}.page-content{padding-top:25px}h1{font-size:30px;line-height:1.45;letter-spacing:-.06em;margin:0 0 22px;font-weight:750;max-width:98%}.body{font-size:14px;line-height:1.8;word-break:keep-all;overflow-wrap:break-word}p{margin:0 0 14px}strong{font-weight:700}h2,h3,h4{margin:15px 0 10px;line-height:1.5;font-size:16px;letter-spacing:-.025em}h3:first-child{margin-top:0}.blocks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px;margin:18px 0}.blocks.columns-3{grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.block{border-top:1px solid #cfd6e2;padding:14px 0 16px;break-inside:avoid;font-size:13px;line-height:1.8}.block h3{color:#2d4e91;font-size:15px;margin:0 0 10px}.block strong{color:#172335}.block br+br{display:block;content:'';margin-top:9px}.steps{display:flex;border-top:1px solid #cfd6e2;border-bottom:1px solid #cfd6e2;padding:13px 0;gap:12px;margin:22px 0}.steps>div{flex:1}.steps span{display:block;color:#2d4e91;font-size:12px;margin-bottom:8px}.steps strong{font-size:13px}.intro h1{font-size:45px;margin-top:23px;margin-bottom:25px;max-width:760px}.intro .body{max-width:930px;font-size:15px;line-height:1.9}.intro .body>p:first-child{color:#2d4e91;font-size:15px;border-left:3px solid #2d4e91;padding-left:16px;margin:26px 0}.metrics{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #cfd6e2;margin-top:30px;padding-top:20px}.metrics>div+div{border-left:1px solid #d9dfe7;padding-left:20px}.metrics strong{display:block;font-size:32px;letter-spacing:-.04em;line-height:1.25}.metrics span{display:block;font-size:12px;color:#647084;margin-top:10px}.case h1{font-size:29px;max-width:970px;margin-bottom:18px}.case .body>p:first-child{font-size:14px;color:#647084}.case .blocks{margin-top:17px}.case .block{font-size:13.4px}.case .body>p{margin-bottom:10px}.diagram h1{font-size:25px;margin-bottom:10px}.diagram figure{margin:0;display:flex;justify-content:center;align-items:center;height:586px}.diagram img{max-width:100%;max-height:100%;object-fit:contain}.decisions .blocks{gap:0 25px;margin:11px 0}.decisions .block{font-size:12.8px;line-height:1.72;padding-top:11px;padding-bottom:12px}.decisions .body>p{font-size:13.2px;line-height:1.7;margin-bottom:10px}.role .block{font-size:12.6px;line-height:1.75}.implementation .block{font-size:14px;line-height:1.9;padding-top:18px;padding-bottom:23px}.overview .body{font-size:15px;line-height:1.85;max-width:950px}.overview .body>p{margin-bottom:25px}.resume{width:210mm;height:297mm;padding:36px 48px 45px}.resume footer{left:48px;right:48px}.resume h1{font-size:32px;letter-spacing:-.04em}.resume .page-content{padding-top:23px}.resume .body{font-size:13px;line-height:1.85}.profile-top{display:flex;gap:25px;align-items:flex-start;margin-bottom:25px}.portrait{width:86px;height:108px;object-fit:cover}.profile-top h1{margin:0 0 5px}.profile-top p{margin:0 0 5px;font-size:12px}.resume h2{font-size:17px;color:#2d4e91;border-top:1px solid #cfd6e2;padding-top:12px;margin-top:23px}.resume .experience{border-top:1px solid #d9dfe7;margin-top:16px;padding-top:10px}.resume .experience h3{font-size:14px;margin:0 0 7px}.resume .experience p{font-size:12.4px;line-height:1.75;margin:0}.education{display:grid;grid-template-columns:1fr 1fr;gap:15px;font-size:12px}.resume .stack p{margin:0;font-size:12px}
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
const manifest={profile:publicProfile,sourceSha256:data.source.sha256,documents:{}};
const layout=[];
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
    await page.pdf({path:path.join(output,doc.file),preferCSSPageSize:true,printBackground:true,tagged:true});
    const pageTexts=await page.evaluate(()=>[...document.querySelectorAll('.sheet')].map(el=>el.innerText));
    manifest.documents[doc.id]={id:doc.id,title:doc.title,pdf:'/documents/'+doc.file,pages:doc.pages.map((p,i)=>({id:p.id,title:p.title,image:`/documents/${doc.id}/page-${String(i+1).padStart(2,'0')}.webp`,text:pageTexts[i],width:doc.id==='resume'?1191:1684,height:doc.id==='resume'?1684:1191}))};
  }
}finally{await browser.close();await fs.writeFile(path.join(work,'layout-checks.json'),JSON.stringify(layout,null,2));}
const render=spawnSync(bundle+'/python/python.exe',['-X','utf8',path.join(root,'scripts/render-document-pages.py'),output,JSON.stringify(Object.fromEntries(documents.map(d=>[d.id,d.pages.length])))],{encoding:'utf8'});
if(render.status!==0)throw Error(render.stderr||render.stdout);
await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2));
const exportPath=path.resolve(root,'../output/pdf/20261118');await fs.mkdir(exportPath,{recursive:true});
for(const doc of documents)await fs.copyFile(path.join(output,doc.file),path.join(exportPath,doc.file));
await fs.writeFile(path.join(root,'content/build-report.json'),JSON.stringify({source:data.source,selectedCases:data.selectedCases,documents:documents.map(d=>({id:d.id,pages:d.pages.length,pdf:d.file})),layoutChecks:layout},null,2));
console.log(JSON.stringify({documents:documents.map(d=>({id:d.id,pages:d.pages.length})),pdfDirectory:exportPath,render:render.stdout.trim()}));
