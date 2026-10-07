import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Alert, Button, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import Swal from 'sweetalert2';

export default function Cartera() {
  const [creditos, setCreditos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluandoId, setEvaluandoId] = useState(null);
  
  // Estados para Filtros y Búsqueda
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

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

  // Evaluación de Riesgo con Modelo ML + SweetAlert2
  const handleEvaluarRiesgo = async (idCredito) => {
    setEvaluandoId(idCredito);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/riesgo/evaluar/${idCredito}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Error al ejecutar la evaluación de riesgo');

      const data = await response.json();
      
      const nivel = data.nivel_riesgo || data.s_nivel_riesgo || 'N/A';
      const probRaw = data.probabilidad_impago ?? data.n_probabilidad_impago ?? 0;
      const probPorcentaje = (probRaw * 100).toFixed(1);
      const recomendacion = data.recomendacion || data.s_recomendacion || '';

      const nivelUpper = nivel.toUpperCase();
      const colorRiesgo = nivelUpper === 'ALTO' ? '#dc3545' : nivelUpper === 'MEDIO' ? '#ffc107' : '#198754';
      const iconRiesgo = nivelUpper === 'ALTO' ? 'warning' : nivelUpper === 'MEDIO' ? 'info' : 'success';

      Swal.fire({
        title: `Evaluación Crédito #${idCredito}`,
        icon: iconRiesgo,
        html: `
          <div style="text-align: left; font-size: 0.95rem; line-height: 1.5; margin-top: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 10px 14px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e9ecef;">
              <span style="font-weight: 600; color: #495057;">Nivel de Riesgo:</span>
              <span style="background-color: ${colorRiesgo}; color: ${nivelUpper === 'MEDIO' ? '#000' : '#fff'}; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 0.85rem; text-transform: uppercase;">
                ${nivel}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 10px 14px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e9ecef;">
              <span style="font-weight: 600; color: #495057;">Probabilidad de Impago:</span>
              <span style="font-weight: bold; font-size: 1.1rem; color: #212529;">${probPorcentaje}%</span>
            </div>
            <div style="background: #f8f9fa; padding: 12px 14px; border-radius: 8px; border: 1px solid #e9ecef;">
              <span style="font-weight: 600; color: #495057; display: block; margin-bottom: 4px;">Recomendación:</span>
              <span style="color: #6c757d;">${recomendacion}</span>
            </div>
          </div>
        `,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0d6efd',
        customClass: {
          popup: 'rounded-4 shadow-lg'
        }
      });

      // Recargar la lista para reflejar si el estado cambió
      fetchCreditos();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error de evaluación',
        text: err.message,
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setEvaluandoId(null);
    }
  };

  // Exportación de Reportes a CSV (HU-011)
  const handleExportarCSV = () => {
    if (!creditosFiltrados || creditosFiltrados.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin datos',
        text: 'No hay registros en la vista actual para exportar.',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    const headers = ["ID Credito", "Cliente", "RFC", "Monto Otorgado", "Tasa %", "Plazo (Meses)", "Estado"];
    const rows = creditosFiltrados.map(c => [
      c.id_credito || c.id,
      `"${c.cliente || ''}"`,
      `"${c.rfc || ''}"`,
      c.monto || c.n_monto_otorgado,
      c.tasa || c.n_tasa_interes,
      c.plazo || c.n_plazo_meses,
      `"${c.estado || c.s_estado}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Cartera_FOFOMI_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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
        fetchCreditos();
        
        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: 'El crédito ha sido registrado correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar el crédito',
        confirmButtonColor: '#dc3545'
      });
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

  // Filtrado dinámico
  const creditosFiltrados = creditos.filter((credito) => {
    const estadoActual = credito.estado || credito.s_estado;
    const clienteActual = credito.cliente || '';
    const rfcActual = credito.rfc || '';

    const cumpleEstado = filtroEstado === 'Todos' || estadoActual === filtroEstado;
    const termino = busqueda.toLowerCase();
    const cumpleBusqueda = 
      clienteActual.toLowerCase().includes(termino) ||
      rfcActual.toLowerCase().includes(termino);

    return cumpleEstado && cumpleBusqueda;
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Cartera de Créditos</h2>
          <p className="text-muted mb-0">Consulta y gestión de financiamientos FOFOMI.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-success" onClick={handleExportarCSV} className="shadow-sm d-flex align-items-center gap-1">
            <DownloadIcon fontSize="small" /> Exportar CSV
          </Button>
          <Button variant="primary" onClick={() => setShowModal(true)} className="shadow-sm">
            + Nuevo Crédito
          </Button>
        </div>
      </div>

      {/* Barra de Filtros y Buscador */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-3">
          <Row className="g-3">
            <Col md={7}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <SearchIcon className="text-muted" fontSize="small" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por cliente o RFC..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="border-start-0 ps-0"
                />
              </InputGroup>
            </Col>

            <Col md={5}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <FilterListIcon className="text-muted" fontSize="small" />
                </InputGroup.Text>
                <Form.Select 
                  value={filtroEstado} 
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="border-start-0"
                >
                  <option value="Todos">Todos los Estados</option>
                  <option value="Al corriente">Al corriente</option>
                  <option value="En riesgo">En riesgo</option>
                  <option value="Vencido">Vencido</option>
                  <option value="Liquidado">Liquidado</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabla de Créditos */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2 mb-0">Cargando cartera...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="m-3">{error}</Alert>
          ) : creditosFiltrados.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No se encontraron créditos que coincidan con los criterios de búsqueda.
            </div>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>RFC</th>
                  <th>Monto</th>
                  <th>Tasa</th>
                  <th>Plazo</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {creditosFiltrados.map((credito) => {
                  const id = credito.id_credito || credito.id;
                  const estado = credito.estado || credito.s_estado;
                  return (
                    <tr key={id}>
                      <td className="text-muted fw-bold">#{id}</td>
                      <td className="fw-semibold">{credito.cliente}</td>
                      <td>{credito.rfc}</td>
                      <td>${(credito.monto || credito.n_monto_otorgado)?.toLocaleString('es-MX')}</td>
                      <td>{credito.tasa || credito.n_tasa_interes}%</td>
                      <td>{credito.plazo || credito.n_plazo_meses} meses</td>
                      <td>
                        <Badge bg={getColorEstado(estado)} className="px-3 py-2">
                          {estado}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline-warning"
                          size="sm"
                          disabled={evaluandoId === id}
                          onClick={() => handleEvaluarRiesgo(id)}
                        >
                          {evaluandoId === id ? 'Evaluando...' : 'Evaluar Riesgo'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal para registrar nuevo crédito */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Registrar Nuevo Crédito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <h6 className="text-primary fw-bold mb-3">Datos del Cliente</h6>
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

            <h6 className="text-primary fw-bold mb-3">Condiciones del Crédito</h6>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Monto Otorgado ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.01" 
                    min="1"
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
                    min="0"
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
                    min="1"
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