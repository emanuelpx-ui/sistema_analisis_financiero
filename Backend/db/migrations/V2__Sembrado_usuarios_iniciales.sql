-- =========================================================================
-- Versión: V2
-- Descripción: Sembrado de usuarios iniciales
-- =========================================================================

INSERT INTO usuario (s_nombre, s_email, s_password_hash, s_rol) 
VALUES 
    ('Administrador General', 'admin@analisis.com', 'admin123', 'admin'),
    ('Analista FOFOMI', 'analista@analisis.com', 'analista123', 'analista');