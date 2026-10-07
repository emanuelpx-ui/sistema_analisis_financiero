-- Migración Flyway: Agregar columna faltante a la tabla alerta_riesgo
ALTER TABLE alerta_riesgo 
ADD COLUMN IF NOT EXISTS n_probabilidad_impago NUMERIC(5, 4);