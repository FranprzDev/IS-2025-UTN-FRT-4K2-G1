'use client';

import { useState } from 'react';

export default function PacienteForm({ onSuccess }: { onSuccess: (cuil: string) => void }) {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        cuil: '',
        obraSocial: '',
        email: '',
        numeroAfiliado: '',
        calle: '',
        numero: '',
        localidad: ''
    });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting PacienteForm...');
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/urgencias/crear-paciente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            console.log('PacienteForm response status:', res.status);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setMessage('Paciente creado exitosamente');
            onSuccess(formData.cuil);
        } catch (err: any) {
            console.error('PacienteForm error:', err);
            setMessage('Error: ' + err.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="card">
            <h3 className="title" style={{ fontSize: '1.5rem' }}>Nuevo Paciente</h3>
            {message && <p style={{ color: message.startsWith('Error') ? 'var(--error)' : 'var(--success)' }}>{message}</p>}
            <form onSubmit={handleSubmit} className="grid grid-2">
                <input name="nombre" placeholder="Nombre" className="input" onChange={handleChange} required />
                <input name="apellido" placeholder="Apellido" className="input" onChange={handleChange} required />
                <input name="cuil" placeholder="CUIL (XX-XXXXXXXX-X)" className="input" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" className="input" onChange={handleChange} />
                <input name="obraSocial" placeholder="Obra Social" className="input" onChange={handleChange} required />
                <input name="numeroAfiliado" placeholder="N° Afiliado" className="input" onChange={handleChange} />
                <input name="calle" placeholder="Calle" className="input" onChange={handleChange} />
                <input name="numero" placeholder="Número" className="input" onChange={handleChange} />
                <input name="localidad" placeholder="Localidad" className="input" onChange={handleChange} />
                <div style={{ gridColumn: '1 / -1' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Crear Paciente</button>
                </div>
            </form>
        </div>
    );
}
