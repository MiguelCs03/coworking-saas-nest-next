'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Building2,
    Users,
    MapPin,
    Wifi,
    Coffee,
    Monitor,
    Calendar,
    Clock,
    ArrowLeft,
    CheckCircle2,
    X,
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

interface Reservation {
    start_time: string;
    end_time: string;
}

export default function SpaceDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const roomId = params.id as string;

    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    // Formulario de reserva
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (roomId) {
            fetchRoomDetails();
            fetchRoomReservations();
        }
    }, [roomId]);

    const fetchRoomDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3002/rooms/${roomId}`);
            if (response.ok) {
                const data = await response.json();
                setRoom(data);
            } else {
                setError('No se pudo cargar el espacio');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al cargar el espacio');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoomReservations = async () => {
        try {
            const response = await fetch(`http://localhost:3002/reservations/room/${roomId}`);
            if (response.ok) {
                const data = await response.json();
                setReservations(data);
            }
        } catch (error) {
            console.error('Error al cargar reservas:', error);
        }
    };

    const calculateHours = () => {
        if (!startTime || !endTime) return 0;
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        return Math.max(0, (endMinutes - startMinutes) / 60);
    };

    const calculateTotalPrice = () => {
        if (!room) return 0;
        const hours = calculateHours();
        return hours * Number(room.price_per_hour);
    };

    const isAuthenticated = () => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('token');
        }
        return false;
    };

    const getUserId = () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            if (user) {
                return JSON.parse(user).id;
            }
        }
        return null;
    };

    const handleReserve = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        if (!selectedDate || !startTime || !endTime) {
            setError('Por favor completa todos los campos');
            return;
        }

        const hours = calculateHours();
        if (hours <= 0) {
            setError('La hora de fin debe ser posterior a la hora de inicio');
            return;
        }

        setIsSubmitting(true);

        try {
            const userId = getUserId();
            const startDateTime = new Date(`${selectedDate}T${startTime}`);
            const endDateTime = new Date(`${selectedDate}T${endTime}`);

            const response = await fetch('http://localhost:3002/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    room_id: roomId,
                    start_time: startDateTime.toISOString(),
                    end_time: endDateTime.toISOString(),
                    total_price: calculateTotalPrice(),
                    status: 'confirmed',
                }),
            });

            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => {
                    router.push('/reservations');
                }, 2000);
            } else {
                const data = await response.json();
                setError(data.message || 'Error al crear la reserva');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al procesar la reserva');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-large"></div>
                <p>Cargando detalles del espacio...</p>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="error-container">
                <Building2 size={64} />
                <h2>Espacio no encontrado</h2>
                <button onClick={() => router.push('/home')} className="btn-back">
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className="space-details-container">
            {/* Success Modal */}
            {showSuccess && (
                <div className="success-modal-overlay">
                    <div className="success-modal">
                        <CheckCircle2 size={64} className="success-icon" />
                        <h2>¡Reserva Exitosa!</h2>
                        <p>Tu reserva ha sido confirmada</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="details-header">
                <button onClick={() => router.back()} className="btn-back-header">
                    <ArrowLeft size={20} />
                    Volver
                </button>
            </header>

            {/* Hero Image */}
            <section className="space-hero">
                {room.image_url ? (
                    <img src={room.image_url} alt={room.name} className="hero-image-detail" />
                ) : (
                    <div className="hero-placeholder">
                        <Building2 size={120} />
                    </div>
                )}
                <div className="hero-overlay-detail"></div>
            </section>

            <div className="details-content">
                {/* Main Info */}
                <section className="main-info-section">
                    <div className="info-grid-container">
                        <div className="info-primary">
                            <h1 className="space-title-detail">{room.name}</h1>
                            <div className="space-meta">
                                <div className="meta-item">
                                    <MapPin size={18} />
                                    <span>Centro Ciudad</span>
                                </div>
                                <div className="meta-item">
                                    <Users size={18} />
                                    <span>Hasta {room.capacity} personas</span>
                                </div>
                            </div>
                            <p className="space-description-detail">{room.description}</p>

                            {/* Amenities */}
                            <div className="amenities-section">
                                <h3 className="section-subtitle">Amenidades Incluidas</h3>
                                <div className="amenities-grid">
                                    <div className="amenity-item">
                                        <Wifi size={24} />
                                        <span>WiFi Alta Velocidad</span>
                                    </div>
                                    <div className="amenity-item">
                                        <Coffee size={24} />
                                        <span>Café Ilimitado</span>
                                    </div>
                                    <div className="amenity-item">
                                        <Monitor size={24} />
                                        <span>Monitor 4K</span>
                                    </div>
                                    <div className="amenity-item">
                                        <Building2 size={24} />
                                        <span>Sala Privada</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reservation Form */}
                        <div className="reservation-card">
                            <div className="price-header">
                                <span className="price-large">${room.price_per_hour}</span>
                                <span className="price-period">/hora</span>
                            </div>

                            <form onSubmit={handleReserve} className="reservation-form">
                                <div className="form-group">
                                    <label className="form-label">
                                        <Calendar size={18} />
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Clock size={18} />
                                        Hora de Inicio
                                    </label>
                                    <input
                                        type="time"
                                        className="form-input"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Clock size={18} />
                                        Hora de Fin
                                    </label>
                                    <input
                                        type="time"
                                        className="form-input"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Calculation Summary */}
                                <div className="price-summary">
                                    <div className="summary-row">
                                        <span>Duración</span>
                                        <span className="summary-value">
                                            {calculateHours().toFixed(1)} horas
                                        </span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Total</span>
                                        <span className="summary-total">
                                            ${calculateTotalPrice().toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {error && (
                                    <div className="error-message">
                                        <X size={16} />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn-reserve-detail"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
