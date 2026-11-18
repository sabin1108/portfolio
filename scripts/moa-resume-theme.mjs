import assert from 'node:assert/strict';

// Restore the actual archived BinClassicResume hierarchy, not a recolored document template.
export function createResumeSheets(data, profile, resume, {inline, marked, escape, portraitUrl}) {
  const paragraphs=data.common[0].markdown.split(/\n\s*\n/).filter(Boolean);
  const intro=resume.projectSummary||paragraphs[1];
  const role=resume.role||paragraphs[2];
  const skills=data.common[1].markdown.match(/\*\*Frontend:[\s\S]*?(?=\n\s*!\[\[|$)/)?.[0]||'';
  assert(intro&&role&&skills, 'Resume manuscript sections missing');
  const cases=data.gyeol.filter(page=>page.kind==='case').map(page=>{
    const table=marked.lexer(page.markdown,{gfm:true}).find(token=>token.type==='table');
    assert(table?.rows[0]?.[0]?.text, `Resume choice missing: ${page.id}`);
    return {title:page.title, text:resume.caseOverrides?.[page.id]||table.rows[0][0].text};
  });
  assert.equal(cases.length,6,'Resume layout expects the six selected manuscript cases');
  const icon=type=>`<svg viewBox="0 0 24 24" aria-hidden="true">${type==='mail'?'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>':type==='github'?'<path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.9c0-1.1-.1-1.5-.6-2 3.3-.4 6.6-1.6 6.6-7.3a5.8 5.8 0 0 0-1.6-4 5.2 5.2 0 0 0-.1-4s-1.3-.4-4.2 1.6a14.4 14.4 0 0 0-7.6 0C4.6.4 3.3.8 3.3.8a5.2 5.2 0 0 0-.1 4 5.8 5.8 0 0 0-1.6 4c0 5.7 3.3 6.9 6.6 7.3-.4.4-.6 1-.6 2V22"/>':'<path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>'}</svg>`;
  const achievements=(items,start=0)=>`<ul class="bin-classic-achievements">${items.map((entry,index)=>`<li class="${start+index<2?'bin-classic-featured-result':''}"><h4>${escape(entry.title)}</h4><p>${inline(entry.text)}</p></li>`).join('')}</ul>`;
  const section=(title,body,className='')=>`<section class="bin-classic-section ${className}"><h2>${title}</h2>${body}</section>`;
  const projectHeading=`<div class="bin-classic-project-heading"><div><h3>Project_Moa</h3></div><span>2026.09~2026.11 · 1인</span></div>${profile.project?`<div class="bin-classic-project-links"><a href="${escape(profile.project.github)}" target="_blank" rel="noreferrer">${icon('github')}프로젝트 GitHub</a><a href="${escape(profile.project.demo)}" target="_blank" rel="noreferrer">${icon('external')}데모 체험</a></div>`:''}`;
  const contacts=`<div class="bin-classic-contact"><a href="mailto:${escape(profile.email)}">${icon('mail')}${escape(profile.email)}</a><a href="${escape(profile.github)}">${icon('github')}${escape(profile.github)}</a><a href="https://www.binportfolio.site/GYEOLSOFT">${icon('external')}포트폴리오</a></div>`;
  const classicHeader=`<div class="bin-classic-header"><div><h1>${escape(profile.name)}</h1><p class="bin-classic-role">${escape(profile.role)}</p>${contacts}</div><img class="bin-classic-photo portrait" src="${escape(portraitUrl)}" alt="${escape(profile.name)}"></div>${resume.introduction?`<div class="bin-classic-intro">${marked.parse(resume.introduction)}</div>`:''}`;
  const page1=classicHeader+section('프로젝트 경험',`<article class="bin-classic-project">${projectHeading}<p class="bin-classic-role-line">${inline(intro)} ${inline(role)}</p>${achievements(cases.slice(0,3))}</article>`)+section('지원동기',`<p class="bin-classic-motivation">${inline(resume.motivation)}</p>`);
  const skillTokens=skills.split(/\r?\n/).map(text=>({text:text.trim()})).filter(token=>token.text);
  const skillRows=skillTokens.map(token=>{
    const match=token.text.match(/^\*\*([^*]+)\*\*\s*([\s\S]+)$/);
    assert(match,'Unexpected resume skill row');
    return `<div class="bin-classic-skill-row"><dt>${inline(match[1])}</dt><dd>${inline(match[2])}</dd></div>`;
  }).join('');
  const education=`<div class="bin-classic-education"><div><strong>${escape(profile.education.school)}</strong><p>${escape(profile.education.degree)} · ${escape(profile.education.status)}</p></div><div><p>${escape(profile.education.period)}</p><p>${escape(profile.education.gpa)}</p></div></div><div class="bin-classic-certificates">${profile.certificates.map(certificate=>`<p><strong>${escape(certificate.name)}</strong> · ${escape(certificate.issuer)} · ${escape(certificate.date)}</p>`).join('')}</div>`;
  const training=resume.training.map(entry=>`<p><strong>${escape(entry.name)}</strong> · ${escape(entry.status)}</p>`).join('');
  const records=[...resume.research.map(entry=>`<li><h3><span>${escape(entry.kind)}</span>${entry.href?`<a href="${escape(entry.href)}" target="_blank" rel="noreferrer">${escape(entry.title)} ↗</a>`:escape(entry.title)}</h3><p>${escape(entry.details)}</p></li>`),...resume.awards.map(entry=>`<li><h3><span>수상</span>${escape(entry.title)}</h3><p>${escape(entry.details)}</p></li>`)].join('');
  const page2=`<article class="bin-classic-project bin-classic-project-continuation">${achievements(cases.slice(3),3)}</article>`+section('기술 역량',`<dl class="bin-classic-skills">${skillRows}</dl>`)+section('학력 · 자격 · 교육',education+`<div class="bin-classic-training">${training}</div>`)+section('연구 · 특허 · 수상',`<ul class="bin-classic-records">${records}</ul>`);
  return [
    {id:'resume-profile',title:'프로필 · 프로젝트 경험 · 지원동기',body:page1},
    {id:'resume-experience',title:'구현 경험 · 기술 · 교육 · 연구·수상',body:page2}
  ].map((page,index)=>({id:page.id,title:page.title,kind:'resume',markup:`<section class="sheet resume bin-classic-page" data-page-id="${page.id}"><div class="page-content"><div class="body bin-classic-resume">${page.body}</div></div><footer><span>${escape(profile.email)}</span><span>${index+1} / 2</span></footer></section>`}));
}

export const legacyResumeCss = `
.sheet.resume{position:relative;width:210mm;height:297mm;padding:26px 32px 42px;background:#fff;color:#20262e;font-family:'Malgun Gothic','Apple SD Gothic Neo',Arial,sans-serif;word-break:keep-all;overflow-wrap:anywhere}
.sheet.resume>header,.sheet.resume>footer{display:flex;justify-content:space-between;align-items:center;color:#66717d;font-size:11px;line-height:1.4;letter-spacing:.025em}
.sheet.resume>header{border-bottom:1px solid #d6dbe1;padding-bottom:8px}
.sheet.resume>footer{position:absolute;left:32px;right:32px;bottom:18px;border-top:1px solid #d6dbe1;padding-top:10px}
.sheet.resume .page-content{padding-top:0}
.sheet.resume .body,.sheet.resume p,.sheet.resume dd{font-size:16px;line-height:1.55;color:#4e5968}
.sheet.resume p{margin:0}
.sheet.resume a{color:#245f95;text-decoration:none}
.sheet.resume strong{color:#20262e;font-weight:700}
.sheet.resume h1,.sheet.resume h2,.sheet.resume h3,.sheet.resume h4{color:#20262e;letter-spacing:-.025em}
.sheet.resume .bin-classic-header{display:flex;justify-content:space-between;align-items:flex-start;gap:26px;padding-bottom:12px;border-bottom:1px solid #cfd5dc}
.sheet.resume .bin-classic-header>div{flex:1;min-width:0}
.sheet.resume .bin-classic-header h1{font-size:36px;line-height:1.15;margin:0}
.sheet.resume .bin-classic-role{font-size:16px;line-height:1.5;font-weight:600;margin-top:6px;color:#4e5968}
.sheet.resume .bin-classic-intro{font-size:16px;line-height:1.55;margin-top:10px}
.sheet.resume .bin-classic-intro p+p{margin-top:6px}
.sheet.resume .bin-classic-contact{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:12px}
.sheet.resume .bin-classic-contact a{display:inline-flex;align-items:center;gap:6px;color:#245f95;font-size:14px;line-height:1.5;white-space:nowrap}
.sheet.resume .bin-classic-contact svg{width:14px;height:14px;stroke:currentColor;stroke-width:1.7;fill:none;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.sheet.resume .bin-classic-photo{width:96px;height:120px;object-fit:cover;flex-shrink:0;border-radius:2px}
.sheet.resume .bin-classic-section{margin-top:14px}
.sheet.resume .bin-classic-section>h2{font-size:15px;font-weight:700;line-height:1.4;letter-spacing:0;color:#526071;padding-bottom:6px;margin:0 0 10px;border-bottom:1px solid #cfd5dc}
.sheet.resume .bin-classic-project-continuation{margin-top:0}
.sheet.resume .bin-classic-project-heading{display:flex;align-items:baseline;justify-content:space-between;gap:16px}
.sheet.resume .bin-classic-project-heading h3{font-size:22px;line-height:1.4;letter-spacing:-.025em;margin:0}
.sheet.resume .bin-classic-project-heading>span{color:#66717d;font-size:15px;line-height:1.5;white-space:nowrap}
.sheet.resume .bin-classic-project-links{display:flex;gap:20px;margin-top:8px}
.sheet.resume .bin-classic-project-links a{display:inline-flex;align-items:center;gap:5px;font-size:14px;line-height:1.5;color:#245f95}
.sheet.resume .bin-classic-project-links svg{width:13px;height:13px;stroke:currentColor;stroke-width:1.7;fill:none;stroke-linecap:round;stroke-linejoin:round}
.sheet.resume .bin-classic-continuation{font-size:13px;color:#66717d;font-weight:400;margin-left:8px;letter-spacing:0}
.sheet.resume .bin-classic-role-line{margin-top:10px;font-size:16px;line-height:1.55}
.sheet.resume .bin-classic-achievements{list-style:none;margin:10px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 24px}
.sheet.resume .bin-classic-achievements li{grid-column:1/-1;break-inside:avoid;padding-top:8px;border-top:1px solid #dfe3e8}
.sheet.resume .bin-classic-achievements .bin-classic-featured-result{grid-column:auto;padding-top:12px;border-top:2px solid #245f95}
.sheet.resume .bin-classic-achievements h4{font-size:17px;line-height:1.4;margin:0 0 7px;font-weight:700}
.sheet.resume .bin-classic-featured-result h4{font-size:17px;line-height:1.45}
.sheet.resume .bin-classic-achievements p{font-size:16px;line-height:1.55;margin:0}
.sheet.resume .bin-classic-project-continuation>.bin-classic-achievements{margin-top:0}
.sheet.resume .bin-classic-project-continuation>.bin-classic-achievements>li:first-child{padding-top:0;border-top:0}
.sheet.resume .bin-classic-skills{margin:0}
.sheet.resume .bin-classic-skill-row{display:grid;grid-template-columns:110px minmax(0,1fr);gap:20px;align-items:baseline;padding:4px 0}
.sheet.resume .bin-classic-skill-row+ .bin-classic-skill-row{border-top:1px solid #e3e7eb}
.sheet.resume .bin-classic-skill-row dt{font-size:15px;font-weight:700;line-height:1.5;color:#20262e}
.sheet.resume .bin-classic-skill-row dd{font-size:16px;line-height:1.55;margin:0}
.sheet.resume .bin-classic-education{display:flex;justify-content:space-between;gap:20px;font-size:16px;line-height:1.55}
.sheet.resume .bin-classic-education>div:last-child{text-align:right}
.sheet.resume .bin-classic-education p{font-size:16px;line-height:1.55;margin:3px 0 0}
.sheet.resume .bin-classic-certificates{margin-top:8px}
.sheet.resume .bin-classic-certificates p{font-size:16px;line-height:1.55;margin:0}
.sheet.resume .bin-classic-training{margin-top:8px}
.sheet.resume .bin-classic-records{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.sheet.resume .bin-classic-records h3{font-size:16px;line-height:1.45;font-weight:600;margin:0}
.sheet.resume .bin-classic-records h3>span{display:inline-block;font-size:11px;font-weight:500;color:#526071;vertical-align:middle;border:1px solid #cfd5dc;border-radius:3px;padding:1px 4px;margin-right:7px;white-space:nowrap}
.sheet.resume .bin-classic-records p{font-size:14px;line-height:1.45;color:#66717d;margin-top:2px}
`;
