const { useState, useEffect, useRef } = React;

// ── Hooks ─────────────────────────────────────────────────────────────────────
const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {if (e.isIntersecting) setInView(true);}, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const useWindowWidth = () => {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const A = '#ff4d6d',A2 = '#00d4ff';
const sectionStyle = (inView, isMobile = false) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'none' : 'translateY(28px)',
  transition: 'opacity 0.7s ease, transform 0.7s ease',
  padding: isMobile ? '60px 5%' : '96px 5%',
  maxWidth: 1200,
  margin: '0 auto'
});

const SectionHeader = ({ label, title }) =>
<div style={{ marginBottom: 56 }}>
    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: A, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>// {label}</div>
    <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 38, fontWeight: 700, color: '#e2eaf4', margin: 0, lineHeight: 1.1 }}>{title}</h2>
    <div style={{ width: 36, height: 2, background: A, marginTop: 14, boxShadow: `0 0 12px ${A}` }}></div>
  </div>;


// ── Project Placeholder SVG ────────────────────────────────────────────────────
const ProjectPlaceholder = ({ project }) => {
  let h = 0;
  for (const c of project.title) h = h * 31 + c.charCodeAt(0) & 0x7fffffff;
  const hue = 180 + h % 80;
  const c1 = `oklch(0.16 0.07 ${hue})`,c2 = `oklch(0.24 0.1 ${hue})`,ac = `oklch(0.68 0.18 ${hue})`;
  const initials = project.title.split(' ').map((w) => w[0]).join('').slice(0, 3);
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="220" fill={c1} />
      {[...Array(9)].map((_, i) => <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="220" stroke={c2} strokeWidth="0.6" />)}
      {[...Array(5)].map((_, i) => <line key={`h${i}`} x1="0" y1={i * 55} x2="400" y2={i * 55} stroke={c2} strokeWidth="0.6" />)}
      <rect x="10" y="10" width="18" height="18" fill="none" stroke={ac} strokeWidth="1.5" opacity="0.7" />
      <line x1="10" y1="19" x2="5" y2="19" stroke={ac} strokeWidth="1.5" opacity="0.7" />
      <line x1="19" y1="10" x2="19" y2="5" stroke={ac} strokeWidth="1.5" opacity="0.7" />
      <rect x="372" y="192" width="18" height="18" fill="none" stroke={ac} strokeWidth="1.5" opacity="0.7" />
      <line x1="390" y1="201" x2="395" y2="201" stroke={ac} strokeWidth="1.5" opacity="0.7" />
      <line x1="381" y1="210" x2="381" y2="215" stroke={ac} strokeWidth="1.5" opacity="0.7" />
      <text x="200" y="110" textAnchor="middle" dominantBaseline="middle" fill={ac} fontFamily="JetBrains Mono,monospace" fontSize="54" fontWeight="700" opacity="0.18">{initials}</text>
      <text x="200" y="168" textAnchor="middle" dominantBaseline="middle" fill={ac} fontFamily="JetBrains Mono,monospace" fontSize="11" opacity="0.45">{project.tags.join(' · ')}</text>
    </svg>);

};

// ── Nav ────────────────────────────────────────────────────────────────────
const Nav = ({ name, onAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useWindowWidth() < 768;
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 4);
  const links = [['Sobre mí','about'],['Skills','skills'],['Exp.','experience'],['Proyectos','projects'],['Contacto','contact']];
  return (
    <>
      <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:200,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 5%',height:64,background:'rgba(6,9,18,0.95)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontFamily:'Space Grotesk,sans-serif',fontWeight:700,fontSize:20,color:A,letterSpacing:'0.05em',textShadow:`0 0 20px ${A}88` }}>{initials}</div>
        {isMobile ? (
          <button onClick={() => setMenuOpen(o => !o)} style={{ background:'none',border:'none',cursor:'pointer',padding:8,display:'flex',flexDirection:'column',gap:5 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:22,height:2,background:menuOpen&&i===1?'transparent':A,borderRadius:1,transition:'all 0.2s',transform:menuOpen?(i===0?'rotate(45deg) translate(5px,5px)':i===2?'rotate(-45deg) translate(5px,-5px)':'none'):'none' }}/>)}
          </button>
        ) : (
          <div style={{ display:'flex',gap:28,alignItems:'center' }}>
            {links.map(([label, id]) => (
              <a key={id} href={`#${id}`} style={{ fontFamily:'Inter,sans-serif',fontSize:14,color:'#6b7a95',textDecoration:'none',transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='#e2eaf4'} onMouseLeave={e => e.target.style.color='#6b7a95'}>{label}</a>
            ))}
            <button onClick={onAdmin} style={{ fontFamily:'JetBrains Mono,monospace',fontSize:12,color:A,background:`${A}18`,border:`1px solid ${A}44`,borderRadius:4,padding:'6px 16px',cursor:'pointer',transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background=`${A}28`; e.currentTarget.style.borderColor=`${A}88`; }}
              onMouseLeave={e => { e.currentTarget.style.background=`${A}18`; e.currentTarget.style.borderColor=`${A}44`; }}>$ admin</button>
          </div>
        )}
      </nav>
      {isMobile && menuOpen && (
        <div style={{ position:'fixed',top:64,left:0,right:0,zIndex:199,background:'rgba(6,9,18,0.97)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.07)',padding:'16px 5% 20px',display:'flex',flexDirection:'column',gap:4 }}>
          {links.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}
              style={{ fontFamily:'Inter,sans-serif',fontSize:16,color:'#9aaccb',textDecoration:'none',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{label}</a>
          ))}
          <button onClick={() => { setMenuOpen(false); onAdmin(); }} style={{ fontFamily:'JetBrains Mono,monospace',fontSize:13,color:A,background:`${A}15`,border:`1px solid ${A}40`,borderRadius:6,padding:'10px',cursor:'pointer',marginTop:8 }}>$ admin</button>
        </div>
      )}
    </>
  );
};

// ── Hero ────────────────────────────────────────────────────────────────────
const HeroSection = ({ data }) => {
  const isMobile = useWindowWidth() < 768;
  return (
  <section style={{ minHeight:'100vh',display:'flex',alignItems:'center',padding:'80px 5% 60px',position:'relative',overflow:'hidden' }}>
    <div style={{ position:'absolute',inset:0,backgroundImage:`linear-gradient(${A}08 1px,transparent 1px),linear-gradient(90deg,${A}08 1px,transparent 1px)`,backgroundSize:'60px 60px',pointerEvents:'none' }}/>
    <div style={{ position:'absolute',top:'25%',left:'20%',width:700,height:700,background:`radial-gradient(circle,${A}0d 0%,transparent 65%)`,pointerEvents:'none' }}/>
    <div style={{ display:'flex',flexDirection:isMobile?'column':'row',alignItems:'center',gap:isMobile?40:80,width:'100%',maxWidth:1200,margin:'0 auto',position:'relative' }}>
      <div style={{ flex:1,minWidth:0,textAlign:isMobile?'center':'left' }}>
        <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:13,color:A,letterSpacing:'0.2em',marginBottom:22,display:'flex',alignItems:'center',justifyContent:isMobile?'center':'flex-start',gap:8 }}>
          <span style={{ display:'inline-block',width:8,height:8,borderRadius:'50%',background:data.available?'#22c55e':A,boxShadow:data.available?'0 0 10px #22c55e':'none',animation:data.available?'pulse 2s infinite':'none' }}></span>
          {data.available?'DISPONIBLE PARA PROYECTOS':'OCUPADO ACTUALMENTE'}
        </div>
        <h1 style={{ fontFamily:'Space Grotesk,sans-serif',fontSize:'clamp(32px,5.5vw,72px)',fontWeight:700,color:'#e2eaf4',lineHeight:1.05,margin:'0 0 4px' }}>
          {data.name.split(' ').slice(0,2).join(' ')}
        </h1>
        <h1 style={{ fontFamily:'Space Grotesk,sans-serif',fontSize:'clamp(32px,5.5vw,72px)',fontWeight:700,lineHeight:1.05,margin:'0 0 28px',background:`linear-gradient(120deg,${A},${A2})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' }}>
          {data.name.split(' ').slice(2).join(' ')}
        </h1>
        <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:isMobile?13:15,color:'#5a6a80',marginBottom:24 }}>
          {data.subtitle.split(' · ').map((s,i) => (
            <span key={i}>{i>0&&<span style={{ color:A,margin:'0 8px' }}>·</span>}{s}</span>
          ))}
        </div>
        <p style={{ fontFamily:'Inter,sans-serif',fontSize:isMobile?15:17,color:'#7a8fa8',lineHeight:1.75,maxWidth:480,margin:isMobile?'0 auto 32px':'0 0 40px' }}>{data.bio}</p>
        <div style={{ display:'flex',gap:14,flexWrap:'wrap',justifyContent:isMobile?'center':'flex-start' }}>
          <a href="#contact" style={{ fontFamily:'Space Grotesk,sans-serif',fontWeight:600,fontSize:15,color:'#060912',background:A,border:'none',borderRadius:6,padding:'13px 30px',cursor:'pointer',textDecoration:'none',boxShadow:`0 0 24px ${A}66`,transition:'all 0.2s',display:'inline-block' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform='none'}>Contáctame</a>
          <a href="#projects" style={{ fontFamily:'Space Grotesk,sans-serif',fontWeight:600,fontSize:15,color:'#e2eaf4',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:6,padding:'13px 30px',cursor:'pointer',textDecoration:'none',transition:'all 0.2s',display:'inline-block' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.09)'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.transform='none'; }}>Ver proyectos →</a>
        </div>
      </div>
      <div style={{ flexShrink:0,position:'relative' }}>
        <div style={{ width:isMobile?220:296,height:isMobile?220:296,borderRadius:'50%',overflow:'hidden',border:`2px solid ${A}66`,boxShadow:`0 0 50px ${A}44,0 0 100px ${A}18` }}>
          {data.photo
            ? <img src={data.photo} alt={data.name} style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'top center' }}/>
            : <div style={{ width:'100%',height:'100%',background:'#0c1020',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Space Grotesk,sans-serif',fontSize:64,fontWeight:700,color:A,opacity:0.3 }}>{data.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
          }
        </div>
        {!isMobile && <><div style={{ position:'absolute',inset:-14,borderRadius:'50%',border:`1px solid ${A}20`,pointerEvents:'none' }}/><div style={{ position:'absolute',inset:-28,borderRadius:'50%',border:`1px solid ${A}0d`,pointerEvents:'none' }}/></>}
        <div style={{ position:'absolute',bottom:12,left:isMobile?-8:-24,background:'#0c1020',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'8px 14px',fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#5a6a80',backdropFilter:'blur(10px)',whiteSpace:'nowrap' }}>📍 {data.location}</div>
      </div>
    </div>
  </section>
  );
};

// ── About ─────────────────────────────────────────────────────────────────────
const AboutSection = ({ data }) => {
  const isMobile = useWindowWidth() < 768;
  const [ref, inView] = useInView();
  return (
    <div ref={ref} id="about" style={{ background: 'rgba(12,16,32,0.6)' }}>
      <div style={sectionStyle(inView, isMobile)}>
        <SectionHeader label="sobre mí" title="¿Quién soy?" />
        <div style={{ maxWidth: 720, fontFamily: 'Inter,sans-serif', fontSize: 18, color: '#8b9ab0', lineHeight: 1.85, borderLeft: `2px solid ${A}`, paddingLeft: 28 }}>
          {data.text}
        </div>
      </div>
    </div>);

};

// ── Skills ────────────────────────────────────────────────────────────────────
const SkillsSection = ({ data }) => {
  const [ref, inView] = useInView();
  const isMobile = useWindowWidth() < 768;
  const catColors = [A, A2, '#a855f7', '#f59e0b'];
  return (
    <div ref={ref} id="skills">
      <div style={sectionStyle(inView, isMobile)}>
        <SectionHeader label="habilidades" title="Stack Tecnológico" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
          {data.map((cat, ci) =>
          <div key={cat.id} style={{ background: '#0c1020', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 28, transition: 'border-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = `${catColors[ci % catColors.length]}44`}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: catColors[ci % catColors.length], letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>{cat.category}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cat.items.map((item) =>
              <span key={item} style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#9aaccb', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '5px 12px' }}>{item}</span>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

};

// ── Education ─────────────────────────────────────────────────────────────────
const EducationSection = ({ data }) => {
  const [ref, inView] = useInView();
  const isMobile = useWindowWidth() < 768;
  return (
    <div ref={ref} style={{ background: 'rgba(12,16,32,0.6)' }}>
      <div style={sectionStyle(inView, isMobile)}>
        <SectionHeader label="educación" title="Formación Académica" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {data.map((ed) =>
          <div key={ed.id} style={{ display: 'flex', gap: 24, background: '#0c1020', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 28, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: `${A}18`, border: `1px solid ${A}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 18, color: '#e2eaf4', marginBottom: 4 }}>{ed.degree}</div>
                <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: A2, marginBottom: 6 }}>{ed.institution}</div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#5a6a80', marginBottom: 10 }}>{ed.period}</div>
                {ed.description && <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#7a8fa8', lineHeight: 1.65 }}>{ed.description}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

};

// ── Languages ─────────────────────────────────────────────────────────────────
const LanguagesSection = ({ data }) => {
  const [ref, inView] = useInView();
  const isMobile = useWindowWidth() < 768;
  const [animated, setAnimated] = useState(false);
  useEffect(() => {if (inView) setTimeout(() => setAnimated(true), 200);}, [inView]);
  return (
    <div ref={ref}>
      <div style={sectionStyle(inView, isMobile)}>
        <SectionHeader label="idiomas" title="Idiomas" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
          {data.map((lang) =>
          <div key={lang.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 16, color: '#e2eaf4' }}>{lang.name}</span>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#5a6a80' }}>{lang.level}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: animated ? `${lang.percent}%` : '0%', background: `linear-gradient(90deg,${A},${A2})`, borderRadius: 2, transition: 'width 1s ease', boxShadow: `0 0 8px ${A}88` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

};

// ── Experience ────────────────────────────────────────────────────────────────
const ExperienceSection = ({ data }) => {
  const [ref, inView] = useInView();
  const isMobile = useWindowWidth() < 768;
  return (
    <div ref={ref} id="experience" style={{ background: 'rgba(12,16,32,0.6)' }}>
      <div style={sectionStyle(inView, isMobile)}>
        <SectionHeader label="experiencia" title="Trayectoria Profesional" />
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom,${A},${A2},transparent)` }} />
          {data.map((exp, i) =>
          <div key={exp.id} style={{ display: 'flex', gap: 40, marginBottom: 48, position: 'relative' }}>
              <div style={{ position: 'relative', flexShrink: 0, width: 30 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: A, border: `2px solid #060912`, boxShadow: `0 0 12px ${A}`, marginTop: 6, marginLeft: 8 }} />
              </div>
              <div style={{ flex: 1, background: '#0c1020', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 28, transition: 'border-color 0.2s,transform 0.2s' }}
            onMouseEnter={(e) => {e.currentTarget.style.borderColor = `${A}33`;e.currentTarget.style.transform = 'translateX(4px)';}}
            onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';e.currentTarget.style.transform = 'none';}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: 20, color: '#e2eaf4' }}>{exp.role}</div>
                    <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: A2, marginTop: 2 }}>{exp.company}</div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#5a6a80', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: '4px 10px', whiteSpace: 'nowrap' }}>{exp.period}</div>
                </div>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: '#7a8fa8', lineHeight: 1.7, margin: '10px 0 16px' }}>{exp.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {exp.tags.map((t) =>
                <span key={t} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: A, background: `${A}15`, border: `1px solid ${A}30`, borderRadius: 3, padding: '3px 9px' }}>{t}</span>
                )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

};

// ── PDF Thumbnail ─────────────────────────────────────────────────────────────
const PDFThumb = ({ pdfData, thumbPage = 0 }) => {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!pdfData || !window.pdfjsLib) return;
    let cancelled = false;
    setReady(false);
    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfData).promise;
        const pageNum = Math.min(thumbPage + 1, pdf.numPages);
        const page = await pdf.getPage(pageNum);
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const containerW = canvas.parentElement?.offsetWidth || 280;
        const viewport = page.getViewport({ scale: 1 });
        const scale = containerW / viewport.width;
        const vp = page.getViewport({ scale });
        canvas.width = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
        if (!cancelled) setReady(true);
      } catch (e) {}
    })();
    return () => {cancelled = true;};
  }, [pdfData, thumbPage]);
  return (
    <div style={{ width: '100%', minHeight: 120, background: '#070c14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {!ready &&
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#3a4a5a' }}>Cargando PDF...</div>
      }
      <canvas ref={canvasRef} style={{ width: '100%', display: ready ? 'block' : 'none' }} />
    </div>);

};

// ── PDF Viewer (canvas-based via PDF.js, sin iframe) ──────────────────────────
const PDFViewer = ({ pdfData, initialPage = 0 }) => {
  const [pages, setPages] = useState([]);
  const [current, setCurrent] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!pdfData || !window.pdfjsLib) return;
    let cancelled = false;
    setLoading(true);
    setPages([]);
    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfData).promise;
        if (cancelled) return;
        const imgs = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          if (cancelled) return;
          const viewport = page.getViewport({ scale: 1.6 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
          imgs.push(canvas.toDataURL('image/jpeg', 0.92));
        }
        if (!cancelled) {setPages(imgs);setLoading(false);}
      } catch (e) {
        if (!cancelled) {setError(true);setLoading(false);}
      }
    })();
    return () => {cancelled = true;};
  }, [pdfData]);

  useEffect(() => {
    if (pages.length > 0) setCurrent(Math.min(initialPage, pages.length - 1));
  }, [pages, initialPage]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#3a4a5a' }}>
      Renderizando PDF...
    </div>);

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: A }}>
      Error al cargar el PDF
    </div>);


  const total = pages.length;
  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(total - 1, c + 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Page image */}
      <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
        {pages[current] &&
        <img src={pages[current]} alt={`Página ${current + 1}`}
        style={{ width: '100%', display: 'block', borderRadius: 6 }} />
        }
      </div>
      {/* Navigator */}
      {total > 1 &&
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '10px 0 6px', flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
          <button onClick={prev} disabled={current === 0}
        style={{ width: 32, height: 32, borderRadius: 6, background: current === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: current === 0 ? '#2e3a4a' : '#e2eaf4', fontSize: 16, cursor: current === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>‹</button>
          {/* Page pills */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {pages.map((_, i) =>
          <button key={i} onClick={() => setCurrent(i)}
          style={{ width: i === current ? 28 : 8, height: 8, borderRadius: 4, background: i === current ? A : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.25s', boxShadow: i === current ? `0 0 8px ${A}88` : 'none' }} />
          )}
          </div>
          <button onClick={next} disabled={current === total - 1}
        style={{ width: 32, height: 32, borderRadius: 6, background: current === total - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: current === total - 1 ? '#2e3a4a' : '#e2eaf4', fontSize: 16, cursor: current === total - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>›</button>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#5a6a80', position: 'absolute', right: 44 }}>{current + 1} / {total}</span>
        </div>
      }
    </div>);

};

// ── Certificate Modal ─────────────────────────────────────────────────────────
const CertificateModal = ({ cert, onClose }) => {
  const badgeColors = { AWS: '#f59e0b', CEH: A, TF: '#22c55e', CYB: A2 };
  const bc = badgeColors[cert.badge] || A;
  const pdfSrc = cert.pdfUrl || cert.pdfData || ""; const hasPdf = !!pdfSrc;
  useEffect(() => {
    const fn = (e) => {if (e.key === 'Escape') onClose();};
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => {window.removeEventListener('keydown', fn);document.body.style.overflow = '';};
  }, []);

  const downloadPdf = () => {
    const a = document.createElement('a');
    a.href = pdfSrc;
    a.download = `${cert.title.replace(/\s+/g, '-')}.pdf`;
    a.click();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.25s ease' }}
    onClick={(e) => {if (e.target === e.currentTarget) onClose();}}>
      <div style={{ width: '80vw', maxWidth: 860, maxHeight: '90vh', background: '#0c1020', border: `1px solid ${bc}33`, borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease', boxShadow: `0 0 80px ${bc}22` }}>
        {/* Header stripe */}
        <div style={{ height: 5, background: `linear-gradient(90deg,${bc},${bc}44)`, flexShrink: 0 }} />

        {/* Certificate info header */}
        <div style={{ padding: '28px 36px 24px', position: 'relative', overflow: 'hidden', flexShrink: 0, background: hasPdf ? 'transparent' : 'none' }}>
          {!hasPdf && <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${bc}06 1px,transparent 1px),linear-gradient(90deg,${bc}06 1px,transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />}
          {!hasPdf && <>
            <svg style={{ position: 'absolute', top: 16, left: 16 }} width="36" height="36" viewBox="0 0 40 40" fill="none"><path d="M0 40 L0 0 L40 0" stroke={bc} strokeWidth="1.5" opacity="0.35" /></svg>
            <svg style={{ position: 'absolute', top: 16, right: 16 }} width="36" height="36" viewBox="0 0 40 40" fill="none"><path d="M40 40 L40 0 L0 0" stroke={bc} strokeWidth="1.5" opacity="0.35" /></svg>
          </>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}>
            <div style={{ width: 64, height: 64, borderRadius: 14, background: `${bc}18`, border: `2px solid ${bc}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 30px ${bc}28` }}>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 16, fontWeight: 700, color: bc }}>{cert.badge}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: bc, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 6 }}>Certificado de Logro</div>
              <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 22, fontWeight: 700, color: '#e2eaf4', lineHeight: 1.2, margin: '0 0 6px' }}>{cert.title}</h2>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#8b9ab0' }}>
                {cert.issuer} <span style={{ color: '#3a4a5a', margin: '0 6px' }}>·</span>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#5a6a80' }}>{cert.date}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#6b7a95', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
          </div>

          {/* Decorative certificate (no PDF) */}
          {!hasPdf &&
          <div style={{ marginTop: 28, textAlign: 'center' }}>
              <div style={{ width: 80, height: 1, background: `linear-gradient(90deg,transparent,${bc},transparent)`, margin: '0 auto 20px' }} />
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: '#5a6a80', fontStyle: 'italic' }}>
                No hay certificado PDF adjunto. Puedes agregar uno desde el panel Admin.
              </div>
            </div>
          }
        </div>

        {/* PDF Viewer */}
        {hasPdf &&
        <div style={{ flex: 1, minHeight: 0, padding: '0 36px 4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', minHeight: 460, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              <PDFViewer pdfData={pdfSrc} initialPage={cert.pdfThumbPage || 0} />
            </div>
          </div>
        }

        {/* Footer */}
        <div style={{ padding: '18px 36px 24px', display: 'flex', gap: 10, borderTop: `1px solid ${bc}14`, flexShrink: 0, flexWrap: 'wrap' }}>
          {cert.url &&
          <a href={cert.url} target="_blank" rel="noreferrer"
          style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 13, color: '#060912', background: bc, borderRadius: 6, padding: '9px 22px', textDecoration: 'none', boxShadow: `0 0 16px ${bc}44`, transition: 'all 0.2s', display: 'inline-block' }}>Ver Credencial →</a>
          }
          {hasPdf &&
          <button onClick={downloadPdf}
          style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 13, color: bc, background: `${bc}15`, border: `1px solid ${bc}40`, borderRadius: 6, padding: '9px 22px', cursor: 'pointer', transition: 'all 0.2s' }}>⬇ Descargar PDF</button>
          }
          <button onClick={onClose}
          style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 13, color: '#6b7a95', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '9px 22px', cursor: 'pointer', transition: 'all 0.2s' }}>Cerrar</button>
        </div>
      </div>
    </div>);

};

// ── Certificates ──────────────────────────────────────────────────────────────
// ── Carousel ──────────────────────────────────────────────────────────────────
const Carousel = ({ children, cardWidth = 300 }) => {
  const trackRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const count = React.Children.count(children);
  const visible = Math.max(1, Math.floor((typeof window !== 'undefined' ? window.innerWidth * 0.85 : 900) / (cardWidth + 20)));
  const max = Math.max(0, count - visible);
  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(max, i + 1));
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${idx * (cardWidth + 20)}px)`;
    }
  }, [idx, cardWidth]);
  return (
    <div style={{ position: 'relative' }}>
      {/* Arrows */}
      {idx > 0 && (
        <button onClick={prev} style={{ position:'absolute',left:-20,top:'50%',transform:'translateY(-50%)',zIndex:10,width:40,height:40,borderRadius:'50%',background:'#0c1020',border:`1px solid rgba(255,255,255,0.12)`,color:'#e2eaf4',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px rgba(0,0,0,0.4)',transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=`${A}88`;e.currentTarget.style.color=A;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';e.currentTarget.style.color='#e2eaf4';}}>‹</button>
      )}
      {idx < max && (
        <button onClick={next} style={{ position:'absolute',right:-20,top:'50%',transform:'translateY(-50%)',zIndex:10,width:40,height:40,borderRadius:'50%',background:'#0c1020',border:`1px solid rgba(255,255,255,0.12)`,color:'#e2eaf4',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px rgba(0,0,0,0.4)',transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=`${A}88`;e.currentTarget.style.color=A;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';e.currentTarget.style.color='#e2eaf4';}}>›</button>
      )}
      {/* Track */}
      <div style={{ overflow:'hidden', padding:'8px 4px 16px' }}>
        <div ref={trackRef} style={{ display:'flex', gap:20, transition:'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)', willChange:'transform' }}>
          {React.Children.map(children, child => (
            <div style={{ minWidth:cardWidth, maxWidth:cardWidth, flexShrink:0 }}>{child}</div>
          ))}
        </div>
      </div>
      {/* Dots */}
      {count > visible && (
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:4 }}>
          {Array.from({ length: max + 1 }).map((_, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{ width: i===idx ? 20 : 6, height:6, borderRadius:3, background: i===idx ? A : 'rgba(255,255,255,0.15)', cursor:'pointer', transition:'all 0.3s' }} />
          ))}
        </div>
      )}
    </div>
  );
};

const CertificatesSection = ({ data }) => {
  const [ref, inView] = useInView();
  const isMobile = useWindowWidth() < 768;
  const [selected, setSelected] = useState(null);
  const badgeColors = { AWS: '#f59e0b', CEH: A, TF: '#22c55e', CYB: A2 };
  return (
    <div ref={ref} id="certificates">
      <div style={sectionStyle(inView, isMobile)}>
        <SectionHeader label="certificaciones" title="Certificados & Diplomados" />
        <Carousel cardWidth={280}>
          {data.map((cert) => {
            const bc = badgeColors[cert.badge] || A;
            const pdfSrc = cert.pdfUrl || cert.pdfData || "";
            return (
              <div key={cert.id}
              style={{ background: '#0c1020', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', transition: 'all 0.25s', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
              onMouseEnter={(e) => {e.currentTarget.style.borderColor = `${bc}55`;e.currentTarget.style.transform = 'translateY(-4px)';e.currentTarget.style.boxShadow = `0 12px 36px ${bc}1a`;}}
              onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';e.currentTarget.style.transform = 'none';e.currentTarget.style.boxShadow = 'none';}}
              onClick={() => setSelected(cert)}>
                {pdfSrc ?
                  <div style={{ height: 160, overflow: 'hidden', position: 'relative', background: '#070c14', flexShrink: 0 }}>
                    <PDFThumb pdfData={pdfSrc} thumbPage={cert.pdfThumbPage || 0} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 55%,#0c1020)' }} />
                    <div style={{ position: 'absolute', top: 10, right: 10, background: `${bc}22`, border: `1px solid ${bc}55`, borderRadius: 5, padding: '3px 8px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, color: bc, backdropFilter: 'blur(4px)' }}>{cert.badge}</div>
                  </div>
                :
                  <div style={{ height: 8, background: `linear-gradient(90deg,${bc},${bc}44)`, flexShrink: 0 }} />
                }
                <div style={{ padding: 20, display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1 }}>
                  {!pdfSrc &&
                    <div style={{ width: 46, height: 46, borderRadius: 10, background: `${bc}18`, border: `1px solid ${bc}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, fontWeight: 700, color: bc, boxShadow: `0 0 14px ${bc}22` }}>
                      {cert.badge}
                    </div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 15, color: '#e2eaf4', lineHeight: 1.3, marginBottom: 5 }}>{cert.title}</div>
                    <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#5a6a80', marginBottom: 6 }}>{cert.issuer}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: `${bc}cc` }}>{cert.date}</div>
                      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#3a4a5a' }}>ver →</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>
      {selected && <CertificateModal cert={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};



// ── Project Modal ─────────────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.25s ease' }}
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: '80vw', maxWidth: 900, maxHeight: '85vh', background: '#0c1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease', boxShadow: `0 0 80px ${A}22` }}>
        <div style={{ height: 240, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
          {project.image ?
            <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
            <ProjectPlaceholder project={project} />
          }
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 60%,#0c1020)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2eaf4', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>×</button>
        </div>
        <div style={{ padding: 36, overflow: 'auto', flex: 1 }}>
          <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 28, fontWeight: 700, color: '#e2eaf4', margin: '0 0 12px' }}>{project.title}</h3>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 16, color: '#8b9ab0', lineHeight: 1.75, margin: '0 0 24px' }}>{project.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
            {project.tags.map((t) =>
              <span key={t} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: A, background: `${A}15`, border: `1px solid ${A}30`, borderRadius: 4, padding: '5px 12px' }}>{t}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {project.github && <a href={project.github} target="_blank" rel="noreferrer" style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 14, color: '#e2eaf4', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '10px 20px', textDecoration: 'none', transition: 'all 0.2s' }}>GitHub →</a>}
            {project.url && <a href={project.url} target="_blank" rel="noreferrer" style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 14, color: '#060912', background: A, borderRadius: 6, padding: '10px 20px', textDecoration: 'none', transition: 'all 0.2s', boxShadow: `0 0 16px ${A}44` }}>Ver Demo →</a>}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = ({ data, onExpand }) => {
  const [ref, inView] = useInView();
  const isMobile = useWindowWidth() < 768;
  return (
    <div ref={ref} id="projects" style={{ background: 'rgba(12,16,32,0.6)' }}>
      <div style={sectionStyle(inView, isMobile)}>
        <SectionHeader label="proyectos" title="Proyectos Destacados" />
        <Carousel cardWidth={320}>
          {data.map((proj) =>
          <div key={proj.id} style={{ background: '#0c1020', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s', display: 'flex', flexDirection: 'column', height: '100%' }}
          onMouseEnter={(e) => {e.currentTarget.style.borderColor = `${A}44`;e.currentTarget.style.transform = 'translateY(-5px)';e.currentTarget.style.boxShadow = `0 16px 40px ${A}18`;}}
          onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';e.currentTarget.style.transform = 'none';e.currentTarget.style.boxShadow = 'none';}}
          onClick={() => onExpand(proj)}>
              <div style={{ height: 180, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                {proj.image ?
              <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
              <ProjectPlaceholder project={proj} />
              }
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to bottom,transparent,#0c1020)' }} />
              </div>
              <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: 18, color: '#e2eaf4', marginBottom: 10 }}>{proj.title}</div>
                <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#6b7a95', lineHeight: 1.65, flex: 1, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{proj.description}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {proj.tags.map((t) => <span key={t} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: A2, background: `${A2}12`, border: `1px solid ${A2}25`, borderRadius: 3, padding: '3px 8px' }}>{t}</span>)}
                </div>
              </div>
            </div>
          )}
        </Carousel>
      </div>
    </div>);

};

// ── Contact ───────────────────────────────────────────────────────────────────
const ServicesSection = () => {
  const [ref, inView] = useInView();
  const isMobile = useWindowWidth() < 768;
  const services = [
    { icon: '🤖', title: 'Desarrollo con IA', desc: 'Integración de modelos de lenguaje, automatización inteligente y soluciones con LLMs para productos y flujos de trabajo.', tags: ['LangChain', 'OpenAI API', 'Prompt Engineering'] },
    { icon: '🔒', title: 'Ciberseguridad', desc: 'Auditorías de seguridad, pentesting de aplicaciones web, análisis de vulnerabilidades y hardening de sistemas.', tags: ['Pentesting', 'OWASP', 'Burp Suite'] },
    { icon: '⚙️', title: 'Backend & APIs', desc: 'Diseño e implementación de APIs RESTful y microservicios escalables con buenas prácticas de arquitectura.', tags: ['Python', 'FastAPI', 'Docker'] },
    { icon: '📊', title: 'Machine Learning', desc: 'Entrenamiento, evaluación y despliegue de modelos de ML/DL para clasificación, NLP y análisis de datos.', tags: ['TensorFlow', 'PyTorch', 'Scikit-learn'] },
    { icon: '🌐', title: 'Desarrollo Web', desc: 'Creación de sitios y aplicaciones web modernas, responsivas y de alto rendimiento con React y tecnologías actuales.', tags: ['React', 'HTML/CSS', 'TypeScript'] },
    { icon: '🧠', title: 'Consultoría Técnica', desc: 'Asesoría en arquitectura de software, revisión de código, selección de stack tecnológico y buenas prácticas.', tags: ['Arquitectura', 'Code Review', 'Tech Stack'] },
  ];
  return (
    <div ref={ref} id="services" style={{ background: 'rgba(8,12,24,0.8)' }}>
      <div style={sectionStyle(inView, isMobile)}>
        <SectionHeader label="servicios" title="¿En qué puedo ayudarte?" />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
          {services.map((s, i) => (
            <div key={i} style={{ background: '#0c1020', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 28, transition: 'all 0.25s', cursor: 'default' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${A}44`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 36px ${A}15`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: 17, color: '#e2eaf4', marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#6b7a95', lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {s.tags.map(t => <span key={t} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: A2, background: `${A2}10`, border: `1px solid ${A2}25`, borderRadius: 3, padding: '2px 8px' }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="https://wa.me/51950087974" target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: 16, color: '#060912', background: A, borderRadius: 8, padding: '14px 36px', textDecoration: 'none', boxShadow: `0 0 30px ${A}44`, transition: 'all 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
            Contáctame por WhatsApp →
          </a>
        </div>
      </div>
    </div>
  );
};

const ContactSection = ({ data }) => {
  const [ref, inView] = useInView();
  const isMobile = useWindowWidth() < 768;
  const socials = [
    data.github && { href: data.github, label: 'GitHub', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" /></svg> },
    data.linkedin && { href: data.linkedin, label: 'LinkedIn', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
    { href: 'https://wa.me/51950087974', label: 'WhatsApp', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
    { href: 'https://www.instagram.com/j.an.sa_cha', label: 'Instagram', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  ].filter(Boolean);

  return (
    <div ref={ref} id="contact">
      <div style={{ ...sectionStyle(inView, isMobile), textAlign: 'center' }}>
        <SectionHeader label="contacto" title="Hablemos" />
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 18, color: '#7a8fa8', lineHeight: 1.75, marginBottom: 40 }}>{data.message}</p>
          <a href={`mailto:${data.email}`}
          style={{ display: 'inline-block', fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: isMobile ? 15 : 18, color: '#060912', background: A, borderRadius: 8, padding: isMobile ? '13px 24px' : '16px 40px', textDecoration: 'none', marginBottom: 48, boxShadow: `0 0 30px ${A}55`, transition: 'all 0.2s', wordBreak: 'break-all' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>{data.email}</a>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: isMobile ? 10 : 16 }}>
            {socials.map(s => <SocialBtn key={s.label} href={s.href} label={s.label} icon={s.icon} isMobile={isMobile} />)}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: isMobile ? '20px 5%' : '24px 5%', borderTop: '1px solid rgba(255,255,255,0.05)', fontFamily: 'JetBrains Mono,monospace', fontSize: isMobile ? 10 : 12, color: '#2e3a4a' }}>
        © {new Date().getFullYear()} Jesus Angel Saenz Chang — Todos los derechos reservados
      </div>
    </div>
  );
};


const SocialBtn = ({ href, label, icon, isMobile }) =>
<a href={href} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Space Grotesk,sans-serif', fontSize: isMobile ? 13 : 14, fontWeight: 600, color: '#8b9ab0', background: '#0c1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: isMobile ? '10px 14px' : '12px 22px', textDecoration: 'none', transition: 'all 0.2s' }}
onMouseEnter={(e) => {e.currentTarget.style.color = '#e2eaf4';e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';e.currentTarget.style.transform = 'translateY(-2px)';}}
onMouseLeave={(e) => {e.currentTarget.style.color = '#8b9ab0';e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';e.currentTarget.style.transform = 'none';}}>
    {icon}{label}
  </a>;


// ── Combined: Skills + Education + Languages ──────────────────────────────────
const TechSection = ({ skills, education, languages }) => {
  const isMobile = useWindowWidth() < 900;
  const [ref, inView] = useInView();
  const catColors = [A, A2, '#a855f7', '#f59e0b'];
  const [animated, setAnimated] = useState(false);
  useEffect(() => {if (inView) setTimeout(() => setAnimated(true), 300);}, [inView]);

  return (
    <div ref={ref} id="skills">
      <div style={sectionStyle(inView, isMobile)}>
        <SectionHeader label="perfil técnico" title="Stack & Formación" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>

          {/* LEFT: Skills full height */}
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: A, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>// Stack Tecnológico</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {skills.map((cat, ci) =>
              <div key={cat.id} style={{ background: '#0c1020', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 22, transition: 'border-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = `${catColors[ci % catColors.length]}44`}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                  <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: catColors[ci % catColors.length], letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>{cat.category}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {cat.items.map((item) =>
                  <span key={item} style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#9aaccb', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '4px 11px' }}>{item}</span>
                  )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Education + Languages stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Education */}
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: A2, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>// Formación Académica</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {education.map((ed) =>
                <div key={ed.id} style={{ display: 'flex', gap: 16, background: '#0c1020', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, alignItems: 'flex-start' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 9, background: `${A2}18`, border: `1px solid ${A2}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={A2} strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 15, color: '#e2eaf4', marginBottom: 3 }}>{ed.degree}</div>
                      <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: A2, marginBottom: 4 }}>{ed.institution}</div>
                      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#5a6a80' }}>{ed.period}</div>
                      {ed.description && <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#6b7a95', lineHeight: 1.6, marginTop: 8 }}>{ed.description}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#a855f7', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>// Idiomas</div>
              <div style={{ background: '#0c1020', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
                {languages.map((lang) =>
                <div key={lang.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: 15, color: '#e2eaf4' }}>{lang.name}</span>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#5a6a80' }}>{lang.level}</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: animated ? `${lang.percent}%` : '0%', background: `linear-gradient(90deg,${A},${A2})`, borderRadius: 2, transition: 'width 1.1s ease', boxShadow: `0 0 8px ${A}66` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>);

};

Object.assign(window, { Nav, HeroSection, AboutSection, SkillsSection, EducationSection, LanguagesSection, TechSection, ExperienceSection, CertificatesSection, CertificateModal, ProjectsSection, ProjectModal, ServicesSection, ContactSection });