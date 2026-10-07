-- V4__crear_tabla_alerta_riesgo.sql
CREATE TABLE IF NOT EXISTS alerta_riesgo (
    id SERIAL PRIMARY KEY,
    id_credito INT REFERENCES credito(id) ON DELETE CASCADE,
    n_probabilidad_impago NUMERIC(5, 4) NOT NULL,
    s_nivel_riesgo VARCHAR(20) NOT NULL CHECK (s_nivel_riesgo IN ('BAJO', 'MEDIO', 'ALTO')),
    s_recomendacion VARCHAR(255) NOT NULL,
    f_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);