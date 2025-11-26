'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import PacienteForm from '../components/PacienteForm';
import UrgenciaForm from '../components/UrgenciaForm';
import ListaEspera from '../components/ListaEspera';

export default function UrgenciasPage() {
    const router = useRouter();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedCuil, setSelectedCuil] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('UrgenciasPage checking token:', token ? 'Present' : 'Missing');
        if (!token) {
            console.log('No token found, redirecting to login');
            router.push('/');
        }
    }, [router]);

    const handleUrgenciaSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
        setSelectedCuil('');
    };

    const handlePacienteSuccess = (cuil: string) => {
        setSelectedCuil(cuil);
    };

    return (
        <>
            <Navbar />
            <main className="container">
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="grid">
                        <PacienteForm onSuccess={handlePacienteSuccess} />
                        <UrgenciaForm defaultCuil={selectedCuil} onSuccess={handleUrgenciaSuccess} />
                    </div>
                    <div>
                        <ListaEspera refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            </main>
        </>
    );
}
