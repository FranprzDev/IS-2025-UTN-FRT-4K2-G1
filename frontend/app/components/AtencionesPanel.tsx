'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

interface ValorCuil {
  valor: string;
}

interface PacienteIngreso {
  nombre: string;
  apellido: string;
  cuil: ValorCuil;
}

interface IngresoDetalle {
  paciente: PacienteIngreso;
  estado?: string;
  nivelEmergencia?: { descripcion: string };
}

interface AtencionDetalle {
  informe: string;
  fecha: string;
  ingreso: IngresoDetalle;
}

export default function AtencionesPanel({
  refreshTrigger,
}: {
  refreshTrigger: number;
}) {
  const [misIngresos, setMisIngresos] = useState<IngresoDetalle[]>([]);
  const [atenciones, setAtenciones] = useState<AtencionDetalle[]>([]);
  const [mensaje, setMensaje] = useState<string>('');
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error'>('success');
  const [atencionCuil, setAtencionCuil] = useState<string>('');
  const [informe, setInforme] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [selectedInformeCuil, setSelectedInformeCuil] = useState<string>('');

  const token = useMemo(() => localStorage.getItem('token') || '', []);

  const fetchMisIngresos = useCallback(async (): Promise<void> => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/reclamo/mis-ingresos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Error al obtener ingresos');
      }
      const data = await res.json();
      setMisIngresos(data);
    } catch (error: any) {
      setTipoMensaje('error');
      setMensaje(error.message || 'Error al obtener ingresos');
    }
    setLoadingData(false);
  }, [token]);

  const fetchAtenciones = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch('/api/atencion/mis-atenciones', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Error al obtener atenciones');
      }
      const data = await res.json();
      setAtenciones(data);
    } catch (error: any) {
      setTipoMensaje('error');
      setMensaje(error.message || 'Error al obtener atenciones');
    }
  }, [token]);

  useEffect(() => {
    fetchMisIngresos();
    fetchAtenciones();
  }, [fetchMisIngresos, fetchAtenciones, refreshTrigger]);

  const enProceso = useMemo(
    () =>
      misIngresos.filter(
        (ingreso) => ingreso.estado?.toLowerCase() === 'en proceso',
      ),
    [misIngresos],
  );

  const finalizados = useMemo(
    () =>
      misIngresos.filter(
        (ingreso) => ingreso.estado?.toLowerCase() === 'finalizado',
      ),
    [misIngresos],
  );

  useEffect(() => {
    if (!atencionCuil && enProceso[0]) {
      setAtencionCuil(enProceso[0].paciente.cuil.valor);
    }
  }, [atencionCuil, enProceso]);

  const handleRegistrarAtencion = async (): Promise<void> => {
    if (!atencionCuil || atencionCuil.trim() === '') {
      setTipoMensaje('error');
      setMensaje('Debe seleccionar un paciente en proceso');
      return;
    }
    if (!informe || informe.trim() === '') {
      setTipoMensaje('error');
      setMensaje('Se ha omitido el informe de la atención');
      return;
    }
    setLoading(true);
    setTipoMensaje('success');
    setMensaje('Registrando atención...');
    try {
      const res = await fetch('/api/atencion/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ingresoCuil: atencionCuil,
          informe,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar la atención');
      }
      setTipoMensaje('success');
      setMensaje('Atención registrada exitosamente');
      setInforme('');
      setAtencionCuil('');
      await fetchMisIngresos();
      await fetchAtenciones();
    } catch (error: any) {
      setTipoMensaje('error');
      setMensaje(error.message || 'Error al registrar la atención');
    }
    setLoading(false);
  };

  const obtenerInforme = (cuil: string): string => {
    const atencion = atenciones.find(
      (a) => a.ingreso.paciente.cuil.valor === cuil,
    );
    return atencion?.informe || 'Informe no disponible';
  };

  const pacienteActual = enProceso[0];
  const informeSeleccionado =
    selectedInformeCuil !== ''
      ? obtenerInforme(selectedInformeCuil)
      : null;

  return (
    <div className="layout">
      <div className="panel">
        <div className="panel-header">
          <h3>Paciente en proceso</h3>
          <span className="badge">
            {enProceso.length > 0 ? 'En atención' : 'Sin pacientes'}
          </span>
        </div>
        {mensaje && (
          <div
            className={`alert ${tipoMensaje === 'error' ? 'alert-error' : 'alert-success'}`}
          >
            {mensaje}
          </div>
        )}
        {loadingData ? (
          <div className="placeholder">Cargando...</div>
        ) : pacienteActual ? (
          <>
            <div className="card-grid">
              <div className="card-item">
                <p className="label">Paciente</p>
                <p className="value">
                  {pacienteActual.paciente.nombre} {pacienteActual.paciente.apellido}
                </p>
              </div>
              <div className="card-item">
                <p className="label">CUIL</p>
                <p className="value">{pacienteActual.paciente.cuil.valor}</p>
              </div>
              <div className="card-item">
                <p className="label">Estado</p>
                <p className="value">{pacienteActual.estado || 'En proceso'}</p>
              </div>
              <div className="card-item">
                <p className="label">Nivel</p>
                <p className="value">
                  {pacienteActual.nivelEmergencia?.descripcion || 'N/D'}
                </p>
              </div>
            </div>
            <div className="form">
              <label className="label">Informe</label>
              <textarea
                value={informe}
                onChange={(e) => setInforme(e.target.value)}
                rows={4}
              />
              <button
                className="btn-primary"
                onClick={handleRegistrarAtencion}
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrar atención'}
              </button>
            </div>
          </>
        ) : (
          <div className="placeholder">
            Reclame un paciente desde la lista de espera para iniciar una atención.
          </div>
        )}
      </div>
      <div className="panel">
        <div className="panel-header">
          <h3>Historial de pacientes reclamados</h3>
          <span className="badge muted">
            {finalizados.length} finalizados
          </span>
        </div>
        {finalizados.length === 0 ? (
          <div className="placeholder">Aún no tienes atenciones finalizadas.</div>
        ) : (
          <div className="history-list">
            {finalizados.map((ingreso) => (
              <div key={ingreso.paciente.cuil.valor} className="history-item">
                <div>
                  <p className="value">
                    {ingreso.paciente.nombre} {ingreso.paciente.apellido}
                  </p>
                  <p className="label">{ingreso.paciente.cuil.valor}</p>
                </div>
                <div className="history-actions">
                  <span className="badge success">{ingreso.estado}</span>
                  <button
                    className="btn-secondary"
                    onClick={() =>
                      setSelectedInformeCuil((prev) =>
                        prev === ingreso.paciente.cuil.valor ? '' : ingreso.paciente.cuil.valor,
                      )
                    }
                  >
                    {selectedInformeCuil === ingreso.paciente.cuil.valor
                      ? 'Ocultar informe'
                      : 'Ver informe'}
                  </button>
                </div>
                {selectedInformeCuil === ingreso.paciente.cuil.valor && (
                  <div className="informe">
                    {obtenerInforme(ingreso.paciente.cuil.valor)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        .layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 1rem;
        }
        .panel {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 0.75rem;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .badge {
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.1);
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .badge.muted {
          background: rgba(148, 163, 184, 0.2);
          color: var(--secondary);
        }
        .badge.success {
          background: rgba(34, 197, 94, 0.1);
          color: var(--success);
        }
        .alert {
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
        }
        .alert-error {
          background: rgba(239, 68, 68, 0.12);
          color: var(--error);
        }
        .alert-success {
          background: rgba(34, 197, 94, 0.12);
          color: var(--success);
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
        }
        .card-item {
          padding: 0.75rem;
          border: 1px solid var(--card-border);
          border-radius: 0.5rem;
          background: var(--background);
        }
        .label {
          margin: 0;
          color: var(--secondary);
          font-size: 0.85rem;
        }
        .value {
          margin: 0.15rem 0 0 0;
          font-weight: 600;
          color: var(--foreground);
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        textarea {
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--card-border);
          background: transparent;
          color: var(--foreground);
          resize: vertical;
        }
        .btn-primary {
          background: linear-gradient(90deg, #2563eb, #7c3aed);
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .placeholder {
          padding: 1rem;
          border: 1px dashed var(--card-border);
          border-radius: 0.5rem;
          color: var(--secondary);
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .history-item {
          border: 1px solid var(--card-border);
          border-radius: 0.5rem;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .history-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-secondary {
          border: 1px solid var(--card-border);
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          background: transparent;
          color: var(--foreground);
          cursor: pointer;
        }
        .informe {
          margin-top: 0.5rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          background: rgba(59, 130, 246, 0.08);
          color: var(--foreground);
          white-space: pre-wrap;
        }
        @media (max-width: 1024px) {
          .layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

