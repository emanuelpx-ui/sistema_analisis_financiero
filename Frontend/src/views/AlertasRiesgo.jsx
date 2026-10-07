import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Card, Spinner } from 'react-bootstrap';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function AlertasRiesgo() {
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerAlertas = async () => {
    try {
      setCargando(true);
      const res = await fetch('http://localhost:8000/api/riesgo');
      if (res.ok) {
        const data = await res.json();
        setAlertas(data);
      }
    } catch (error) {
      console.error("Error al obtener alertas de riesgo:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerAlertas();
  }, []);

  const getBadgeVariant = (nivel) => {
    switch (nivel?.toLowerCase()) {
      case 'alto':
        return 'danger';
      case 'medio':
        return 'warning';
      case 'bajo':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div>
      {/* Encabezado y botón alineados */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Alertas de Riesgo</h2>
          <p className="text-muted mb-0">Monitoreo de evaluaciones del modelo predictivo</p>
        </div>
        <Button 
          variant="primary" 
          onClick={obtenerAlertas}
          disabled={cargando}
          className="d-flex align-items-center gap-2 shadow-sm"
        >
          <RefreshIcon fontSize="small" />
          {cargando ? 'Cargando...' : 'Actualizar Alertas'}
        </Button>
      </div>

      {/* Contenedor tipo Tarjeta de Bootstrap */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          {cargando ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2 mb-0">Cargando alertas del servidor...</p>
            </div>
          ) : alertas.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No hay alertas de riesgo registradas.
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Crédito ID</th>
                  <th>Prob. Impago</th>
                  <th>Nivel de Riesgo</th>
                  <th>Recomendación</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {alertas.map((alerta) => (
                  <tr key={alerta.id}>
                    <td className="fw-bold">#{alerta.id_credito}</td>
                    <td className="fw-semibold">
                      {(alerta.n_probabilidad_impago * 100).toFixed(1)}%
                    </td>
                    <td>
                      <Badge bg={getBadgeVariant(alerta.s_nivel_riesgo)} className="px-3 py-2">
                        {alerta.s_nivel_riesgo}
                      </Badge>
                    </td>
                    <td>{alerta.s_recomendacion || "Sin recomendación"}</td>
                    <td className="text-muted small">
                      {alerta.f_created_at ? new Date(alerta.f_created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}