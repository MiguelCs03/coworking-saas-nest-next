'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './dashboard.css';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            // Si no hay token, redirigir al login
            router.push('/login');
            return;
        }

        // Cargar datos del usuario
        setUser(JSON.parse(userData));
    }, [router]);

    // Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!user) {
        return (
            <div className="loading-screen">
                <div className="spinner-large"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Header del dashboard */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1 className="dashboard-title">🏢 Coworking SaaS</h1>
                    </div>
                    <div className="header-right">
                        <div className="user-info">
                            <div className="user-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-details">
                                <p className="user-name">{user.name}</p>
                                <p className="user-role">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="dashboard-main">
                <div className="welcome-section">
                    <h2 className="welcome-title">
                        ¡Bienvenido, {user.name.split(' ')[0]}! 👋
                    </h2>
                    <p className="welcome-description">
                        Has iniciado sesión correctamente. Este es tu panel de control.
                    </p>
                </div>

                {/* Cards de información */}
                <div className="info-grid">
                    <div className="info-card">
                        <div className="card-icon">📧</div>
                        <div className="card-content">
                            <p className="card-label">Email</p>
                            <p className="card-value">{user.email}</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🎭</div>
                        <div className="card-content">
                            <p className="card-label">Rol</p>
                            <p className="card-value">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🔑</div>
                        <div className="card-content">
                            <p className="card-label">ID de Usuario</p>
                            <p className="card-value">{user.id.substring(0, 8)}...</p>
                        </div>
                    </div>
                </div>

                {/* Sección de próximas características */}
                <div className="features-section">
                    <h3 className="section-title">Funciones Disponibles</h3>
                    <div className="features-grid">
                        <div className="feature-card clickable" onClick={() => router.push('/home')}>
                            <span className="feature-emoji">🏢</span>
                            <h4>Explorar Espacios</h4>
                            <p>Descubre y reserva espacios de coworking</p>
                        </div>
                        <div className="feature-card clickable" onClick={() => router.push('/reservations')}>
                            <span className="feature-emoji">📅</span>
                            <h4>Mis Reservas</h4>
                            <p>Gestiona tus reservas activas y pasadas</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-emoji">📊</span>
                            <h4>Reportes</h4>
                            <p>Próximamente: Visualiza estadísticas</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
