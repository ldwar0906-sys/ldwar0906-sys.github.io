import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Youtube,
  Phone,
  MessageSquare
} from 'lucide-react';

// --- [커스텀 아이콘 정의] ---
const KakaoIcon = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 3c-4.97 0-9 3.18-9 7.1 0 2.53 1.63 4.76 4.14 6.04-.17.58-.61 2.12-.7 2.45-.11.43.16.42.33.31.14-.09 2.19-1.48 3.06-2.08.7.13 1.43.19 2.17.19 4.97 0 9-3.18 9-7.1S16.97 3 12 3z"/>
  </svg>
);

const BlogIcon = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16.444 19.143l1.107 1.107c.39.39 1.024.39 1.414 0l1.107-1.107c.39-.39.39-1.024 0-1.414l-1.107-1.107a5.53 5.53 0 00-6.143-8.857 5.53 5.53 0 00-8.857 6.143 5.53 5.53 0 008.857 6.143 5.53 5.53 0 004.582-1.011l.144.103zm-7.666-4.921l-1.414-1.414.707-.707 1.414 1.414-.707.707zm2.828-2.828l-1.414-1.414.707-.707 1.414 1.414-.707.707z"/>
  </svg>
);

const Instagram = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Facebook = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

// --- [1. 스마트 썸네일 컴포넌트] ---
const SmartImage = React.memo(({ srcBase, alt, onHide }) => {
  const [ext, setExt] = useState('jpg');
  const [errorCount, setErrorCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleError = useCallback(() => {
    if (errorCount === 0) {
      setExt('png');
      setErrorCount(1);
    } else {
      setIsVisible(false);
      if (onHide) onHide();
    }
  }, [errorCount, onHide]);

  if (!isVisible) return null; 

  return (
    <img 
      src={`${srcBase}.${ext}`} 
      alt={alt} 
      onError={handleError}
      loading="lazy"
      className="relative w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 z-10 bg-slate-100"
    />
  );
});

// --- [2. 상세 페이지 무한 자동 스크롤 컴포넌트] ---
const SmartSeriesImage = React.memo(({ srcBase, index, onSuccess }) => {
  const [ext, setExt] = useState('jpg');
  const [errorCount, setErrorCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleError = useCallback(() => {
    if (errorCount === 0) {
      setExt('png');
      setErrorCount(1);
    } else {
      setIsVisible(false);
    }
  }, [errorCount]);

  if (!isVisible) return null;

  return (
    <img 
      src={`${srcBase}.${ext}`} 
      alt={`Detail ${index}`} 
      onLoad={onSuccess}
      onError={handleError}
      className="w-full h-auto block object-cover bg-slate-50" 
    />
  );
});

const SeriesImageContainer = ({ project }) => {
  const [maxVisible, setMaxVisible] = useState(1);
  const handleSuccess = useCallback(() => {
    setMaxVisible(prev => prev + 1);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {Array.from({ length: maxVisible }).map((_, i) => (
        <SmartSeriesImage 
          key={`${project.id}-${i}`}
          index={i + 1}
          srcBase={`${project.seriesBasePath}/${i + 1}`} 
          onSuccess={i + 1 === maxVisible ? handleSuccess : undefined}
        />
      ))}
    </div>
  );
};

// --- [포트폴리오 데이터 생성] ---
const generateProjects = () => {
  const projects = [];
  let idCounter = 1;
  const baseUrl = "";

  const addSmartSeries = (category, dataMap) => {
    Object.entries(dataMap).forEach(([sub, data]) => {
      data.ids.forEach((item) => {
        if (!item) return;

        let folderName = "";
        let displayTitle = "";

        // ⭐️ [기능 추가] item이 문자열이면 기존 방식, 객체면 커스텀 제목 방식
        if (typeof item === 'string' && item.trim()) {
          folderName = item;
          const underscoreIndex = folderName.indexOf('_');
          if (underscoreIndex !== -1) {
            displayTitle = folderName.substring(underscoreIndex + 1);
          } else {
            displayTitle = `${sub} 작업 ${folderName.replace('no', '')}`;
          }
        } else if (typeof item === 'object') {
          folderName = item.folder;
          displayTitle = item.title;
        }

        if (folderName && folderName.trim()) {
          projects.push({
            id: idCounter++,
            category,
            subCategory: sub,
            isSmart: true,
            isSeries: true,
            srcBase: `${baseUrl}${data.path}/${folderName}/1`,
            seriesBasePath: `${baseUrl}${data.path}/${folderName}`,  
            title: displayTitle,
            description: `${sub} 기획 및 디자인 결과물입니다.`
          });
        }
      });
    });
  };

  // ⭐️ [포트폴리오 폴더 및 제목 설정하는 곳] ⭐️
  const editorialData = {
    "카달로그·브로슈어": { 
      path: "/images/EDITORIAL/CatalogBrochure", 
      ids: [
        { folder: "no1_경남대학교 캡스톤디자인 운영 매뉴얼북", title: "경남대학교 캡스톤디자인 운영 매뉴얼북 38P" },
        { folder: "no2_경상남도 응급의료지원단 CI매뉴얼북", title: "경상남도응급의료지원단 CI 매뉴얼북 24P" },
        { folder: "no3_경상남도 자립지원전담기관 소식지", title: "경상남도자립지원전담기관 소식지 20P" },
        { folder: "no4_울산광역시 어린이독서체험관 캐릭터 매뉴얼북", title: "울산광역시 어린이독서체험관 캐릭터 매뉴얼북 20P" },
        { folder: "no5_이플로우 카달로그", title: "기업 이플로우 카달로그 32P" },
        { folder: "no6_SM 엔지니어링 카달로그", title: "기업 SM엔지니어링 카달로그 32P" },
        { folder: "no7_MTS 카달로그", title: "기업 MTS 카달로그 48P" },
        { folder: "no8_모드텍 카달로그", title: "기업 모드텍 카달로그 24P" },
        { folder: "no9_서현 카달로그", title: "기업 서현 카달로그 24P" },
        { folder: "no10_세덕종합벨트 카달로그", title: "기업 세덕종합벨트 카달로그 28P" },
        { folder: "no11_원진 BMT", title: "기업 원진 BMT 32P" },
        { folder: "no12_웰템 카달로그", title: "기업 웰템 카달로그 32P" },
        { folder: "no13_태양테크 회사소개서", title: "기업 태양테크 회사소개서 28P" }
      ] 
    },
    "리플렛·팜플렛": { 
      path: "/images/EDITORIAL/LeafletPamphlet", 
      ids: [
        { folder: "no1_몽골어 경남대학교 외국인 특별전형 모집 리플렛", title: "경남대학교 외국인 특별전형 모집 대문접지 리플렛 몽골어 버전" },
        { folder: "no2_영문 경남대학교 외국인 특별전형 모집 리플렛", title: "경남대학교 외국인 특별전형 모집 대문접지 리플렛 영어 버전" },
        { folder: "no3_중문 _몽골어 경남대학교 외국인 특별전형 모집 리플렛", title: "경남대학교 외국인 특별전형 모집 대문접지 리플렛 중국어 버전" },
        { folder: "no4_함안대산중학교 대문접지형 리플렛", title: "함안대산중학교 대문접지형 리플렛" },
        { folder: "no5_3. 창신대학교_문덕수문학관 리플렛", title: "창신대학교_문덕수문학관 리플렛" },
        { folder: "no6_4. 제품소개서 리플렛_타일회사 동양석재", title: "타일회사 동양석재 리플렛" },
        { folder: "no7_5. 울산시교육청_어린이독서체험관 리플렛", title: "울산시교육청_어린이독서체험관 리플렛" },
        { folder: "no8_6. 기업 소개서 팜플렛_오앤어스", title: "기업 소개서 팜플렛_오앤어스" },
        { folder: "no9_7. 캘리그라피협회 3단 리플렛 6P", title: "캘리그라피협회 3단 리플렛 6P" },
        { folder: "no10_8. 무용단체_춤터별진 3단 리플렛6P", title: "무용단체_춤터별진 3단 리플렛6P" },
        { folder: "no11_9. KDS연주회 리플렛", title: "KDS연주회 리플렛" },
        { folder: "no12_10. 경남대학교_글로벌한마 리플렛", title: "" },
        { folder: "no13_경남대학교_국제처 모집 대문접지형 리플렛 한국어", title: "경남대학교_국제처 모집 대문접지형 리플렛 한국어 버전" },
        { folder: "no14_경남대학교_국제처 모집 대문접지형 리플렛 영문", title: "경남대학교_국제처 모집 대문접지형 리플렛 영어 버전" },
        { folder: "no15_경남대학교_국제처 모집 대문접지형 리플렛 중문", title: "경남대학교_국제처 모집 대문접지형 리플렛 중국어 버전" },
        { folder: "no16_경북경찰청어린이집_대문접지형 리플렛 6p", title: "경북경찰청어린이집_대문접지형 리플렛 6p" },
        { folder: "no17_경남환경미디어협회_미디어 환경 교육", title: "경남환경미디어협회_미디어 환경 교육 리플렛" },
        { folder: "no18_경상고등학교 동창회 리플렛", title: "경상고등학교 동창회 리플렛" },
        { folder: "no19_교육발표회 리플렛_이은문화살롱", title: "교육발표회 리플렛_이은문화살롱" },
        { folder: "no20_국악공연_가인 3단 리플렛 6P", title: "국악공연_가인 3단 리플렛 6P" },
        { folder: "no21_기업 홍보 리플렛 제작_금오산업", title: "기업 홍보 리플렛 제작_금오산업" },
        { folder: "no22_무용단체_춤터별진 눈이부시게 공연 리플렛", title: "무용단체_춤터별진 눈이부시게 공연 리플렛" },
        { folder: "no23_뮤지컬공연 팜플렛 8p_고운초등학교 팜플렛", title: "뮤지컬공연 팜플렛 8p_고운초등학교 팜플렛" },
        { folder: "no24_미술전시_강현정 작가 리플렛", title: "미술전시_강현정 작가 리플렛" },
        { folder: "no25_미술전시_정현숙 작가 리플렛", title: "미술전시_정현숙 작가 리플렛" }
      ] 
    },
    "홍보물·패키지": { 
      path: "/images/EDITORIAL/PosterOther", 
      ids: [
        { folder: "no1_노블핏 패키지", title: "노블핏 패키지 디자인" },
        { folder: "no2_이자카야 메뉴판", title: "이자카야_사바하 메뉴판" },
        { folder: "no3_퓨전주점 메뉴판", title: "퓨전주점_이글루 메뉴판" },
        { folder: "no4_중식주점 메뉴판", title: "중식주점_코리아야시장 메뉴판" },
        { folder: "no5_조개구이 메뉴판", title: "조개구이_불티나 조개구이 메뉴판" },
        { folder: "no6_꼬숩", title: "꼬숩땅콩 전단지" },
        { folder: "no7_고기집 메뉴판", title: "고깃집_순희식당 메뉴판" },
        { folder: "no8_한별 봉투 디자인", title: "한별반려동물장례식장 봉투 디자인" },
        { folder: "no9_헬시드리치", title: "헬시드리치" },
        { folder: "", title: "" },
        { folder: "", title: "" },
        { folder: "", title: "" },
      ] 
    }
  };
  addSmartSeries("EDITORIAL", editorialData);

  const signageData = {
    "간판·시트지": { 
      path: "/images/SIGNAGE/SignboardSheet", 
      ids: [
        { folder: "no1_울산 어린이독서체험관 실외", title: "울산광역시 어린이독서체험관.No1" },
        { folder: "no2_울산 어린이독서체험관 실내", title: "울산광역시 어린이독서체험관.No2" },
        { folder: "no3_울산 어린이독서체험관 시트지", title: "울산광역시 어린이독서체험관.NO3" },
        { folder: "no4_갈바에 부식 느낌", title: "갈바 부식 간판" },
        { folder: "no5_채널간판, 프레임 다양", title: "채널 간판 작업물" },
        { folder: "no6_조형물 및 구조물 등", title: "조형물 및 구조물" },
        { folder: "", title: "" },
        { folder: "", title: "" },
        { folder: "", title: "" },
      ] 
    },
    "현수막·배너": { 
      path: "/images/SIGNAGE/Banner", 
      ids: [
        { folder: "no1_캘리 교육 배너", title: "공예와 캘리그라피로 만나는 세상 배너" },
        { folder: "no2_학원 배너", title: "즐거운 뮤직스쿨 배너" },  
        { folder: "no3_캘리 교육 배너", title: "흙으로 빚고 마음으로 쓰는 예술치유 여행 배너" },
        { folder: "no4_루프탑 식당 배너", title: "루프탑 캠핑 세트 배너" },
        { folder: "no5_춤터별진 무용 공연 배너", title: "춤터별진 무용 공연 배너" },
        { folder: "no6_교육 모집 배너", title: "토요문화학교 교육 배너" },
        { folder: "no7_창원청년비전센터 배너", title: "창원청년비전센터 배너" },
        { folder: "no8_진해문화원 교육 배너", title: "진해문화원 교육 배너" },
        { folder: "no9_해군사관학교 배너", title: "창원시 해군사관학교 배너" },
        { folder: "no10_YODI 카페 배너 2종", title: "YODI 카페 배너 2종" },
        { folder: "no11_솔아동발달센터 배너", title: "솔아동발달센터 배너" },
        { folder: "no12_양식당 아치 배너", title: "양식당 아치 배너" },
        { folder: "no13_전시 배너 아카이브", title: "전시 배너 아카이브" },
        { folder: "no14_고등학교 축제 현수막", title: "창원토월고등학교 축제 현수막" },
        { folder: "no15_행사 강연 현수막", title: "행사, 강연 현수막" },
        { folder: "no16_기업 박람회 현수막", title: "기업 박람회 현수막" },
        { folder: "no17_해남126 호텔 현수막", title: "해남126 호텔 현수막" },
      ] 
    }
  };
  addSmartSeries("SIGNAGE", signageData);

  const webData = { 
    "웹 콘텐츠": { 
      path: "/images/WEB/Contents", 
      ids: [
        { folder: "no1_경상남도탄소중립지원센터 카드 뉴스 2회차", title: "경상남도탄소중립지원센터 카드뉴스_2회차" },
        { folder: "no2_경상남도탄소중립지원센터 카드 뉴스 4회차", title: "경상남도탄소중립지원센터 카드뉴스_4회차" },
        { folder: "no3_경상남도 도시탐사대", title: "경상남도 도시탐사대 카드뉴스" },
        { folder: "no4_노블핏", title: "노블핏 쉐이크 상세페이지" },
        { folder: "no5_시너지애드", title: "시너지애드 상세페이지" },
        { folder: "no6_우브로 상세페이지", title: "우브로 상세페이지" },
        { folder: "", title: "" },
      ] 
    } 
  };
  addSmartSeries("WEB", webData);

  // ⭐️ [브랜딩 데이터 로컬 연동] ⭐️
  // 기존 하드코딩 배열을 삭제하고 다른 탭처럼 스마트 로딩 방식을 적용했습니다.
  const brandingData = {
    "브랜딩": {
      path: "/images/BRANDING",
      ids: [
        // 필요시 이곳에 다음과 같은 양식으로 추가하세요.
        // { folder: "no1_브랜딩작업", title: "브랜딩 프로젝트 1" },
      ]
    }
  };
  addSmartSeries("BRANDING", brandingData);

  // ⭐️ [영상 제작 (YouTube) 세부 카테고리 분류] ⭐️
  const videoData = {
    "공연,행사": [
      { id: "hsS_3X64YbE", title: "공연 영상 제작_혼인대첩 우첨지댁 경사" },
      { id: "Abh9eKQcIuE", title: "국악창작그룹 라금 _ 너영나영(you&i), 은하수 연주" },
      { id: "FOOkzuEfwXk", title: "공연 영상 제작 l 드론 촬영 l 영상 제작 _ 국악창작그룹 라금" },
      { id: "dtAcRD_AijY", title: "창신대학교 춤추는 시 몸으로 읽는 문덕수 무용 교육 영상" },
      { id: "yYfLUnz4tpM", title: "무용단체 춤터별진 본공연 촬영 및 편집 영상제작 프로젝트"}
    ],
    "홍보영상": [
      { id: "Ka-zWBdTG0I", title: "무용단체 춤터별진 홍보영상"},
      { id: "lPO37dawKVc", title: "그레이시티 유튜브 인터뷰영상"},
      { id: "xQmi6Lz6rDw", title: "그레이시티 고객 인터뷰 영상"},
      { id: "ZL6eVld7HVs", title: "창원시립소년소녀합창단 메이킹 영상 제작 "},
      { id: "PaJnjh8q7YU", title: "함안 한별도그파크 홍보영상"}
    ],
    "정보 전달형 영상": [
      { id: "U6AgLF7TMpU", title: "경남대학교 링크사업단 캡스톤디자인 매뉴얼영상_1편"},
      { id: "xF0MLK3cFdM", title: "경남대학교 링크사업단 캡스톤디자인 매뉴얼영상_2편"},
      { id: "Cy6GsYK28O0", title: "2025년 장애인협회 실적보고 영상제작 프로젝트"}
    ]
  };

  Object.entries(videoData).forEach(([sub, videos]) => {
    videos.forEach((v, i) => {
      if (v && v.id && v.id.trim()) {
        projects.push({ 
          id: idCounter++, 
          category: "VIDEO", 
          subCategory: sub, 
          youtubeId: v.id, 
          startParam: v.start ? `&start=${v.start}` : "", 
          img: `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`, 
          title: v.title || `${sub} 영상 ${i + 1}`, 
          description: `${sub} 프로젝트입니다.` 
        });
      }
    });
  });

  return projects;
};

const allProjects = generateProjects();

const ProjectCard = React.memo(({ project, currentTab, onSelect, onFail }) => {
  const aspectClass = (project.category === 'VIDEO' && currentTab === 'VIDEO') ? 'aspect-video' : 'aspect-[4/5]';
  const brandColor = "#EE7123";

  return (
    <div onClick={() => onSelect(project)} className="group cursor-pointer font-pretendard animate-in fade-in slide-in-from-bottom duration-700">
      <div className={`relative overflow-hidden rounded-2xl mb-6 bg-slate-800 shadow-2xl border border-white/5 ${aspectClass}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900"><span className="text-slate-700 font-bold uppercase tracking-widest text-[10px]">ArtDesign Visual</span></div>
        {project.isSmart ? (
          <SmartImage srcBase={project.srcBase} alt={project.title} onHide={onFail} />
        ) : (
          <img src={project.img} alt={project.title} onError={onFail} className="relative w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 z-10" />
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
        <p className="text-slate-500 font-medium text-sm font-pretendard"> Visual Solution</p>
      </div>
    </div>
  );
});

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeSubCategory, setActiveSubCategory] = useState('전체');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [failedIds, setFailedIds] = useState(new Set());

  const brandColor = "#EE7123";

  const socialLinks = {
    kakao: "https://pf.kakao.com/_kqdwG", 
    blog: "https://blog.naver.com/design10040", 
    youtube: "https://www.youtube.com/@ArtDesign777", 
    instagram: "https://www.instagram.com/art_design.hs/", 
  };

  const navLinks = [
    { en: 'COMPANY', kr: '회사 소개', id: 'company' },
    { en: 'PORTFOLIO', kr: '포트폴리오', id: 'create' },
    { en: 'CONTACT', kr: '문의하기', id: 'contact' },
  ];

  const categoryData = [
    { id: 'ALL', kr: '전체보기', sub: [] },
    { id: 'EDITORIAL', kr: '편집디자인', sub: ['전체', '카달로그·브로슈어', '리플렛·팜플렛', '홍보물·패키지'] },
    { id: 'BRANDING', kr: '브랜딩', sub: [] },
    { id: 'SIGNAGE', kr: '실·내외 사인물', sub: ['전체', '간판·시트지', '현수막·배너'] },
    { id: 'WEB', kr: '웹 콘텐츠', sub: [] },
    { id: 'VIDEO', kr: '영상제작', sub: ['전체', '공연,행사', '홍보영상', '정보 전달형 영상'] }
  ];

  const filteredProjects = useMemo(() => {
    return allProjects
      .filter(p => !failedIds.has(p.id))
      .filter(p => {
        const matchCategory = activeCategory === 'ALL' || p.category === activeCategory;
        const matchSubCategory = activeSubCategory === '전체' || p.subCategory === activeSubCategory;
        return matchCategory && matchSubCategory;
      });
  }, [activeCategory, activeSubCategory, failedIds]);

  const displayedProjects = useMemo(() => filteredProjects.slice(0, 12), [filteredProjects]);

  const handleProjectFail = useCallback((id) => {
    setFailedIds(prev => {
      if (prev.has(id)) return prev;
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  const handleSelectProject = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setActiveSubCategory('전체');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const content = e.target.content.value;
    window.location.href = `mailto:design10040@naver.com?subject=[ArtDesign 문의] ${name}님의 프로젝트 문의&body=성함/기업명: ${name}%0D%0A회신 이메일: ${email}%0D%0A%0D%0A내용:%0D%0A${content}`;
  };

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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-pretendard selection:bg-[#EE7123] selection:text-white scroll-smooth overflow-x-hidden relative font-pretendard">
      
      {/* 상세 오버레이 */}
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
                <span className="px-5 py-2 bg-orange-50 text-[#EE7123] rounded-full text-xs font-black tracking-widest uppercase shadow-sm">{selectedProject.subCategory || selectedProject.category}</span>
                <span className="text-slate-400 font-bold text-xs">PORTFOLIO</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8 leading-tight text-slate-900">{selectedProject.title}</h2>
              <p className="text-lg text-slate-600 leading-relaxed font-light max-w-3xl mb-12">{selectedProject.description}</p>
              <button onClick={() => {setSelectedProject(null); window.location.hash = "#contact";}} className="px-10 py-4 bg-slate-950 text-white font-black tracking-widest rounded-full hover:bg-[#EE7123] transition-all shadow-xl hover:-translate-y-1 uppercase">Inquiry for this style</button>
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
            
            <div className="mb-16 font-pretendard text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic text-white mb-12 uppercase font-pretendard">{activeCategory} Works</h2>
              <div className="flex flex-wrap gap-4 relative z-20 font-pretendard mb-8">
                {categoryData.map((cat) => (
                  <button key={`archive-cat-${cat.id}`} onClick={() => handleCategoryChange(cat.id)} className={`group relative h-12 overflow-hidden px-8 rounded-full border transition-all tracking-widest ${activeCategory === cat.id ? 'bg-[#EE7123] border-[#EE7123] text-white shadow-lg' : 'border-white/10 text-slate-400 hover:text-white hover:border-white/30'}`}>
                    <div className="transition-transform duration-500 ease-in-out group-hover:-translate-y-1/2 flex flex-col items-center justify-start h-[96px]">
                      <span className="h-12 w-full flex items-center justify-center font-black text-[12px] uppercase font-pretendard">{cat.kr}</span>
                      <span className="h-12 w-full flex items-center justify-center font-black text-[13px] whitespace-nowrap font-pretendard">{cat.kr}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {['EDITORIAL', 'SIGNAGE', 'VIDEO'].includes(activeCategory) && (
                <div className="flex flex-wrap gap-2 mb-12 bg-white/5 p-2 rounded-2xl border border-white/10 w-fit mx-auto md:mx-0 font-pretendard animate-in fade-in zoom-in duration-500">
                  {categoryData.find(c => c.id === activeCategory)?.sub.map(sub => (
                    <button key={`archive-sub-${sub}`} onClick={() => setActiveSubCategory(sub)} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubCategory === sub ? 'bg-[#EE7123] text-white' : 'text-slate-400 hover:text-white font-pretendard'}`}>{sub}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-6 text-slate-400 text-sm font-bold tracking-widest uppercase font-pretendard">Showing: <span className="text-white">{filteredProjects.length}</span> Projects</div>
            <div className={`grid md:grid-cols-2 ${activeCategory === 'VIDEO' ? 'lg:grid-cols-2 max-w-6xl mx-auto' : 'lg:grid-cols-4'} gap-x-6 gap-y-12 pb-24 font-pretendard`}>
              {filteredProjects.map((project) => (
                <ProjectCard key={`archive-card-${project.id}`} project={project} currentTab={activeCategory} onSelect={handleSelectProject} onFail={() => handleProjectFail(project.id)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 내비게이션 바 */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-white py-3 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center font-pretendard">
          <div className="flex items-center">
            <a href="#home" className={`text-2xl tracking-tight transition-colors duration-300 flex items-baseline gap-1 ${!isScrolled ? 'text-white' : 'text-slate-900'}`}>
              <span className="font-black" style={{ color: brandColor }}>ART</span>
              <span className="font-light" style={{ color: brandColor }}>DESIGN</span>
            </a>
          </div>
          <div className="hidden lg:flex items-center space-x-12 font-pretendard">
            {navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`} className={`text-[14px] font-bold transition-colors ${!isScrolled ? 'text-white' : 'text-slate-700'} hover:text-[#EE7123] ${activeSection === link.id ? 'text-[#EE7123]' : ''} font-pretendard`}>{link.en}</a>
            ))}
          </div>
          <button className={`lg:hidden ${!isScrolled ? 'text-white' : 'text-slate-900'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        
        {/* 모바일 반투명 블랙 드롭다운 메뉴창 */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-slate-900/50 backdrop-blur-md shadow-2xl flex flex-col py-2 animate-in slide-in-from-top-2 duration-300 font-pretendard border-t border-white/10">
            {navLinks.map((link) => (
              <a 
                key={`mobile-${link.id}`} 
                href={`#${link.id}`} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-8 py-5 text-[15px] font-black tracking-widest flex items-center justify-between border-b border-white/5 last:border-0 transition-colors ${
                  activeSection === link.id 
                    ? 'text-[#EE7123] bg-black/50' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.en}</span>
                <span className="text-xs font-bold opacity-60">{link.kr}</span>
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="relative h-screen flex items-center bg-slate-950 font-pretendard overflow-hidden">
        {/* ⭐️ 수정한 부분: 로컬 메인 배너 이미지 연결 ⭐️ */}
        <div className="absolute inset-0 bg-[url('/images/MAIN/main_bg.jpg')] bg-cover bg-center opacity-40 animate-subtle-zoom" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 text-white font-pretendard">
          <span className="inline-block font-bold tracking-[0.4em] text-sm mb-4 uppercase italic font-pretendard" style={{ color: brandColor }}>Visual & Motion Studio</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-[0.1em] mb-8 leading-normal uppercase font-pretendard">
            <span className="font-extrabold">감각</span>
            <span className="font-light">을 담아,</span>
            <span className="font-extrabold">일상</span>
            <span className="font-light">에 더하다.</span>
          </h1>
          <a href="#create" className="px-10 py-5 bg-[#EE7123] rounded-full font-bold inline-flex items-center group shadow-xl transition-transform hover:scale-105 uppercase tracking-widest text-sm font-pretendard">Project Archive <ArrowUpRight className="ml-2 group-hover:rotate-45 transition-transform" /></a>
        </div>
      </section>

      {/* COMPANY */}
      <section id="company" className="py-32 bg-white font-pretendard">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-start font-pretendard">
          <div className="sticky top-32">
            <span className="font-bold tracking-[0.3em] text-sm uppercase mb-6 block font-pretendard" style={{ color: brandColor }}>01 / COMPANY</span>
            <h2 className="text-2xl md:text-4xl font-bold mb-5 tracking-tighter font-pretendard leading-tight text-slate-900">
             <span className="block mb-1 md:mb-2">보이는 디자인을 넘어, 경험을 디자인합니다.</span>
             <span className="block">시각디자인 전문 회사 아트디자인</span>
            </h2>
            <p className="text-slate-500 text-lg leading-snug mb-4 font-light font-pretendard">
              브랜딩부터 편집, 인쇄, 영상, 사인물, 공간까지<br className="hidden md:block"/>아트디자인은 일상 속 브랜드 경험을 만들어갑니다.
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-12 font-pretendard">
              <div className="flex items-center space-x-4"><div className="p-3 bg-orange-50 rounded-xl" style={{ color: brandColor }}><Tag size={24}/></div><div className="font-bold font-pretendard">Branding</div></div>
              <div className="flex items-center space-x-4"><div className="p-3 bg-orange-50 rounded-xl" style={{ color: brandColor }}><FileText size={24}/></div><div className="font-bold font-pretendard">Print Design</div></div>
              <div className="flex items-center space-x-4"><div className="p-3 bg-orange-50 rounded-xl" style={{ color: brandColor }}><Play size={24}/></div><div className="font-bold font-pretendard">Video Production</div></div>
              <div className="flex items-center space-x-4"><div className="p-3 bg-orange-50 rounded-xl" style={{ color: brandColor }}><LayoutGrid size={24}/></div><div className="font-bold font-pretendard">Signage Design</div></div>
            </div>
          </div>
          <div className="space-y-12">
            <div className="aspect-[16/10] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 group">
              {/* ⭐️ 수정한 부분: 로컬 컴퍼니 섹션 이미지 연결 ⭐️ */}
              <img src="/images/MAIN/company_img.jpg" alt="Studio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="grid grid-cols-2 gap-10 font-pretendard">
              <div><div className="text-4xl font-black text-slate-900 mb-2 tracking-tight">1,200+</div><div className="text-sm font-bold text-slate-400 uppercase tracking-widest font-pretendard">Works</div></div>
              <div><div className="text-4xl font-black text-slate-900 mb-2 tracking-tight font-pretendard">10Yrs</div><div className="text-sm font-bold text-slate-400 uppercase tracking-widest font-pretendard">History</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="create" className="py-32 bg-slate-950 text-white font-pretendard">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 font-pretendard">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8 font-pretendard">
            <div><span className="font-bold tracking-[0.3em] text-sm uppercase mb-4 block font-pretendard" style={{ color: brandColor }}>02 / WHAT WE CREATE</span><h2 className="text-3xl md:text-5xl font-black tracking-tighter italic font-pretendard">Portfolio</h2></div>
            <div className="flex flex-wrap gap-4 font-pretendard">
              {categoryData.map((cat) => (
                <button key={`filter-${cat.id}`} onClick={() => handleCategoryChange(cat.id)} className={`px-8 py-3 rounded-full border text-[12px] font-black tracking-widest transition-all ${activeCategory === cat.id ? 'bg-[#EE7123] border-[#EE7123] text-white shadow-lg' : 'border-white/10 text-slate-400 hover:text-white font-pretendard'}`}>{cat.kr}</button>
              ))}
            </div>
          </div>

          {(activeCategory === 'EDITORIAL' || activeCategory === 'SIGNAGE' || activeCategory === 'VIDEO') && (
            <div className="flex flex-wrap gap-2 mb-12 bg-white/5 p-2 rounded-2xl border border-white/10 w-fit font-pretendard">
              {categoryData.find(c => c.id === activeCategory)?.sub.map(sub => (
                <button key={`sub-tab-${sub}`} onClick={() => setActiveSubCategory(sub)} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubCategory === sub ? 'bg-[#EE7123] text-white' : 'text-slate-400 hover:text-white font-pretendard'}`}>{sub}</button>
              ))}
            </div>
          )}
          
          <div className={`grid md:grid-cols-2 ${activeCategory === 'VIDEO' ? 'lg:grid-cols-2 max-w-6xl mx-auto' : 'lg:grid-cols-3'} gap-10 font-pretendard`}>
            {displayedProjects.map((project) => (
              <ProjectCard key={`main-card-${project.id}`} project={project} currentTab={activeCategory} onSelect={handleSelectProject} onFail={() => handleProjectFail(project.id)} />
            ))}
          </div>

          {filteredProjects.length > 12 && (
            <div className="flex justify-center mt-20 border-t border-white/10 pt-16 font-pretendard">
              <button onClick={() => setShowArchive(true)} className="px-12 py-5 font-bold tracking-widest uppercase border-2 border-slate-700 rounded-full hover:border-[#EE7123] hover:bg-[#EE7123] transition-all flex items-center group font-pretendard">View All {activeCategory} ({filteredProjects.length})<ArrowUpRight className="ml-2 group-hover:rotate-45 transition-transform" /></button>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-32 bg-white font-pretendard">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-24 font-pretendard text-center md:text-left">
          <div className="font-pretendard">
            <span className="font-bold tracking-[0.3em] text-sm uppercase mb-6 block font-pretendard" style={{ color: brandColor }}>03 / CONTACT US</span>
            <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tighter italic leading-none font-pretendard text-slate-900 text-left">Work Together</h2>
            <div className="space-y-10 font-pretendard">
              <div className="flex items-start space-x-6 font-pretendard">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 font-pretendard shrink-0" style={{ color: brandColor }}><MapPin size={24} /></div>
                <div className="text-left"><h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-2 font-pretendard">Studio</h4><p className="text-xl font-bold font-pretendard text-slate-900">경남 창원시 마산회원구 3·15대로 509 3층</p></div>
              </div>
              <div className="flex items-start space-x-6 font-pretendard">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 font-pretendard shrink-0" style={{ color: brandColor }}><Mail size={24} /></div>
                <div className="text-left"><h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-2 font-pretendard">Email</h4><p className="text-xl font-bold font-pretendard text-slate-900">design10040@naver.com</p></div>
              </div>
              <div className="flex items-start space-x-6 font-pretendard">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 font-pretendard shrink-0" style={{ color: brandColor }}><Phone size={24} /></div>
                <div className="text-left"><h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-2 font-pretendard">Tel</h4><p className="text-xl font-bold font-pretendard text-slate-900">055-609-1063</p></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
            <a href={socialLinks.kakao} target="_blank" rel="noopener noreferrer" className="group p-8 bg-amber-50 rounded-[32px] border border-amber-100 flex flex-col justify-between hover:bg-[#EE7123] hover:text-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-900 mb-8 group-hover:scale-110 transition-transform duration-500"><KakaoIcon size={32} /></div>
              <div><h4 className="font-black text-lg mb-1 uppercase tracking-tight">KakaoTalk</h4><p className="text-xs font-bold opacity-60">채널 실시간 상담하기</p></div>
            </a>
            <a href={socialLinks.blog} target="_blank" rel="noopener noreferrer" className="group p-8 bg-emerald-50 rounded-[32px] border border-emerald-100 flex flex-col justify-between hover:bg-[#EE7123] hover:text-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-900 mb-8 group-hover:scale-110 transition-transform duration-500"><BlogIcon size={32} /></div>
              <div><h4 className="font-black text-lg mb-1 uppercase tracking-tight">Naver Blog</h4><p className="text-xs font-bold opacity-60">작업 비하인드 스토리</p></div>
            </a>
            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="group p-8 bg-red-50 rounded-[32px] border border-red-100 flex flex-col justify-between hover:bg-[#EE7123] hover:text-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-red-900 mb-8 group-hover:scale-110 transition-transform duration-500"><Youtube size={32} /></div>
              <div><h4 className="font-black text-lg mb-1 uppercase tracking-tight">YouTube</h4><p className="text-xs font-bold opacity-60">디자인 포트폴리오 영상</p></div>
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="group p-8 bg-purple-50 rounded-[32px] border border-purple-100 flex flex-col justify-between hover:bg-[#EE7123] hover:text-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-900 mb-8 group-hover:scale-110 transition-transform duration-500"><Instagram size={32} /></div>
              <div><h4 className="font-black text-lg mb-1 uppercase tracking-tight">Instagram</h4><p className="text-xs font-bold opacity-60">공식 인스타그램 팔로우</p></div>
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-16 border-t border-white/5 font-pretendard">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          
          {/* 상단 섹션: 로고 및 기업 정보 */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="space-y-6">
              {/* 로고 */}
              <div className="flex items-baseline gap-1">
                <span className="font-black text-2xl" style={{ color: brandColor }}>ART</span>
                <span className="font-light text-2xl" style={{ color: brandColor }}>DESIGN</span>
              </div>
              
              {/* 법적 명시 사항 (사업자 등록 번호 등은 실제 번호로 수정하세요) */}
              <div className="text-slate-400 text-[13px] leading-relaxed font-light">
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                  <span><strong>상호명</strong> 아트디자인</span>
                  <span><strong>대표자</strong> 김희수</span>
                  <span><strong>사업자등록번호</strong> 477-26-01631</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span><strong>주소</strong> 경남 창원시 마산회원구 3·15대로 509 3층</span>
                  <span><strong>이메일</strong> design10040@naver.com</span>
                  <span><strong>Tel</strong> 055-609-1063</span>
                </div>
              </div>
            </div>

            {/* 메뉴 링크 (퀵메뉴) */}
            <div className="flex gap-16">
              <div>
                <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-4">Menu</h4>
                <ul className="text-slate-500 text-[13px] space-y-2 uppercase font-bold">
                  <li><a href="#company" className="hover:text-[#EE7123] transition-colors">Company</a></li>
                  <li><a href="#create" className="hover:text-[#EE7123] transition-colors">Portfolio</a></li>
                  <li><a href="#contact" className="hover:text-[#EE7123] transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* 하단 섹션: 카피라이트 및 정책 */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* 카피라이트 표시 */}
            <p className="text-slate-500 text-[12px] tracking-wide font-medium uppercase">
              © 2026 ArtDesign Visual Group. All rights reserved.
            </p>
            
            {/* 정책 링크 */}
            <div className="flex gap-6 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
              <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
              <span className="cursor-pointer hover:text-white transition-colors">Terms of Use</span>
            </div>
          </div>
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
        .slide-in-from-top-2 { animation-name: slideInTop2; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInBottom { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideInTop2 { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes subtle-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.05); } }
        .animate-subtle-zoom { animation: subtle-zoom 20s ease-out infinite alternate; }
      `}</style>
    </div>
  );
};

export default App;