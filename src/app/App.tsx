import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import type {KeyboardEvent} from 'react';
import {ArrowDownToLine, ArrowUpRight, ChevronLeft, FileText, Menu, Minus, Plus, X, ZoomIn} from 'lucide-react';
import applicationCompanies from './application-companies.json';
import {createWheelNavigation, wheelPixels} from './wheel-navigation';

type DocumentPage = {id: string; title: string; html: string; width: number; height: number; kind?: string; visual?: string};
type PortfolioDocument = {id: string; title: string; pdf: string; pages: DocumentPage[]};
type Profile = {name: string; role: string; email: string; github: string; project?: {github: string; demo: string}};
type ViewerDocuments = {profile: Profile; portfolio: PortfolioDocument; resume?: PortfolioDocument};
type Company = {name: string; route: string; label: string};
type Tab = 'portfolio' | 'resume';
const existingCompanies = {
  '/GYEOLSOFT': {name: '결소프트', label: 'GYEOLSOFT', portfolio: 'gyeolsoft', resume: 'resume'},
  '/VoltaON': {name: '볼타온', label: 'VOLTAON', portfolio: 'voltaon', resume: 'voltaonResume'},
};

function isDocument(value: unknown): value is PortfolioDocument {
  if (!value || typeof value !== 'object' || !('pages' in value) || !('id' in value) || !('title' in value) || !('pdf' in value)) return false;
  return typeof value.id === 'string' && typeof value.title === 'string' && typeof value.pdf === 'string'
    && Array.isArray(value.pages) && value.pages.length > 0
    && value.pages.every(page => page && typeof page.html === 'string' && page.html.length && page.width > 0 && page.height > 0);
}

function DocumentSurface({page, magnification = 1, fixed = false}: {page: DocumentPage; magnification?: number; fixed?: boolean}) {
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(page.width);
  useLayoutEffect(() => {
    if (!fixed) return;
    const element = frame.current;
    if (!element) return;
    const update = () => setWidth(element.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [fixed]);
  if (!fixed) return <div className="document-surface reading-surface"><div className="document-sheet" dangerouslySetInnerHTML={{__html: page.html}} /></div>;
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
    <div className="zoom-canvas"><DocumentSurface page={page} magnification={magnification} fixed/></div>
  </dialog>;
}

function MissingPage() {
  useEffect(() => {document.title = '페이지를 찾을 수 없습니다 | 민사빈';}, []);
  return <main className="missing-page"><p className="overline">404</p><h1>페이지를 찾을 수 없습니다.</h1><p>현재 공개된 포트폴리오에서 확인해 주세요.</p><a className="button primary" href="/"><ChevronLeft size={16}/>메인 포트폴리오</a></main>;
}

function Viewer({documents, company}: {documents: ViewerDocuments; company: Company | null}) {
  const [tab, setTab] = useState<Tab>(company && location.hash === '#resume' ? 'resume' : 'portfolio');
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const [expanded, setExpanded] = useState<DocumentPage | null>(null);
  const [wheelNavigation] = useState(createWheelNavigation);
  const viewport = useRef<HTMLDivElement>(null);
  const selectedResume = tab === 'resume' ? documents.resume : undefined;
  const doc = selectedResume ?? documents.portfolio;
  const resume = Boolean(selectedResume);
  const current = doc.pages[Math.min(active, doc.pages.length - 1)];
  const {profile} = documents;

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
    document.title = `${company ? company.name+' · ' : ''}${resume ? '이력서' : '포트폴리오'} | ${profile.name}`;
    setActive(0);
    setMenu(false);
    setExpanded(null);
    wheelNavigation.reset();
    window.scrollTo({top: 0});
  }, [doc.id, company, profile.name, resume, wheelNavigation]);

  useEffect(() => {
    if (resume || menu || expanded) return;
    const element = viewport.current;
    if (!element) return;
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const delta = wheelPixels(event.deltaY, event.deltaMode, element.clientHeight);
      if (!delta) return;
      const now = performance.now();
      let target = event.target instanceof Element ? event.target : null;
      while (target && element.contains(target)) {
        const style = getComputedStyle(target);
        const scrollable = /auto|scroll/.test(style.overflowY) && target.scrollHeight > target.clientHeight + 2;
        const canRead = delta > 0 ? target.scrollTop + target.clientHeight < target.scrollHeight - 2 : target.scrollTop > 2;
        if (scrollable && canRead) {
          if (!wheelNavigation.allowReading(now)) event.preventDefault();
          return;
        }
        target = target.parentElement;
      }
      event.preventDefault();
      const direction = wheelNavigation.push(delta, now);
      if (direction) setActive(index => Math.max(0, Math.min(doc.pages.length - 1, index + direction)));
    };
    element.addEventListener('wheel', handleWheel, {passive: false});
    return () => element.removeEventListener('wheel', handleWheel);
  }, [doc.id, doc.pages.length, resume, menu, expanded, wheelNavigation]);

  useEffect(() => {
    if (resume) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {document.body.style.overflow = previousOverflow;};
  }, [resume]);

  useLayoutEffect(() => {
    document.querySelectorAll('.slide-document .legacy-copy,.slide-document .legacy-wide-content,.slide-document .slide-reader').forEach(element => {element.scrollTop = 0;});
  }, [active, doc.id]);

  useEffect(() => {
    if (!resume) return;
    const syncPage = () => {
      let index = 0;
      document.querySelectorAll('.resume-page').forEach((element, pageIndex) => {
        if (element.getBoundingClientRect().top <= innerHeight * .4) index = pageIndex;
      });
      setActive(index);
    };
    syncPage();
    window.addEventListener('scroll', syncPage, {passive: true});
    window.addEventListener('resize', syncPage);
    return () => {
      window.removeEventListener('scroll', syncPage);
      window.removeEventListener('resize', syncPage);
    };
  }, [doc.id, resume]);

  useEffect(() => {
    const handleKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target;
      if (event.defaultPrevented || document.querySelector('dialog[open]')) return;
      if (menu) {
        if (event.key === 'Escape') {
          event.preventDefault();
          setMenu(false);
          document.querySelector<HTMLButtonElement>('.toc-toggle')?.focus();
        }
        return;
      }
      if (resume || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (target instanceof Element && target.closest('input,textarea,select,[contenteditable=true],[role=tab]')) return;
      if (window.getSelection()?.type === 'Range') return;
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      wheelNavigation.lock(performance.now());
      setActive(index => Math.max(0, Math.min(doc.pages.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1))));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [doc.id, doc.pages.length, resume, menu, wheelNavigation]);

  function selectTab(next: Tab) {
    if (!company || next === tab) return;
    history.pushState(null, '', next === 'resume' ? company.route+'#resume' : company.route);
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
    const next = Math.max(0, Math.min(doc.pages.length - 1, index));
    setActive(next);
    setMenu(false);
    wheelNavigation.lock(performance.now());
    if (resume) document.getElementById(`${doc.id}-${next}`)?.scrollIntoView({block: 'start', behavior: 'instant'});
  }
  function renderPage(page: DocumentPage, index: number) {
    return <section key={page.id} id={`${doc.id}-${index}`} className={`document-page ${resume ? 'resume-page' : 'slide-reader'}`} data-page={index} aria-label={page.title}>
      <DocumentSurface page={page}/>
      {resume && <div className="page-caption"><span>{page.title}</span><div className="page-caption-actions"><span>{index + 1} / {doc.pages.length}</span><button className="page-zoom-button" type="button" onClick={() => setExpanded(page)} aria-label={`${index + 1}페이지 ${page.title} 확대 보기`}><ZoomIn size={14}/>확대</button></div></div>}
    </section>;
  }

  return <div className={`viewer-shell ${resume ? 'resume-view' : 'deck-view'}`}>
    <a className="skip-link" href="#document" onClick={event => {event.preventDefault(); document.getElementById('document')?.focus();}}>본문으로 이동</a>
    <aside className={`page-index toc-rail ${menu ? 'is-open' : ''}`} aria-label="문서 목차">
      <button className="toc-toggle" type="button" aria-expanded={menu} aria-label={menu ? '목차 접기' : '목차 펼치기'} onClick={() => setMenu(!menu)}>{menu ? <X size={20}/> : <Menu size={20}/>}</button>
      <div className="index-header"><span>CONTENTS</span><span>{doc.pages.length} pages</span></div>
      <nav>{doc.pages.map((page, index) => <button key={page.id} type="button" className={active === index ? 'is-active' : ''} onClick={() => move(index)} aria-current={active === index ? 'page' : undefined} aria-label={`${index + 1}페이지 ${page.title}`} title={page.title}><span className="page-number">{String(index + 1).padStart(2, '0')}</span><span className="toc-label">{page.title}</span></button>)}</nav>
      <a className="open-pdf" href={doc.pdf} target="_blank" rel="noreferrer" aria-label="PDF로 열기"><FileText size={17}/><span>PDF로 열기</span></a>
    </aside>
    {menu && <button type="button" className="toc-backdrop" aria-label="목차 닫기" onClick={() => setMenu(false)}/>}
    <header className="site-header"><div className="identity"><a href="/">{profile.name}</a><span>{profile.role}</span></div><div className="header-links"><a href={`mailto:${profile.email}`}>Email<ArrowUpRight size={13}/></a><a href={profile.project?.github||profile.github} target="_blank" rel="noreferrer">{profile.project?'Moa GitHub':'GitHub'}<ArrowUpRight size={13}/></a>{profile.project&&<a href={profile.project.demo} target="_blank" rel="noreferrer">데모 체험<ArrowUpRight size={13}/></a>}</div></header>
    <div className="document-bar">
      <div className="document-heading"><span className="document-context">{company?.label ?? 'PORTFOLIO'}</span><h1>{doc.title}</h1></div>
      <div className="document-actions">
        {company && <div className="document-tabs" role="tablist" aria-label="문서 선택">{(['portfolio', 'resume'] as const).map(value => <button key={value} id={`tab-${value}`} type="button" role="tab" aria-selected={tab === value} aria-controls="document" tabIndex={tab === value ? 0 : -1} onClick={() => selectTab(value)} onKeyDown={handleTabKey}>{value === 'portfolio' ? '포트폴리오' : '이력서'}</button>)}</div>}
        <a className="button download" href={doc.pdf} download><ArrowDownToLine size={16}/><span>PDF 다운로드</span></a>
      </div>
    </div>
    <div ref={viewport} className={`workspace ${resume ? 'resume-workspace' : 'portfolio-workspace'}`}>
      <main id="document" tabIndex={-1} className={`document-pages ${resume ? '' : 'slide-document'}`} aria-label={doc.title} role={company ? 'tabpanel' : undefined} aria-labelledby={company ? `tab-${tab}` : undefined}>
        {resume ? doc.pages.map(renderPage) : renderPage(current, Math.min(active, doc.pages.length - 1))}
      </main>
    </div>
    {!resume && <div className="slide-controls">
      <button className="previous-page" type="button" onClick={() => move(active - 1)} disabled={active === 0}><ChevronLeft size={18}/>이전</button>
      <div className="slide-status" role="status"><span>{String(active + 1).padStart(2, '0')} / {String(doc.pages.length).padStart(2, '0')}</span><span>{current.title}</span><span className="wheel-hint">휠로 넘기기</span></div>
      <div className="slide-control-actions"><button className="page-zoom-button" type="button" onClick={() => setExpanded(current)} aria-label={`${active + 1}페이지 ${current.title} 확대 보기`}><ZoomIn size={14}/>확대</button><button className="next-page" type="button" onClick={() => move(active + 1)} disabled={active === doc.pages.length - 1}>다음<ChevronLeft className="next-icon" size={18}/></button></div>
    </div>}
    {resume && <footer className="site-footer"><span>{profile.name}</span><a href={`mailto:${profile.email}`}>{profile.email}</a></footer>}
    {expanded && <ExpandedPage page={expanded} onClose={() => setExpanded(null)}/>}
  </div>;
}

export default function App() {
  const [route] = useState(() => {
    const pathname = window.location.pathname;
    if (window.location.search) return null;
    const application = Object.entries(applicationCompanies).find(([,company]) => company.path === pathname);
    if (application) {
      const [slug, {name}] = application;
      return {source: `/documents/applications/${slug}/manifest.json`, portfolio: 'portfolio', resume: 'resume', company: {name, label: name, route: pathname}};
    }
    const existing = Object.entries(existingCompanies).find(([route]) => route === pathname)?.[1];
    if (existing) return {source: '/documents/manifest.json', ...existing, company: {name: existing.name, label: existing.label, route: pathname}};
    if (pathname === '/') return {source: '/documents/manifest.json', portfolio: 'main', resume: undefined, company: null};
    return null;
  });
  const [documents, setDocuments] = useState<ViewerDocuments | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!route) return;
    const abort = new AbortController();
    setFailed(false);
    fetch(route.source, {signal: abort.signal, headers: {Accept: 'application/json'}})
      .then(response => {
        if (!response.ok) throw Error('Document unavailable');
        return response.json();
      })
      .then(value => {
        const portfolio = value?.documents?.[route.portfolio];
        const resume = route.resume ? value?.documents?.[route.resume] : undefined;
        if (!isDocument(portfolio) || (route.resume && !isDocument(resume)) || !value.profile) throw Error('Invalid documents');
        setDocuments({profile: value.profile, portfolio, resume});
      })
      .catch(error => {if (error.name !== 'AbortError') setFailed(true);});
    return () => abort.abort();
  }, [route, attempt]);
  if (!route) return <MissingPage/>;
  if (failed) return <main className="loading-state"><h1>문서를 불러오지 못했습니다.</h1><button className="button primary" type="button" onClick={() => setAttempt(attempt + 1)}>다시 불러오기</button></main>;
  if (!documents) return <main className="loading-state" role="status">포트폴리오를 불러오고 있습니다.</main>;
  return <Viewer documents={documents} company={route.company}/>;
}
