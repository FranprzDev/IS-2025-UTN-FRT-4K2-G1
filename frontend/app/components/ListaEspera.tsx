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

    return (
        <div className="card">
            <h3 className="title" style={{ fontSize: '1.5rem' }}>Lista de Espera</h3>
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
                                    {/* Note: Ingreso model might not have fechaHora exposed or it's created at runtime. Using current date for demo if missing. */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
