'use client';

import { useEffect, useState } from 'react';

interface Ingreso {
    paciente: {
        nombre: string;
        apellido: string;
        cuil: { valor: string };
    };
    nivelEmergencia: { descripcion: string };
    fechaHora: string;
}

export default function ListaEspera({ refreshTrigger }: { refreshTrigger: number }) {
    const [ingresos, setIngresos] = useState<Ingreso[]>([]);
    const [userRole, setUserRole] = useState<string>('');
    const [message, setMessage] = useState('');
    const [showDoctorForm, setShowDoctorForm] = useState(false);
    const [doctorData, setDoctorData] = useState({
        nombre: '',
        apellido: '',
        cuil: '',
        matricula: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserRole(payload.rol || '');
            } catch (error) {
                console.error('Error decodificando token:', error);
            }
        }
    }, []);

    useEffect(() => {
        fetch('/api/urgencias/lista-espera')
            .then(res => res.json())
            .then(data => setIngresos(data))
            .catch(err => console.error(err));
    }, [refreshTrigger]);

    const getNivelColor = (nivel: string) => {
        switch (nivel) {
            case 'Critica': return '#ef4444';
            case 'Emergencia': return '#f97316';
            case 'Urgencia': return '#eab308';
            default: return '#3b82f6';
        }
    };

    const handleReclamarPaciente = async () => {
        if (!doctorData.nombre || !doctorData.apellido || !doctorData.cuil || !doctorData.matricula) {
            setShowDoctorForm(true);
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/reclamo/reclamar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(doctorData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setMessage('Paciente reclamado exitosamente');
            setTimeout(() => {
                setMessage('');
                window.location.reload();
            }, 2000);
        } catch (err: any) {
            setMessage('Error: ' + err.message);
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="title" style={{ fontSize: '1.5rem', margin: 0 }}>Lista de Espera</h3>
                {userRole === 'medico' && (
                    <button
                        onClick={handleReclamarPaciente}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        Reclamar Próximo Paciente
                    </button>
                )}
            </div>

            {message && (
                <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    background: message.startsWith('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: message.startsWith('Error') ? 'var(--error)' : 'var(--success)'
                }}>
                    {message}
                </div>
            )}

            {showDoctorForm && (
                <div style={{
                    padding: '1.5rem',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem'
                }}>
                    <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Datos del Médico</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={doctorData.nombre}
                            onChange={(e) => setDoctorData({ ...doctorData, nombre: e.target.value })}
                            className="input"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Apellido"
                            value={doctorData.apellido}
                            onChange={(e) => setDoctorData({ ...doctorData, apellido: e.target.value })}
                            className="input"
                            required
                        />
                        <input
                            type="text"
                            placeholder="CUIL (XX-XXXXXXXX-X)"
                            value={doctorData.cuil}
                            onChange={(e) => setDoctorData({ ...doctorData, cuil: e.target.value })}
                            className="input"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Matrícula"
                            value={doctorData.matricula}
                            onChange={(e) => setDoctorData({ ...doctorData, matricula: e.target.value })}
                            className="input"
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button
                            onClick={() => {
                                if (doctorData.nombre && doctorData.apellido && doctorData.cuil && doctorData.matricula) {
                                    handleReclamarPaciente();
                                }
                            }}
                            className="btn btn-primary"
                        >
                            Confirmar y Reclamar
                        </button>
                        <button
                            onClick={() => setShowDoctorForm(false)}
                            className="btn"
                            style={{ background: 'var(--card-border)' }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                            <th style={{ padding: '1rem' }}>Paciente</th>
                            <th style={{ padding: '1rem' }}>CUIL</th>
                            <th style={{ padding: '1rem' }}>Nivel</th>
                            <th style={{ padding: '1rem' }}>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingresos.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: 'var(--secondary)' }}>
                                    No hay pacientes en espera
                                </td>
                            </tr>
                        ) : (
                            ingresos.map((ingreso, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                    <td style={{ padding: '1rem' }}>{ingreso.paciente.nombre} {ingreso.paciente.apellido}</td>
                                    <td style={{ padding: '1rem' }}>{ingreso.paciente.cuil.valor}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.875rem',
                                            background: `${getNivelColor(ingreso.nivelEmergencia.descripcion)}20`,
                                            color: getNivelColor(ingreso.nivelEmergencia.descripcion)
                                        }}>
                                            {ingreso.nivelEmergencia.descripcion}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{new Date().toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
