import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Mail, 
  MapPin, 
  ArrowUpRight, 
  Search, 
  Globe as GlobeIcon, 
  Play, 
  FileText,
  ArrowLeft,
  Tag,
  LayoutGrid,
  Calendar
} from 'lucide-react';

// 소셜 아이콘 인라인 SVG (패키지 의존성 최소화)
const Instagram = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Facebook = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const Linkedin = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const App = () => {
  // 상태 관리
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showArchive, setShowArchive] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const brandColor = "#EE7123";

  // 메뉴 데이터
  const navLinks = [
    { en: 'COMPANY', kr: '회사 소개', id: 'company' },
    { en: 'WHAT WE CREATE', kr: '포트폴리오', id: 'create' },
    { en: 'CONTACT US', kr: '문의하기', id: 'contact' },
  ];

  // 카테고리 데이터
  const categoryData = [
    { en: 'ALL', kr: '전체보기' },
    { en: 'CATALOG', kr: '카탈로그' },
    { en: 'BROCHURE', kr: '브로슈어' },
    { en: 'LEAFLET', kr: '리플렛' },
    { en: 'VIDEO', kr: '영상디자인' }
  ];

  // 프로젝트 데이터 (48개 구성, 102번 이미지 교체 완료)
  const allProjects = [
    // CATALOG (101-112)
    { id: 101, title: "Modern Tech Catalog", category: "CATALOG", year: "2024", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800", description: "최신 IT 하드웨어 라인업을 소개하는 프리미엄 카탈로그입니다." },
    { id: 102, title: "Architecture Annual", category: "CATALOG", year: "2024", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800", description: "글로벌 건축 디자인 트렌드를 분석한 아카이브북입니다." },
    { id: 103, title: "Sustainable Living", category: "CATALOG", year: "2024", img: "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=800", description: "친환경 라이프스타일 가전 브랜드 카탈로그입니다." },
    { id: 104, title: "Automotive Portfolio", category: "CATALOG", year: "2023", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800", description: "럭셔리 자동차 라인업 카탈로그입니다." },
    { id: 105, title: "Luxury Watches", category: "CATALOG", year: "2024", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800", description: "하이엔드 워치 브랜드의 마스터피스 컬렉션입니다." },
    { id: 106, title: "Interior Guide", category: "CATALOG", year: "2023", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800", description: "공간의 가치를 높이는 인테리어 디자인 가이드입니다." },
    { id: 107, title: "Fashion Archive", category: "CATALOG", year: "2024", img: "https://images.unsplash.com/photo-1539109132345-c49ac0248e66?q=80&w=800", description: "2024 시즌 패션 트렌드 매거진 카탈로그입니다." },
    { id: 108, title: "Organic Brand Book", category: "CATALOG", year: "2024", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800", description: "유기농 스킨케어 브랜드 철학을 담은 브랜드북입니다." },
    { id: 109, title: "Smart Home Tech", category: "CATALOG", year: "2023", img: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800", description: "스마트 홈 시스템 구축 매뉴얼 카탈로그입니다." },
    { id: 110, title: "Global Finance", category: "CATALOG", year: "2024", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800", description: "글로벌 금융 시장 전망 분석 카탈로그입니다." },
    { id: 111, title: "Fine Jewelry", category: "CATALOG", year: "2023", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800", description: "다이아몬드 아카이브 카탈로그입니다." },
    { id: 112, title: "Digital Innovation", category: "CATALOG", year: "2024", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800", description: "기술 로드맵 카탈로그입니다." },

    // BROCHURE (201-212)
    { id: 201, title: "Luxury Real Estate", category: "BROCHURE", year: "2024", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800", description: "프리미엄 주거 공간 홍보 브로슈어입니다." },
    { id: 202, title: "Corporate Profile", category: "BROCHURE", year: "2023", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", description: "기업의 브랜드 파워를 보여주는 프로필 브로슈어입니다." },
    { id: 203, title: "Gallery Intro", category: "BROCHURE", year: "2024", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800", description: "현대 미술 갤러리 기획전 소개 브로슈어입니다." },
    { id: 204, title: "Startup Pitch", category: "BROCHURE", year: "2024", img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800", description: "테크 스타트업의 투자 제안용 브로슈어입니다." },
    { id: 205, title: "Healthcare Vision", category: "BROCHURE", year: "2023", img: "https://images.unsplash.com/photo-1504813184591-01592fd03cfd?q=80&w=800", description: "스마트 헬스케어 시스템 안내 브로슈어입니다." },
    { id: 206, title: "Campus Life", category: "BROCHURE", year: "2024", img: "https://images.unsplash.com/photo-1523050853021-ea734f960f3b?q=80&w=800", description: "대학교 신입생 가이드 브로슈어입니다." },
    { id: 207, title: "Resort Branding", category: "BROCHURE", year: "2023", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800", description: "고급 리조트 홍보 브로슈어입니다." },
    { id: 208, title: "Wealth Mgmt", category: "BROCHURE", year: "2024", img: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=800", description: "금융 자산 관리 서비스 안내 브로슈어입니다." },
    { id: 209, title: "Global NGO", category: "BROCHURE", year: "2023", img: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb8?q=80&w=800", description: "글로벌 NGO 활동 내역 브로슈어입니다." },
    { id: 210, title: "Fine Dining", category: "BROCHURE", year: "2024", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800", description: "미슐랭 가이드 레스토랑 메뉴 브로슈어입니다." },
    { id: 211, title: "Industrial Tech", category: "BROCHURE", year: "2024", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800", description: "산업 기술 혁신 홍보 브로슈어입니다." },
    { id: 212, title: "Agency Portfolio", category: "BROCHURE", year: "2023", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800", description: "컨벤션 대행사 성공 사례 브로슈어입니다." },

    // LEAFLET (301-312)
    { id: 301, title: "Summit Guide", category: "LEAFLET", year: "2023", img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800", description: "국제 회담 일정 및 안내 리플렛입니다." },
    { id: 302, title: "Exhibition Info", category: "LEAFLET", year: "2024", img: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=800", description: "IT 박람회 안내용 리플렛입니다." },
    { id: 303, title: "Festival Map", category: "LEAFLET", year: "2024", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800", description: "축제 프로그램 리플렛입니다." },
    { id: 304, title: "Museum Tour", category: "LEAFLET", year: "2023", img: "https://images.unsplash.com/photo-1518998053574-53fd6206041c?q=80&w=800", description: "국립 박물관 전시 안내 리플렛입니다." },
    { id: 305, title: "Brand Campaign", category: "LEAFLET", year: "2024", img: "https://images.unsplash.com/photo-1572044162444-ad60f128bde2?q=80&w=800", description: "브랜드 캠페인 홍보용 리플렛입니다." },
    { id: 306, title: "Open Day", category: "LEAFLET", year: "2024", img: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?q=80&w=800", description: "입시 설명회 행사 리플렛입니다." },
    { id: 307, title: "Medical Guide", category: "LEAFLET", year: "2023", img: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800", description: "전문 병원 진료 안내 리플렛입니다." },
    { id: 308, title: "Pitch One-sheet", category: "LEAFLET", year: "2024", img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800", description: "스타트업 핵심 요약 리플렛입니다." },
    { id: 309, title: "Eco-Friendly", category: "LEAFLET", year: "2024", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=800", description: "환경 캠페인 안내 리플렛입니다." },
    { id: 310, title: "Concert Info", category: "LEAFLET", year: "2023", img: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=800", description: "클래식 공연 예매 정보 리플렛입니다." },
    { id: 311, title: "Real Estate Map", category: "LEAFLET", year: "2024", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800", description: "부동산 분양 정보 리플렛입니다." },
    { id: 312, title: "Job Fair", category: "LEAFLET", year: "2024", img: "https://images.unsplash.com/photo-1521791136064-7986c2923216?q=80&w=800", description: "채용 박람회 일정 리플렛입니다." },

    // VIDEO (401-412)
    { id: 401, title: "Digital Identity", category: "VIDEO", year: "2024", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800", description: "IT 브랜드 모션 아이덴티티 필름입니다." },
    { id: 402, title: "Corporate Vision", category: "VIDEO", year: "2023", img: "https://images.unsplash.com/photo-1492724724894-7464c27d0ceb?q=80&w=800", description: "기업의 미래 가치 시각화 영상입니다." },
    { id: 403, title: "Logo Motion", category: "VIDEO", year: "2024", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800", description: "브랜드 로고 오프닝 모션입니다." },
    { id: 404, title: "Launch Film", category: "VIDEO", year: "2024", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800", description: "서비스 런칭 홍보 영상입니다." },
    { id: 405, title: "Product Teaser", category: "VIDEO", year: "2024", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800", description: "신제품 디테일 티저 영상입니다." },
    { id: 406, title: "Fashion Film", category: "VIDEO", year: "2024", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800", description: "감각적인 패션 컬렉션 필름입니다." },
    { id: 407, title: "Music FX", category: "VIDEO", year: "2023", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800", description: "시각적 임팩트가 강조된 뮤직비디오 프로젝트입니다." },
    { id: 408, title: "Interviews", category: "VIDEO", year: "2024", img: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800", description: "사내 문화 소개 인터뷰 영상입니다." },
    { id: 409, title: "Cinematic City", category: "VIDEO", year: "2023", img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800", description: "도시 미학 시네마틱 필름입니다." },
    { id: 410, title: "Startup Story", category: "VIDEO", year: "2024", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800", description: "스타트업 탄생 다큐멘터리입니다." },
    { id: 411, title: "Tech Demo", category: "VIDEO", year: "2023", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800", description: "최신 기술 시연 데모 릴입니다." },
    { id: 412, title: "Ads Graphics", category: "VIDEO", year: "2024", img: "https://images.unsplash.com/photo-1611162616475-46b635cbca85?q=80&w=800", description: "SNS 광고용 모션 그래픽 시리즈입니다." },
  ];

  const filteredProjects = allProjects.filter(p => activeCategory === 'ALL' || p.category === activeCategory);
  const displayedProjects = filteredProjects.slice(0, 6);

  // 스크롤 이벤트 및 섹션 하이라이트
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'company', 'create', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 모달 상태 시 스크롤 방지
  useEffect(() => {
    if (showArchive || selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showArchive, selectedProject]);

  // 카드 컴포넌트
  const ProjectCard = ({ project }) => (
    <div onClick={() => setSelectedProject(project)} className="group cursor-pointer font-pretendard animate-in fade-in slide-in-from-bottom duration-700">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-slate-800 shadow-2xl border border-white/5">
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
           <span className="text-slate-700 font-bold uppercase tracking-widest text-[10px]">ArtDesign Visual</span>
        </div>
        <img src={project.img} alt={project.title} loading="lazy" className="relative w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 z-10" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20" style={{ backgroundColor: `${brandColor}E6` }}>
          <div className="text-center px-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-900 mx-auto mb-4 shadow-lg transition-transform group-hover:scale-110">
              <ArrowUpRight size={24} />
            </div>
            <p className="text-sm font-bold tracking-widest text-white uppercase font-pretendard">View Detail</p>
          </div>
        </div>
      </div>
      <div>
        <span className="text-[11px] font-bold tracking-widest uppercase mb-2 block" style={{ color: brandColor }}>{project.category}</span>
        <h3 className="text-2xl font-bold mb-2 group-hover:text-[#EE7123] transition-colors tracking-tight text-white">{project.title}</h3>
        <p className="text-slate-500 font-medium text-sm">{project.year} | Visual Solution</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-pretendard selection:bg-[#EE7123] selection:text-white scroll-smooth overflow-x-hidden relative">
      
      {/* 상세 오버레이 */}
      {selectedProject && (
        <div className="fixed inset-0 bg-white z-[500] overflow-y-auto animate-in fade-in duration-300">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-12">
            <button onClick={() => setSelectedProject(null)} className="flex items-center space-x-3 text-slate-400 hover:text-slate-900 mb-16 group">
              <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all font-pretendard"><ArrowLeft size={20} /></div>
              <span className="font-bold tracking-widest uppercase font-pretendard">Close</span>
            </button>
            <div className="grid lg:grid-cols-2 gap-20">
              <div className="rounded-3xl overflow-hidden shadow-3xl bg-slate-100"><img src={selectedProject.img} alt={selectedProject.title} className="w-full h-auto object-cover" /></div>
              <div className="font-pretendard">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="px-4 py-1.5 bg-orange-50 text-[#EE7123] rounded-full text-xs font-black tracking-widest uppercase">{selectedProject.category}</span>
                  <span className="text-slate-400 font-bold text-xs">{selectedProject.year} Port.</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-tight">{selectedProject.title}</h2>
                <div className="space-y-8 mb-12 border-t border-slate-100 pt-10">
                  <div className="flex items-start space-x-4">
                    <Tag size={20} className="text-[#EE7123] mt-1" />
                    <div><h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-2">Description</h4><p className="text-lg text-slate-700 leading-relaxed font-light">{selectedProject.description}</p></div>
                  </div>
                </div>
                <button onClick={() => {setSelectedProject(null); window.location.hash = "#contact";}} className="w-full py-6 bg-slate-950 text-white font-black tracking-widest rounded-2xl hover:bg-[#EE7123] transition-colors shadow-2xl">INQUIRY FOR THIS STYLE</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 아카이브 오버레이 */}
      {showArchive && (
        <div className="fixed inset-0 bg-slate-950 z-[400] overflow-y-auto animate-in slide-in-from-bottom duration-500">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
            <div className="sticky top-0 z-50 py-4 bg-slate-950/80 backdrop-blur-sm mb-12 flex justify-between items-center">
              <button onClick={() => setShowArchive(false)} className="flex items-center space-x-3 text-slate-400 hover:text-white group">
                <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-[#EE7123] group-hover:bg-[#EE7123] transition-all"><ArrowLeft size={20} /></div>
                <span className="font-bold tracking-widest uppercase text-xs font-pretendard">Back</span>
              </button>
              <div className="flex items-center space-x-2 font-pretendard"><LayoutGrid size={18} className="text-[#EE7123]" /><span className="text-white font-black tracking-widest text-xs uppercase">{activeCategory} ARCHIVE ({filteredProjects.length})</span></div>
            </div>
            <div className="mb-16 font-pretendard">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic text-white mb-12 uppercase">{activeCategory} Works</h2>
              <div className="flex flex-wrap gap-4">
                {categoryData.map((cat) => (
                  <button key={`archive-${cat.en}`} onClick={() => setActiveCategory(cat.en)} className={`group relative h-10 overflow-hidden px-8 rounded-full border transition-all text-[11px] font-black tracking-widest ${activeCategory === cat.en ? 'bg-[#EE7123] border-[#EE7123] text-white' : 'border-white/10 text-slate-400 hover:text-white hover:border-white/30'}`}>
                    <div className="transition-transform duration-500 ease-in-out group-hover:-translate-y-1/2 flex flex-col items-center">
                      <span className="h-10 flex items-center justify-center whitespace-nowrap">{cat.en}</span>
                      <span className="h-10 flex items-center justify-center font-black whitespace-nowrap">{cat.kr}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 pb-24">{filteredProjects.map((project) => (<ProjectCard key={`archive-item-${project.id}`} project={project} />))}</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-white py-3 shadow-md border-b border-slate-100' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center font-pretendard">
          <div className="flex items-center">
            <a href="#home" className={`text-2xl tracking-tight transition-colors duration-300 flex items-baseline gap-1 ${!isScrolled ? 'text-white' : 'text-slate-900'}`}>
              <span className="font-black" style={{ color: brandColor }}>ART</span>
              <span className="font-light" style={{ color: brandColor }}>DESIGN</span>
            </a>
          </div>
          
          <div className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              <a 
                key={link.id} 
                href={`#${link.id}`} 
                className={`group relative h-7 overflow-hidden text-[14px] font-bold tracking-tight transition-all duration-300 
                  ${!isScrolled ? 'text-white' : 'text-slate-700'} 
                  ${activeSection === link.id ? '!opacity-100' : 'opacity-60'}`}
                style={{ color: activeSection === link.id ? brandColor : '' }}
              >
                <div className="transition-transform duration-500 ease-in-out group-hover:-translate-y-1/2 flex flex-col items-center">
                  <span className="h-7 flex items-center justify-center whitespace-nowrap">{link.en}</span>
                  <span className="h-7 flex items-center justify-center font-black whitespace-nowrap" style={{ color: brandColor }}>{link.kr}</span>
                </div>
              </a>
            ))}
          </div>

          <button className={`lg:hidden ${!isScrolled ? 'text-white' : 'text-slate-900'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="relative h-screen flex items-center bg-slate-950 font-pretendard">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-40 animate-subtle-zoom" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 text-white">
          <span className="inline-block font-bold tracking-[0.4em] text-sm mb-4 uppercase italic" style={{ color: brandColor }}>Visual & Motion Studio</span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">VISUAL<br />EXPERIENCE</h1>
          <p className="max-w-2xl text-xl font-light text-slate-300 mb-12">메시지의 본질을 꿰뚫는 창의적인 디자인 파트너, ArtDesign입니다.</p>
          <a href="#create" className="px-10 py-5 bg-[#EE7123] rounded-full font-bold inline-flex items-center group shadow-xl transition-transform hover:scale-105">PROJECT ARCHIVE <ArrowUpRight className="ml-2 group-hover:rotate-45 transition-transform" /></a>
        </div>
      </section>

      {/* COMPANY Section */}
      <section id="company" className="py-32 bg-white font-pretendard">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-start">
          <div className="sticky top-32">
            <span className="font-bold tracking-[0.3em] text-sm uppercase mb-6 block" style={{ color: brandColor }}>01 / COMPANY</span>
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">기업의 본질을 꿰뚫는<br />디자인 전문 그룹.</h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-10 font-light">ArtDesign은 20년 이상의 노하우를 바탕으로 시각디자인의 새로운 표준을 제시합니다. 인쇄 매체부터 디지털 영상까지 통합 비주얼 솔루션을 제공합니다.</p>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center space-x-4"><div className="p-3 bg-orange-50 rounded-xl" style={{ color: brandColor }}><FileText size={24}/></div><div className="font-bold">Print Media</div></div>
              <div className="flex items-center space-x-4"><div className="p-3 bg-orange-50 rounded-xl" style={{ color: brandColor }}><Play size={24}/></div><div className="font-bold">Motion Film</div></div>
            </div>
          </div>
          <div className="space-y-12">
            <div className="aspect-[16/10] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 group">
              <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop" alt="Studio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="grid grid-cols-2 gap-10">
              <div><div className="text-4xl font-black text-slate-900 mb-2 tracking-tight">3,500+</div><div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Printed Works</div></div>
              <div><div className="text-4xl font-black text-slate-900 mb-2 tracking-tight">24Yrs</div><div className="text-sm font-bold text-slate-400 uppercase tracking-widest">History</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE CREATE Section */}
      <section id="create" className="py-32 bg-slate-950 text-white font-pretendard">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <span className="font-bold tracking-[0.3em] text-sm uppercase mb-4 block" style={{ color: brandColor }}>02 / WHAT WE CREATE</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic font-pretendard">Portfolio</h2>
            </div>
            
            <div className="flex flex-wrap gap-4 font-pretendard">
              {categoryData.map((cat) => (
                <button 
                  key={`filter-${cat.en}`} 
                  onClick={() => setActiveCategory(cat.en)}
                  className={`group relative h-10 overflow-hidden px-8 rounded-full border text-[11px] font-black tracking-widest transition-all ${
                    activeCategory === cat.en 
                      ? 'bg-[#EE7123] border-[#EE7123] text-white shadow-lg shadow-orange-950/40' 
                      : 'border-white/10 hover:border-white/40 text-slate-400'
                  }`}
                >
                  <div className="transition-transform duration-500 ease-in-out group-hover:-translate-y-1/2 flex flex-col items-center">
                    <span className="h-10 flex items-center justify-center whitespace-nowrap">{cat.en}</span>
                    <span className="h-10 flex items-center justify-center font-black whitespace-nowrap">{cat.kr}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {displayedProjects.map((project) => (
              <ProjectCard key={`main-grid-${project.id}`} project={project} />
            ))}
          </div>

          {filteredProjects.length > 6 && (
            <div className="flex justify-center mt-12 border-t border-white/10 pt-16">
              <button 
                onClick={() => setShowArchive(true)}
                className="px-12 py-5 font-bold tracking-widest uppercase border-2 border-slate-700 rounded-full hover:border-[#EE7123] hover:bg-[#EE7123] transition-all flex items-center group font-pretendard"
              >
                VIEW ALL {activeCategory} ({filteredProjects.length})
                <ArrowUpRight className="ml-2 group-hover:rotate-45 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* CONTACT Section */}
      <section id="contact" className="py-32 bg-white font-pretendard">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-24 font-pretendard">
          <div>
            <span className="font-bold tracking-[0.3em] text-sm uppercase mb-6 block" style={{ color: brandColor }}>03 / CONTACT US</span>
            <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter italic leading-none font-pretendard">Work Together</h2>
            <div className="space-y-10">
              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 font-pretendard" style={{ color: brandColor }}><MapPin size={24} /></div>
                <div><h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-2 font-pretendard">Studio</h4><p className="text-xl font-bold">경남 창원시 마산회원구 3·15대로 509 3층</p></div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 font-pretendard" style={{ color: brandColor }}><Mail size={24} /></div>
                <div><h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-2 font-pretendard">Email</h4><p className="text-xl font-bold">work@artdesign.co.kr</p></div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-10 rounded-[40px] shadow-sm border border-slate-100 font-pretendard">
            <form className="space-y-6 font-pretendard" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" className="w-full bg-white rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#EE7123] outline-none transition-all font-pretendard" placeholder="성함/기업명" />
                <input type="email" className="w-full bg-white rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#EE7123] outline-none transition-all font-pretendard" placeholder="이메일" />
              </div>
              <textarea rows={4} className="w-full bg-white rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-[#EE7123] outline-none resize-none transition-all font-pretendard" placeholder="프로젝트 문의 내용을 적어주세요." />
              <button className="w-full text-white font-black py-5 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-orange-900/10 font-pretendard" style={{ backgroundColor: brandColor }}>SEND MESSAGE</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-white/5 font-pretendard">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left font-pretendard">
          <div className="flex items-baseline gap-1">
            <span className="font-black text-2xl" style={{ color: brandColor }}>ART</span>
            <span className="font-light text-2xl" style={{ color: brandColor }}>DESIGN</span>
          </div>
          <p className="text-slate-500 text-sm italic">© 2024 ArtDesign Visual Group. All rights reserved.</p>
          <div className="flex space-x-6">
            <Instagram className="cursor-pointer hover:text-[#EE7123] transition-colors" />
            <Facebook className="cursor-pointer hover:text-[#EE7123] transition-colors" />
            <Linkedin className="cursor-pointer hover:text-[#EE7123] transition-colors" />
          </div>
        </div>
      </footer>

      {/* Custom Styles (Animations & Scrollbar) */}
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        .font-pretendard { font-family: 'Pretendard', sans-serif; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #EE7123; border-radius: 10px; }
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