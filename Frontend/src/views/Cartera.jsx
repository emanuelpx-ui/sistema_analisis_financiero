import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Alert, Button, Modal, Form, Row, Col } from 'react-bootstrap';

export default function Cartera() {
  const [creditos, setCreditos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para el Modal y el Formulario
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    s_nombre_completo: '', s_rfc: '', s_municipio: '', s_giro_comercial: '',
    n_monto_otorgado: '', n_tasa_interes: '', n_plazo_meses: ''
  });

  const fetchCreditos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/creditos');
      if (!response.ok) throw new Error('Error al conectar con el servidor');
      const data = await response.json();
      setCreditos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Lista de campos que deben ir forzosamente en mayúsculas
    const camposMayusculas = ['s_nombre_completo', 's_rfc', 's_municipio', 's_giro_comercial'];
    
    setFormData({ 
      ...formData, 
      [name]: camposMayusculas.includes(name) ? value.toUpperCase() : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/creditos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          n_monto_otorgado: parseFloat(formData.n_monto_otorgado),
          n_tasa_interes: parseFloat(formData.n_tasa_interes),
          n_plazo_meses: parseInt(formData.n_plazo_meses)
        })
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ s_nombre_completo: '', s_rfc: '', s_municipio: '', s_giro_comercial: '', n_monto_otorgado: '', n_tasa_interes: '', n_plazo_meses: '' });
        fetchCreditos(); // Recargar la tabla automáticamente
      }
    } catch (err) {
      alert("Error al guardar el crédito");
    }
  };

  const getColorEstado = (estado) => {
    switch(estado) {
      case 'Al corriente': return 'success';
      case 'En riesgo': return 'warning text-dark';
      case 'Vencido': return 'danger';
      case 'Liquidado': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Cartera de Créditos</h2>
          <p className="text-muted">Consulta y gestión de financiamientos FOFOMI.</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Nuevo Crédito
        </Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th><th>Cliente</th><th>RFC</th><th>Monto</th><th>Tasa</th><th>Plazo</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {creditos.map((credito) => (
                  <tr key={credito.id_credito}>
                    <td className="text-muted">#{credito.id_credito}</td>
                    <td className="fw-semibold">{credito.cliente}</td>
                    <td>{credito.rfc}</td>
                    <td>${credito.monto.toLocaleString('es-MX')}</td>
                    <td>{credito.tasa}%</td>
                    <td>{credito.plazo} meses</td>
                    <td><Badge bg={getColorEstado(credito.estado)}>{credito.estado}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal para registrar nuevo crédito */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Registrar Nuevo Crédito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <h6 className="text-primary mb-3">Datos del Cliente</h6>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control name="s_nombre_completo" value={formData.s_nombre_completo} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>RFC</Form.Label>
                  <Form.Control name="s_rfc" value={formData.s_rfc} onChange={handleChange} maxLength="13" required />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Municipio</Form.Label>
                  <Form.Control name="s_municipio" value={formData.s_municipio} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Giro Comercial</Form.Label>
                  <Form.Control name="s_giro_comercial" value={formData.s_giro_comercial} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="text-primary mb-3">Condiciones del Crédito</h6>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Monto Otorgado ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.01" 
                    min="1" /* Evita negativos y ceros */
                    name="n_monto_otorgado" 
                    value={formData.n_monto_otorgado} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Tasa de Interés (%)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.01" 
                    min="0" /* Permite 0 pero no negativos */
                    name="n_tasa_interes" 
                    value={formData.n_tasa_interes} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Plazo (Meses)</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="1" /* Mínimo 1 mes */
                    name="n_plazo_meses" 
                    value={formData.n_plazo_meses} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button variant="primary" type="submit">Guardar Crédito</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}