'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Building2,
    Users,
    DollarSign,
    Clock,
    MapPin,
    Search,
    Wifi,
    Coffee,
    Monitor,
    Calendar,
    CheckCircle2,
    ArrowRight,
    Star
} from 'lucide-react';
import './home.css';

interface Room {
    id: string;
    name: string;
    description: string;
    capacity: number;
    price_per_hour: number;
    image_url: string;
    is_active: boolean;
}

export default function HomePage() {
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchLocation, setSearchLocation] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await fetch('http://localhost:3002/rooms/available');
            if (response.ok) {
                const data = await response.json();
                setRooms(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = () => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('token');
        }
        return false;
    };

    const handleReserve = (roomId: string) => {
        if (isAuthenticated()) {
            router.push(`/reservations/new?room=${roomId}`);
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="modern-home-container">
            {/* Hero Section con Search Bar Flotante */}
            <section className="hero-section-modern">
                <div className="hero-background">
                    <Image
                        src="/coworking-hero.jpg"
                        alt="Coworking Space"
                        fill
                        priority
                        className="hero-image"
                        quality={100}
                    />
                    <div className="hero-overlay"></div>
                </div>

                {/* Header Sticky */}
                <header className="modern-header">
                    <div className="header-content">
                        <div className="logo-area">
                            <Building2 className="logo-icon" strokeWidth={2.5} />
                            <span className="logo-text">Coworking SaaS</span>
                        </div>
                        <nav className="nav-links">
                            <a href="#spaces" className="nav-link">Espacios</a>
                            <a href="#how-it-works" className="nav-link">Cómo Funciona</a>
                            <button
                                onClick={() => router.push('/login')}
                                className="btn-login"
                            >
                                {isAuthenticated() ? 'Mi Cuenta' : 'Iniciar Sesión'}
                            </button>
                        </nav>
                    </div>
                </header>

                {/* Hero Content */}
                <div className="hero-content-modern">
                    <h1 className="hero-title-modern">
                        Enfócate en tu trabajo,<br />nosotros manejamos el espacio
                    </h1>
                    <p className="hero-subtitle-modern">
                        Reserva escritorios flexibles, oficinas privadas y salas de reuniones en las ubicaciones más inspiradoras
                    </p>
                    <button
                        onClick={() => document.getElementById('spaces')?.scrollIntoView({ behavior: 'smooth' })}
                        className="btn-hero"
                    >
                        Explorar Espacios
                    </button>
                </div>

                {/* Search Bar Flotante */}
                <div className="search-bar-floating">
                    <div className="search-grid">
                        <div className="search-field">
                            <label className="search-label">Ubicación</label>
                            <div className="search-input-wrapper">
                                <MapPin size={20} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="¿Dónde te ubicas?"
                                    className="search-input"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="search-field">
                            <label className="search-label">Tipo de Espacio</label>
                            <div className="search-input-wrapper">
                                <Building2 size={20} className="search-icon" />
                                <select
                                    className="search-select"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <option value="all">Todos</option>
                                    <option value="desk">Escritorio</option>
                                    <option value="office">Oficina Privada</option>
                                    <option value="meeting">Sala de Reuniones</option>
                                </select>
                            </div>
                        </div>

                        <div className="search-field">
                            <label className="search-label">Fecha</label>
                            <div className="search-input-wrapper">
                                <Calendar size={20} className="search-icon" />
                                <input
                                    type="date"
                                    className="search-input"
                                />
                            </div>
                        </div>

                        <button className="btn-search">
                            <Search size={20} />
                            <span>Buscar</span>
                        </button>
                    </div>
                </div>
            </section>

            <main className="main-content">
                {/* Chips de Categorías */}
                <section className="categories-section">
                    <div className="categories-container">
                        <button className="category-chip active">
                            <Star size={16} />
                            Más Populares
                        </button>
                        <button className="category-chip">
                            <Monitor size={16} />
                            Hot Desk
                        </button>
                        <button className="category-chip">
                            <Users size={16} />
                            Salas de Reuniones
                        </button>
                        <button className="category-chip">
                            <Building2 size={16} />
                            Oficinas Privadas
                        </button>
                    </div>
                </section>

                {/* How It Works */}
                <section className="how-it-works-section" id="how-it-works">
                    <div className="section-container">
                        <div className="section-header-center">
                            <h2 className="section-title-large">Cómo funciona</h2>
                            <p className="section-description">
                                Consigue tu espacio de productividad en tres simples pasos
                            </p>
                        </div>

                        <div className="steps-grid">
                            <div className="step-card">
                                <div className="step-icon-wrapper">
                                    <Search className="step-icon" />
                                </div>
                                <h3 className="step-title">1. Descubre</h3>
                                <p className="step-description">
                                    Busca miles de espacios por ubicación, tipo y amenidades que se adapten a tu estilo de trabajo
                                </p>
                            </div>

                            <div className="step-card">
                                <div className="step-icon-wrapper">
                                    <Calendar className="step-icon" />
                                </div>
                                <h3 className="step-title">2. Reserva</h3>
                                <p className="step-description">
                                    Asegura tu lugar con opciones de reserva flexibles. Sin contratos a largo plazo
                                </p>
                            </div>

                            <div className="step-card">
                                <div className="step-icon-wrapper">
                                    <Coffee className="step-icon" />
                                </div>
                                <h3 className="step-title">3. Trabaja</h3>
                                <p className="step-description">
                                    Llega, conéctate al WiFi de alta velocidad y comienza a construir tus sueños
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Espacios Populares */}
                <section className="popular-spaces-section" id="spaces">
                    <div className="section-container">
                        <div className="section-header-split">
                            <div>
                                <h2 className="section-title-large">Espacios Populares</h2>
                                <p className="section-description">
                                    Los espacios de trabajo más queridos alrededor del mundo
                                </p>
                            </div>
                            <button className="btn-view-all">
                                Ver todos <ArrowRight size={18} />
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading-modern">
                                <div className="spinner-large"></div>
                                <p>Cargando espacios...</p>
                            </div>
                        ) : rooms.length === 0 ? (
                            <div className="empty-modern">
                                <Building2 size={64} />
                                <h3>No hay espacios disponibles</h3>
                                <p>Vuelve pronto para ver nuevos espacios</p>
                            </div>
                        ) : (
                            <div className="spaces-grid-modern">
                                {rooms.map((room) => (
                                    <div key={room.id} className="space-card-modern">
                                        <div className="space-image-container">
                                            {room.image_url ? (
                                                <img
                                                    src={room.image_url}
                                                    alt={room.name}
                                                    className="space-image"
                                                />
                                            ) : (
                                                <div className="space-image-placeholder">
                                                    <Building2 size={48} />
                                                </div>
                                            )}
                                            <div className="space-badge">Disponible</div>
                                        </div>

                                        <div className="space-info-modern">
                                            <div className="space-header">
                                                <h3 className="space-name">{room.name}</h3>
                                                <div className="space-price">
                                                    <span className="price-amount">${room.price_per_hour}</span>
                                                    <span className="price-unit">/hora</span>
                                                </div>
                                            </div>

                                            <p className="space-location">
                                                <MapPin size={16} />
                                                Centro Ciudad
                                            </p>

                                            <p className="space-description-modern">
                                                {room.description}
                                            </p>

                                            <div className="space-amenities-modern">
                                                <div className="amenity-tag">
                                                    <Users size={14} />
                                                    {room.capacity} personas
                                                </div>
                                                <div className="amenity-tag">
                                                    <Wifi size={14} />
                                                    WiFi
                                                </div>
                                                <div className="amenity-tag">
                                                    <Coffee size={14} />
                                                    Café
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleReserve(room.id)}
                                                className="btn-reserve-modern"
                                            >
                                                Reservar ahora
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section-modern">
                    <div className="cta-container-modern">
                        <div className="cta-pattern"></div>
                        <h2 className="cta-title-modern">
                            ¿Listo para impulsar tu productividad?
                        </h2>
                        <p className="cta-description-modern">
                            Únete a más de 500 profesionales que reservan sus espacios perfectos cada día
                        </p>
                        <button
                            onClick={() => router.push('/login')}
                            className="btn-cta-modern"
                        >
                            Comenzar ahora
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </section>
            </main>

            {/* footer */}
            <footer className="modern-footer">
                <div className="footer-content-modern">
                    <div className="footer-brand-section">
                        <div className="footer-logo">
                            <Building2 size={24} />
                            <span>Coworking SaaS</span>
                        </div>
                        <p className="footer-description">
                            La red global de espacios de trabajo de alta productividad. Reserva un escritorio, una sala o un piso completo en segundos.
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Compañía</h4>
                            <a href="#">Nosotros</a>
                            <a href="#">Carreras</a>
                            <a href="#">Blog</a>
                        </div>

                        <div className="footer-column">
                            <h4>Soporte</h4>
                            <a href="#">Centro de Ayuda</a>
                            <a href="#">Contacto</a>
                            <a href="#">Precios</a>
                        </div>

                        <div className="footer-column">
                            <h4>Legal</h4>
                            <a href="#">Privacidad</a>
                            <a href="#">Términos</a>
                            <a href="#">Cookies</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Coworking SaaS. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
