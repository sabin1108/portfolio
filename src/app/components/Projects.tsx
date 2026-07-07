import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Network,
  Table2,
  X,
} from "lucide-react";
import { portfolio, type Project } from "../data/portfolio";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type PortfolioProject = Project;
type GalleryImage = PortfolioProject["imageGallery"]["main"];

function ProjectGallery({ project }: { project: PortfolioProject }) {
  const galleryImages: GalleryImage[] = [
    project.imageGallery.main,
    ...project.imageGallery.supporting,
  ];
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const selectedImage =
    selectedImageIndex === null ? null : galleryImages[selectedImageIndex];

  const showPreviousImage = () => {
    setSelectedImageIndex((currentIndex) =>
      currentIndex === null
        ? currentIndex
        : (currentIndex - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  const showNextImage = () => {
    setSelectedImageIndex((currentIndex) =>
      currentIndex === null ? currentIndex : (currentIndex + 1) % galleryImages.length,
    );
  };

  return (
    <>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_8rem]">
        <button
          type="button"
          onClick={() => setSelectedImageIndex(0)}
          className="group aspect-[16/9] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`${project.imageGallery.main.alt} 확대`}
        >
          <img
            src={project.imageGallery.main.src}
            alt={project.imageGallery.main.alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </button>

        <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          {project.imageGallery.supporting.map((image, imageIndex) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setSelectedImageIndex(imageIndex + 1)}
              className="group aspect-[16/10] overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 lg:aspect-auto"
              aria-label={`${image.alt} 확대`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-white/95 p-4 backdrop-blur-sm sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="프로젝트 이미지 미리보기"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedImageIndex(null);
              }}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPreviousImage();
              }}
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="이전 이미지"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <motion.img
              key={selectedImage.src}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[86vh] max-w-[86vw] rounded-lg border border-slate-200 bg-white object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNextImage();
              }}
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="다음 이미지"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-md">
              {(selectedImageIndex ?? 0) + 1} / {galleryImages.length}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function MetricGrid({ project }: { project: PortfolioProject }) {
  if (!project.metrics.length) {
    return null;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {project.metrics.map((metric) => (
        <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500">{metric.label}</p>
          <p className="mt-1 text-lg font-bold tracking-tight text-slate-900">
            {metric.value}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{metric.basis}</p>
        </div>
      ))}
    </div>
  );
}
function MetricTable({ project }: { project: PortfolioProject }) {
  if (!project.metricRows?.length) {
    return null;
  }

  const isPhotoMap = project.title === "PhotoMap";
  const isGameInfo = project.title === "Game Information Platform";
  const hidesBasis = isPhotoMap || isGameInfo;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Table2 className="h-4 w-4 text-blue-600" />
        <h4 className="text-base font-semibold text-slate-900">
          {isPhotoMap
            ? "지표 표(React Profiler 활용)"
            : isGameInfo
              ? "지표 표(fallow 스킬 활용)"
              : "지표 표"}
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full ${hidesBasis ? "min-w-[640px]" : "min-w-[760px]"} border-collapse text-left text-sm`}>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <th scope="col" className="px-4 py-3">지표</th>
              <th scope="col" className="px-4 py-3">이전</th>
              <th scope="col" className="px-4 py-3">이후</th>
              {!hidesBasis ? <th scope="col" className="px-4 py-3">근거</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {project.metricRows.map((row) => (
              <tr key={row.metric} className="align-top">
                <th scope="row" className="w-56 whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                  {row.metric}
                </th>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.before}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">{row.after}</td>
                {!hidesBasis ? <td className="px-4 py-3 text-slate-500">{row.basis}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
type FlowNode = {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  w: number;
  tone: string;
};

type FlowEdge = {
  from: string;
  to: string;
  label: string;
  labelX: number;
  labelY: number;
  via?: "down" | "up";
  fromOffsetY?: number;
  toOffsetY?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
};

type ArchitectureFlow = {
  height: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
  groups?: { title: string; x: number; y: number; w: number; h: number }[];
};

const diagramWidth = 1120;

const architectureFlows: Record<string, ArchitectureFlow> = {
  PhotoMap: {
    height: 520,
    groups: [
      { title: "브라우저 화면", x: 24, y: 24, w: 725, h: 450 },
      { title: "데이터와 시각화", x: 775, y: 72, w: 315, h: 360 },
    ],
    nodes: [
      { id: "user", title: "사용자", subtitle: "사진 탐색, 업로드", x: 70, y: 165, w: 135, tone: "border-slate-300 bg-white" },
      { id: "ui", title: "탐색 화면", subtitle: "지도, 앨범, 타임라인", x: 280, y: 95, w: 185, tone: "border-sky-300 bg-sky-50" },
      { id: "upload", title: "업로드 처리", subtitle: "위치와 촬영 시간 추출", x: 280, y: 320, w: 185, tone: "border-cyan-300 bg-cyan-50" },
      { id: "state", title: "상태 관리", subtitle: "사진, 필터, 선택 상태", x: 545, y: 205, w: 185, tone: "border-emerald-300 bg-emerald-50" },
      { id: "database", title: "사진 데이터베이스", subtitle: "사진 정보와 메타데이터", x: 835, y: 125, w: 175, tone: "border-violet-300 bg-violet-50" },
      { id: "runtime", title: "시각화 런타임", subtitle: "지도와 관계 그래프 연동", x: 835, y: 315, w: 175, tone: "border-indigo-300 bg-indigo-50" },
      { id: "render", title: "렌더링 최적화", subtitle: "보이는 사진만 렌더링", x: 545, y: 390, w: 185, tone: "border-amber-300 bg-amber-50" },
    ],
    edges: [
      { from: "user", to: "ui", label: "탐색", labelX: 220, labelY: 130 },
      { from: "user", to: "upload", label: "업로드", labelX: 215, labelY: 315 },
      { from: "ui", to: "state", label: "화면 상태", labelX: 485, labelY: 150 },
      { from: "upload", to: "state", label: "사진 정보", labelX: 485, labelY: 310 },
      { from: "state", to: "database", label: "저장/조회", labelX: 745, labelY: 170 },
      { from: "state", to: "runtime", label: "시각화 데이터", labelX: 735, labelY: 295 },
      { from: "state", to: "render", label: "렌더링 대상", labelX: 585, labelY: 330, via: "down" },
    ],
  },
  "Game Information Platform": {
    height: 570,
    groups: [
      { title: "프론트엔드", x: 24, y: 24, w: 725, h: 500 },
      { title: "서버 경계와 외부 서비스", x: 775, y: 60, w: 315, h: 470 },
    ],
    nodes: [
      { id: "user", title: "사용자", subtitle: "검색, 관심 등록", x: 70, y: 165, w: 135, tone: "border-slate-300 bg-white" },
      { id: "ui", title: "게임 화면", subtitle: "검색, 할인, 관심 목록", x: 280, y: 95, w: 185, tone: "border-sky-300 bg-sky-50" },
      { id: "state", title: "화면 상태", subtitle: "관심 상품, 목표 가격", x: 280, y: 320, w: 185, tone: "border-emerald-300 bg-emerald-50" },
      { id: "domain", title: "응답 정규화", subtitle: "상점별 데이터를 공통 형태로 변환", x: 545, y: 205, w: 185, tone: "border-amber-300 bg-amber-50" },
      { id: "route", title: "서버 요청 경계", subtitle: "캐시, 호출 제한, 장애 완충", x: 835, y: 115, w: 175, tone: "border-violet-300 bg-violet-50" },
      { id: "supabase", title: "사용자 저장소", subtitle: "인증, 관심 목록, 가격 기록", x: 835, y: 315, w: 175, tone: "border-indigo-300 bg-indigo-50" },
      { id: "apis", title: "게임 외부 API", subtitle: "상점 가격과 게임 정보", x: 835, y: 455, w: 175, tone: "border-rose-300 bg-rose-50" },
    ],
    edges: [
      { from: "user", to: "ui", label: "검색", labelX: 220, labelY: 130 },
      { from: "user", to: "state", label: "관심 등록", labelX: 215, labelY: 315 },
      { from: "ui", to: "domain", label: "요청", labelX: 485, labelY: 150 },
      { from: "state", to: "domain", label: "가격 조건", labelX: 485, labelY: 310 },
      { from: "domain", to: "route", label: "정규화 요청", labelX: 740, labelY: 165 },
      { from: "route", to: "apis", label: "외부 조회", labelX: 900, labelY: 390, via: "down" },
      { from: "state", to: "supabase", label: "저장", labelX: 630, labelY: 375 },
      { from: "route", to: "supabase", label: "가격 기록", labelX: 900, labelY: 255 },
    ],
  },
  "AI ChatBot": {
    height: 560,
    groups: [
      { title: "브라우저 화면", x: 24, y: 24, w: 725, h: 500 },
      { title: "백엔드 경계", x: 775, y: 72, w: 315, h: 400 },
    ],
    nodes: [
      { id: "user", title: "사용자", subtitle: "질문 입력", x: 70, y: 165, w: 135, tone: "border-slate-300 bg-white" },
      { id: "chat", title: "채팅 화면", subtitle: "메시지, 사이드바, 일정", x: 280, y: 95, w: 185, tone: "border-sky-300 bg-sky-50" },
      { id: "local", title: "로컬 저장", subtitle: "대화 복원, 탭 동기화", x: 280, y: 320, w: 185, tone: "border-emerald-300 bg-emerald-50" },
      { id: "renderer", title: "메시지 렌더링", subtitle: "긴 링크와 마크다운 처리", x: 545, y: 195, w: 185, tone: "border-amber-300 bg-amber-50" },
      { id: "api", title: "서버 요청 경계", subtitle: "채팅, 공지 요청 전달", x: 835, y: 125, w: 175, tone: "border-violet-300 bg-violet-50" },
      { id: "backend", title: "학교 정보 서버", subtitle: "공지, 식단, 학사 정보", x: 835, y: 315, w: 175, tone: "border-indigo-300 bg-indigo-50" },
      { id: "export", title: "대화 내보내기", subtitle: "서버 전송 없이 파일 생성", x: 545, y: 410, w: 185, tone: "border-rose-300 bg-rose-50" },
    ],
    edges: [
      { from: "user", to: "chat", label: "질문", labelX: 220, labelY: 130 },
      { from: "chat", to: "local", label: "저장", labelX: 330, labelY: 245 },
      { from: "local", to: "renderer", label: "복원", labelX: 485, labelY: 310 },
      { from: "chat", to: "renderer", label: "표시", labelX: 485, labelY: 150 },
      { from: "renderer", to: "api", label: "요청", labelX: 745, labelY: 170 },
      { from: "api", to: "backend", label: "전달", labelX: 900, labelY: 255, via: "down" },
      { from: "local", to: "export", label: "파일 생성", labelX: 490, labelY: 430 },
    ],
  },
};

function toPercent(value: number) {
  return `${(value / diagramWidth) * 100}%`;
}

function getNodeCenter(node: FlowNode) {
  return { x: node.x + node.w / 2, y: node.y + 42 };
}

function getNodeEdgePoint(node: FlowNode, target: FlowNode, offsetY = 0) {
  const center = getNodeCenter(node);
  const targetCenter = getNodeCenter(target);
  const dx = targetCenter.x - center.x;
  const dy = targetCenter.y - center.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return { x: dx >= 0 ? node.x + node.w : node.x, y: center.y + offsetY };
  }

  return { x: center.x, y: dy >= 0 ? node.y + 84 + offsetY : node.y + offsetY };
}

function getEdgePath(edge: FlowEdge, nodes: FlowNode[]) {
  const from = nodes.find((node) => node.id === edge.from);
  const to = nodes.find((node) => node.id === edge.to);

  if (!from || !to) {
    return "";
  }

  const start = edge.startX !== undefined && edge.startY !== undefined
    ? { x: edge.startX, y: edge.startY }
    : getNodeEdgePoint(from, to, edge.fromOffsetY ?? 0);
  const end = edge.endX !== undefined && edge.endY !== undefined
    ? { x: edge.endX, y: edge.endY }
    : getNodeEdgePoint(to, from, edge.toOffsetY ?? 0);
  const offset = edge.via === "down" ? 42 : edge.via === "up" ? -22 : 0;
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2 + offset;

  return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${midY}, ${end.x} ${end.y}`;
}

function ArchitectureDiagram({ project }: { project: PortfolioProject }) {
  const diagram = architectureFlows[project.title];

  if (!diagram) {
    return null;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Network className="h-4 w-4 text-slate-700" />
        <h4 className="text-base font-semibold text-slate-900">아키텍처 흐름도</h4>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-4">
        <div className="relative w-full" style={{ height: diagram.height }}>
          <svg
            className="pointer-events-none absolute inset-0 z-20 h-full w-full"
            viewBox={`0 0 ${diagramWidth} ${diagram.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker id={`arrow-${project.title}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L8,3 z" fill="#475569" />
              </marker>
            </defs>
            {diagram.edges.map((edge) => (
              <path
                key={`${edge.from}-${edge.to}`}
                d={getEdgePath(edge, diagram.nodes)}
                fill="none"
                stroke="#475569"
                strokeWidth="1.45"
                markerEnd={`url(#arrow-${project.title})`}
              />
            ))}
          </svg>

          {diagram.groups?.map((group) => (
            <div
              key={group.title}
              className="absolute z-0 rounded-xl border border-slate-200 bg-slate-50/60"
              style={{ left: toPercent(group.x), top: group.y, width: toPercent(group.w), height: group.h }}
            >
              <span className="absolute left-3 top-3 z-40 rounded-md bg-white/85 px-2 py-1 text-[0.66rem] font-bold uppercase tracking-wide text-slate-600 shadow-sm">
                {group.title}
              </span>
            </div>
          ))}

          {diagram.edges.map((edge) => (
            <span
              key={`${edge.from}-${edge.to}-label`}
              className="absolute z-40 rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[0.62rem] font-semibold leading-none text-slate-600 shadow-sm"
              style={{ left: toPercent(edge.labelX), top: edge.labelY }}
            >
              {edge.label}
            </span>
          ))}

          {diagram.nodes.map((node) => (
            <article
              key={node.id}
              className={`absolute z-30 rounded-lg border p-3 shadow-sm ${node.tone}`}
              style={{ left: toPercent(node.x), top: node.y, width: toPercent(node.w) }}
            >
              <h5 className="break-keep text-sm font-bold leading-snug text-slate-950">{node.title}</h5>
              <p className="mt-1 break-keep text-xs leading-relaxed text-slate-600">{node.subtitle}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function CaseStudyGrid({ project }: { project: PortfolioProject }) {
  return (
    <div className="space-y-4">
      {project.caseStudies.map((caseStudy, index) => {
        const rows = [
          { label: "이슈", value: caseStudy.issue },
          { label: "문제 원인", value: caseStudy.cause },
          { label: "해결", value: caseStudy.resolution },
          { label: "성과", value: caseStudy.result },
        ] as const;

        return (
          <article key={caseStudy.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                {index + 1}
              </span>
              <h4 className="text-base font-semibold text-slate-900">{caseStudy.title}</h4>
            </div>

            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
              {rows.map((row, rowIndex) => (
                <section
                  key={row.label}
                  className="grid gap-3 px-4 py-4 md:grid-cols-[7.5rem_minmax(0,1fr)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-xs font-bold text-slate-700">
                      {rowIndex + 1}
                    </span>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      {row.label}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">{row.value}</p>
                </section>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {caseStudy.evidence.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                  {item}
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
function ProjectSection({ project, index }: { project: PortfolioProject; index: number }) {
  return (
    <motion.article
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="border-t border-slate-200 py-12 first:border-t-0 first:pt-0"
    >
      <div className="mb-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {project.period}
            </Badge>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {project.team}
            </Badge>
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            {project.title}
          </h3>
          <p className="mt-2 text-base font-semibold text-slate-600">
            {project.subtitle}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-slate-600">
            {project.summary}
          </p>

          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                담당부분
              </p>
              <ul className="mt-3 space-y-2">
                {project.responsibilities.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-white text-slate-700 ring-1 ring-slate-200">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.live ? (
              <Button asChild className="bg-blue-700 text-white hover:bg-blue-800">
                <a href={project.links.live} target="_blank" rel="noreferrer">
                  서비스
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : null}
            <Button asChild variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              <a href={project.links.github} target="_blank" rel="noreferrer">
                GitHub
                <Github className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ImageIcon className="h-4 w-4 text-blue-600" />
            실제 화면 자료
          </div>
          <ProjectGallery project={project} />
        </div>
      </div>

      <div className="space-y-6">
        <MetricGrid project={project} />
        <ArchitectureDiagram project={project} />
        <CaseStudyGrid project={project} />
        <MetricTable project={project} />
      </div>
    </motion.article>
  );
}
export function Projects() {
  return (
    <motion.section
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-20"
    >
      <div className="mb-10">
        <p className="text-sm font-semibold text-blue-700">Portfolio</p>
        <h2 className="text-[1.75rem] font-semibold tracking-tight text-slate-900">
          프로젝트 상세
        </h2>
      </div>

      <div>
        {portfolio.projects.map((project, index) => (
          <ProjectSection key={project.title} project={project} index={index} />
        ))}
      </div>
    </motion.section>
  );
}