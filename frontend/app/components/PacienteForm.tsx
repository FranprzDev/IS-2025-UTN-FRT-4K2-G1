'use client';

import { useState } from 'react';

type PacienteFormData = {
    nombre: string;
    apellido: string;
    cuil: string;
    obraSocial: string;
    email: string;
    numeroAfiliado: string;
    calle: string;
    numero: string;
    localidad: string;
};

type PacienteFormProps = {
    onSuccess: (cuil: string) => void;
};

export default function PacienteForm({ onSuccess }: PacienteFormProps) {
    const [formData, setFormData] = useState<PacienteFormData>({
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
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Submitting PacienteForm...', formData);
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
                <div>
                    <label className="label">
                        Nombre
                        <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>
                    </label>
                    <input name="nombre" value={formData.nombre} placeholder="Nombre" className="input" onChange={handleChange} required />
                </div>
                <div>
                    <label className="label">
                        Apellido
                        <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>
                    </label>
                    <input name="apellido" value={formData.apellido} placeholder="Apellido" className="input" onChange={handleChange} required />
                </div>
                <div>
                    <label className="label">
                        CUIL (XX-XXXXXXXX-X)
                        <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>
                    </label>
                    <input name="cuil" value={formData.cuil} placeholder="CUIL (XX-XXXXXXXX-X)" className="input" onChange={handleChange} required />
                </div>
                <div>
                    <label className="label">Email</label>
                    <input name="email" type="email" value={formData.email} placeholder="Email" className="input" onChange={handleChange} />
                </div>
                <div>
                    <label className="label">Obra Social</label>
                    <input name="obraSocial" value={formData.obraSocial} placeholder="Obra Social" className="input" onChange={handleChange} />
                </div>
                <div>
                    <label className="label">N° Afiliado</label>
                    <input name="numeroAfiliado" value={formData.numeroAfiliado} placeholder="N° Afiliado" className="input" onChange={handleChange} />
                </div>
                <div>
                    <label className="label">
                        Calle
                        <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>
                    </label>
                    <input name="calle" value={formData.calle} placeholder="Calle" className="input" onChange={handleChange} required />
                </div>
                <div>
                    <label className="label">
                        Número
                        <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>
                    </label>
                    <input name="numero" value={formData.numero} placeholder="Número" className="input" onChange={handleChange} required />
                </div>
                <div>
                    <label className="label">
                        Localidad
                        <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>
                    </label>
                    <input name="localidad" value={formData.localidad} placeholder="Localidad" className="input" onChange={handleChange} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Crear Paciente</button>
                </div>
            </form>
        </div>
    );
}
