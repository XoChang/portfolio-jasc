const { useState, useEffect } = React;
const A = '#ff4d6d', A2 = '#00d4ff';

// ── Shared admin input styles ─────────────────────────────────────────────────
const inp = { fontFamily:'Inter,sans-serif',fontSize:14,color:'#e2eaf4',background:'#0a0f1e',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 13px',width:'100%',boxSizing:'border-box',outline:'none',transition:'border-color 0.2s' };
const label = { fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#5a6a80',letterSpacing:'0.12em',textTransform:'uppercase',display:'block',marginBottom:6 };
const Inp = ({ lbl, ...props }) => (
  <div style={{ marginBottom:16 }}>
    {lbl && <span style={label}>{lbl}</span>}
    <input style={inp} {...props}
      onFocus={e => e.target.style.borderColor=`${A}88`}
      onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
  </div>
);
const Textarea = ({ lbl, ...props }) => (
  <div style={{ marginBottom:16 }}>
    {lbl && <span style={label}>{lbl}</span>}
    <textarea style={{ ...inp,resize:'vertical',minHeight:90 }} {...props}
      onFocus={e => e.target.style.borderColor=`${A}88`}
      onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
  </div>
);
const Toggle = ({ lbl, checked, onChange }) => (
  <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:16 }}>
    <span style={label}>{lbl}</span>
    <div onClick={() => onChange(!checked)} style={{ width:44,height:24,borderRadius:12,background:checked?A:'rgba(255,255,255,0.1)',cursor:'pointer',position:'relative',transition:'background 0.2s' }}>
      <div style={{ width:18,height:18,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:checked?23:3,transition:'left 0.2s' }}/>
    </div>
  </div>
);
const AddBtn = ({ onClick, text='Agregar' }) => (
  <button onClick={onClick} style={{ fontFamily:'JetBrains Mono,monospace',fontSize:12,color:A,background:`${A}15`,border:`1px dashed ${A}55`,borderRadius:6,padding:'8px 18px',cursor:'pointer',width:'100%',transition:'all 0.2s' }}
    onMouseEnter={e => { e.currentTarget.style.background=`${A}25`; e.currentTarget.style.borderColor=`${A}99`; }}
    onMouseLeave={e => { e.currentTarget.style.background=`${A}15`; e.currentTarget.style.borderColor=`${A}55`; }}>+ {text}</button>
);
const RemBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#5a6a80',background:'transparent',border:'1px solid rgba(255,255,255,0.08)',borderRadius:4,padding:'3px 10px',cursor:'pointer',flexShrink:0 }}
    onMouseEnter={e => { e.currentTarget.style.color=A; e.currentTarget.style.borderColor=A; }}
    onMouseLeave={e => { e.currentTarget.style.color='#5a6a80'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}>✕</button>
);

// ── File Upload Component (Supabase Storage) ──────────────────────────────────
const FileUpload = ({ label: lbl, value, onChange, accept='.pdf,.jpg,.jpeg,.png', bucket='portfolio-files', hint='' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Limpiar el input para permitir re-subir el mismo archivo
    e.target.value = '';
    setUploading(true);
    setError('');
    try {
      const result = await window.uploadFile(file, bucket, file.name.replace(/\.[^.]+$/, ''));
      onChange(result.url);
      if (result.isBase64) setError('⚠ Supabase no configurado — guardado temporalmente en base64');
    } catch(err) {
      setError(`✕ Error: ${err.message || 'No se pudo subir el archivo. Verifica los permisos del bucket en Supabase.'}`);
    }
    setUploading(false);
  };

  const isImage = value && (value.includes('.jpg') || value.includes('.jpeg') || value.includes('.png') || value.startsWith('data:image'));
  const isPDF = value && (value.includes('.pdf') || value.startsWith('data:application/pdf'));

  return (
    <div style={{ marginBottom:16 }}>
      <span style={label}>{lbl}</span>
      {hint && <div style={{ fontFamily:'Inter,sans-serif',fontSize:11,color:'#3a4a5a',marginBottom:8 }}>{hint}</div>}
      {value ? (
        <div>
          {isImage && <img src={value} alt="preview" style={{ width:'100%',maxHeight:120,objectFit:'cover',borderRadius:6,marginBottom:8,border:'1px solid rgba(255,255,255,0.1)' }}/>}
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ flex:1,background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:6,padding:'8px 12px',fontFamily:'JetBrains Mono,monospace',fontSize:12,color:'#22c55e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
              {isPDF ? '📄 PDF cargado' : isImage ? '🖼 Imagen cargada' : '✓ Archivo cargado'}
            </div>
            <button onClick={() => onChange('')} style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:A,background:`${A}10`,border:`1px solid ${A}30`,borderRadius:5,padding:'8px 12px',cursor:'pointer',flexShrink:0 }}>Eliminar</button>
          </div>
        </div>
      ) : (
        <label style={{ display:'block',background:'rgba(255,255,255,0.03)',border:`1px dashed ${uploading?A2:'rgba(255,255,255,0.12)'}`,borderRadius:6,padding:'16px',cursor:'pointer',textAlign:'center',fontFamily:'Inter,sans-serif',fontSize:13,color:uploading?A2:'#5a6a80',transition:'all 0.2s' }}>
          {uploading ? '⏳ Subiendo...' : `📎 Click para subir ${accept.includes('pdf') ? 'PDF / imagen' : 'imagen'}`}
          <input type="file" accept={accept} style={{ display:'none' }} disabled={uploading} onChange={handleFile}/>
        </label>
      )}
      {error && <div style={{ fontFamily:'Inter,sans-serif',fontSize:11,color:'#f59e0b',marginTop:6 }}>{error}</div>}
    </div>
  );
};

// ── Save Status Indicator ─────────────────────────────────────────────────────
const SaveStatus = ({ status }) => {
  const colors = { idle:'#3a4a5a', saving:'#f59e0b', saved:'#22c55e', error:A };
  const texts  = { idle:'● Esperando cambios', saving:'⟳ Guardando...', saved:'✓ Guardado en Supabase', error:'✕ Error al guardar' };
  return (
    <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:colors[status],transition:'color 0.3s' }}>
      {texts[status]}
    </div>
  );
};

// ── Tab: Perfil ───────────────────────────────────────────────────────────────
const TabPerfil = ({ data, onChange }) => {
  const h = data.hero;
  const u = (k, v) => onChange({ ...data, hero: { ...h, [k]: v } });
  return (
    <div>
      <Inp lbl="Nombre completo" value={h.name} onChange={e => u('name', e.target.value)}/>
      <Inp lbl="Título" value={h.title} onChange={e => u('title', e.target.value)}/>
      <Inp lbl="Subtítulo (separar con · )" value={h.subtitle} onChange={e => u('subtitle', e.target.value)}/>
      <Textarea lbl="Bio" value={h.bio} onChange={e => u('bio', e.target.value)}/>
      <Inp lbl="Ubicación" value={h.location} onChange={e => u('location', e.target.value)}/>
      <FileUpload
        label="Foto de perfil"
        value={h.photo}
        onChange={v => u('photo', v)}
        accept=".jpg,.jpeg,.png,.webp"
        bucket="portfolio-files"
        hint="Recomendado: cuadrada, mín. 400×400px"
      />
      <Toggle lbl="Disponible para proyectos" checked={h.available} onChange={v => u('available', v)}/>
    </div>
  );
};

// ── Tab: Sobre mí ─────────────────────────────────────────────────────────────
const TabAbout = ({ data, onChange }) => (
  <div>
    <Textarea lbl="Texto de presentación" value={data.about.text} onChange={e => onChange({ ...data, about: { text: e.target.value } })} style={{ minHeight:140 }}/>
  </div>
);

// ── Tab: Skills ───────────────────────────────────────────────────────────────
const TabSkills = ({ data, onChange }) => {
  const skills = data.skills;
  const setSkills = s => onChange({ ...data, skills: s });
  const addCat = () => setSkills([...skills, { id: Date.now(), category: 'Nueva Categoría', items: [] }]);
  const remCat = id => setSkills(skills.filter(c => c.id !== id));
  const updCat = (id, k, v) => setSkills(skills.map(c => c.id===id ? { ...c, [k]: v } : c));
  const addItem = (id) => {
    const val = prompt('Nombre del skill:');
    if (val) updCat(id, 'items', [...(skills.find(c=>c.id===id)?.items||[]), val]);
  };
  const remItem = (id, item) => updCat(id, 'items', skills.find(c=>c.id===id).items.filter(i=>i!==item));
  return (
    <div>
      {skills.map(cat => (
        <div key={cat.id} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:16,marginBottom:16 }}>
          <div style={{ display:'flex',gap:10,marginBottom:12 }}>
            <input value={cat.category} onChange={e => updCat(cat.id,'category',e.target.value)} style={{ ...inp,flex:1 }}
              onFocus={e => e.target.style.borderColor=`${A}88`} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
            <RemBtn onClick={() => remCat(cat.id)}/>
          </div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:6,marginBottom:10 }}>
            {cat.items.map(item => (
              <div key={item} style={{ display:'flex',alignItems:'center',gap:4,background:`${A}15`,border:`1px solid ${A}30`,borderRadius:4,padding:'3px 8px 3px 10px' }}>
                <span style={{ fontFamily:'Inter,sans-serif',fontSize:13,color:'#9aaccb' }}>{item}</span>
                <button onClick={() => remItem(cat.id, item)} style={{ background:'none',border:'none',color:'#5a6a80',cursor:'pointer',padding:'0 2px',fontSize:13,lineHeight:1 }}>×</button>
              </div>
            ))}
          </div>
          <button onClick={() => addItem(cat.id)} style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:A2,background:`${A2}12`,border:`1px solid ${A2}30`,borderRadius:4,padding:'4px 12px',cursor:'pointer' }}>+ skill</button>
        </div>
      ))}
      <AddBtn onClick={addCat} text="Agregar categoría"/>
    </div>
  );
};

// ── Tab: Educación ────────────────────────────────────────────────────────────
const TabEducation = ({ data, onChange }) => {
  const items = data.education;
  const set = v => onChange({ ...data, education: v });
  const add = () => set([...items, { id: Date.now(), degree:'', institution:'', period:'', description:'' }]);
  const rem = id => set(items.filter(x => x.id !== id));
  const upd = (id, k, v) => set(items.map(x => x.id===id ? { ...x, [k]: v } : x));
  return (
    <div>
      {items.map(ed => (
        <div key={ed.id} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:16,marginBottom:16 }}>
          <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:8 }}><RemBtn onClick={() => rem(ed.id)}/></div>
          <Inp lbl="Título / Grado" value={ed.degree} onChange={e => upd(ed.id,'degree',e.target.value)}/>
          <Inp lbl="Institución" value={ed.institution} onChange={e => upd(ed.id,'institution',e.target.value)}/>
          <Inp lbl="Periodo" value={ed.period} onChange={e => upd(ed.id,'period',e.target.value)}/>
          <Textarea lbl="Descripción" value={ed.description} onChange={e => upd(ed.id,'description',e.target.value)}/>
        </div>
      ))}
      <AddBtn onClick={add} text="Agregar educación"/>
    </div>
  );
};

// ── Tab: Idiomas ──────────────────────────────────────────────────────────────
const TabLanguages = ({ data, onChange }) => {
  const items = data.languages;
  const set = v => onChange({ ...data, languages: v });
  const add = () => set([...items, { id: Date.now(), name:'', level:'', percent:50 }]);
  const rem = id => set(items.filter(x => x.id !== id));
  const upd = (id, k, v) => set(items.map(x => x.id===id ? { ...x, [k]: v } : x));
  return (
    <div>
      {items.map(lang => (
        <div key={lang.id} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:16,marginBottom:16 }}>
          <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:8 }}><RemBtn onClick={() => rem(lang.id)}/></div>
          <Inp lbl="Idioma" value={lang.name} onChange={e => upd(lang.id,'name',e.target.value)}/>
          <Inp lbl="Nivel (ej: Avanzado B2)" value={lang.level} onChange={e => upd(lang.id,'level',e.target.value)}/>
          <div style={{ marginBottom:16 }}>
            <span style={label}>Porcentaje: {lang.percent}%</span>
            <input type="range" min={0} max={100} value={lang.percent} onChange={e => upd(lang.id,'percent',+e.target.value)} style={{ width:'100%',accentColor:A }}/>
          </div>
        </div>
      ))}
      <AddBtn onClick={add} text="Agregar idioma"/>
    </div>
  );
};

// ── Tab: Experiencia ──────────────────────────────────────────────────────────
const TabExperience = ({ data, onChange }) => {
  const items = data.experience;
  const set = v => onChange({ ...data, experience: v });
  const add = () => set([...items, { id: Date.now(), role:'', company:'', period:'', description:'', tags:[] }]);
  const rem = id => set(items.filter(x => x.id !== id));
  const upd = (id, k, v) => set(items.map(x => x.id===id ? { ...x, [k]: v } : x));
  const addTag = (id) => { const val = prompt('Tag:'); if (val) upd(id, 'tags', [...(items.find(x=>x.id===id)?.tags||[]), val]); };
  const remTag = (id, t) => upd(id, 'tags', items.find(x=>x.id===id).tags.filter(x=>x!==t));
  return (
    <div>
      {items.map(exp => (
        <div key={exp.id} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:16,marginBottom:16 }}>
          <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:8 }}><RemBtn onClick={() => rem(exp.id)}/></div>
          <Inp lbl="Rol / Cargo" value={exp.role} onChange={e => upd(exp.id,'role',e.target.value)}/>
          <Inp lbl="Empresa" value={exp.company} onChange={e => upd(exp.id,'company',e.target.value)}/>
          <Inp lbl="Periodo" value={exp.period} onChange={e => upd(exp.id,'period',e.target.value)}/>
          <Textarea lbl="Descripción" value={exp.description} onChange={e => upd(exp.id,'description',e.target.value)}/>
          <div style={{ marginBottom:8 }}>
            <span style={label}>Tags</span>
            <div style={{ display:'flex',flexWrap:'wrap',gap:6,marginBottom:8 }}>
              {exp.tags.map(t => (
                <div key={t} style={{ display:'flex',alignItems:'center',gap:4,background:`${A}15`,border:`1px solid ${A}30`,borderRadius:4,padding:'3px 8px 3px 10px' }}>
                  <span style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:A }}>{t}</span>
                  <button onClick={() => remTag(exp.id,t)} style={{ background:'none',border:'none',color:'#5a6a80',cursor:'pointer',padding:'0 2px',fontSize:12 }}>×</button>
                </div>
              ))}
              <button onClick={() => addTag(exp.id)} style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:A2,background:`${A2}12`,border:`1px solid ${A2}30`,borderRadius:4,padding:'3px 10px',cursor:'pointer' }}>+ tag</button>
            </div>
          </div>
        </div>
      ))}
      <AddBtn onClick={add} text="Agregar experiencia"/>
    </div>
  );
};

// ── PDF Page Picker (admin) ────────────────────────────────────────────────────
const PDFPagePicker = ({ pdfData, selectedPage, onChange }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!pdfData || !window.pdfjsLib) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfData).promise;
        if (cancelled) return;
        const thumbs = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          if (cancelled) return;
          const viewport = page.getViewport({ scale: 0.4 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
          thumbs.push(canvas.toDataURL('image/jpeg', 0.8));
        }
        if (!cancelled) { setPages(thumbs); setLoading(false); }
      } catch(e) { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [pdfData]);
  if (loading) return <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#3a4a5a',padding:'8px 0' }}>Cargando páginas...</div>;
  if (pages.length <= 1) return null;
  return (
    <div style={{ marginBottom:16 }}>
      <span style={label}>Página de portada ({pages.length} páginas disponibles)</span>
      <div style={{ display:'flex',flexWrap:'wrap',gap:10 }}>
        {pages.map((src, i) => (
          <div key={i} onClick={() => onChange(i)}
            style={{ cursor:'pointer',borderRadius:6,overflow:'hidden',border: i===selectedPage ? `2px solid ${A}` : '2px solid rgba(255,255,255,0.08)',transition:'all 0.2s',position:'relative' }}>
            <img src={src} alt={`Pág. ${i+1}`} style={{ display:'block',width:80,height:'auto' }}/>
            <div style={{ position:'absolute',bottom:0,left:0,right:0,textAlign:'center',fontFamily:'JetBrains Mono,monospace',fontSize:10,color: i===selectedPage ? A : '#5a6a80',background:'rgba(0,0,0,0.6)',padding:'2px 0' }}>{i+1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Tab: Certificados ─────────────────────────────────────────────────────────
const TabCertificates = ({ data, onChange }) => {
  const items = data.certificates;
  const set = v => onChange({ ...data, certificates: v });
  const add = () => set([...items, { id: Date.now(), title:'', issuer:'', date:'', url:'', badge:'NEW', pdfUrl:'' }]);
  const rem = id => set(items.filter(x => x.id !== id));
  const upd = (id, k, v) => set(items.map(x => x.id===id ? { ...x, [k]: v } : x));
  return (
    <div>
      {items.map(cert => (
        <div key={cert.id} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:16,marginBottom:16 }}>
          <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:8 }}><RemBtn onClick={() => rem(cert.id)}/></div>
          <Inp lbl="Título del certificado" value={cert.title} onChange={e => upd(cert.id,'title',e.target.value)}/>
          <Inp lbl="Emisor" value={cert.issuer} onChange={e => upd(cert.id,'issuer',e.target.value)}/>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
            <Inp lbl="Año" value={cert.date} onChange={e => upd(cert.id,'date',e.target.value)}/>
            <Inp lbl="Badge (3-4 letras)" value={cert.badge} onChange={e => upd(cert.id,'badge',e.target.value)}/>
          </div>
          <Inp lbl="URL de verificación (opcional)" value={cert.url} onChange={e => upd(cert.id,'url',e.target.value)}/>
          <FileUpload
            label="Certificado PDF"
            value={cert.pdfUrl || cert.pdfData || ''}
            onChange={v => upd(cert.id, 'pdfUrl', v)}
            accept=".pdf"
            bucket="portfolio-files"
            hint="El PDF se sube a Supabase Storage y queda disponible para todos los visitantes"
          />
          {(cert.pdfUrl || cert.pdfData) && (
            <PDFPagePicker
              pdfData={cert.pdfUrl || cert.pdfData}
              selectedPage={cert.pdfThumbPage || 0}
              onChange={page => upd(cert.id, 'pdfThumbPage', page)}
            />
          )}
        </div>
      ))}
      <AddBtn onClick={add} text="Agregar certificado"/>
    </div>
  );
};

// ── Tab: Proyectos ────────────────────────────────────────────────────────────
const TabProjects = ({ data, onChange }) => {
  const items = data.projects;
  const set = v => onChange({ ...data, projects: v });
  const add = () => set([...items, { id: Date.now(), title:'', description:'', tags:[], image:'', url:'', github:'' }]);
  const rem = id => set(items.filter(x => x.id !== id));
  const upd = (id, k, v) => set(items.map(x => x.id===id ? { ...x, [k]: v } : x));
  const addTag = (id) => { const val = prompt('Tag:'); if (val) upd(id, 'tags', [...(items.find(x=>x.id===id)?.tags||[]), val]); };
  const remTag = (id, t) => upd(id, 'tags', items.find(x=>x.id===id).tags.filter(x=>x!==t));
  return (
    <div>
      {items.map(proj => (
        <div key={proj.id} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:16,marginBottom:16 }}>
          <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:8 }}><RemBtn onClick={() => rem(proj.id)}/></div>
          <Inp lbl="Nombre del proyecto" value={proj.title} onChange={e => upd(proj.id,'title',e.target.value)}/>
          <Textarea lbl="Descripción" value={proj.description} onChange={e => upd(proj.id,'description',e.target.value)}/>
          <FileUpload
            label="Imagen del proyecto"
            value={proj.image}
            onChange={v => upd(proj.id, 'image', v)}
            accept=".jpg,.jpeg,.png,.webp,.gif"
            bucket="portfolio-files"
            hint="Recomendado: 1200×630px"
          />
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
            <Inp lbl="URL del proyecto" value={proj.url} onChange={e => upd(proj.id,'url',e.target.value)}/>
            <Inp lbl="GitHub URL" value={proj.github} onChange={e => upd(proj.id,'github',e.target.value)}/>
          </div>
          <div style={{ marginBottom:8 }}>
            <span style={label}>Tags</span>
            <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
              {proj.tags.map(t => (
                <div key={t} style={{ display:'flex',alignItems:'center',gap:4,background:`${A2}12`,border:`1px solid ${A2}25`,borderRadius:4,padding:'3px 8px 3px 10px' }}>
                  <span style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:A2 }}>{t}</span>
                  <button onClick={() => remTag(proj.id,t)} style={{ background:'none',border:'none',color:'#5a6a80',cursor:'pointer',padding:'0 2px',fontSize:12 }}>×</button>
                </div>
              ))}
              <button onClick={() => addTag(proj.id)} style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:A,background:`${A}12`,border:`1px solid ${A}30`,borderRadius:4,padding:'3px 10px',cursor:'pointer' }}>+ tag</button>
            </div>
          </div>
        </div>
      ))}
      <AddBtn onClick={add} text="Agregar proyecto"/>
    </div>
  );
};

// ── Tab: Contacto ─────────────────────────────────────────────────────────────
const TabContact = ({ data, onChange }) => {
  const c = data.contact;
  const u = (k,v) => onChange({ ...data, contact: { ...c, [k]: v } });
  return (
    <div>
      <Inp lbl="Email" value={c.email} onChange={e => u('email',e.target.value)}/>
      <Inp lbl="GitHub URL" value={c.github} onChange={e => u('github',e.target.value)}/>
      <Inp lbl="LinkedIn URL" value={c.linkedin} onChange={e => u('linkedin',e.target.value)}/>
      <Textarea lbl="Mensaje de contacto" value={c.message} onChange={e => u('message',e.target.value)}/>
    </div>
  );
};

// ── Tab: Seguridad ────────────────────────────────────────────────────────────
const TabSecurity = ({ data, onChange }) => {
  const [cur, setCur] = useState('');
  const [newP, setNewP] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const save = () => {
    if (cur !== data.admin.password) { setMsg('Contraseña actual incorrecta'); return; }
    if (newP.length < 4) { setMsg('La nueva contraseña debe tener al menos 4 caracteres'); return; }
    if (newP !== confirm) { setMsg('Las contraseñas no coinciden'); return; }
    onChange({ ...data, admin: { password: newP } });
    setMsg('✓ Contraseña actualizada');
    setCur(''); setNewP(''); setConfirm('');
  };
  return (
    <div>
      <Inp lbl="Contraseña actual" type="password" value={cur} onChange={e => setCur(e.target.value)}/>
      <Inp lbl="Nueva contraseña" type="password" value={newP} onChange={e => setNewP(e.target.value)}/>
      <Inp lbl="Confirmar nueva contraseña" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}/>
      {msg && <div style={{ fontFamily:'Inter,sans-serif',fontSize:13,color:msg.startsWith('✓')?'#22c55e':A,marginBottom:16 }}>{msg}</div>}
      <button onClick={save} style={{ fontFamily:'Space Grotesk,sans-serif',fontWeight:600,fontSize:14,color:'#060912',background:A,border:'none',borderRadius:6,padding:'10px 24px',cursor:'pointer' }}>Cambiar contraseña</button>
    </div>
  );
};

// ── Tab: Supabase Config ──────────────────────────────────────────────────────
const TabSupabase = () => {
  const configured = window.SUPABASE_URL !== 'https://TU_PROYECTO.supabase.co';
  return (
    <div>
      <div style={{ padding:20,background: configured ? 'rgba(34,197,94,0.06)' : 'rgba(255,77,109,0.06)',border:`1px solid ${configured ? 'rgba(34,197,94,0.2)' : `${A}22`}`,borderRadius:10,marginBottom:20 }}>
        <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color: configured ? '#22c55e' : A,letterSpacing:'0.1em',marginBottom:6 }}>
          {configured ? '✓ SUPABASE CONECTADO' : '⚠ SUPABASE NO CONFIGURADO'}
        </div>
        <div style={{ fontFamily:'Inter,sans-serif',fontSize:13,color:'#6b7a95' }}>
          {configured
            ? 'Los datos y archivos se guardan en la nube. Todos los visitantes ven los mismos datos.'
            : 'Los datos se guardan en localStorage (solo tú los ves). Configura Supabase en portfolio-data.js para activar la nube.'}
        </div>
      </div>

      <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#5a6a80',letterSpacing:'0.1em',marginBottom:16 }}>// PASOS PARA CONFIGURAR</div>

      {[
        { n:1, t:'Crear proyecto en Supabase', d:'Ve a supabase.com → New Project → anota la URL y la anon key.' },
        { n:2, t:'Editar portfolio-data.js', d:'Reemplaza SUPABASE_URL y SUPABASE_ANON_KEY con tus valores reales.' },
        { n:3, t:'Crear tabla en Supabase', d:'En el SQL Editor de Supabase, ejecuta el SQL del archivo SUPABASE_SETUP.sql incluido.' },
        { n:4, t:'Crear storage buckets', d:'En Storage, crea un bucket llamado "portfolio-files" y ponlo en modo público.' },
        { n:5, t:'Publicar', d:'Sube todos los archivos a Netlify y listo. Las imágenes y PDFs se guardarán en Supabase.' },
      ].map(step => (
        <div key={step.n} style={{ display:'flex',gap:14,marginBottom:16 }}>
          <div style={{ width:28,height:28,borderRadius:'50%',background:`${A}20`,border:`1px solid ${A}50`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'JetBrains Mono,monospace',fontSize:12,color:A,flexShrink:0 }}>{step.n}</div>
          <div>
            <div style={{ fontFamily:'Space Grotesk,sans-serif',fontWeight:600,fontSize:14,color:'#e2eaf4',marginBottom:3 }}>{step.t}</div>
            <div style={{ fontFamily:'Inter,sans-serif',fontSize:13,color:'#6b7a95' }}>{step.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Admin Panel ───────────────────────────────────────────────────────────────
const AdminPanel = ({ data, onUpdate, onClose }) => {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('perfil');
  const [local, setLocal] = useState(data);
  const [saveStatus, setSaveStatus] = useState('idle');

  const login = () => {
    if (pw === data.admin.password) { setAuth(true); setErr(''); }
    else setErr('Contraseña incorrecta');
  };

  const update = async (d) => {
    setLocal(d);
    setSaveStatus('saving');
    try {
      await window.saveData(d);
      onUpdate(d);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch(e) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const tabs = [
    ['perfil','Perfil'], ['about','Sobre mí'], ['skills','Skills'],
    ['education','Educación'], ['languages','Idiomas'], ['experience','Experiencia'],
    ['certificates','Certificados'], ['projects','Proyectos'],
    ['contact','Contacto'], ['security','Seguridad'], ['supabase','☁ Supabase']
  ];

  const content = () => {
    if (tab==='perfil') return <TabPerfil data={local} onChange={update}/>;
    if (tab==='about') return <TabAbout data={local} onChange={update}/>;
    if (tab==='skills') return <TabSkills data={local} onChange={update}/>;
    if (tab==='education') return <TabEducation data={local} onChange={update}/>;
    if (tab==='languages') return <TabLanguages data={local} onChange={update}/>;
    if (tab==='experience') return <TabExperience data={local} onChange={update}/>;
    if (tab==='certificates') return <TabCertificates data={local} onChange={update}/>;
    if (tab==='projects') return <TabProjects data={local} onChange={update}/>;
    if (tab==='contact') return <TabContact data={local} onChange={update}/>;
    if (tab==='security') return <TabSecurity data={local} onChange={update}/>;
    if (tab==='supabase') return <TabSupabase/>;
  };

  if (!auth) return (
    <div style={{ position:'fixed',inset:0,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.9)',backdropFilter:'blur(12px)' }}>
      <div style={{ background:'#0c1020',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:48,width:360,boxShadow:`0 0 60px ${A}22` }}>
        <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:A,letterSpacing:'0.2em',marginBottom:8 }}>// ACCESO ADMIN</div>
        <h2 style={{ fontFamily:'Space Grotesk,sans-serif',fontSize:26,fontWeight:700,color:'#e2eaf4',margin:'0 0 28px' }}>Panel de Control</h2>
        <input type="password" placeholder="Contraseña" value={pw} onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key==='Enter' && login()}
          style={{ ...inp,marginBottom:err?8:16,fontSize:16 }}
          onFocus={e => e.target.style.borderColor=`${A}88`} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
        {err && <div style={{ fontFamily:'Inter,sans-serif',fontSize:13,color:A,marginBottom:12 }}>{err}</div>}
        <div style={{ display:'flex',gap:10 }}>
          <button onClick={login} style={{ flex:1,fontFamily:'Space Grotesk,sans-serif',fontWeight:700,fontSize:15,color:'#060912',background:A,border:'none',borderRadius:6,padding:'12px',cursor:'pointer',boxShadow:`0 0 20px ${A}44` }}>Entrar</button>
          <button onClick={onClose} style={{ fontFamily:'Space Grotesk,sans-serif',fontSize:15,color:'#5a6a80',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,padding:'12px 18px',cursor:'pointer' }}>Cancelar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1000,display:'flex',background:'rgba(0,0,0,0.85)',backdropFilter:'blur(8px)' }}>
      <div style={{ width:'clamp(140px,20vw,200px)',background:'#070c14',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',flexShrink:0 }}>
        <div style={{ padding:'24px 20px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:11,color:A,letterSpacing:'0.15em',marginBottom:4 }}>// ADMIN</div>
          <div style={{ fontFamily:'Space Grotesk,sans-serif',fontWeight:700,fontSize:16,color:'#e2eaf4' }}>Panel</div>
        </div>
        <nav style={{ flex:1,padding:'12px 0',overflow:'auto' }}>
          {tabs.map(([id, name]) => (
            <button key={id} onClick={() => setTab(id)} style={{ display:'block',width:'100%',textAlign:'left',fontFamily:'Inter,sans-serif',fontSize:13,color:tab===id?A:'#6b7a95',background:tab===id?`${A}10`:'transparent',border:'none',borderLeft:tab===id?`2px solid ${A}`:'2px solid transparent',padding:'9px 20px',cursor:'pointer',transition:'all 0.15s' }}>{name}</button>
          ))}
        </nav>
        <div style={{ padding:16,borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={onClose} style={{ width:'100%',fontFamily:'Inter,sans-serif',fontSize:13,color:'#5a6a80',background:'transparent',border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,padding:'9px',cursor:'pointer',transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color='#e2eaf4'}
            onMouseLeave={e => e.currentTarget.style.color='#5a6a80'}>← Cerrar panel</button>
        </div>
      </div>
      <div style={{ flex:1,display:'flex',flexDirection:'column',overflow:'hidden' }}>
        <div style={{ padding:'20px 28px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#070c14' }}>
          <h3 style={{ fontFamily:'Space Grotesk,sans-serif',fontWeight:700,fontSize:20,color:'#e2eaf4',margin:0 }}>
            {tabs.find(t => t[0]===tab)?.[1]}
          </h3>
          <SaveStatus status={saveStatus}/>
        </div>
        <div style={{ flex:1,overflow:'auto',padding:28 }}>
          {content()}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { AdminPanel });
