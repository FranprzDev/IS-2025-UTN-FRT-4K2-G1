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
    const [loadingCuil, setLoadingCuil] = useState<string>('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [selectedIngresoCuil, setSelectedIngresoCuil] = useState<string>('');
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
                const email: string = payload.email || '';
                const baseName = email.split('@')[0] || 'medico';
                setDoctorData({
                    nombre: baseName,
                    apellido: 'Cuenta',
                    cuil: '20123456789',
                    matricula: 'MAT-DEFAULT'
                });
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

    const handleReclamarPaciente = async (ingresoCuil?: string) => {
        if (ingresoCuil) {
            setSelectedIngresoCuil(ingresoCuil);
        }
        const objetivo = ingresoCuil || selectedIngresoCuil;
        setLoadingCuil(objetivo);
        setMessage(`Reclamando paciente ${objetivo || ''}...`);
        setToastType('success');

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/reclamo/reclamar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...doctorData,
                    ingresoCuil: ingresoCuil || selectedIngresoCuil
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setMessage(`Paciente ${objetivo || ''} reclamado exitosamente`);
            setToastType('success');
            setTimeout(() => {
                setMessage('');
                setIngresos(prev => prev.filter(ingreso => ingreso.paciente.cuil.valor !== (ingresoCuil || selectedIngresoCuil)));
            }, 2000);
        } catch (err: any) {
            setToastType('error');
            setMessage('Error: ' + err.message);
        }
        setLoadingCuil('');
    };

    return (
        <>
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="title" style={{ fontSize: '1.5rem', margin: 0 }}>Lista de Espera</h3>
            </div>

            {message && (
                <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    background: toastType === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: toastType === 'error' ? 'var(--error)' : 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {loadingCuil && toastType !== 'error' && (
                        <span className="spinner" style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid var(--primary)',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'spin 0.8s linear infinite'
                        }} />
                    )}
                    <span>{message}</span>
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
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>{new Date().toLocaleDateString()}</span>
                                            {userRole === 'medico' && (
                                                <button
                                                    onClick={() => handleReclamarPaciente(ingreso.paciente.cuil.valor)}
                                                    className="btn"
                                                    style={{
                                                        padding: '0.35rem 0.5rem',
                                                        minWidth: '2.5rem',
                                                        background: 'rgba(59,130,246,0.15)',
                                                        opacity: loadingCuil === ingreso.paciente.cuil.valor ? 0.6 : 1,
                                                        cursor: loadingCuil === ingreso.paciente.cuil.valor ? 'wait' : 'pointer'
                                                    }}
                                                    aria-label="Reclamar paciente"
                                                    disabled={loadingCuil === ingreso.paciente.cuil.valor}
                                                >
                                                    {loadingCuil === ingreso.paciente.cuil.valor ? '...' : '⚡'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        <style jsx>{`
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `}</style>
        </>
    );
}
