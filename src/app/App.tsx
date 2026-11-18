import {useEffect, useRef, useState} from 'react';
import {ArrowDownToLine, ArrowUpRight, ChevronLeft, FileText, Menu, X, ZoomIn} from 'lucide-react';

type DocumentPage={id:string;title:string;image:string;text:string;width:number;height:number};
type PortfolioDocument={id:string;title:string;pdf:string;pages:DocumentPage[]};
type Manifest={profile:{name:string;role:string;email:string;github:string;portrait:string};documents:{main:PortfolioDocument;gyeolsoft:PortfolioDocument;resume:PortfolioDocument}};

function ExpandedPage({page,onClose}:{page:DocumentPage;onClose:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{dialog.current?.showModal();},[]);
  return <dialog ref={dialog} className="zoom-dialog" onClose={onClose} aria-label={page.title}>
    <div className="zoom-toolbar"><span>{page.title}</span><button type="button" onClick={()=>dialog.current?.close()} aria-label="확대 보기 닫기"><X size={20}/></button></div>
    <div className="zoom-canvas"><img src={page.image} width={page.width} height={page.height} alt={page.title}/></div>
  </dialog>;
}

function MissingPage(){
  useEffect(()=>{document.title='페이지를 찾을 수 없습니다 | 민사빈';},[]);
  return <main className="missing-page"><p className="overline">404</p><h1>페이지를 찾을 수 없습니다.</h1><p>현재 공개된 포트폴리오에서 확인해 주세요.</p><a className="button primary" href="/"><ChevronLeft size={16}/>메인 포트폴리오</a></main>;
}

function Viewer({manifest,company}:{manifest:Manifest;company:boolean}){
  const [tab,setTab]=useState<'portfolio'|'resume'>(company&&window.location.hash==='#resume'?'resume':'portfolio');
  const [active,setActive]=useState(0);
  const [menu,setMenu]=useState(false);
  const [expanded,setExpanded]=useState<DocumentPage|null>(null);
  const doc=company?(tab==='resume'?manifest.documents.resume:manifest.documents.gyeolsoft):manifest.documents.main;
  const {profile}=manifest;
  useEffect(()=>{
    document.title=`${company?'결소프트 · ':''}${tab==='resume'?'이력서':'포트폴리오'} | ${profile.name}`;
    setActive(0);setMenu(false);window.scrollTo({top:0});
    if(!company)return;
    history.replaceState(null,'',tab==='resume'?'/GYEOLSOFT#resume':'/GYEOLSOFT');
  },[doc.id,company,profile.name,tab]);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(visible)setActive(Number((visible.target as HTMLElement).dataset.page));
    },{rootMargin:'-90px 0px -25% 0px',threshold:[0,.25,.5,.75]});
    document.querySelectorAll('[data-page]').forEach(element=>observer.observe(element));
    return()=>observer.disconnect();
  },[doc.id]);
  function move(index:number){
    document.getElementById(`${doc.id}-${index}`)?.scrollIntoView({block:'start',behavior:'instant'});
    setActive(index);setMenu(false);
  }
  return <>
    <a className="skip-link" href="#document">본문으로 이동</a>
    <header className="site-header"><div className="identity"><a href="/">{profile.name}</a><span>{profile.role}</span></div><div className="header-links"><a href={`mailto:${profile.email}`}>Email<ArrowUpRight size={13}/></a><a href={profile.github} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={13}/></a></div></header>
    <div className="document-bar"><div className="document-heading"><span className="document-context">{company?'GYEOLSOFT':'PORTFOLIO'}</span><h1>{doc.title}</h1></div><div className="document-actions">{company&&<div className="document-tabs" role="tablist" aria-label="문서 선택"><button type="button" role="tab" aria-selected={tab==='portfolio'} onClick={()=>setTab('portfolio')}>포트폴리오</button><button type="button" role="tab" aria-selected={tab==='resume'} onClick={()=>setTab('resume')}>이력서</button></div>}<a className="button download" href={doc.pdf} download><ArrowDownToLine size={16}/><span>PDF 다운로드</span></a></div></div>
    <div className="workspace"><aside className={`page-index ${menu?'is-open':''}`} aria-label="문서 목차"><div className="index-header"><span>CONTENTS</span><span>{doc.pages.length} pages</span></div><nav>{doc.pages.map((page,index)=><button key={page.id} type="button" className={active===index?'is-active':''} onClick={()=>move(index)} aria-current={active===index?'page':undefined}><span className="page-number">{String(index+1).padStart(2,'0')}</span><span>{page.title}</span></button>)}</nav><a className="open-pdf" href={doc.pdf} target="_blank" rel="noreferrer"><FileText size={15}/>PDF로 열기<ArrowUpRight size={13}/></a></aside>
      <main id="document" className="document-pages" aria-label={doc.title}><div className="reader-note"><span>페이지를 누르면 확대해서 볼 수 있습니다.</span><span>{doc.pages.length} pages</span></div>{doc.pages.map((page,index)=><section key={page.id} id={`${doc.id}-${index}`} className={`document-page ${doc.id==='resume'?'resume-page':''}`} data-page={index} aria-labelledby={`${doc.id}-${index}-title`}><h2 className="sr-only" id={`${doc.id}-${index}-title`}>{page.title}</h2><button className="page-image-button" type="button" onClick={()=>setExpanded(page)} aria-label={`${page.title} 확대 보기`}><img src={page.image} alt={page.title} width={page.width} height={page.height} loading={index===0?'eager':'lazy'} fetchPriority={index===0?'high':'auto'}/><span className="zoom-label"><ZoomIn size={15}/>확대</span></button><div className="sr-only">{page.text}</div><div className="page-caption"><span>{page.title}</span><span>{index+1} / {doc.pages.length}</span></div></section>)}</main>
    </div><button className="mobile-index-toggle" type="button" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X size={17}/>:<Menu size={17}/>}<span>{active+1} / {doc.pages.length}</span><span>목차</span></button>
    <footer className="site-footer"><span>{profile.name}</span><a href={`mailto:${profile.email}`}>{profile.email}</a></footer>
    {expanded&&<ExpandedPage page={expanded} onClose={()=>setExpanded(null)}/>}
  </>;
}

export default function App(){
  const path=window.location.pathname;
  const allowed=(path==='/'||path==='/GYEOLSOFT')&&!window.location.search;
  const [manifest,setManifest]=useState<Manifest|null>(null);
  const [failed,setFailed]=useState(false);
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{
    if(!allowed)return;
    const abort=new AbortController();setFailed(false);
    fetch('/documents/manifest.json',{signal:abort.signal}).then(response=>{if(!response.ok)throw Error('Document unavailable');return response.json();}).then(value=>{if(!value?.documents?.main?.pages?.length||!value?.documents?.gyeolsoft?.pages?.length||!value?.documents?.resume?.pages?.length)throw Error('Invalid documents');setManifest(value);}).catch(error=>{if(error.name!=='AbortError')setFailed(true);});
    return()=>abort.abort();
  },[allowed,attempt]);
  if(!allowed)return <MissingPage/>;
  if(failed)return <main className="loading-state"><h1>문서를 불러오지 못했습니다.</h1><button className="button primary" type="button" onClick={()=>setAttempt(attempt+1)}>다시 불러오기</button></main>;
  if(!manifest)return <main className="loading-state" role="status">포트폴리오를 불러오고 있습니다.</main>;
  return <Viewer manifest={manifest} company={path==='/GYEOLSOFT'}/>;
}
