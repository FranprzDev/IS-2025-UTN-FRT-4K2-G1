'use client';

import { useState } from 'react';

export default function UsuarioForm({ onSuccess }: { onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rol: 'administrativo'
    });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al crear usuario');
            setMessage('Usuario creado exitosamente');
            setFormData({ email: '', password: '', rol: 'administrativo' });
            if (onSuccess) {
                setTimeout(() => onSuccess(), 1000);
            }
        } catch (err: any) {
            setMessage('Error: ' + err.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="card">
            <h3 className="title" style={{ fontSize: '1.5rem' }}>Crear Usuario</h3>
            {message && <p style={{ color: message.startsWith('Error') ? 'var(--error)' : 'var(--success)' }}>{message}</p>}
            <form onSubmit={handleSubmit} className="grid">
                <div>
                    <label className="label">Email</label>
                    <input 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="input" 
                        required 
                    />
                </div>
                <div>
                    <label className="label">Contraseña</label>
                    <input 
                        name="password" 
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        className="input" 
                        required 
                        minLength={8}
                    />
                </div>
                <div>
                    <label className="label">Rol</label>
                    <select 
                        name="rol" 
                        value={formData.rol} 
                        onChange={handleChange} 
                        className="input"
                    >
                        <option value="administrativo">Administrativo</option>
                        <option value="MEDICO">Médico</option>
                        <option value="ENFERMERA">Enfermera</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Crear Usuario</button>
            </form>
        </div>
    );
}






