import React, { useState } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Button } from 'react-bootstrap';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SettingsIcon from '@mui/icons-material/Settings';

// Importamos el nuevo componente
import Cartera from './Cartera'; 

export default function Dashboard({ user, onLogout }) {
  // Estado para controlar qué vista se muestra (por defecto 'panel')
  const [vistaActiva, setVistaActiva] = useState('panel');

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Barra de navegación superior */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-4 shadow-sm z-3">
        <Navbar.Brand href="#home">Sistema de Análisis Financiero</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <span className="text-light align-self-center me-3">
              Bienvenido, {user?.nombre || 'Administrador'}
            </span>
            <Button variant="outline-light" size="sm" onClick={onLogout}>
              Cerrar Sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="d-flex flex-grow-1 overflow-hidden">
        
        {/* Menú Lateral interactivo */}
        <div className="bg-dark text-white d-flex flex-column align-items-center py-3 shadow" style={{ width: '70px' }}>
          <Nav className="flex-column w-100 gap-4 mt-2">
            <Nav.Link 
              onClick={() => setVistaActiva('panel')}
              className={`d-flex justify-content-center px-0 ${vistaActiva === 'panel' ? 'text-white border-start border-3 border-primary' : 'text-light opacity-75'}`} 
              title="Panel General"
            >
              <DashboardIcon fontSize="large" />
            </Nav.Link>

            <Nav.Link 
              onClick={() => setVistaActiva('cartera')}
              className={`d-flex justify-content-center px-0 ${vistaActiva === 'cartera' ? 'text-white border-start border-3 border-primary' : 'text-light opacity-75'}`} 
              title="Cartera de Créditos"
            >
              <FolderSharedIcon fontSize="large" />
            </Nav.Link>

            <Nav.Link 
              onClick={() => setVistaActiva('alertas')}
              className={`d-flex justify-content-center px-0 ${vistaActiva === 'alertas' ? 'text-white border-start border-3 border-primary' : 'text-light opacity-75'}`} 
              title="Alertas de Riesgo"
            >
              <WarningAmberIcon fontSize="large" />
            </Nav.Link>

            <Nav.Link 
              className="text-light d-flex justify-content-center px-0 opacity-75 hover-opacity-100 mt-auto mb-3" 
              title="Configuración"
            >
              <SettingsIcon fontSize="large" />
            </Nav.Link>
          </Nav>
        </div>

        {/* Contenido dinámico (Cambia según el icono presionado) */}
        <div className="flex-grow-1 p-5 overflow-auto">
          <Container fluid>
            
            {vistaActiva === 'panel' && (
              <>
                <Row className="mb-4">
                  <Col>
                    <h2>Panel General</h2>
                    <p className="text-muted">Resumen ejecutivo y métricas del sistema FOFOMI Inteligente.</p>
                  </Col>
                </Row>
                <Row className="g-4">
                  <Col md={4}>
                    <Card className="shadow-sm border-0">
                      <Card.Body>
                        <Card.Title className="text-secondary">Clientes Registrados</Card.Title>
                        <h3 className="fw-bold">1,240</h3>
                        <Card.Text className="text-success small">+12% este mes</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="shadow-sm border-0">
                      <Card.Body>
                        <Card.Title className="text-secondary">Créditos Activos</Card.Title>
                        <h3 className="fw-bold">850</h3>
                        <Card.Text className="text-primary small">Cartera saludable</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="shadow-sm border-0">
                      <Card.Body>
                        <Card.Title className="text-secondary">Alertas de Riesgo</Card.Title>
                        <h3 className="fw-bold text-danger">15</h3>
                        <Card.Text className="text-danger small">Requieren revisión</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}

            {vistaActiva === 'cartera' && <Cartera />}
            
            {vistaActiva === 'alertas' && (
              <div>
                <h2>Alertas de Riesgo</h2>
                <p className="text-muted">Módulo en construcción...</p>
              </div>
            )}

          </Container>
        </div>
      </div>
    </div>
  );
}