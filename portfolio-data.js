// ── Supabase Config ───────────────────────────────────────────────────────────
// 👇 Reemplaza estos valores con los de tu proyecto en supabase.com
window.SUPABASE_URL = 'https://qroahniczzdcncxosiuw.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyb2FobmljenpkY25jeG9zaXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTMzNzEsImV4cCI6MjA4OTc4OTM3MX0.aY5b_GAP205D0ZtCSOP7IoNd99R5Bi6YU79n-zqMV2w';

// ── Default Data ──────────────────────────────────────────────────────────────
window.DEFAULT_DATA = {
  hero: {
    name: "Jesus Angel Saenz Chang",
    title: "Software Engineer",
    subtitle: "ML · Cybersecurity · Prompt Engineering",
    bio: "Ingeniero de Software apasionado por la intersección entre Inteligencia Artificial y Ciberseguridad. Construyo sistemas inteligentes, seguros y escalables.",
    location: "Lima, Perú",
    available: true,
    photo: ""
  },
  about: {
    text: "Soy Ingeniero de Software con experiencia en Machine Learning, Ciberseguridad y desarrollo full-stack. Me especializo en construir soluciones que combinan IA aplicada con prácticas de seguridad modernas. Disfruto los retos técnicos complejos y el aprendizaje continuo en un campo que evoluciona constantemente."
  },
  skills: [
    { id: 1, category: "Languages & Frameworks", items: ["Python", "React", "TypeScript", "Go"] },
    { id: 2, category: "Machine Learning", items: ["TensorFlow", "PyTorch", "Scikit-learn", "Prompt Engineering", "LangChain"] },
    { id: 3, category: "Cybersecurity", items: ["Pentesting", "OSINT", "Burp Suite", "Metasploit", "CTF"] },
    { id: 4, category: "Infrastructure", items: ["Kubernetes", "Docker", "AWS", "Linux", "CI/CD"] }
  ],
  education: [
    { id: 1, degree: "Ingeniería de Software", institution: "Universidad Nacional Mayor de San Marcos", period: "2018 — 2023", description: "Especialización en sistemas distribuidos e inteligencia artificial." }
  ],
  languages: [
    { id: 1, name: "Español", level: "Nativo", percent: 100 },
    { id: 2, name: "Inglés", level: "Avanzado (B2)", percent: 80 },
    { id: 3, name: "Portugués", level: "Básico (A2)", percent: 30 }
  ],
  experience: [
    { id: 1, role: "Software Engineer", company: "Empresa X", period: "2023 — Presente", description: "Desarrollo de microservicios y APIs RESTful de alto rendimiento.", tags: ["Python", "FastAPI", "Docker", "Kubernetes"] },
    { id: 2, role: "ML Engineer Jr.", company: "Startup Y", period: "2022 — 2023", description: "Entrenamiento y despliegue de modelos de clasificación y NLP.", tags: ["Python", "TensorFlow", "GCP"] }
  ],
  certificates: [
    { id: 1, title: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2024", url: "", badge: "AWS" },
    { id: 2, title: "Certified Ethical Hacker (CEH)", issuer: "EC-Council", date: "2023", url: "", badge: "CEH" },
    { id: 3, title: "TensorFlow Developer Certificate", issuer: "Google", date: "2023", url: "", badge: "TF" },
    { id: 4, title: "Diplomado en Ciberseguridad", issuer: "PUCP", date: "2022", url: "", badge: "CYB" }
  ],
  projects: [
    { id: 1, title: "ML Threat Detector", description: "Sistema de detección de amenazas usando modelos de ML para analizar tráfico de red en tiempo real.", tags: ["Python", "TensorFlow", "Scapy"], image: "", url: "", github: "" },
    { id: 2, title: "SecureChat E2E", description: "Aplicación de mensajería con cifrado extremo a extremo usando protocolo Signal.", tags: ["TypeScript", "React", "WebCrypto"], image: "", url: "", github: "" },
    { id: 3, title: "CVE Scanner API", description: "API REST para escaneo automatizado de vulnerabilidades CVE en dependencias.", tags: ["Go", "Docker", "REST"], image: "", url: "", github: "" },
    { id: 4, title: "NLP Sentiment Pipeline", description: "Pipeline de análisis de sentimientos en español con transformers fine-tuned.", tags: ["Python", "HuggingFace", "FastAPI"], image: "", url: "", github: "" }
  ],
  contact: {
    email: "jesus.saenz@email.com",
    github: "https://github.com/jasc",
    linkedin: "https://linkedin.com/in/jasc",
    message: "¿Tienes un proyecto interesante o quieres colaborar? No dudes en escribirme."
  },
  admin: { password: "admin123" }
};

// ── Supabase Client ───────────────────────────────────────────────────────────
window._sb = null;
window._getSupabase = () => {
  if (window._sb) return window._sb;
  if (window.supabase && window.SUPABASE_URL !== 'https://TU_PROYECTO.supabase.co') {
    window._sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }
  return window._sb;
};

// ── Deep merge helper ─────────────────────────────────────────────────────────
// El spread { ...defaults, ...saved } solo funciona en el primer nivel.
// Si saved tiene hero: { name: "X" } sin los demas campos, borra photo, title, etc.
// Este merge combina campo a campo en todos los niveles. Los arrays del saved
// reemplazan completamente (correcto para listas de proyectos, certificados, etc.)
window._deepMerge = (defaults, saved) => {
  if (!saved || typeof saved !== 'object') return defaults;
  const result = { ...defaults };
  for (const key of Object.keys(saved)) {
    const dVal = defaults[key];
    const sVal = saved[key];
    const bothPlainObjects =
      dVal && sVal &&
      typeof dVal === 'object' && typeof sVal === 'object' &&
      !Array.isArray(dVal) && !Array.isArray(sVal);
    result[key] = bothPlainObjects ? window._deepMerge(dVal, sVal) : sVal;
  }
  return result;
};

// ── Load Data ─────────────────────────────────────────────────────────────────
window.loadData = async () => {
  const sb = window._getSupabase();

  // Sin Supabase configurado → fallback a localStorage
  if (!sb) {
    try {
      const s = localStorage.getItem('portfolio-jasc');
      return s ? window._deepMerge(window.DEFAULT_DATA, JSON.parse(s)) : { ...window.DEFAULT_DATA };
    } catch { return { ...window.DEFAULT_DATA }; }
  }

  // Con Supabase
  try {
    const { data, error } = await sb
      .from('portfolio_data')
      .select('content')
      .eq('id', 1)
      .single();

    // Si no hay fila todavia o content esta vacio, usar defaults
    if (error || !data || !data.content || Object.keys(data.content).length === 0) {
      return { ...window.DEFAULT_DATA };
    }

    // Deep merge: los datos guardados sobreescriben los defaults campo a campo
    return window._deepMerge(window.DEFAULT_DATA, data.content);
  } catch {
    return { ...window.DEFAULT_DATA };
  }
};

// ── Save Data ─────────────────────────────────────────────────────────────────
window.saveData = async (data) => {
  const sb = window._getSupabase();
  if (!sb) {
    localStorage.setItem('portfolio-jasc', JSON.stringify(data));
    return;
  }
  try {
    await sb.from('portfolio_data').upsert({ id: 1, content: data });
  } catch (e) {
    console.error('Error guardando en Supabase:', e);
    localStorage.setItem('portfolio-jasc', JSON.stringify(data));
  }
};

// ── Upload File to Supabase Storage ──────────────────────────────────────────
window.uploadFile = async (file, bucket, pathPrefix) => {
  const sb = window._getSupabase();
  if (!sb) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve({ url: e.target.result, isBase64: true });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  try {
    const ext = file.name.split('.').pop().toLowerCase();
    const safeName = `${pathPrefix.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.${ext}`;

    const mimeMap = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg', jpeg: 'image/jpeg',
      png: 'image/png', webp: 'image/webp', gif: 'image/gif'
    };
    const contentType = mimeMap[ext] || file.type || 'application/octet-stream';

    const { error } = await sb.storage.from(bucket).upload(safeName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType
    });
    if (error) throw error;

    const { data } = sb.storage.from(bucket).getPublicUrl(safeName);
    return { url: data.publicUrl, isBase64: false };
  } catch (e) {
    console.error('Error subiendo archivo a Supabase:', e);
    throw new Error(e.message || 'Error al subir el archivo');
  }
};

// ── Delete File from Supabase Storage ────────────────────────────────────────
window.deleteFile = async (bucket, url) => {
  const sb = window._getSupabase();
  if (!sb || !url || url.startsWith('data:')) return;
  try {
    const path = url.split(`${bucket}/`)[1];
    if (path) await sb.storage.from(bucket).remove([path]);
  } catch (e) {
    console.error('Error eliminando archivo:', e);
  }
};
