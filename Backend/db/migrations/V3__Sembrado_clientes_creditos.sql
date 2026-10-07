-- Insertar Clientes de prueba (Microempresas)
INSERT INTO cliente (s_nombre_completo, s_rfc, s_municipio, s_giro_comercial) VALUES
('María López Pérez', 'LOPM850312XX1', 'Puebla', 'Abarrotes'),
('Juan Carlos Sánchez', 'SACJ900524YY2', 'Cholula', 'Taller Mecánico'),
('Ana Gómez Ruiz', 'GORA781105ZZ3', 'Coronango', 'Papelería');

-- Insertar Créditos asociados (Asumiendo que los IDs de cliente generados serán 1, 2 y 3)
INSERT INTO credito (id_cliente, n_monto_otorgado, n_tasa_interes, n_plazo_meses, f_fecha_inicio, s_estado, n_score_riesgo) VALUES
(1, 50000.00, 10.50, 12, '2026-01-15', 'Al corriente', 0.1200),
(2, 120000.00, 12.00, 24, '2025-08-10', 'En riesgo', 0.7850),
(3, 25000.00, 15.00, 6, '2026-05-20', 'Al corriente', 0.0500),
(1, 15000.00, 10.50, 6, '2025-02-01', 'Liquidado', 0.0100);