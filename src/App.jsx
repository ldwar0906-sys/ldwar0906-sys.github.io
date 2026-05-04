import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Mail, 
  MapPin, 
  ArrowUpRight, 
  Globe as GlobeIcon, 
  Play, 
  FileText, 
  ArrowLeft, 
  Tag, 
  LayoutGrid, 
  Youtube 
} from 'lucide-react';

// --- [1. 스마트 썸네일 컴포넌트] ---
const SmartImage = ({ srcBase, alt }) => {
  const [ext, setExt] = useState('jpg');
  const [errorCount, setErrorCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleError = () => {
    if (errorCount === 0) {
      setExt('png');
      setErrorCount(1);
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null; // 이미지가 없으면 엑박 대신 껍데기만 깔끔하게 남김

  return (
    <img 
      src={`${srcBase}.${ext}`} 
      alt={alt} 
      onError={handleError}
      loading="lazy"
      className="relative w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 z-10 bg-slate-100"
    />
  );
};

// --- [2. 상세 페이지 무한 자동 스크롤 컴포넌트] ---
const SmartSeriesImage = ({ srcBase, index, onSuccess }) => {
  const [ext, setExt] = useState('jpg');
  const [errorCount, setErrorCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleError = () => {
    if (errorCount === 0) {
      setExt('png');
      setErrorCount(1);
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <img 
      src={`${srcBase}.${ext}`} 
      alt={`Detail ${index}`} 
      onLoad={() => onSuccess && onSuccess()}
      onError={handleError}
      className="w-full h-auto block object-cover bg-slate-50" 
    />
  );
};

const SeriesImageContainer = ({ project }) => {
  const [maxVisible, setMaxVisible] = useState(1);

  return (
    <div className="flex flex-col w-full">
      {Array.from({ length: maxVisible }).map((_, i) => (
        <SmartSeriesImage 
          key={`${project.id}-${i}`}
          index={i + 1}
          srcBase={`${project.seriesBasePath}/${project.seriesPrefix}_${i + 1}`}
          onSuccess={() => {
            // 앞의 이미지가 성공하면 다음 이미지 렌더링
            if (i + 1 === maxVisible) setMaxVisible(prev => prev + 1);
          }}
        />
      ))}
    </div>
  );
};

// --- [SVG 아이콘] ---
const Instagram = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const Facebook = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

// --- [포트폴리오 데이터 생성 (렉 제거 완료)] ---
const generateProjects = () => {
  const projects = [];
  let idCounter = 1;
  const baseUrl = ""; // 개인 도메인 연결 시 공백 필수

  // 사용자가 입력한 숫자만큼만 정확하게 폴더를 인식합니다.
  const getIds = (count) => {
     const arr = [];
     for(let i=0; i<count; i++) arr.push(`no${i+1}`);
     return arr;
  };

  const addSmartSeries = (category, dataMap) => {
    Object.entries(dataMap).forEach(([sub, data]) => {
      data.ids.forEach((id) => {
        if (id && id.trim()) {
          projects.push({
            id: idCounter++,
            category,
            subCategory: sub,
            isSmart: true,
            isSeries: true,
            srcBase: `${baseUrl}${data.path}/${id}/${id}_1`, 
            seriesBasePath: `${baseUrl}${data.path}/${id}`,  
            seriesPrefix: id,                                
            title: `${sub} 작업 ${id.replace('no', '')}`,
            year: "2024",
            description: `${sub} 기획 및 디자인 결과물입니다.`
          });
        }
      });
    });
  };

  // ⭐️ [중요] 여기에 내가 만든 폴더의 '정확한 갯수'를 입력해 주세요!
  // 현재 no1, no2 폴더가 있으므로 getIds(2)로 설정했습니다.
  // 나중에 no3 폴더를 추가하시면 getIds(3)으로 숫자만 바꿔주시면 됩니다.
  const editorialData = {
    "카달로그·브로슈어": { path: "/images/EDITORIAL/CatalogBrochure", ids: getIds(2) },
    "리플렛·팜플렛": { path: "/images/EDITORIAL/LeafletPamphlet", ids: getIds(0) },
    "포스터": { path: "/images/EDITORIAL/Poster", ids: getIds(0) }
  };
  addSmartSeries("EDITORIAL", editorialData);

  const signageData = {
    "간판·시트지": { path: "/images/SIGNAGE/SignboardSheet", ids: getIds(0) },
    "현수막·배너": { path: "/images/SIGNAGE/Banner", ids: getIds(0) }
  };
  addSmartSeries("SIGNAGE", signageData);

  const webData = {
    "웹 콘텐츠": { path: "/images/WEB/Contents", ids: getIds(0) }
  };
  addSmartSeries("WEB", webData);

  // --- [수동 추가 데이터] ---
  const brandingImages = ["https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800"];
  brandingImages.forEach((img, i) => {
    if (img && img.trim()) {
      projects.push({ id: idCounter++, category: "BRANDING", img: img, title: `브랜딩 작업 ${i + 1}`, year: "2024", description: "브랜드 아이덴티티 구축 프로젝트입니다." });
    }
  });

  const videoIds = [
    { id: "hsS_3X64YbE", start: 3248 }, { id: "Abh9eKQcIuE" }, { id: "FOOkzuEfwXk", start: 874 }
  ];
  videoIds.forEach((v, i) => {
    if (v && v.id && v.id.trim()) {
      projects.push({ id: idCounter++, category: "VIDEO", youtubeId: v.id, startParam: v.start ? `&start=${v.start}` : "", img: `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`, title: `영상 작업 ${i + 1}`, year: "2024", description: "영상 제작 프로젝트입니다." });
    }
  });

  return projects;
};

const allProjects = generateProjects();

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeSubCategory, setActiveSubCategory] = useState('전체');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const brandColor = "#EE7123";

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const content = e.target.content.value;
    window.location.href = `mailto:hh3131@naver.com?subject=[ArtDesign 문의] ${name}님의 프로젝트 문의&body=성함/기업명: ${name}%0D%0A회신 이메일: ${email}%0D%0A%0D%0A내용:%0D%0A${content}`;
  };

  const navLinks = [
    { en: 'COMPANY', kr: '회사 소개', id: 'company' },
    { en: 'PORTFOLIO', kr: '포트폴리오', id: 'create' },
    { en: 'CONTACT', kr: '문의하기', id: 'contact' },
  ];

  const categoryData = [
    { id: 'ALL', kr: '전체보기', sub: [] },
    { id: 'EDITORIAL', kr: '편집디자인', sub: ['전체', '카달로그·브로슈어', '리플렛·팜플렛', '포스터'] },
    { id: 'BRANDING', kr: '브랜딩', sub: [] },
    { id: 'SIGNAGE', kr: '실·내외 사인물', sub: ['전체', '간판·시트지', '현수막·배너'] },
    { id: 'WEB', kr: '웹 콘텐츠', sub: [] },
    { id: 'VIDEO', kr: '영상제작', sub: [] }
  ];

  const filteredProjects = allProjects.filter(p => {
    const matchCategory = activeCategory === 'ALL' || p.category === activeCategory;
    const matchSubCategory = activeSubCategory === '전체' || p.subCategory === activeSubCategory;
    return matchCategory && matchSubCategory;
  });

  const displayedProjects = filteredProjects.slice(0, 12);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = ['home', 'company', 'create', 'contact'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (selectedProject || showArchive) ? 'hidden' : 'unset';
  }, [selectedProject, showArchive]);

  const ProjectCard = ({ project }) => (
    <div onClick={() => setSelectedProject(project)} className="group cursor-pointer font-pretendard animate-in fade-in slide-in-from-bottom duration-700">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-slate-800 shadow-2xl border border-white/5">
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900"><span className="text-slate-700 font-bold uppercase tracking-widest text-[10px]">ArtDesign Visual</span></div>
        {project.isSmart ? (
          <SmartImage srcBase={project.srcBase} alt={project.title} />
        ) : (
          <img src={project.img} alt={project.title} className="relative w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 z-10" />
        )}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20" style={{ backgroundColor: `${brandColor}E6` }}>
          <div className="text-center px-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-900 mx-auto mb-4 shadow-lg transition-transform group-hover:scale-110"><ArrowUpRight size={24} /></div>
            <p className="text-sm font-bold tracking-widest text-white uppercase font-pretendard">View Detail</p>
          </div>
        </div>
      </div>
      <div>
        <span className="text-[11px] font-bold tracking-widest uppercase mb-2 block" style={{ color: brandColor }}>{project.subCategory || project.category}</span>
        <h3 className="text-2xl font-bold mb-2 group-hover:text-[#EE7123] transition-colors tracking-tight text-white font-pretendard">{project.title}</h3>
        <p className="text-slate-500 font-medium text-sm font-pretendard">{project.year} | Visual Solution</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-pretendard selection:bg-[#EE7123] selection:text-white scroll-smooth overflow-x-hidden relative font-pretendard">
      
      {/* 팝업 오버레이 (새로운 중앙 정렬 통스크롤 레이아웃) */}
      {selectedProject && (
        <div className="fixed inset-0 bg-white z-[500] overflow-y-auto custom-scrollbar animate-in fade-in duration-300 font-pretendard">
          
          <div className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
              <button onClick={() => setSelectedProject(null)} className="flex items-center space-x-3 text-slate-400 hover:text-slate-900 group">
                <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all"><ArrowLeft size={20} /></div>
                <span className="font-bold tracking-widest uppercase text-sm">Close</span>
              </button>
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-16 flex flex-col items-center">
            <div className="flex flex-col items-center text-center mb-16 animate-in slide-in-from-bottom duration-700">
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-5 py-2 bg-orange-50 text-[#EE7123] rounded-full text-xs font-black tracking-widest uppercase shadow-sm">
                  {selectedProject.subCategory || selectedProject.category}
                </span>
                <span className="text-slate-400 font-bold text-xs">2024 PORTFOLIO</span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-tight text-slate-900">
                {selectedProject.title}
              </h2>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light max-w-3xl mb-12">
                {selectedProject.description}
              </p>
              <button onClick={() => {setSelectedProject(null); window.location.hash = "#contact";}} className="px-12 py-5 bg-slate-950 text-white font-black tracking-widest rounded-full hover:bg-[#EE7123] transition-all shadow-xl hover:-translate-y-1 uppercase">
                Inquiry for this style
              </button>
            </div>

            <div className="w-full rounded-[32px] overflow-hidden shadow-2xl bg-slate-50 border border-slate-100 flex flex-col animate-in slide-in-from-bottom duration-1000 delay-150 fill-mode-both">
              {selectedProject.youtubeId ? (
                 <div className="relative w-full aspect-video shrink-0 bg-black">
                   <iframe className="absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${selectedProject.youtubeId}?autoplay=1${selectedProject.startParam}`} frameBorder="0" allowFullScreen></iframe>
                 </div>
              ) : selectedProject.isSeries ? (
                <SeriesImageContainer project={selectedProject} />
              ) : selectedProject.isSmart ? (
                <SmartImage srcBase={selectedProject.srcBase} alt={selectedProject.title} />
              ) : (
                <img src={selectedProject.img} alt={selectedProject.title} className="w-full h-auto block object-cover" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 아카이브 오버레이 */}
      {showArchive && (
        <div className="fixed inset-0 bg-slate-950 z-[400] overflow-y-auto animate-in slide-in-from-bottom duration-500 font-pretendard">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 font-pretendard">
            <div className="sticky top-0 z-50 py-4 bg-slate-950/80 backdrop-blur-sm mb-12 flex justify-between items-center font-pretendard">
              <button onClick={() => setShowArchive(false)} className="flex items-center space-x-3 text-slate-400 hover:text-white group">
                <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-[#EE7123] group-hover:bg-[#EE7123] transition-all"><ArrowLeft size={20} /></div>
                <span className="font-bold tracking-widest uppercase text-xs font-pretendard">Back</span>
              </button>
              <div className="flex items-center space-x-2 font-pretendard"><LayoutGrid size={18} className="text-[#EE7123]" /><span className="text-white font-black tracking-widest text-xs uppercase font-pretendard">{activeCategory} Archive</span></div>
            </div>
            <div className="mb-16 font-pretendard">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic text-white mb-12 uppercase font-pretendard">{activeCategory} Works</h2>
              <div className="flex flex-wrap gap-4 relative z-20 font-pretendard">
                {categoryData.map((cat) => (
                  <button key={`archive-${cat.id}`} onClick={() => {setActiveCategory(cat.id); setActiveSubCategory('전체');}} className={`group relative h-12 overflow-hidden px-8 rounded-full border transition-all tracking-widest ${activeCategory === cat.id ? 'bg-[#EE7123] border-[#EE7123] text-white shadow-lg' : 'border-white/10 text-slate-400 hover:text-white hover:border-white/30'}`}>
                    <div className="transition-transform duration-500 ease-in-out group-hover:-translate-y-1/2 flex flex-col items-center justify-start h-[96px]">
                      <span className="h-12 w-full flex items-center justify-center font-black text-[12px] uppercase font-pretendard">{cat.kr}</span>
                      <span className="h-12 w-full flex items-center justify-center font-black text-[13px] whitespace-nowrap font-pretendard">{cat.kr}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6 text-slate-400 text-sm font-bold tracking-widest uppercase font-pretendard">Showing: <span className="text-white">{filteredProjects.length}</span> Projects</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 pb-24 font-pretendard">{filteredProjects.map((project) => (<ProjectCard key={project.id} project={project} />))}</div>
          </div>
        </div>
      )}

      {/* 내비게이션 바 */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-white py-3 shadow-md border-b border-slate-100' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center font-pretendard">
          <div className="flex items-center"><a href="#home" className={`text-2xl tracking-tight transition-colors duration-300 flex items-baseline gap-1 ${!isScrolled ? 'text-white' : 'text-slate-900'}`}><span className="font-black" style={{ color: brandColor }}>ART</span><span className="font-light" style={{ color: brandColor }}>DESIGN</span></a></div>
          <div className="hidden lg:flex items-center space-x-12 font-pretendard">
            {navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`} className={`text-[14px] font-bold transition-colors ${!isScrolled ? 'text-white' : 'text-slate-700'} hover:text-[#EE7123] ${activeSection === link.id ? 'text-[#EE7123]' : ''} font-pretendard`}>{link.en}</a>
            ))}
          </div>
          <button className={`lg:hidden ${!isScrolled ? 'text-white' : 'text-slate-900'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
        </div>
      </nav>

      <section id="home" className="relative h-screen flex items-center bg-slate-950 font-pretendard">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1600')] bg-cover bg-center opacity-40 animate-subtle-zoom" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 text-white font-pretendard">
          <span className="inline-block font-bold tracking-[0.4em] text-sm mb-4 uppercase italic font-pretendard" style={{ color: brandColor }}>Visual & Motion Studio</span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none uppercase font-pretendard">Visual<br />Experience</h1>
          <a href="#create" className="px-10 py-5 bg-[#EE7123] rounded-full font-bold inline-flex items-center group shadow-xl transition-transform hover:scale-105 uppercase tracking-widest text-sm font-pretendard">Project Archive <ArrowUpRight className="ml-2 group-hover:rotate-45 transition-transform" /></a>
        </div>
      </section>

      <section id="company" className="py-32 bg-white font-pretendard">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-start font-pretendard">
          <div className="sticky top-32">
            <span className="font-bold tracking-[0.3em] text-sm uppercase mb-6 block font-pretendard" style={{ color: brandColor }}>01 / COMPANY</span>
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter font-pretendard">기업의 본질을 꿰뚫는<br />디자인 전문 그룹.</h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-10 font-light font-pretendard">ArtDesign은 20년 이상의 노하우를 바탕으로 시각디자인의 새로운 표준을 제시합니다. 인쇄 매체부터 디지털 영상까지 통합 비주얼 솔루션을 제공합니다.</p>
            <div className="grid grid-cols-2 gap-8 font-pretendard"><div className="flex items-center space-x-4 font-pretendard"><div className="p-3 bg-orange-50 rounded-xl" style={{ color: brandColor }}><FileText size={24}/></div><div className="font-bold font-pretendard">Print Media</div></div><div className="flex items-center space-x-4 font-pretendard"><div className="p-3 bg-orange-50 rounded-xl" style={{ color: brandColor }}><Play size={24}/></div><div className="font-bold font-pretendard">Motion Film</div></div></div>
          </div>
          <div className="space-y-12">
            <div className="aspect-[16/10] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 group"><img src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop" alt="Studio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
            <div className="grid grid-cols-2 gap-10 font-pretendard"><div><div className="text-4xl font-black text-slate-900 mb-2 tracking-tight">3,500+</div><div className="text-sm font-bold text-slate-400 uppercase tracking-widest font-pretendard">Works</div></div><div><div className="text-4xl font-black text-slate-900 mb-2 tracking-tight font-pretendard">24Yrs</div><div className="text-sm font-bold text-slate-400 uppercase tracking-widest font-pretendard">History</div></div></div>
          </div>
        </div>
      </section>

      <section id="create" className="py-32 bg-slate-950 text-white font-pretendard">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 font-pretendard">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 font-pretendard">
            <div><span className="font-bold tracking-[0.3em] text-sm uppercase mb-4 block font-pretendard" style={{ color: brandColor }}>02 / WHAT WE CREATE</span><h2 className="text-4xl md:text-6xl font-black tracking-tighter italic font-pretendard">Portfolio</h2></div>
            <div className="flex flex-wrap gap-4 font-pretendard">
              {categoryData.map((cat) => (
                <button key={`filter-${cat.id}`} onClick={() => {setActiveCategory(cat.id); setActiveSubCategory('전체');}} className={`px-8 py-3 rounded-full border text-[12px] font-black tracking-widest transition-all ${activeCategory === cat.id ? 'bg-[#EE7123] border-[#EE7123] text-white shadow-lg' : 'border-white/10 text-slate-400 hover:text-white font-pretendard'}`}>{cat.kr}</button>
              ))}
            </div>
          </div>

          {(activeCategory === 'EDITORIAL' || activeCategory === 'SIGNAGE') && (
            <div className="flex flex-wrap gap-2 mb-12 bg-white/5 p-2 rounded-2xl border border-white/10 w-fit font-pretendard">
              {categoryData.find(c => c.id === activeCategory).sub.map(sub => (
                <button key={sub} onClick={() => setActiveSubCategory(sub)} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubCategory === sub ? 'bg-[#EE7123] text-white' : 'text-slate-400 hover:text-white font-pretendard'}`}>{sub}</button>
              ))}
            </div>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 font-pretendard">{displayedProjects.map((project) => (<ProjectCard key={project.id} project={project} />))}</div>
          {filteredProjects.length > 12 && (
            <div className="flex justify-center mt-20 border-t border-white/10 pt-16 font-pretendard">
              <button onClick={() => setShowArchive(true)} className="px-12 py-5 font-bold tracking-widest uppercase border-2 border-slate-700 rounded-full hover:border-[#EE7123] hover:bg-[#EE7123] transition-all flex items-center group font-pretendard">View All {activeCategory} ({filteredProjects.length})<ArrowUpRight className="ml-2 group-hover:rotate-45 transition-transform" /></button>
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="py-32 bg-white font-pretendard">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-24 font-pretendard">
          <div className="font-pretendard"><span className="font-bold tracking-[0.3em] text-sm uppercase mb-6 block font-pretendard" style={{ color: brandColor }}>03 / CONTACT US</span><h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter italic leading-none font-pretendard">Work Together</h2><div className="space-y-10 font-pretendard"><div className="flex items-start space-x-6 font-pretendard"><div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 font-pretendard" style={{ color: brandColor }}><MapPin size={24} /></div><div><h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-2 font-pretendard">Studio</h4><p className="text-xl font-bold font-pretendard">경남 창원시 마산회원구 3·15대로 509 3층</p></div></div><div className="flex items-start space-x-6 font-pretendard"><div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 font-pretendard" style={{ color: brandColor }}><Mail size={24} /></div><div><h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-2 font-pretendard">Email</h4><p className="text-xl font-bold font-pretendard">hh3131@naver.com</p></div></div></div></div>
          <div className="bg-slate-50 p-10 rounded-[40px] shadow-sm border border-slate-100 font-pretendard">
            <form className="space-y-6 font-pretendard" onSubmit={handleContactSubmit}>
              <div className="grid md:grid-cols-2 gap-6 font-pretendard"><input required name="name" type="text" className="w-full bg-white rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#EE7123] outline-none transition-all font-pretendard" placeholder="성함/기업명" /><input required name="email" type="email" className="w-full bg-white rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#EE7123] outline-none transition-all font-pretendard" placeholder="회신 이메일 주소" /></div>
              <textarea required name="content" rows={4} className="w-full bg-white rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#EE7123] outline-none resize-none transition-all font-pretendard" placeholder="프로젝트 문의 내용을 적어주세요." /><button type="submit" className="w-full text-white font-black py-5 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-orange-900/10 uppercase tracking-widest font-pretendard" style={{ backgroundColor: brandColor }}>Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 border-t border-white/5 font-pretendard">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left font-pretendard">
          <div className="flex items-baseline gap-1 font-pretendard"><span className="font-black text-2xl font-pretendard" style={{ color: brandColor }}>ART</span><span className="font-light text-2xl font-pretendard" style={{ color: brandColor }}>DESIGN</span></div>
          <p className="text-slate-500 text-sm italic font-pretendard">© 2024 ArtDesign Visual Group. All rights reserved.</p>
          <div className="flex space-x-6 font-pretendard"><Instagram className="cursor-pointer hover:text-[#EE7123] transition-colors font-pretendard" /><Facebook className="cursor-pointer hover:text-[#EE7123] transition-colors font-pretendard" /></div>
        </div>
      </footer>

      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        .font-pretendard { font-family: 'Pretendard', sans-serif; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #EE7123; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .animate-in { animation-duration: 0.5s; animation-fill-mode: both; }
        .fade-in { animation-name: fadeIn; }
        .slide-in-from-bottom { animation-name: slideInBottom; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInBottom { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes subtle-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.05); } }
        .animate-subtle-zoom { animation: subtle-zoom 20s ease-out infinite alternate; }
      `}</style>
    </div>
  );
};

export default App;