-- ═══════════════════════════════════════════════════════════════════
-- SUPABASE SETUP — Portfolio JASC
-- Ejecuta este SQL en: supabase.com → Tu proyecto → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════════════

-- 1. Crear tabla para los datos del portfolio
CREATE TABLE IF NOT EXISTS portfolio_data (
  id        INTEGER PRIMARY KEY DEFAULT 1,
  content   JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Solo permitir una fila (id = 1)
ALTER TABLE portfolio_data ADD CONSTRAINT single_row CHECK (id = 1);

-- 2. Habilitar Row Level Security
ALTER TABLE portfolio_data ENABLE ROW LEVEL SECURITY;

-- 3. Política: cualquiera puede LEER (visitantes del portfolio)
CREATE POLICY "public_read"
  ON portfolio_data FOR SELECT
  USING (true);

-- 4. Política: cualquiera puede ESCRIBIR (el admin del portfolio)
CREATE POLICY "public_write"
  ON portfolio_data FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Insertar fila inicial vacía
INSERT INTO portfolio_data (id, content)
VALUES (1, '{}')
ON CONFLICT (id) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════════
-- STORAGE — Políticas para el bucket "portfolio-files"
-- Ejecuta esto DESPUÉS de crear el bucket manualmente en la UI
-- ═══════════════════════════════════════════════════════════════════

-- Permitir subida de archivos (INSERT) a cualquiera
CREATE POLICY "allow_public_uploads"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'portfolio-files');

-- Permitir lectura pública de archivos
CREATE POLICY "allow_public_reads"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'portfolio-files');

-- Permitir sobreescribir archivos (UPDATE / upsert)
CREATE POLICY "allow_public_updates"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'portfolio-files');

-- Permitir eliminar archivos
CREATE POLICY "allow_public_deletes"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'portfolio-files');


-- ═══════════════════════════════════════════════════════════════════
-- PASOS MANUALES EN LA UI DE SUPABASE (no se pueden hacer con SQL):
--
--   1. Ve a Storage en el menú lateral
--   2. Click en "New bucket"
--   3. Nombre: portfolio-files
--   4. Activa "Public bucket" ✓
--   5. Click en "Save"
--   6. Luego ejecuta el SQL de arriba (sección STORAGE)
-- ═══════════════════════════════════════════════════════════════════
