-- =========================================================================
-- Versión: V1
-- Descripción: Esquema inicial de base de datos
-- Nomenclatura: Tablas en singular y prefijo de una letra por tipo de dato
-- =========================================================================

-- 1. Tabla de Usuario
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    s_nombre VARCHAR(100) NOT NULL,
    s_email VARCHAR(150) UNIQUE NOT NULL,
    s_password_hash VARCHAR(255) NOT NULL,
    s_rol VARCHAR(50) NOT NULL CHECK (s_rol IN ('admin', 'analista', 'soporte')),
    f_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Cliente
CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    s_nombre_completo VARCHAR(150) NOT NULL,
    s_rfc VARCHAR(13) UNIQUE NOT NULL,
    s_municipio VARCHAR(100) NOT NULL,
    s_giro_comercial VARCHAR(100) NOT NULL,
    f_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Crédito y Cartera
CREATE TABLE credito (
    id SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES cliente(id) ON DELETE CASCADE,
    n_monto_otorgado NUMERIC(12, 2) NOT NULL,
    n_tasa_interes NUMERIC(5, 2) NOT NULL,
    n_plazo_meses INT NOT NULL,
    f_fecha_inicio DATE NOT NULL,
    s_estado VARCHAR(50) NOT NULL CHECK (s_estado IN ('Al corriente', 'En riesgo', 'Vencido', 'Liquidado')),
    n_score_riesgo NUMERIC(5, 4) DEFAULT 0.0000,
    f_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Historial de Pago
CREATE TABLE historial_pago (
    id SERIAL PRIMARY KEY,
    id_credito INT REFERENCES credito(id) ON DELETE CASCADE,
    n_monto_esperado NUMERIC(12, 2) NOT NULL,
    n_monto_pagado NUMERIC(12, 2) DEFAULT 0.00,
    f_fecha_limite DATE NOT NULL,
    f_fecha_pago DATE,
    n_dias_atraso INT DEFAULT 0,
    s_estatus_pago VARCHAR(50) NOT NULL CHECK (s_estatus_pago IN ('A tiempo', 'Con atraso', 'Impagado'))
);

-- 5. Tabla de Auditoría del Sistema
CREATE TABLE auditoria_sistema (
    id SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id) ON DELETE SET NULL,
    s_accion VARCHAR(100) NOT NULL,
    s_detalles TEXT,
    f_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabla de Alerta de Riesgo (Machine Learning)
CREATE TABLE alerta_riesgo (
    id SERIAL PRIMARY KEY,
    id_credito INT REFERENCES credito(id) ON DELETE CASCADE,
    s_nivel_riesgo VARCHAR(50) NOT NULL CHECK (s_nivel_riesgo IN ('Medio', 'Alto', 'Crítico')),
    s_modelo_usado VARCHAR(100) DEFAULT 'XGBoost_v1',
    s_estado_alerta VARCHAR(50) DEFAULT 'Pendiente' CHECK (s_estado_alerta IN ('Pendiente', 'Atendida', 'Descartada')),
    f_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);