'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
    Building2,
    MapPin,
    Star,
    Share2,
    Heart,
    Wifi,
    Coffee,
    Monitor,
    Users,
    ArrowLeft,
    Check
} from 'lucide-react';
import './space-details.css';

interface Room {
    id: string;
    name: string;
    description: string;
    capacity: number;
    price_per_hour: number;
    image_url: string;
    is_active: boolean;
}

export default function SpaceDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomId = searchParams.get('id');

    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [hours, setHours] = useState(4);

    useEffect(() => {
        if (roomId) {
            fetchRoom(roomId);
        }
    }, [roomId]);

    const fetchRoom = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:3002/rooms/${id}`);
            if (response.ok) {
                const data = await response.json();
                setRoom(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReserve = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            // Aquí iría a la página de confirmación de reserva
            router.push(`/reservations/new?room=${roomId}&date=${selectedDate}&hours=${hours}`);
        }
    };

    if (loading) {
        return (
            <div className="loading-page">
                <div className="spinner-large"></div>
                <p>Cargando espacio...</p>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="error-page">
                <Building2 size={64} />
                <h2>Espacio no encontrado</h2>
                <button onClick={() => router.push('/home')} className="btn-back">
                    Volver al inicio
                </button>
            </div>
        );
    }

    const totalPrice = room.price_per_hour * hours;
    const serviceFee = totalPrice * 0.1;
    const total = totalPrice + serviceFee;

    return (
        <div className="space-details-container">
            {/* Header */}
            <header className="details-header">
                <div className="header-content-det">
                    <button onClick={() => router.back()} className="btn-back-simple">
                        <ArrowLeft size={20} />
                    </button>

                    <div className="logo-section">
                        <Building2 className="logo-icon" />
                        <span className="logo-text">Coworking SaaS</span>
                    </div>

                    <button
                        onClick={() => router.push('/login')}
                        className="btn-login-det"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </header>

            <main className="details-main">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs">
                    <a href="/home">Inicio</a>
                    <span>/</span>
                    <a href="/home">Espacios</a>
                    <span>/</span>
                    <span>{room.name}</span>
                </nav>

                {/* Page Title */}
                <div className="page-header">
                    <div className="header-left">
                        <div className="badges-row">
                            <span className="badge-verified">Espacio Verificado</span>
                            <div className="rating">
                                <Star size={16} className="star-filled" />
                                <span className="rating-number">4.9</span>
                                <span className="rating-count">(128 reseñas)</span>
                            </div>
                        </div>
                        <h1 className="space-title">{room.name}</h1>
                        <div className="location-row">
                            <MapPin size={18} />
                            <span>Centro Ciudad, Oficinas Principales</span>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="btn-icon-action">
                            <Share2 size={18} />
                            Compartir
                        </button>
                        <button className="btn-icon-action">
                            <Heart size={18} />
                            Guardar
                        </button>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="image-gallery">
                    <div className="main-image">
                        {room.image_url ? (
                            <img src={room.image_url} alt={room.name} />
                        ) : (
                            <div className="placeholder-image">
                                <Building2 size={64} />
                            </div>
                        )}
                    </div>
                    <div className="gallery-grid">
                        <div className="gallery-item">
                            <div className="placeholder-small">
                                <Monitor size={24} />
                            </div>
                        </div>
                        <div className="gallery-item">
                            <div className="placeholder-small">
                                <Coffee size={24} />
                            </div>
                        </div>
                        <div className="gallery-item">
                            <div className="placeholder-small">
                                <Wifi size={24} />
                            </div>
                        </div>
                        <div className="gallery-item">
                            <div className="more-photos">
                                <span>+8 fotos</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="content-grid">
                    {/* Left Column */}
                    <div className="content-left">
                        {/* About */}
                        <section className="section">
                            <h2 className="section-title">Acerca de este espacio</h2>
                            <p className="section-text">
                                {room.description}
                            </p>

                            <div className="specs-grid">
                                <div className="spec-item">
                                    <span className="spec-label">Capacidad</span>
                                    <span className="spec-value">Hasta {room.capacity} personas</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Tipo</span>
                                    <span className="spec-value">Oficina / Hot Desk</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Tamaño</span>
                                    <span className="spec-value">100 m²</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Acceso</span>
                                    <span className="spec-value">24/7 Miembros</span>
                                </div>
                            </div>
                        </section>

                        {/* Amenities */}
                        <section className="section">
                            <h2 className="section-title">Lo que ofrece este lugar</h2>
                            <div className="amenities-list">
                                <div className="amenity-item">
                                    <Wifi size={20} />
                                    <span>WiFi de Alta Velocidad</span>
                                </div>
                                <div className="amenity-item">
                                    <Coffee size={20} />
                                    <span>Café y Té Ilimitados</span>
                                </div>
                                <div className="amenity-item">
                                    <Monitor size={20} />
                                    <span>Pantalla 4K</span>
                                </div>
                                <div className="amenity-item">
                                    <Users size={20} />
                                    <span>Sala de Reuniones</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="content-right">
                        <div className="booking-card">
                            <div className="booking-header">
                                <div className="price-section">
                                    <span className="price-amount">${room.price_per_hour}</span>
                                    <span className="price-unit">/hora</span>
                                </div>
                                <div className="rating-small">
                                    <Star size={14} className="star-filled" />
                                    <span>4.9</span>
                                </div>
                            </div>

                            {/* Date/Hours Selection */}
                            <div className="booking-inputs">
                                <div className="input-group">
                                    <label>Fecha</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="booking-input"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Horas</label>
                                    <select
                                        value={hours}
                                        onChange={(e) => setHours(Number(e.target.value))}
                                        className="booking-input"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                                            <option key={h} value={h}>{h} {h === 1 ? 'hora' : 'horas'}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleReserve}
                                className="btn-reserve-big"
                                disabled={!selectedDate}
                            >
                                Reservar Ahora
                            </button>

                            <p className="booking-note">Aún no se te cobrará</p>

                            <div className="price-breakdown">
                                <div className="price-row">
                                    <span>${room.price_per_hour} x {hours} horas</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="price-row">
                                    <span>Tarifa de servicio</span>
                                    <span>${serviceFee.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="price-total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <div className="security-badge">
                                <Check size={18} />
                                <div>
                                    <p className="badge-title">Reserva Protegida</p>
                                    <p className="badge-subtitle">Tu pago está seguro hasta que confirmes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
