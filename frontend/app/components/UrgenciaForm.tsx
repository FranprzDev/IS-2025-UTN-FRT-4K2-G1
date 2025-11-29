'use client';

import { useState, useEffect } from 'react';

export default function UrgenciaForm({ defaultCuil, onSuccess }: { defaultCuil?: string, onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        cuil: defaultCuil || '',
        informe: '',
        nivelEmergencia: 'Urgencia',
        temperatura: 36.5,
        frecuenciaCardiaca: 80,
        frecuenciaRespiratoria: 16,
        frecuenciaSistolica: 120,
        frecuenciaDiastolica: 80,
        enfermera: {
            nombre: 'Ana',
            apellido: 'García',
            cuil: '27123456789',
            matricula: 'ENF1234',
            email: 'ana@hospital.com'
        }
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (defaultCuil) {
            setFormData(prev => ({ ...prev, cuil: defaultCuil }));
        }
    }, [defaultCuil]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting UrgenciaForm...');
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/urgencias/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            console.log('UrgenciaForm response status:', res.status);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setMessage('Urgencia registrada exitosamente');
            onSuccess();
        } catch (err: any) {
            console.error('UrgenciaForm error:', err);
            setMessage('Error: ' + err.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="card">
            <h3 className="title" style={{ fontSize: '1.5rem' }}>Registrar Urgencia</h3>
            {message && <p style={{ color: message.startsWith('Error') ? 'var(--error)' : 'var(--success)' }}>{message}</p>}
            <form onSubmit={handleSubmit} className="grid">
                <div>
                    <label className="label">CUIL Paciente</label>
                    <input name="cuil" value={formData.cuil} onChange={handleChange} className="input" required />
                </div>

                <div className="grid grid-2">
                    <div>
                        <label className="label">Nivel Emergencia</label>
                        <select name="nivelEmergencia" value={formData.nivelEmergencia} onChange={handleChange} className="input">
                            <option value="Critica">Crítica</option>
                            <option value="Emergencia">Emergencia</option>
                            <option value="Urgencia">Urgencia</option>
                            <option value="Urgencia Menor">Urgencia Menor</option>
                            <option value="Sin Urgencia">Sin Urgencia</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Temperatura (°C)</label>
                        <input name="temperatura" type="number" step="0.1" value={formData.temperatura} onChange={handleChange} className="input" required />
                    </div>
                    <div>
                        <label className="label">Frec. Cardíaca (bpm)</label>
                        <input name="frecuenciaCardiaca" type="number" value={formData.frecuenciaCardiaca} onChange={handleChange} className="input" required />
                    </div>
                    <div>
                        <label className="label">Frec. Respiratoria (rpm)</label>
                        <input name="frecuenciaRespiratoria" type="number" value={formData.frecuenciaRespiratoria} onChange={handleChange} className="input" required />
                    </div>
                    <div>
                        <label className="label">Presión Sistólica</label>
                        <input name="frecuenciaSistolica" type="number" value={formData.frecuenciaSistolica} onChange={handleChange} className="input" required />
                    </div>
                    <div>
                        <label className="label">Presión Diastólica</label>
                        <input name="frecuenciaDiastolica" type="number" value={formData.frecuenciaDiastolica} onChange={handleChange} className="input" required />
                    </div>
                </div>

                <div>
                    <label className="label">Informe / Motivo</label>
                    <textarea name="informe" value={formData.informe} onChange={handleChange} className="input" rows={3} required />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Registrar Ingreso</button>
            </form>
        </div>
    );
}
