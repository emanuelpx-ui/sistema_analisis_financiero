import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Button, Spinner } from 'react-bootstrap';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SettingsIcon from '@mui/icons-material/Settings';

import Cartera from './Cartera'; 
import AlertasRiesgo from './AlertasRiesgo';

export default function Dashboard({ user, onLogout }) {
  const [vistaActiva, setVistaActiva] = useState('panel');
  const [kpis, setKpis] = useState(null);
  const [loadingKpis, setLoadingKpis] = useState(true);

  // Consulta dinámica de KPIs desde la base de datos (HU-010)
  const fetchKpis = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/creditos/kpis');
      if (response.ok) {
        const data = await response.json();
        setKpis(data);
      }
    } catch (error) {
      console.error("Error al cargar KPIs:", error);
    } finally {
      setLoadingKpis(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, [vistaActiva]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Barra superior */}
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
        {/* Menú Lateral */}
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

        {/* Contenido principal */}
        <div className="flex-grow-1 p-5 overflow-auto">
          <Container fluid>
            {vistaActiva === 'panel' && (
              <>
                <Row className="mb-4">
                  <Col>
                    <h2>Panel General</h2>
                    <p className="text-muted">Resumen ejecutivo y métricas en tiempo real del sistema FOFOMI Inteligente.</p>
                  </Col>
                </Row>

                {loadingKpis ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-2">Cargando métricas de cartera...</p>
                  </div>
                ) : (
                  <>
                    {/* Fila de KPIs */}
                    <Row className="g-4">
                      <Col md={3}>
                        <Card className="shadow-sm border-0 h-100">
                          <Card.Body>
                            <Card.Title className="text-secondary small fw-bold text-uppercase">Monto Total Otorgado</Card.Title>
                            <h3 className="fw-bold text-primary mt-2">
                              ${kpis?.monto_total_otorgado?.toLocaleString('es-MX') || '0.00'}
                            </h3>
                            <Card.Text className="text-muted small">Capital colocado activo</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="shadow-sm border-0 h-100">
                          <Card.Body>
                            <Card.Title className="text-secondary small fw-bold text-uppercase">Total Créditos</Card.Title>
                            <h3 className="fw-bold mt-2">{kpis?.total_creditos || 0}</h3>
                            <Card.Text className="text-success small">Registrados en sistema</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="shadow-sm border-0 h-100">
                          <Card.Body>
                            <Card.Title className="text-secondary small fw-bold text-uppercase">Créditos en Riesgo</Card.Title>
                            <h3 className="fw-bold text-warning mt-2">{kpis?.creditos_en_riesgo || 0}</h3>
                            <Card.Text className="text-warning small">Requieren seguimiento</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="shadow-sm border-0 h-100">
                          <Card.Body>
                            <Card.Title className="text-secondary small fw-bold text-uppercase">% Riesgo Cartera</Card.Title>
                            <h3 className="fw-bold text-danger mt-2">{kpis?.porcentaje_riesgo || 0}%</h3>
                            <Card.Text className="text-danger small">Índice global de impago</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {/* Nueva sección para incrustar Metabase */}
                    <Row className="mt-4">
                      <Col>
                        <Card className="shadow-sm border-0">
                          <Card.Body style={{ height: '600px' }}>
                            <iframe
                              src="http://localhost:3030/public/question/5fac926a-aedc-47d0-b572-cde93608c508"
                              frameBorder="0"
                              width="100%"
                              height="100%"
                              allowTransparency="true"
                              title="Gráficas Metabase"
                            ></iframe>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}
              </>
            )}

            {vistaActiva === 'cartera' && <Cartera />}
            {vistaActiva === 'alertas' && <AlertasRiesgo />}
          </Container>
        </div>
      </div>
    </div>
  );
}