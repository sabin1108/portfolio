import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import type {KeyboardEvent} from 'react';
import {ArrowDownToLine, ArrowUpRight, ChevronLeft, FileText, Menu, Minus, Plus, X, ZoomIn} from 'lucide-react';

type DocumentPage = {id: string; title: string; html: string; width: number; height: number};
type PortfolioDocument = {id: string; title: string; pdf: string; pages: DocumentPage[]};
type Manifest = {
  profile: {name: string; role: string; email: string; github: string};
  documents: {main: PortfolioDocument; gyeolsoft: PortfolioDocument; resume: PortfolioDocument};
};
type Tab = 'portfolio' | 'resume';

function DocumentSurface({page, magnification = 1}: {page: DocumentPage; magnification?: number}) {
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(page.width);
  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const update = () => setWidth(element.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const scale = width / page.width * magnification;
  return <div ref={frame} className="document-surface">
    <div className="document-size" style={{width: width * magnification, height: page.height * scale}}>
      <div className="document-sheet" style={{width: page.width, height: page.height, transform: `scale(${scale})`}} dangerouslySetInnerHTML={{__html: page.html}} />
    </div>
  </div>;
}

function ExpandedPage({page, onClose}: {page: DocumentPage; onClose: () => void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [magnification, setMagnification] = useState(1);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({preventScroll: true});
    };
  }, []);
  return <dialog ref={dialog} className="zoom-dialog" onClose={onClose} aria-label={page.title}>
    <div className="zoom-toolbar">
      <span>{page.title}</span>
      <div className="zoom-controls">
        <button type="button" onClick={() => setMagnification(value => Math.max(1, value - .25))} disabled={magnification === 1} aria-label="축소"><Minus size={18}/></button>
        <button className="zoom-reset" type="button" onClick={() => setMagnification(1)} aria-label="화면 너비에 맞추기">{magnification === 1 ? '너비 맞춤' : `${Math.round(magnification * 100)}%`}</button>
        <button type="button" onClick={() => setMagnification(value => Math.min(2, value + .25))} disabled={magnification === 2} aria-label="확대"><Plus size={18}/></button>
        <button type="button" onClick={() => dialog.current?.close()} aria-label="확대 보기 닫기" autoFocus><X size={20}/></button>
      </div>
    </div>
    <div className="zoom-canvas"><DocumentSurface page={page} magnification={magnification}/></div>
  </dialog>;
}

function MissingPage() {
  useEffect(() => {document.title = '페이지를 찾을 수 없습니다 | 민사빈';}, []);
  return <main className="missing-page"><p className="overline">404</p><h1>페이지를 찾을 수 없습니다.</h1><p>현재 공개된 포트폴리오에서 확인해 주세요.</p><a className="button primary" href="/"><ChevronLeft size={16}/>메인 포트폴리오</a></main>;
}

function Viewer({manifest, company}: {manifest: Manifest; company: boolean}) {
  const [tab, setTab] = useState<Tab>(company && location.hash === '#resume' ? 'resume' : 'portfolio');
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const [expanded, setExpanded] = useState<DocumentPage | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const doc = company ? (tab === 'resume' ? manifest.documents.resume : manifest.documents.gyeolsoft) : manifest.documents.main;
  const {profile} = manifest;

  useEffect(() => {
    if (!company) return;
    const syncTab = () => {
      if (location.hash === '#resume') setTab('resume');
      else if (!location.hash || location.hash === '#portfolio') setTab('portfolio');
    };
    window.addEventListener('hashchange', syncTab);
    window.addEventListener('popstate', syncTab);
    return () => {
      window.removeEventListener('hashchange', syncTab);
      window.removeEventListener('popstate', syncTab);
    };
  }, [company]);

  useLayoutEffect(() => {
    document.title = `${company ? '결소프트 · ' : ''}${tab === 'resume' ? '이력서' : '포트폴리오'} | ${profile.name}`;
    setActive(0);
    setMenu(false);
    setExpanded(null);
    window.scrollTo({top: 0});
  }, [doc.id, company, profile.name, tab]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = Math.max(0, bar.current?.getBoundingClientRect().bottom || 0);
      const bottom = window.innerHeight;
      let best = 0;
      let largest = -1;
      // Compare all pages; observer callbacks contain only the entries that changed.
      document.querySelectorAll<HTMLElement>('.document-page').forEach((element, index) => {
        const bounds = element.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(bounds.bottom, bottom) - Math.max(bounds.top, top));
        if (overlap > largest) {largest = overlap; best = index;}
      });
      setActive(best);
    };
    const schedule = () => {if (!frame) frame = requestAnimationFrame(update);};
    const observer = new ResizeObserver(schedule);
    document.querySelectorAll('.document-page').forEach(element => observer.observe(element));
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [doc.id]);

  function selectTab(next: Tab) {
    if (next === tab) return;
    history.pushState(null, '', next === 'resume' ? '/GYEOLSOFT#resume' : '/GYEOLSOFT');
    setTab(next);
  }
  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'portfolio' : event.key === 'End' ? 'resume' : tab === 'portfolio' ? 'resume' : 'portfolio';
    selectTab(next);
    document.getElementById(`tab-${next}`)?.focus();
  }
  function move(index: number) {
    const element = document.getElementById(`${doc.id}-${index}`);
    if (!element) return;
    const offset = (bar.current?.getBoundingClientRect().height || 0) + 20;
    window.scrollTo({top: window.scrollY + element.getBoundingClientRect().top - offset, behavior: 'instant'});
    setActive(index);
    setMenu(false);
  }

  return <>
    <a className="skip-link" href="#document" onClick={event => {event.preventDefault(); document.getElementById('document')?.focus();}}>본문으로 이동</a>
    <header className="site-header"><div className="identity"><a href="/">{profile.name}</a><span>{profile.role}</span></div><div className="header-links"><a href={`mailto:${profile.email}`}>Email<ArrowUpRight size={13}/></a><a href={profile.github} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={13}/></a></div></header>
    <div className="document-bar" ref={bar}>
      <div className="document-heading"><span className="document-context">{company ? 'GYEOLSOFT' : 'PORTFOLIO'}</span><h1>{doc.title}</h1></div>
      <div className="document-actions">
        {company && <div className="document-tabs" role="tablist" aria-label="문서 선택">
          {(['portfolio', 'resume'] as const).map(value => <button key={value} id={`tab-${value}`} type="button" role="tab" aria-selected={tab === value} aria-controls="document" tabIndex={tab === value ? 0 : -1} onClick={() => selectTab(value)} onKeyDown={handleTabKey}>{value === 'portfolio' ? '포트폴리오' : '이력서'}</button>)}
        </div>}
        <a className="button download" href={doc.pdf} download><ArrowDownToLine size={16}/><span>PDF 다운로드</span></a>
      </div>
    </div>
    <div className="workspace">
      <aside className={`page-index ${menu ? 'is-open' : ''}`} aria-label="문서 목차">
        <div className="index-header"><span>CONTENTS</span><span>{doc.pages.length} pages</span></div>
        <nav>{doc.pages.map((page, index) => <button key={page.id} type="button" className={active === index ? 'is-active' : ''} onClick={() => move(index)} aria-current={active === index ? 'page' : undefined}><span className="page-number">{String(index + 1).padStart(2, '0')}</span><span>{page.title}</span></button>)}</nav>
        <a className="open-pdf" href={doc.pdf} target="_blank" rel="noreferrer"><FileText size={15}/>PDF로 열기<ArrowUpRight size={13}/></a>
      </aside>
      <main id="document" tabIndex={-1} className="document-pages" aria-label={doc.title} role={company ? 'tabpanel' : undefined} aria-labelledby={company ? `tab-${tab}` : undefined}>
        <div className="reader-note"><span>본문을 선택하거나 검색할 수 있습니다. 크게 보려면 확대를 누르세요.</span><span>{doc.pages.length} pages</span></div>
        {doc.pages.map((page, index) => <section key={page.id} id={`${doc.id}-${index}`} className={`document-page ${doc.id === 'resume' ? 'resume-page' : ''}`} data-page={index} aria-label={page.title}>
          <DocumentSurface page={page}/>
          <div className="page-caption"><span>{page.title}</span><div className="page-caption-actions"><span>{index + 1} / {doc.pages.length}</span><button className="page-zoom-button" type="button" onClick={() => setExpanded(page)} aria-label={`${index + 1}페이지 ${page.title} 확대 보기`}><ZoomIn size={14}/>확대</button></div></div>
        </section>)}
      </main>
    </div>
    <button className="mobile-index-toggle" type="button" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={17}/> : <Menu size={17}/>}<span>{active + 1} / {doc.pages.length}</span><span>목차</span></button>
    <footer className="site-footer"><span>{profile.name}</span><a href={`mailto:${profile.email}`}>{profile.email}</a></footer>
    {expanded && <ExpandedPage page={expanded} onClose={() => setExpanded(null)}/>}
  </>;
}

export default function App() {
  const path = window.location.pathname;
  const allowed = (path === '/' || path === '/GYEOLSOFT') && !window.location.search;
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!allowed) return;
    const abort = new AbortController();
    setFailed(false);
    fetch('/documents/manifest.json', {signal: abort.signal})
      .then(response => {
        if (!response.ok) throw Error('Document unavailable');
        return response.json();
      })
      .then(value => {
        const documents = [value?.documents?.main, value?.documents?.gyeolsoft, value?.documents?.resume];
        if (documents.some(doc => !doc?.pages?.length || doc.pages.some((page: DocumentPage) => !page.html || !(page.width > 0) || !(page.height > 0)))) throw Error('Invalid documents');
        setManifest(value);
      })
      .catch(error => {if (error.name !== 'AbortError') setFailed(true);});
    return () => abort.abort();
  }, [allowed, attempt]);
  if (!allowed) return <MissingPage/>;
  if (failed) return <main className="loading-state"><h1>문서를 불러오지 못했습니다.</h1><button className="button primary" type="button" onClick={() => setAttempt(attempt + 1)}>다시 불러오기</button></main>;
  if (!manifest) return <main className="loading-state" role="status">포트폴리오를 불러오고 있습니다.</main>;
  return <Viewer manifest={manifest} company={path === '/GYEOLSOFT'}/>;
}
