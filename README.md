# Portfolio JASC — Guía de publicación con Supabase

## Archivos incluidos
- `Portfolio.html` — página principal
- `portfolio-ui.jsx` — componentes visuales
- `portfolio-admin.jsx` — panel de administración (actualizado con Supabase)
- `portfolio-data.js` — configuración y helpers de Supabase
- `SUPABASE_SETUP.sql` — SQL para crear la tabla en Supabase

---

## PASO 1 — Crear proyecto en Supabase

1. Ve a https://supabase.com y crea una cuenta gratis
2. Click en **"New project"**
3. Elige un nombre (ej: `portfolio-jasc`) y contraseña de base de datos
4. Espera ~2 minutos a que se cree el proyecto
5. Ve a **Settings → API** y copia:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon / public key** → cadena larga que empieza con `eyJ...`

---

## PASO 2 — Configurar portfolio-data.js

Abre `portfolio-data.js` y reemplaza las líneas del inicio:

```js
window.SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';   // ← tu URL
window.SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI';             // ← tu anon key
```

---

## PASO 3 — Crear la tabla en Supabase

1. Ve a tu proyecto en supabase.com
2. Click en **SQL Editor** → **New query**
3. Copia y pega todo el contenido de `SUPABASE_SETUP.sql`
4. Click en **Run**

---

## PASO 4 — Crear el Storage bucket

1. En el menú lateral ve a **Storage**
2. Click en **New bucket**
3. Nombre: `portfolio-files`
4. Activa **"Public bucket"** ✓
5. Click en **Save**
6. Ve a **Policies** del bucket y crea políticas para:
   - Permitir SELECT, INSERT, UPDATE, DELETE a `anon`

---

## PASO 5 — Publicar en Netlify

1. Ve a https://netlify.com y crea una cuenta
2. En el dashboard, busca **"Deploy manually"**
3. Arrastra la carpeta con todos los archivos al área de deploy
4. Netlify te dará una URL como `https://jasc-portfolio.netlify.app`

---

## Uso del panel de administración

- Accede haciendo clic en tu nombre en la barra de navegación (esquina superior izquierda)
- Contraseña por defecto: `admin123` (cámbiala en la pestaña Seguridad)
- Los cambios se guardan automáticamente en Supabase
- Las imágenes y PDFs se suben a Supabase Storage y quedan disponibles para todos

---

## ¿Qué se guarda dónde?

| Dato | Dónde |
|------|-------|
| Textos, skills, experiencia, etc. | Tabla `portfolio_data` en Supabase |
| Foto de perfil | Supabase Storage → bucket `portfolio-files` |
| Imágenes de proyectos | Supabase Storage → bucket `portfolio-files` |
| PDFs de certificados | Supabase Storage → bucket `portfolio-files` |
