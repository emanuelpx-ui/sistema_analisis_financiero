-- =========================================================================
-- SCRIPT DE DATOS DE PRUEBA (SEEDER) - PROYECTO FOFOMI
-- Cobertura: Todos los roles, estados de crédito, comportamiento de pago y niveles de riesgo ML.
-- =========================================================================

-- Limpieza preventiva de datos previos en orden de dependencias
TRUNCATE TABLE auditoria_sistema, alerta_riesgo, historial_pago, credito, cliente, usuario RESTART IDENTITY CASCADE;

-- -------------------------------------------------------------------------
-- 1. USUARIOS DEL SISTEMA
-- Incluye roles: admin, analista y soporte.
-- -------------------------------------------------------------------------
INSERT INTO usuario (s_nombre, s_email, s_password_hash, s_rol) VALUES
('Carlos Mendoza', 'admin@fofomi.gob.mx', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin'),
('Ana Paula Gómez', 'analista.riesgo@fofomi.gob.mx', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'analista'),
('Roberto Ruiz', 'soporte.ti@fofomi.gob.mx', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'soporte');

-- -------------------------------------------------------------------------
-- 2. CLIENTES (ACREDITADOS)
-- Diversidad de giros comerciales y municipios
-- -------------------------------------------------------------------------
INSERT INTO cliente (s_nombre_completo, s_rfc, s_municipio, s_giro_comercial) VALUES
('Abarrotes y Comercializadora del Centro S.A.', 'ACC1003159H1', 'Cuernavaca', 'Comercio al por menor'),
('Agropecuaria Los Pinos S.P.R. de R.L.', 'API150820KL9', 'Tepoztlán', 'Agricultura y Ganadería'),
('Talleres Mecánicos Unidos de Jiutepec', 'TMU180211P02', 'Jiutepec', 'Servicios Automotrices'),
('Textiles e Innovación Morelense', 'TIM120405RT3', 'Temixco', 'Manufactura y Textil'),
('Restaurante El Sabor Morelense', 'RSM190910AB4', 'Cuautla', 'Restaurantes y Alimentos'),
('Cooperativa de Artesanos de Jojutla', 'CAJ2101053X8', 'Jojutla', 'Artesanías y Turismo');

-- -------------------------------------------------------------------------
-- 3. CRÉDITOS Y CARTERA
-- Casos: 'Al corriente', 'En riesgo', 'Vencido' y 'Liquidado'
-- -------------------------------------------------------------------------
INSERT INTO credito (id_cliente, n_monto_otorgado, n_tasa_interes, n_plazo_meses, f_fecha_inicio, s_estado, n_score_riesgo) VALUES
-- Cliente 1: Crédito saludable y al corriente
(1, 150000.00, 12.50, 12, '2026-01-15', 'Al corriente', 0.0820),

-- Cliente 2: Crédito de alto riesgo detectado por ML
(2, 450000.00, 16.00, 24, '2025-11-01', 'En riesgo', 0.8250),

-- Cliente 3: Crédito moroso / vencido
(3, 200000.00, 14.00, 18, '2025-06-10', 'Vencido', 0.9100),

-- Cliente 4: Crédito liquidado con éxito
(4, 80000.00, 10.00, 6, '2025-03-01', 'Liquidado', 0.0350),

-- Cliente 5: Crédito nuevo en riesgo crítico
(5, 300000.00, 15.50, 12, '2026-02-01', 'En riesgo', 0.7800),

-- Cliente 6: Crédito reciente con bajo riesgo
(6, 50000.00, 11.00, 12, '2026-03-01', 'Al corriente', 0.1200);

-- -------------------------------------------------------------------------
-- 4. HISTORIAL DE PAGOS
-- Cobertura de estatus: 'A tiempo', 'Con atraso', 'Impagado'
-- -------------------------------------------------------------------------
INSERT INTO historial_pago (id_credito, n_monto_esperado, n_monto_pagado, f_fecha_limite, f_fecha_pago, n_dias_atraso, s_estatus_pago) VALUES
-- Historial Crédito 1 (Al corriente)
(1, 13360.00, 13360.00, '2026-02-15', '2026-02-14', 0, 'A tiempo'),
(1, 13360.00, 13360.00, '2026-03-15', '2026-03-15', 0, 'A tiempo'),

-- Historial Crédito 2 (En riesgo)
(2, 22000.00, 22000.00, '2025-12-01', '2025-12-05', 4, 'Con atraso'),
(2, 22000.00, 10000.00, '2026-01-01', '2026-01-15', 14, 'Con atraso'),
(2, 22000.00, 0.00, '2026-02-01', NULL, 35, 'Impagado'),

-- Historial Crédito 3 (Vencido)
(3, 12400.00, 0.00, '2025-12-10', NULL, 90, 'Impagado'),
(3, 12400.00, 0.00, '2026-01-10', NULL, 60, 'Impagado'),

-- Historial Crédito 4 (Liquidado)
(4, 13700.00, 13700.00, '2025-04-01', '2025-03-28', 0, 'A tiempo'),
(4, 13700.00, 13700.00, '2025-05-01', '2025-05-01', 0, 'A tiempo'),

-- Historial Crédito 5 (En riesgo reciente)
(5, 27100.00, 0.00, '2026-03-01', NULL, 20, 'Impagado');

-- -------------------------------------------------------------------------
-- 5. ALERTAS DE RIESGO (MACHINE LEARNING)
-- Incluye la estructura corregida con 's_nivel_riesgo', 'n_probabilidad_impago' y 's_recomendacion'
-- -------------------------------------------------------------------------
INSERT INTO alerta_riesgo (id_credito, s_nivel_riesgo, n_probabilidad_impago, s_recomendacion, s_modelo_usado, s_estado_alerta) VALUES
-- Alerta para Crédito 2 (Riesgo Alto)
(2, 'ALTO', 0.8250, 'Congelar desembolsos adicionales e iniciar gestión telefónica inmediata.', 'XGBoost_v1', 'Pendiente'),

-- Alerta para Crédito 3 (Riesgo Crítico)
(3, 'CRITICO', 0.9100, 'Turnar expediente al departamento legal para cobro coactivo.', 'XGBoost_v1', 'Atendida'),

-- Alerta para Crédito 5 (Riesgo Alto)
(5, 'ALTO', 0.7800, 'Realizar visita domiciliaria para reestructuración de tabla de amortización.', 'XGBoost_v1', 'Pendiente'),

-- Alerta previa descartada
(1, 'BAJO', 0.0820, 'Mantener monitoreo de rutina.', 'XGBoost_v1', 'Descartada');

-- -------------------------------------------------------------------------
-- 6. AUDITORÍA DEL SISTEMA
-- Trazabilidad de operaciones del personal
-- -------------------------------------------------------------------------
INSERT INTO auditoria_sistema (id_usuario, s_accion, s_detalles) VALUES
(1, 'CREAR_USUARIO', 'Se registró a la analista Ana Paula Gómez en la plataforma.'),
(2, 'EVALUAR_RIESGO', 'Ejecución del modelo ML para el crédito #2. Probabilidad asignada: 82.5%'),
(2, 'GENERAR_REPORTE', 'Exportación de reporte de créditos en riesgo en formato CSV.'),
(3, 'CONFIGURACION_WEBHOOK', 'Prueba de integración de Webhook hacia servidor de notificaciones externa.');