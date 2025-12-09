'use client';

import { useEffect, useState } from 'react';

interface ValorCuil {
  valor: string;
}

interface PacienteListado {
  nombre: string;
  apellido: string;
  cuil: ValorCuil;
  email?: { valor: string };
  domicilio?: { calle: string; numero: string; localidad: string };
  afiliado?: { numeroAfiliado: string; obraSocial: { nombre: string } };
}

export default function PacientesLista() {
  const [pacientes, setPacientes] = useState<PacienteListado[]>([]);
  const [mensaje, setMensaje] = useState<string>('');
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const cargar = async (): Promise<void> => {
      try {
        const res = await fetch('/api/urgencias/pacientes');
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || 'Error al obtener pacientes');
        }
        const data = await res.json();
        setPacientes(data);
      } catch (error: any) {
        setTipoMensaje('error');
        setMensaje(error.message || 'Error al obtener pacientes');
      }
    };
    cargar();
  }, []);

  return (
    <div className="card">
      <div className="header">
        <h3>Pacientes registrados</h3>
        <span className="badge">{pacientes.length} en total</span>
      </div>
      {mensaje && (
        <div
          className={`alert ${tipoMensaje === 'error' ? 'alert-error' : 'alert-success'}`}
        >
          {mensaje}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>CUIL</th>
              <th>Obra social</th>
              <th>Email</th>
              <th>Domicilio</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty">No hay pacientes registrados</td>
              </tr>
            ) : (
              pacientes.map((p) => (
                <tr key={p.cuil.valor}>
                  <td>{p.nombre} {p.apellido}</td>
                  <td>{p.cuil.valor}</td>
                  <td>{p.afiliado?.obraSocial?.nombre || 'N/A'}</td>
                  <td>{p.email?.valor || 'N/A'}</td>
                  <td>
                    {p.domicilio
                      ? `${p.domicilio.calle} ${p.domicilio.numero}, ${p.domicilio.localidad}`
                      : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 0.75rem;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .badge {
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.1);
          color: var(--primary);
          font-weight: 700;
        }
        .alert {
          padding: 0.75rem;
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
        .table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        th, td {
          padding: 0.85rem;
          border-bottom: 1px solid var(--card-border);
        }
        th {
          font-weight: 700;
          color: var(--foreground);
        }
        td {
          color: var(--foreground);
        }
        .empty {
          text-align: center;
          color: var(--secondary);
        }
      `}</style>
    </div>
  );
}

