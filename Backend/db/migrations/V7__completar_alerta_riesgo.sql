-- 1. Agregar campos faltantes en alerta_riesgo
ALTER TABLE alerta_riesgo 
ADD COLUMN IF NOT EXISTS s_nivel_riesgo VARCHAR(20),
ADD COLUMN IF NOT EXISTS n_probabilidad_impago NUMERIC(5,4),
ADD COLUMN IF NOT EXISTS s_recomendacion TEXT;

-- 2. Actualizar el CHECK constraint para permitir minúsculas o variaciones de nivel de riesgo
ALTER TABLE alerta_riesgo 
DROP CONSTRAINT IF EXISTS alerta_riesgo_s_nivel_riesgo_check;

ALTER TABLE alerta_riesgo 
ADD CONSTRAINT alerta_riesgo_s_nivel_riesgo_check 
CHECK (UPPER(s_nivel_riesgo) IN ('BAJO', 'MEDIO', 'ALTO', 'CRITICO', 'N/A'));