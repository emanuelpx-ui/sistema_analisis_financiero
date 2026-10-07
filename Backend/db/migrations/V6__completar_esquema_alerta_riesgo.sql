ALTER TABLE alerta_riesgo 
ADD COLUMN IF NOT EXISTS n_probabilidad_impago NUMERIC(5, 4),
ADD COLUMN IF NOT EXISTS s_nivel_riesgo VARCHAR(20),
ADD COLUMN IF NOT EXISTS s_recomendacion VARCHAR(255);