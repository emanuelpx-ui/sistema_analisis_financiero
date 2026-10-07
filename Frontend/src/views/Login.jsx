import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { loginUser } from '../services/authService';

export default function Login({ onLoginSuccess }) { // <-- Recibimos la prop aquí
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("¡Botón presionado!");
    
    try {
      setError('');
      console.log("Intentando conectar con el servicio con:", email, password);
      
      const data = await loginUser(email, password);
      console.log('Respuesta del backend:', data);
      
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
    } catch (err) {
      console.error("Error atrapado en el login:", err);
      setError('Correo o contraseña inválidos.');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <h3 className="text-center mb-4">Análisis Financiero</h3>
              <p className="text-center text-muted mb-4">Iniciar Sesión</p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="admin@analisis.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="admin123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Entrar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}