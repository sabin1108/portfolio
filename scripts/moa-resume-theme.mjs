import assert from 'node:assert/strict';

// Shared content, separately composed A4 and A3 print layouts.
export function createResumeSheets(data, profile, resume, {inline, marked, escape, portraitUrl, paper='A4',variant='gyeolsoft'}) {
  assert(['A4','A3'].includes(paper),'Unsupported resume paper');
  assert(['gyeolsoft','voltaon'].includes(variant),'Unsupported resume variant');
  const voltaon=variant==='voltaon',companyName=voltaon?'볼타온':'결소프트',companyRoute=voltaon?'/VoltaON':'/GYEOLSOFT';
  const paragraphs=data.common[0].markdown.split(/\n\s*\n/).filter(Boolean);
  const intro=resume.projectSummary||paragraphs[1];
  const role=resume.role||paragraphs[2];
  const skills=data.common[1].markdown.match(/\*\*Frontend:[\s\S]*?(?=\n\s*!\[\[|$)/)?.[0]||'';
  assert(intro&&role&&skills, 'Resume manuscript sections missing');
  const cases=(voltaon?data.voltaon:data.gyeol).filter(page=>page.kind==='case').map(page=>{
    const table=marked.lexer(page.markdown,{gfm:true}).find(token=>token.type==='table');
    assert(table?.rows[0]?.[0]?.text, `Resume choice missing: ${page.id}`);
    return {id:page.id,title:resume.caseTitles?.[page.id]||page.title, text:resume.caseOverrides?.[page.id]||table.rows[0][0].text, note:resume.caseNotes?.[page.id]};
  });
  assert.equal(cases.length,voltaon?8:6,'Unexpected selected manuscript cases');
  const icon=type=>`<svg viewBox="0 0 24 24" aria-hidden="true">${type==='mail'?'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>':type==='github'?'<path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.9c0-1.1-.1-1.5-.6-2 3.3-.4 6.6-1.6 6.6-7.3a5.8 5.8 0 0 0-1.6-4 5.2 5.2 0 0 0-.1-4s-1.3-.4-4.2 1.6a14.4 14.4 0 0 0-7.6 0C4.6.4 3.3.8 3.3.8a5.2 5.2 0 0 0-.1 4 5.8 5.8 0 0 0-1.6 4c0 5.7 3.3 6.9 6.6 7.3-.4.4-.6 1-.6 2V22"/>':'<path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>'}</svg>`;
  const achievements=items=>{
    const entries=items.map(entry=>{
      const range=/(?:\d+쪽\s+)?\d+(?:[.,]\d+)*[a-z%가-힣]*\s*→\s*\d+(?:[.,]\d+)*[a-z%가-힣]*/gi;
      const body=inline(entry.text).replace(/<strong>([^<]+)<\/strong>/g,(strong,value)=>{
        const highlighted=value.replace(range,'<span class="bin-classic-metric-range">$&</span>');
        return highlighted===value?strong:`<strong class="bin-classic-metric">${highlighted}</strong>`;
      });
      const note=entry.note?`<small class="bin-classic-measurement-note">${escape(entry.note)}</small>`:'';
      return `<li data-case-id="${entry.id}"><h4>${escape(entry.title)}</h4><p>${body}</p>${note}</li>`;
    });
    return `<ul class="bin-classic-achievements">${entries.join('')}</ul>`;
  };
  const section=(title,body,className='')=>`<section class="bin-classic-section ${className}"><h2>${title}</h2>${body}</section>`;
  const projectHeading=`<div class="bin-classic-project-heading"><div><h3>Project_Moa</h3></div><span>2026.09~2026.11 · 1인</span></div>${profile.project?`<div class="bin-classic-project-links"><a href="${escape(profile.project.github)}" target="_blank" rel="noreferrer">${icon('github')}프로젝트 GitHub</a><a href="${escape(profile.project.demo)}" target="_blank" rel="noreferrer">${icon('external')}데모 체험</a></div>`:''}`;
  const contacts=`<div class="bin-classic-contact"><a href="mailto:${escape(profile.email)}">${icon('mail')}${escape(profile.email)}</a><a href="${escape(profile.github)}">${icon('github')}${escape(profile.github)}</a><a href="https://www.binportfolio.site${companyRoute}">${icon('external')}포트폴리오</a></div>`;
  const profileHeader=`<div class="bin-classic-header"><div class="bin-classic-identity"><h1>${escape(profile.name)}</h1><p class="bin-classic-role">${escape(profile.role)}</p></div>${contacts}<img class="bin-classic-photo portrait" src="${escape(portraitUrl)}" alt="${escape(profile.name)}"></div>`;
  const paperText=text=>paper==='A3'?text.replace(/\\\r?\n/g,' '):text;
  const introduction=resume.introduction?`<div class="bin-classic-intro">${marked.parse(paperText(resume.introduction))}</div>`:'';
  const projectDescription=`<p class="bin-classic-role-line">${inline(intro)} ${inline(role)}</p>`;
  const project=entries=>`<article class="bin-classic-project">${projectHeading}${projectDescription}${achievements(entries)}</article>`;
  const motivation=section('지원동기',`<p class="bin-classic-motivation">${inline(paperText(resume.motivation))}</p>`);
  const summary=`<div class="bin-classic-summary">${section('자기소개',introduction)}${motivation}</div>`;
  const skillTokens=skills.split(/\r?\n/).map(text=>({text:text.trim()})).filter(token=>token.text);
  const skillRows=skillTokens.map(token=>{
    const match=token.text.match(/^\*\*([^*]+)\*\*\s*([\s\S]+)$/);
    assert(match,'Unexpected resume skill row');
    return `<div class="bin-classic-skill-row"><dt>${inline(match[1])}</dt><dd>${inline(match[2])}</dd></div>`;
  }).join('');
  const education=`<div class="bin-classic-education"><div><strong>${escape(profile.education.school)}</strong><p>${escape(profile.education.degree)} · ${escape(profile.education.status)}</p></div><div><p>${escape(profile.education.period)}</p><p>${escape(profile.education.gpa)}</p></div></div><div class="bin-classic-certificates">${profile.certificates.map(certificate=>`<p><strong>${escape(certificate.name)}</strong> · ${escape(certificate.issuer)} · ${escape(certificate.date)}</p>`).join('')}</div>`;
  const training=resume.training.map(entry=>`<p><strong>${escape(entry.name)}</strong> · ${escape(entry.status)}</p>`).join('');
  const record=(entry,kind)=>`<li><span class="bin-classic-record-kind">${escape(kind)}</span><div><h3>${entry.href?`<a href="${escape(entry.href)}" target="_blank" rel="noreferrer">${escape(entry.title)} ↗</a>`:escape(entry.title)}</h3><p>${escape(entry.details)}</p></div></li>`;
  const records=[...resume.research.map(entry=>record(entry,entry.kind)),...resume.awards.map(entry=>record(entry,'수상'))].join('');
  const skillsSection=section('기술 역량',`<dl class="bin-classic-skills">${skillRows}</dl>`);
  const educationSection=section('학력 · 자격 · 교육',education+`<div class="bin-classic-training">${training}</div>`);
  const recordsSection=section('연구 · 특허 · 수상',`<ul class="bin-classic-records">${records}</ul>`);
  const credentials=`<div class="bin-classic-credentials">${skillsSection}${educationSection}</div>`;
  const split=voltaon?4:3;
  const page1=profileHeader+summary+section('프로젝트 경험',project(cases.slice(0,split)));
  const page2=`<article class="bin-classic-project bin-classic-project-continuation">${achievements(cases.slice(split))}</article>`+credentials+recordsSection;
  const a3Body=voltaon?`<main>${page1}</main><aside>${page2}</aside>`:`<main>${profileHeader}${section('프로젝트 경험',project(cases))}</main><aside>${summary}${skillsSection}${educationSection}${recordsSection}</aside>`;
  const pages=paper==='A3'?[{id:'resume-a3',title:`${companyName} 이력서 · A3 가로`,body:`<div class="bin-classic-a3-columns">${a3Body}</div>`}]:[
    {id:'resume-profile',title:'프로필 · 지원동기 · 프로젝트 경험',body:page1},
    {id:'resume-experience',title:'구현 경험 · 기술 · 교육 · 연구·수상',body:page2}
  ];
  return pages.map((page,index)=>({id:page.id,title:page.title,kind:'resume',markup:`<section class="sheet resume bin-classic-page${voltaon?' voltaon-resume':''}${paper==='A3'?' paper-a3':''}" data-page-id="${page.id}"><div class="page-content"><div class="body bin-classic-resume">${page.body}</div></div><footer><span>${escape(profile.email)}</span><span>${index+1} / ${pages.length}</span></footer></section>`}));
}

export const legacyResumeCss = `

.sheet.resume{position:relative;width:210mm;height:297mm;padding:38px 44px 46px;background:#fff;color:#25313d;font-family:'Noto Sans KR','Malgun Gothic',Arial,sans-serif;word-break:keep-all;overflow-wrap:anywhere;letter-spacing:-.018em}
.sheet.resume>footer{position:absolute;left:48px;right:48px;bottom:22px;display:flex;justify-content:space-between;align-items:center;color:#697580;font-size:10.5px;line-height:1.4;letter-spacing:.015em}
.sheet.resume .page-content{padding-top:0}
.sheet.resume .body,.sheet.resume p,.sheet.resume dd{font-size:16px;line-height:1.5;color:#46515d}
.sheet.resume p{margin:0}
.sheet.resume a{color:#385472;text-decoration:none}
.sheet.resume strong{color:#25313d;font-weight:600}
.sheet.resume h1,.sheet.resume h2,.sheet.resume h3,.sheet.resume h4{color:#25313d;letter-spacing:-.025em}
.sheet.resume .bin-classic-header{display:grid;grid-template-columns:minmax(0,1fr) auto 108px;align-items:center;gap:20px;padding:16px 20px;border-left:4px solid #2c435e;background:#f2f5f8;margin-bottom:0}
.sheet.resume .bin-classic-identity{min-width:0}
.sheet.resume .bin-classic-header h1{font-size:34px;line-height:1.15;letter-spacing:-.05em;font-weight:700;margin:0;color:#223b55}
.sheet.resume .bin-classic-role{font-size:14px;line-height:1.5;font-weight:500;margin-top:6px;color:#63707c;letter-spacing:.045em}
.sheet.resume .bin-classic-contact{display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-width:0}
.sheet.resume .bin-classic-contact a{display:inline-flex;align-items:center;gap:7px;color:#536477;font-size:12.5px;line-height:1.6;white-space:nowrap}
.sheet.resume .bin-classic-contact svg{width:12px;height:12px;stroke:currentColor;stroke-width:1.6;fill:none;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.sheet.resume .bin-classic-photo{width:108px;height:138px;object-fit:cover;flex-shrink:0;border-radius:2px;background:#fff}
.sheet.resume .bin-classic-intro{margin-top:0;font-size:16px;line-height:1.5}
.sheet.resume .bin-classic-intro p::first-line{font-weight:500;color:#2d3b47}
.sheet.resume .bin-classic-intro p+p{margin-top:6px}
.sheet.resume .bin-classic-section{margin-top:20px}
.sheet.resume .bin-classic-section>h2{font-size:16px;font-weight:700;line-height:1.4;letter-spacing:-.02em;color:#2c435e;margin:0 0 12px;padding:0 0 8px;border:0;border-bottom:1px solid #bac6d2}
.sheet.resume .bin-classic-summary{margin-top:16px;border-top:1px solid #dbe2e9;border-bottom:1px solid #dbe2e9}
.sheet.resume .bin-classic-summary>.bin-classic-section{display:grid;grid-template-columns:78px minmax(0,1fr);gap:18px;align-items:start;margin:0;padding:12px 0}
.sheet.resume .bin-classic-summary>.bin-classic-section+.bin-classic-section{border-top:1px solid #e6ebf0}
.sheet.resume .bin-classic-summary>.bin-classic-section>h2{font-size:14px;line-height:1.7;margin:0;padding:0;border:0;color:#344f6b}
.sheet.resume .bin-classic-project-heading{display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding:9px 12px;background:#f2f5f8;border-left:3px solid #a9b8c9}
.sheet.resume .bin-classic-project-heading h3{font-size:20px;line-height:1.3;letter-spacing:-.035em;font-weight:650;margin:0;color:#2c435e}
.sheet.resume .bin-classic-project-heading>span{color:#697580;font-size:13px;line-height:1.5;white-space:nowrap}
.sheet.resume .bin-classic-project-links{display:flex;gap:18px;margin-top:7px}
.sheet.resume .bin-classic-project-links a{display:inline-flex;align-items:center;gap:6px;font-size:13px;line-height:1.5;color:#385472}
.sheet.resume .bin-classic-project-links svg{width:12px;height:12px;stroke:currentColor;stroke-width:1.6;fill:none;stroke-linecap:round;stroke-linejoin:round}
.sheet.resume .bin-classic-role-line{margin-top:10px;font-size:16px;line-height:1.5}
.sheet.resume .bin-classic-achievements{list-style:none;margin:16px 0 0;padding:0;display:block}
.sheet.resume .bin-classic-achievements li{break-inside:avoid;padding:0 0 0 14px;border:0;border-left:2px solid #e0e6ec}
.sheet.resume .bin-classic-achievements li+li{margin-top:16px}
.sheet.resume .bin-classic-achievements h4{font-size:16px;line-height:1.45;margin:0 0 6px;font-weight:600;color:#2b3945}
.sheet.resume .bin-classic-achievements p{font-size:16px;line-height:1.5;margin:0}
.sheet.resume .bin-classic-achievements strong.bin-classic-metric{color:#254c6d;background:#edf3f8;font-weight:650}
.sheet.resume .bin-classic-achievements .bin-classic-metric-range{white-space:nowrap}
.sheet.resume .bin-classic-measurement-note{display:block;font-size:12px;line-height:1.45;color:#697580;margin-top:5px}
.sheet.resume .bin-classic-project-continuation>.bin-classic-achievements{margin-top:0}
.sheet.resume .bin-classic-skills{margin:0}
.sheet.resume .bin-classic-credentials{display:grid;grid-template-columns:.95fr 1.05fr;gap:28px;margin-top:20px}
.sheet.resume .bin-classic-credentials>.bin-classic-section{margin-top:0}
.sheet.resume .bin-classic-skill-row{display:grid;grid-template-columns:74px minmax(0,1fr);gap:12px;align-items:baseline;padding:6px 0;border-bottom:1px solid #e6ebf0}
.sheet.resume .bin-classic-skill-row dt{font-size:13.5px;font-weight:500;line-height:1.5;color:#65737e;letter-spacing:.015em}
.sheet.resume .bin-classic-skill-row dd{font-size:16px;line-height:1.5;margin:0}
.sheet.resume .bin-classic-education{display:flex;justify-content:space-between;gap:20px;font-size:16px;line-height:1.5}
.sheet.resume .bin-classic-credentials .bin-classic-education{display:block}
.sheet.resume .bin-classic-credentials .bin-classic-education>div:last-child{display:flex;gap:10px;text-align:left;margin-top:4px}
.sheet.resume .bin-classic-credentials .bin-classic-education>div:last-child p{font-size:13px;color:#697580}
.sheet.resume .bin-classic-credentials .bin-classic-certificates,.sheet.resume .bin-classic-credentials .bin-classic-training{padding-top:8px;border-top:1px solid #e6ebf0}
.sheet.resume .bin-classic-education>div:last-child{text-align:right;color:#697580}
.sheet.resume .bin-classic-education p{font-size:16px;line-height:1.55;margin:3px 0 0}
.sheet.resume .bin-classic-certificates{margin-top:9px}
.sheet.resume .bin-classic-certificates p{font-size:16px;line-height:1.55;margin:0}
.sheet.resume .bin-classic-training{margin-top:7px}
.sheet.resume .bin-classic-records{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.sheet.resume .bin-classic-records li{display:grid;grid-template-columns:76px minmax(0,1fr);gap:14px;align-items:baseline;padding-bottom:8px;border-bottom:1px solid #e6ebf0}
.sheet.resume .bin-classic-records li:last-child{border-bottom:0;padding-bottom:0}
.sheet.resume .bin-classic-record-kind{font-size:12px;line-height:1.5;font-weight:500;color:#536b84;white-space:nowrap;background:#f2f5f8;padding:3px 5px;text-align:center}
.sheet.resume .bin-classic-records h3{font-size:15.5px;line-height:1.5;font-weight:500;margin:0;letter-spacing:-.02em}
.sheet.resume .bin-classic-records p{font-size:14px;line-height:1.5;color:#697580;margin-top:2px}
.sheet.resume.paper-a3{width:420mm;height:297mm;padding:38px 44px 46px}
.sheet.resume.paper-a3>footer{left:48px;right:48px}
.sheet.resume.paper-a3 .bin-classic-a3-columns{display:grid;grid-template-columns:1.16fr 1fr;gap:42px;margin-top:0}
.sheet.resume.paper-a3 .bin-classic-a3-columns>main,.sheet.resume.paper-a3 .bin-classic-a3-columns>aside{min-width:0}
.sheet.resume.paper-a3 .bin-classic-a3-columns>aside{padding-left:22px;border-left:1px solid #dbe2e9}
.sheet.resume.paper-a3 .bin-classic-a3-columns>main>.bin-classic-section:first-child,.sheet.resume.paper-a3 .bin-classic-a3-columns>aside>.bin-classic-section:first-child{margin-top:0}
.sheet.resume.paper-a3 .bin-classic-header{padding:12px 20px;margin-bottom:16px}
.sheet.resume.paper-a3 .bin-classic-summary{margin-top:0}
.sheet.resume.paper-a3 .bin-classic-summary>.bin-classic-section{margin:0;grid-template-columns:70px minmax(0,1fr);gap:16px;padding:12px 0}
.sheet.resume.paper-a3 .bin-classic-summary>.bin-classic-section>h2{margin:0}
.sheet.resume.paper-a3 .bin-classic-section{margin-top:14px}
.sheet.resume.paper-a3 .bin-classic-section>h2{margin-bottom:9px}
.sheet.resume.paper-a3 .bin-classic-skill-row{grid-template-columns:90px minmax(0,1fr);gap:16px;padding:3px 0}
.sheet.resume.paper-a3 .bin-classic-records{gap:8px}
.sheet.resume.voltaon-resume .bin-classic-header{padding:12px 20px}
.sheet.resume.voltaon-resume .bin-classic-achievements{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px 28px;align-items:start}
.sheet.resume.voltaon-resume .bin-classic-achievements li{padding-left:12px}
.sheet.resume.voltaon-resume .bin-classic-achievements li+li{margin-top:0}
.sheet.resume.voltaon-resume .bin-classic-achievements p{line-height:1.62}
.sheet.resume.paper-a3.voltaon-resume .bin-classic-a3-columns{grid-template-columns:1fr 1fr}
.sheet.resume.paper-a3.voltaon-resume .bin-classic-credentials>.bin-classic-section{margin-top:0}
`;
