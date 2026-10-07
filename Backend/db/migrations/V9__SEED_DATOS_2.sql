-- =========================================================================
-- SCRIPT DE DATOS DE PRUEBA (SEEDER) - PROYECTO FOFOMI (25 REGISTROS LIMPIOS)
-- =========================================================================

-- 1. Limpiar tablas y reiniciar los IDs (Autoincrementables) desde 1
TRUNCATE TABLE auditoria_sistema, alerta_riesgo, historial_pago, credito, cliente RESTART IDENTITY CASCADE;

-- -------------------------------------------------------------------------
-- 2. CLIENTES (25 registros)
-- -------------------------------------------------------------------------
INSERT INTO cliente (s_nombre_completo, s_rfc, s_municipio, s_giro_comercial) VALUES
('Abarrotes y Comercializadora del Centro S.A.', 'ACB1003159H1', 'Cuernavaca', 'Comercio al por menor'),
('Agropecuaria Los Pinos S.P.R. de R.L.', 'APT150820KL9', 'Tepoztlán', 'Agricultura y Ganadería'),
('Talleres Mecánicos Unidos de Jiutepec', 'TM0180211P02', 'Jiutepec', 'Servicios Automotrices'),
('Textiles e Innovación Morelense', 'TIM120405RU3', 'Temixco', 'Manufactura y Textil'),
('Restaurante El Sabor Morelense', 'RSM191910AB4', 'Cuautla', 'Restaurantes y Alimentos'),
('Cooperativa de Artesanos de Jojutla', 'CAJ3101053X8', 'Jojutla', 'Artesanías y Turismo'),
('Ferretería y Materiales El Ancla', 'FMA150412XY1', 'Cuernavaca', 'Comercialización'),
('Panadería y Pastelería La Especial', 'PPE180320ZZ2', 'Yautepec', 'Alimentos'),
('Servicios de Transporte Colectivo Morelos', 'STC190511AA3', 'Temixco', 'Transporte'),
('Consultoría Informática y Soporte S.A.', 'CIS200615BB4', 'Cuernavaca', 'Tecnología'),
('Café de Altura Orgánico de Tetela', 'COT210722CC5', 'Tetela del Volcán', 'Agricultura'),
('Carpintería y Diseño Rústico Moderno', 'CDR170830DD6', 'Jiutepec', 'Manufactura'),
('Purificadora de Agua H2O Pura', 'PAH190905EE7', 'Cuautla', 'Comercio'),
('Papelería y Variedades Lupita', 'PVL161012FF8', 'Jojutla', 'Comercio al por menor'),
('Gimnasio y Centro Fitness PowerFit', 'GFP220115GG9', 'Cuernavaca', 'Servicios Deportivos'),
('Farmacia Comunitaria del Sur S.A.', 'FCS180228HH0', 'Zacatepec', 'Salud'),
('Construcciones y Edificaciones Morelenses', 'CEM150330II1', 'Cuautla', 'Construcción'),
('Lavandería y Tintorería Rápida Clean', 'LTR200418JJ2', 'Temixco', 'Servicios'),
('Refacciones y Accesorios Diesel del Sur', 'RAD190525KK3', 'Jiutepec', 'Comercio'),
('Estética y Salón de Belleza Glamour', 'ESB210610LL4', 'Cuernavaca', 'Servicios Personales'),
('Distribuidora de Lácteos y Quesos Artesanales', 'DLQ170719MM5', 'Tepoztlán', 'Alimentos'),
('Ferretería Industrial y Herramientas S.A.', 'FIH180802NN6', 'Cuautla', 'Comercialización'),
('Servicios de Impresión y Publicidad Grafica', 'SIP190914OO7', 'Cuernavaca', 'Servicios'),
('Veterinaria y Alimentos para Mascotas San Francisco', 'VAM201021PP8', 'Jiutepec', 'Salud Animal'),
('Boutique y Confecciones de Ropa Tradicional', 'BCR211105QQ9', 'Jojutla', 'Textil');

-- -------------------------------------------------------------------------
-- 3. CRÉDITOS Y CARTERA (25 registros)
-- -------------------------------------------------------------------------
INSERT INTO credito (id_cliente, n_monto_otorgado, n_tasa_interes, n_plazo_meses, f_fecha_inicio, s_estado, n_score_riesgo) VALUES
(1, 150000.00, 12.50, 12, '2026-01-15', 'Al corriente', 0.0820),
(2, 450000.00, 16.00, 24, '2025-11-01', 'En riesgo', 0.8250),
(3, 200000.00, 14.00, 18, '2025-06-10', 'Vencido', 0.9100),
(4, 80000.00, 10.00, 6, '2025-03-01', 'Liquidado', 0.0350),
(5, 300000.00, 15.50, 12, '2026-02-01', 'En riesgo', 0.7800),
(6, 50000.00, 11.00, 12, '2026-03-01', 'Al corriente', 0.1200),
(7, 120000.00, 12.00, 12, '2026-01-10', 'Al corriente', 0.1500),
(8, 60000.00, 13.00, 6, '2026-02-15', 'Al corriente', 0.0900),
(9, 250000.00, 15.00, 24, '2025-09-20', 'En riesgo', 0.6500),
(10, 180000.00, 10.50, 18, '2026-01-05', 'Al corriente', 0.0550),
(11, 95000.00, 11.50, 12, '2026-02-10', 'Al corriente', 0.1100),
(12, 110000.00, 13.50, 12, '2025-12-01', 'Vencido', 0.8800),
(13, 40000.00, 12.00, 6, '2026-03-05', 'Al corriente', 0.0700),
(14, 35000.00, 10.00, 6, '2025-08-15', 'Liquidado', 0.0200),
(15, 220000.00, 14.50, 18, '2026-01-20', 'Al corriente', 0.2100),
(16, 130000.00, 13.00, 12, '2025-10-10', 'En riesgo', 0.5400),
(17, 500000.00, 17.00, 36, '2025-05-12', 'Vencido', 0.9500),
(18, 45000.00, 11.00, 6, '2026-02-20', 'Al corriente', 0.0650),
(19, 175000.00, 14.00, 18, '2025-11-15', 'En riesgo', 0.7100),
(20, 70000.00, 12.50, 12, '2026-01-25', 'Al corriente', 0.1300),
(21, 160000.00, 13.00, 12, '2026-02-05', 'Al corriente', 0.1400),
(22, 320000.00, 15.00, 24, '2025-07-30', 'Vencido', 0.9200),
(23, 90000.00, 11.00, 12, '2026-03-10', 'Al corriente', 0.0850),
(24, 140000.00, 13.50, 18, '2025-09-10', 'Liquidado', 0.0400),
(25, 210000.00, 14.00, 18, '2026-01-18', 'Al corriente', 0.1900);

-- -------------------------------------------------------------------------
-- 4. HISTORIAL DE PAGOS (25 registros)
-- -------------------------------------------------------------------------
INSERT INTO historial_pago (id_credito, n_monto_esperado, n_monto_pagado, f_fecha_limite, f_fecha_pago, n_dias_atraso, s_estatus_pago) VALUES
(1, 13360.00, 13360.00, '2026-02-15', '2026-02-14', 0, 'A tiempo'),
(1, 13360.00, 13360.00, '2026-03-15', '2026-03-15', 0, 'A tiempo'),
(2, 22000.00, 22000.00, '2025-12-01', '2025-12-05', 4, 'Con atraso'),
(2, 22000.00, 10000.00, '2026-01-01', '2026-01-15', 14, 'Con atraso'),
(2, 22000.00, 0.00, '2026-02-01', NULL, 35, 'Impagado'),
(3, 12400.00, 0.00, '2025-12-10', NULL, 90, 'Impagado'),
(3, 12400.00, 0.00, '2026-01-10', NULL, 60, 'Impagado'),
(4, 13700.00, 13700.00, '2025-04-01', '2025-03-28', 0, 'A tiempo'),
(4, 13700.00, 13700.00, '2025-05-01', '2025-05-01', 0, 'A tiempo'),
(5, 27100.00, 0.00, '2026-03-01', NULL, 20, 'Impagado'),
(6, 4450.00, 4450.00, '2026-04-01', '2026-03-30', 0, 'A tiempo'),
(7, 10600.00, 10600.00, '2026-02-10', '2026-02-09', 0, 'A tiempo'),
(8, 10300.00, 10300.00, '2026-03-15', '2026-03-15', 0, 'A tiempo'),
(9, 12100.00, 5000.00, '2025-10-20', '2025-10-28', 8, 'Con atraso'),
(10, 10800.00, 10800.00, '2026-02-05', '2026-02-04', 0, 'A tiempo'),
(11, 8400.00, 8400.00, '2026-03-10', '2026-03-08', 0, 'A tiempo'),
(12, 10100.00, 0.00, '2026-01-01', NULL, 45, 'Impagado'),
(13, 6900.00, 6900.00, '2026-04-05', '2026-04-02', 0, 'A tiempo'),
(14, 5900.00, 5900.00, '2025-09-15', '2025-09-14', 0, 'A tiempo'),
(15, 13900.00, 13900.00, '2026-02-20', '2026-02-19', 0, 'A tiempo'),
(16, 11500.00, 4000.00, '2025-11-10', '2025-11-20', 10, 'Con atraso'),
(17, 16200.00, 0.00, '2025-06-12', NULL, 120, 'Impagado'),
(18, 7800.00, 7800.00, '2026-03-20', '2026-03-19', 0, 'A tiempo'),
(19, 11200.00, 2000.00, '2025-12-15', '2025-12-25', 10, 'Con atraso'),
(20, 6300.00, 6300.00, '2026-02-25', '2026-02-24', 0, 'A tiempo');

-- -------------------------------------------------------------------------
-- 5. ALERTAS DE RIESGO - MACHINE LEARNING (25 registros)
-- -------------------------------------------------------------------------
INSERT INTO alerta_riesgo (id_credito, s_nivel_riesgo, n_probabilidad_impago, s_recomendacion, s_modelo_usado, s_estado_alerta) VALUES
(1, 'BAJO', 0.0820, 'Mantener monitoreo de rutina.', 'RandomForest_v1', 'Descartada'),
(2, 'ALTO', 0.8250, 'Congelar desembolsos adicionales e iniciar gestión telefónica.', 'RandomForest_v1', 'Pendiente'),
(3, 'CRITICO', 0.9100, 'Turnar expediente al departamento legal para cobro coactivo.', 'RandomForest_v1', 'Atendida'),
(4, 'BAJO', 0.0350, 'Crédito liquidado exitosamente sin observaciones.', 'RandomForest_v1', 'Atendida'),
(5, 'ALTO', 0.7800, 'Realizar visita domiciliaria para reestructuración.', 'RandomForest_v1', 'Pendiente'),
(6, 'BAJO', 0.1200, 'Cliente con comportamiento estable.', 'RandomForest_v1', 'Descartada'),
(7, 'BAJO', 0.1500, 'Monitoreo preventivo ordinario.', 'RandomForest_v1', 'Descartada'),
(8, 'BAJO', 0.0900, 'Sin acciones especiales requeridas.', 'RandomForest_v1', 'Descartada'),
(9, 'MEDIO', 0.6500, 'Contactar al acreditado para verificar retraso menor.', 'RandomForest_v1', 'Pendiente'),
(10, 'BAJO', 0.0550, 'Historial de pagos impecable.', 'RandomForest_v1', 'Descartada'),
(11, 'BAJO', 0.1100, 'Operación dentro de parámetros normales.', 'RandomForest_v1', 'Descartada'),
(12, 'CRITICO', 0.8800, 'Iniciar proceso de cobranza judicial por impago prolongado.', 'RandomForest_v1', 'Pendiente'),
(13, 'BAJO', 0.0700, 'Mantener seguimiento estándar.', 'RandomForest_v1', 'Descartada'),
(14, 'BAJO', 0.0200, 'Crédito concluido satisfactoriamente.', 'RandomForest_v1', 'Atendida'),
(15, 'MEDIO', 0.2100, 'Supervisar proximidad de fecha límite de pago.', 'RandomForest_v1', 'Pendiente'),
(16, 'MEDIO', 0.5400, 'Enviar recordatorio automatizado de saldo pendiente.', 'RandomForest_v1', 'Pendiente'),
(17, 'CRITICO', 0.9500, 'Embargo preventivo de garantía y demanda mercantil.', 'RandomForest_v1', 'Atendida'),
(18, 'BAJO', 0.0650, 'Riesgo mínimo de impago.', 'RandomForest_v1', 'Descartada'),
(19, 'ALTO', 0.7100, 'Revisar capacidad de pago actual del negocio.', 'RandomForest_v1', 'Pendiente'),
(20, 'BAJO', 0.1300, 'Comportamiento de pago regular.', 'RandomForest_v1', 'Descartada'),
(21, 'BAJO', 0.1400, 'Sin incidencias reportadas.', 'RandomForest_v1', 'Descartada'),
(22, 'CRITICO', 0.9200, 'Asignar cuenta a despacho externo de cobranza legal.', 'RandomForest_v1', 'Pendiente'),
(23, 'BAJO', 0.0850, 'Aprobación regular bajo lineamientos.', 'RandomForest_v1', 'Descartada'),
(24, 'BAJO', 0.0400, 'Cierre de ciclo de crédito exitoso.', 'RandomForest_v1', 'Atendida'),
(25, 'MEDIO', 0.1900, 'Mantener vigilancia moderada.', 'RandomForest_v1', 'Descartada');

-- -------------------------------------------------------------------------
-- 6. AUDITORÍA DEL SISTEMA (25 registros)
-- -------------------------------------------------------------------------
INSERT INTO auditoria_sistema (id_usuario, s_accion, s_detalles) VALUES
(1, 'CREAR_USUARIO', 'Se registró a la analista Ana Paula Gómez en la plataforma.'),
(2, 'EVALUAR_RIESGO', 'Ejecución del modelo ML para el crédito #2. Probabilidad asignada: 82.5%'),
(2, 'GENERAR_REPORTE', 'Exportación de reporte de créditos en riesgo en formato CSV.'),
(3, 'CONFIGURACION_WEBHOOK', 'Prueba de integración de Webhook hacia servidor de notificaciones externa.'),
(1, 'ACTUALIZAR_CONFIG', 'Modificación de parámetros generales de tasas de interés base.'),
(2, 'EVALUAR_RIESGO', 'Ejecución del modelo ML para el crédito #3. Probabilidad asignada: 91.0%'),
(1, 'LOGIN_EXITOSO', 'El administrador inició sesión en el sistema principal.'),
(3, 'RESPALDO_BD', 'Ejecución exitosa de respaldo automático programado 3-2-1.'),
(2, 'REGISTRAR_CREDITO', 'Alta manual de crédito para Ferretería El Ancla.'),
(1, 'MODIFICAR_ROL', 'Se ajustaron permisos para el usuario operador Juan Pérez.'),
(2, 'EVALUAR_RIESGO', 'Ejecución del modelo ML para el crédito #5. Probabilidad asignada: 78.0%'),
(3, 'MONITOREO_ETL', 'Verificación de ejecución del DAG de Airflow para ingesta de históricos.'),
(2, 'EXPORTAR_DATOS', 'Descarga masiva de cartera activa en formato CSV.'),
(1, 'ELIMINAR_ALERTA', 'Se descartó alerta de riesgo bajo para el crédito #1.'),
(2, 'EVALUAR_RIESGO', 'Ejecución del modelo ML para el crédito #9. Probabilidad asignada: 65.0%'),
(3, 'TEST_CONEXION', 'Prueba de conectividad con pasarela de base de datos PostgreSQL.'),
(1, 'CREAR_USUARIO', 'Alta de nuevo gestor de cobranza en la plataforma.'),
(2, 'EVALUAR_RIESGO', 'Ejecución del modelo ML para el crédito #12. Probabilidad asignada: 88.0%'),
(2, 'ACTUALIZAR_ESTADO', 'Cambio manual de estado de crédito #4 a Liquidado.'),
(3, 'REVISION_LOGS', 'Auditoría de seguridad y accesos del sistema web.'),
(1, 'CONFIGURAR_CORREO', 'Actualización de servidor SMTP para alertas automáticas.'),
(2, 'EVALUAR_RIESGO', 'Ejecución del modelo ML para el crédito #17. Probabilidad asignada: 95.0%'),
(2, 'GENERAR_REPORTE', 'Creación de reporte ejecutivo mensual para dirección general.'),
(3, 'MANTENIMIENTO', 'Limpieza de caché y optimización de índices en PostgreSQL.'),
(1, 'CIERRE_SESION', 'El usuario administrador cerró sesión correctamente.');