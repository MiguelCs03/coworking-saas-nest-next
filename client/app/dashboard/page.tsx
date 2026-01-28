'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    CalendarDays,
    Building2,
    Settings,
    LogOut,
    Plus,
    CreditCard,
    Clock,
    ChevronRight,
    Bell
} from 'lucide-react';
import './dashboard.css';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        setUser(JSON.parse(userData));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!user) {
        return (
            <div className="loading-wrapper">
                <div className="spinner-large"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <Building2 size={24} className="text-primary" />
                    <span>Coworking SaaS</span>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <LayoutDashboard size={18} />
                        <span>Vista General</span>
                    </button>
                    <button
                        className="nav-item"
                        onClick={() => router.push('/reservations')}
                    >
                        <CalendarDays size={18} />
                        <span>Mis Reservas</span>
                    </button>
                    <button
                        className="nav-item"
                        onClick={() => router.push('/home')}
                    >
                        <Building2 size={18} />
                        <span>Explorar Espacios</span>
                    </button>
                    <button className="nav-item">
                        <CreditCard size={18} />
                        <span>Pagos</span>
                    </button>
                    <button className="nav-item">
                        <Settings size={18} />
                        <span>Configuración</span>
                    </button>
                    {user.role === 'admin' && (
                        <button
                            className="nav-item"
                            onClick={() => router.push('/admin/spaces/new')}
                        >
                            <Plus size={18} />
                            <span>Nuevo Espacio</span>
                        </button>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-mini-profile">
                        <div className="mini-avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="mini-info">
                            <span className="mini-name">{user.name.split(' ')[0]}</span>
                            <span className="mini-role">{user.role === 'admin' ? 'Admin' : 'Miembro'}</span>
                        </div>
                        <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Top Header */}
                <header className="top-header">
                    <div className="header-title">
                        <h2>Vista General</h2>
                    </div>
                    <div className="header-actions">
                        <button className="btn-icon-action" style={{ border: 'none', background: 'none' }}>
                            <Bell size={20} color="#6b7280" />
                        </button>
                        <button
                            className="btn-primary"
                            onClick={() => router.push('/home')}
                        >
                            <Plus size={16} />
                            Nueva Reserva
                        </button>
                    </div>
                </header>

                <div className="dashboard-grid">
                    {/* KPI Cards */}
                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-title">Reservas Activas</span>
                            <div className="kpi-icon"><CalendarDays size={16} /></div>
                        </div>
                        <div className="kpi-value">3</div>
                        <div className="kpi-trend">
                            <span>Próxima: Mañana, 09:00 AM</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-title">Horas Usadas (Mes)</span>
                            <div className="kpi-icon"><Clock size={16} /></div>
                        </div>
                        <div className="kpi-value">12.5h</div>
                        <div className="kpi-trend" style={{ color: '#6b7280' }}>
                            <span>Límite plan: 40h</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-title">Gasto Total</span>
                            <div className="kpi-icon"><CreditCard size={16} /></div>
                        </div>
                        <div className="kpi-value">Bs. 450.00</div>
                        <div className="kpi-trend">
                            <span>Actualizado hace 2h</span>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="large-card">
                        <div className="card-header">
                            <h3 className="card-title">Actividad Reciente</h3>
                            <a onClick={() => router.push('/reservations')} className="btn-link">Ver todo</a>
                        </div>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon-box">
                                    <Building2 size={20} />
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">Reserva Confirmada</div>
                                    <div className="activity-desc">Sala de Juntas A • 4 horas</div>
                                </div>
                                <div className="activity-date">Hace 2 horas</div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon-box">
                                    <Clock size={20} />
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">Check-in Completado</div>
                                    <div className="activity-desc">Hot Desk #12</div>
                                </div>
                                <div className="activity-date">Ayer</div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
                                    <CreditCard size={20} />
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">Pago Exitoso</div>
                                    <div className="activity-desc">Mensualidad Plan Pro</div>
                                </div>
                                <div className="activity-date">22 Ene</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="actions-card">
                        <h3 className="card-title" style={{ marginBottom: '20px' }}>Accesos Rápidos</h3>
                        <button className="action-btn-large" onClick={() => router.push('/home')}>
                            <div className="activity-icon-box" style={{ background: '#ebf5ff', color: '#2563eb' }}>
                                <Building2 size={20} />
                            </div>
                            <div className="action-text">
                                <h4>Explorar Espacios</h4>
                                <p>Busca y reserva tu lugar ideal</p>
                            </div>
                            <ChevronRight size={16} style={{ marginLeft: 'auto', color: '#9ca3af' }} />
                        </button>

                        <button className="action-btn-large" onClick={() => router.push('/reservations')}>
                            <div className="activity-icon-box" style={{ background: '#fdf2f8', color: '#db2777' }}>
                                <CalendarDays size={20} />
                            </div>
                            <div className="action-text">
                                <h4>Gestionar Reservas</h4>
                                <p>Modifica o cancela tus citas</p>
                            </div>
                            <ChevronRight size={16} style={{ marginLeft: 'auto', color: '#9ca3af' }} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
