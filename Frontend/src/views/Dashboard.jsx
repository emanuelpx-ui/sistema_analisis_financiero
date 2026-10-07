import React from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Button } from 'react-bootstrap';

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="min-vh-100 bg-light">
      {/* Barra de navegación superior */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-4 shadow-sm">
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

      {/* Contenido principal del Dashboard */}
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <h2>Panel General</h2>
            <p className="text-muted">Resumen ejecutivo y métricas del sistema FOFOMI Inteligente.</p>
          </Col>
        </Row>

        {/* Tarjetas de métricas rápidas */}
        <Row className="g-4">
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title className="text-secondary">Clientes Registrados</Card.Title>
                <Card.H3 className="fw-bold">1,240</Card.H3>
                <Card.Text className="text-success small">+12% este mes</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title className="text-secondary">Créditos Activos</Card.Title>
                <Card.H3 className="fw-bold">850</Card.H3>
                <Card.Text className="text-primary small">Cartera saludable</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title className="text-secondary">Alertas de Riesgo</Card.Title>
                <Card.H3 className="fw-bold text-danger">15</Card.H3>
                <Card.Text className="text-danger small">Requieren revisión</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}