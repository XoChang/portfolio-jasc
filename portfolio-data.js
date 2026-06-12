// ── Firebase Config ───────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAomfHp9xg6gQw49wEMxdUdNojvzNMw4fE",
  authDomain: "portfolio-jasc.firebaseapp.com",
  projectId: "portfolio-jasc",
  storageBucket: "portfolio-jasc.firebasestorage.app",
  messagingSenderId: "578959169109",
  appId: "1:578959169109:web:165851485c39a3de3466dc"
};

// ── Default Data ──────────────────────────────────────────────────────────────
window.DEFAULT_DATA = {
  hero: {
    name: "Jesus Angel Saenz Chang",
    title: "Software Engineer",
    subtitle: "ML · Cybersecurity · Prompt Engineering",
    bio: "Ingeniero de Software apasionado por la interseccion entre Inteligencia Artificial y Ciberseguridad. Construyo sistemas inteligentes, seguros y escalables.",
    location: "Lima, Peru",
    available: true,
    photo: ""
  },
  about: {
    text: "Soy Ingeniero de Software con experiencia en Machine Learning, Ciberseguridad y desarrollo full-stack. Me especializo en construir soluciones que combinan IA aplicada con practicas de seguridad modernas."
  },
  skills: [
    { id: 1, category: "Languages & Frameworks", items: ["Python", "React", "TypeScript", "Go"] },
    { id: 2, category: "Machine Learning", items: ["TensorFlow", "PyTorch", "Scikit-learn", "Prompt Engineering", "LangChain"] },
    { id: 3, category: "Cybersecurity", items: ["Pentesting", "OSINT", "Burp Suite", "Metasploit", "CTF"] },
    { id: 4, category: "Infrastructure", items: ["Kubernetes", "Docker", "AWS", "Linux", "CI/CD"] }
  ],
  education: [
    { id: 1, degree: "Ingenieria de Software", institution: "Universidad Nacional Mayor de San Marcos", period: "2018 - 2023", description: "Especializacion en sistemas distribuidos e inteligencia artificial." }
  ],
  languages: [
    { id: 1, name: "Espanol", level: "Nativo", percent: 100 },
    { id: 2, name: "Ingles", level: "Avanzado (B2)", percent: 80 },
    { id: 3, name: "Portugues", level: "Basico (A2)", percent: 30 }
  ],
  experience: [
    { id: 1, role: "Software Engineer", company: "Empresa X", period: "2023 - Presente", description: "Desarrollo de microservicios y APIs RESTful.", tags: ["Python", "FastAPI", "Docker"] }
  ],
  certificates: [
    { id: 1, title: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2024", url: "", badge: "AWS" }
  ],
  projects: [
    { id: 1, title: "ML Threat Detector", description: "Sistema de deteccion de amenazas usando modelos de ML.", tags: ["Python", "TensorFlow"], image: "", url: "" }
  ],
  contact: {
    email: "jesus.saenz@email.com",
    github: "https://github.com/jasc",
    linkedin: "https://linkedin.com/in/jasc",
    message: "Tienes un proyecto interesante o quieres colaborar? No dudes en escribirme."
  },
  admin: { password: "admin123" }
};

// ── Deep merge ────────────────────────────────────────────────────────────────
window._deepMerge = (defaults, saved) => {
  if (!saved || typeof saved !== 'object') return defaults;
  const result = { ...defaults };
  for (const key of Object.keys(saved)) {
    const dVal = defaults[key];
    const sVal = saved[key];
    const bothPlain = dVal && sVal && typeof dVal === 'object' && typeof sVal === 'object' && !Array.isArray(dVal) && !Array.isArray(sVal);
    result[key] = bothPlain ? window._deepMerge(dVal, sVal) : sVal;
  }
  return result;
};

// ── Firebase init ─────────────────────────────────────────────────────────────
window._fbApp = null;
window._fbDb  = null;
window._fbSt  = null;

window._initFirebase = () => {
  if (window._fbDb) return true;
  if (!window.firebase_compat) return false;
  try {
    if (!firebase_compat.apps.length) {
      window._fbApp = firebase_compat.initializeApp(FIREBASE_CONFIG);
    } else {
      window._fbApp = firebase_compat.apps[0];
    }
    window._fbDb = firebase_compat.firestore();
    window._fbSt = firebase_compat.storage();
    return true;
  } catch(e) {
    console.error('Firebase init error:', e);
    return false;
  }
};

// ── Load Data ─────────────────────────────────────────────────────────────────
window.loadData = async () => {
  if (!window._initFirebase()) {
    try {
      const s = localStorage.getItem('portfolio-jasc');
      return s ? window._deepMerge(window.DEFAULT_DATA, JSON.parse(s)) : { ...window.DEFAULT_DATA };
    } catch { return { ...window.DEFAULT_DATA }; }
  }
  try {
    const doc = await window._fbDb.collection('portfolio').doc('data').get();
    if (!doc.exists || !doc.data() || Object.keys(doc.data()).length === 0) {
      return { ...window.DEFAULT_DATA };
    }
    return window._deepMerge(window.DEFAULT_DATA, doc.data());
  } catch(e) {
    console.error('Firebase load error:', e);
    return { ...window.DEFAULT_DATA };
  }
};

// ── Save Data ─────────────────────────────────────────────────────────────────
window.saveData = async (data) => {
  if (!window._initFirebase()) {
    localStorage.setItem('portfolio-jasc', JSON.stringify(data));
    return;
  }
  try {
    await window._fbDb.collection('portfolio').doc('data').set(data);
  } catch(e) {
    console.error('Firebase save error:', e);
    localStorage.setItem('portfolio-jasc', JSON.stringify(data));
    throw e;
  }
};

// ── Upload File ───────────────────────────────────────────────────────────────
window.uploadFile = async (file, _bucket, pathPrefix) => {
  if (!window._initFirebase()) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve({ url: e.target.result, isBase64: true });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  try {
    const ext = file.name.split('.').pop().toLowerCase();
    const safeName = 'uploads/' + pathPrefix.replace(/[^a-z0-9]/gi, '_') + '_' + Date.now() + '.' + ext;
    const mimeMap = { pdf:'application/pdf', jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', webp:'image/webp', gif:'image/gif' };
    const contentType = mimeMap[ext] || file.type || 'application/octet-stream';
    const ref = window._fbSt.ref(safeName);
    await ref.put(file, { contentType });
    const url = await ref.getDownloadURL();
    return { url, isBase64: false };
  } catch(e) {
    console.error('Firebase upload error:', e);
    throw new Error(e.message || 'Error al subir el archivo');
  }
};

// ── Delete File ───────────────────────────────────────────────────────────────
window.deleteFile = async (_bucket, url) => {
  if (!url || url.startsWith('data:') || !window._initFirebase()) return;
  try {
    await window._fbSt.refFromURL(url).delete();
  } catch(e) {
    console.error('Error eliminando archivo:', e);
  }
};
