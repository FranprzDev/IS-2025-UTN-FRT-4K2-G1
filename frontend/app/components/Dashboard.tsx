'use client';

import { useState, useEffect } from 'react';
import PacienteForm from './PacienteForm';
import UrgenciaForm from './UrgenciaForm';
import ListaEspera from './ListaEspera';
import UsuarioForm from './UsuarioForm';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'registro' | 'urgencia' | 'lista' | 'usuarios'>('registro');
    const [selectedCuil, setSelectedCuil] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [userName, setUserName] = useState('Administrativo');
    const [userRole, setUserRole] = useState<string>('administrativo');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserRole(payload.rol || 'administrativo');
            setUserName(payload.email?.split('@')[0] || 'Usuario');
        } catch (error) {
            console.error('Error decodificando token:', error);
        }
    }, [router]);

    const handlePacienteSuccess = (cuil: string) => {
        setSelectedCuil(cuil);
        setActiveTab('urgencia');
    };

    const handleUrgenciaSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
        setSelectedCuil('');
        setActiveTab('lista');
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="logo-area">
                    <h2>🏥 Sistema de Urgencias</h2>
                </div>

                <nav className="nav-menu">
                    <button
                        className={`nav-item ${activeTab === 'registro' ? 'active' : ''}`}
                        onClick={() => setActiveTab('registro')}
                    >
                        <span>👤</span> Nuevo Paciente
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'urgencia' ? 'active' : ''}`}
                        onClick={() => setActiveTab('urgencia')}
                    >
                        <span>🚑</span> Ingresar Urgencia
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'lista' ? 'active' : ''}`}
                        onClick={() => setActiveTab('lista')}
                    >
                        <span>📋</span> Lista de Espera
                    </button>
                    {userRole === 'administrativo' && (
                        <button
                            className={`nav-item ${activeTab === 'usuarios' ? 'active' : ''}`}
                            onClick={() => setActiveTab('usuarios')}
                        >
                            <span>👨‍⚕️</span> Crear Usuario
                        </button>
                    )}
                </nav>

                <div className="user-profile">
                    <div className="avatar">A</div>
                    <div className="info">
                        <p className="name">{userName}</p>
                        <button onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/');
                        }} className="logout-btn">Cerrar Sesión</button>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <h1>
                        {activeTab === 'registro' && 'Registro de Pacientes'}
                        {activeTab === 'urgencia' && 'Ingreso de Urgencia'}
                        {activeTab === 'lista' && 'Sala de Espera'}
                        {activeTab === 'usuarios' && 'Gestión de Usuarios'}
                    </h1>
                    <div className="date-display">
                        {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                <div className="content-area">
                    {activeTab === 'registro' && (
                        <div className="fade-in">
                            <PacienteForm onSuccess={handlePacienteSuccess} />
                        </div>
                    )}

                    {activeTab === 'urgencia' && (
                        <div className="fade-in">
                            <UrgenciaForm defaultCuil={selectedCuil} onSuccess={handleUrgenciaSuccess} />
                        </div>
                    )}

                    {activeTab === 'lista' && (
                        <div className="fade-in">
                            <ListaEspera refreshTrigger={refreshTrigger} />
                        </div>
                    )}

                    {activeTab === 'usuarios' && (
                        <div className="fade-in">
                            <UsuarioForm onSuccess={() => {}} />
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
                .dashboard-container {
                    display: flex;
                    height: 100vh;
                    background-color: var(--background);
                    font-family: 'Inter', sans-serif;
                    color: var(--foreground);
                }

                .sidebar {
                    width: 280px;
                    background: var(--card-bg);
                    border-right: 1px solid var(--card-border);
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                }

                .logo-area {
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--card-border);
                }

                .logo-area h2 {
                    color: var(--foreground);
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0;
                    background: linear-gradient(to right, #60a5fa, #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .logo-area p {
                    color: var(--secondary);
                    font-size: 0.875rem;
                    margin: 0.25rem 0 0 0;
                }

                .nav-menu {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border: none;
                    background: transparent;
                    color: var(--secondary);
                    font-size: 0.95rem;
                    font-weight: 500;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }

                .nav-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--foreground);
                }

                .nav-item.active {
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--primary);
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--card-border);
                }

                .avatar {
                    width: 40px;
                    height: 40px;
                    background: var(--primary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                }

                .info .name {
                    font-weight: 600;
                    color: var(--foreground);
                    margin: 0;
                    font-size: 0.9rem;
                }

                .logout-btn {
                    background: none;
                    border: none;
                    color: var(--error);
                    font-size: 0.8rem;
                    padding: 0;
                    cursor: pointer;
                    margin-top: 0.25rem;
                }

                .main-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2rem;
                }

                .top-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .top-header h1 {
                    font-size: 1.875rem;
                    color: var(--foreground);
                    font-weight: 700;
                    margin: 0;
                }

                .date-display {
                    color: var(--secondary);
                    font-size: 0.95rem;
                }

                .content-area {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .fade-in {
                    animation: fadeIn 0.3s ease-in-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
