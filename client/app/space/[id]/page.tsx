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
    ArrowRight,
    CheckCircle2,
    X,
    Share2,
    Heart,
    Grid,
    Star,
    ShieldCheck,
    Video,
    Lock,
    AlertCircle,
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
    media?: { url: string; type: 'image' | 'video' }[];
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

    // Galería
    const [showGallery, setShowGallery] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const getMediaItems = () => {
        if (!room) return [];
        const items = [];
        // Add cover image first if it exists
        if (room.image_url) items.push({ url: room.image_url, type: 'image' });
        // Add other media
        if (room.media && room.media.length > 0) {
            items.push(...room.media);
        }
        // Fallback if empty
        if (items.length === 0) {
            items.push({ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80', type: 'image' });
        }
        return items;
    };

    const galleryItems = getMediaItems();

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
            router.push(`/login?redirect=/space/${roomId}`);
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
            <div className="loading-page">
                <div className="spinner-large"></div>
                <p>Cargando detalles del espacio...</p>
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

    return (
        <div className="space-details-container">
            {/* Header Sticky */}
            <header className="details-header">
                <div className="header-content-det">
                    <div className="logo-section">
                        <Building2 className="logo-icon" strokeWidth={2.5} />
                        <span className="logo-text">Coworking SaaS</span>
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
                        {!isAuthenticated() && (
                            <button onClick={() => router.push('/login')} className="btn-login-det">
                                Iniciar Sesión
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="details-main">
                {/* Breadcrumbs */}
                <div className="breadcrumbs">
                    <button className="btn-back-simple" onClick={() => router.back()}>
                        <ArrowLeft size={16} />
                    </button>
                    <span>/</span>
                    <a onClick={() => router.push('/home')} style={{ cursor: 'pointer' }}>Espacios</a>
                    <span>/</span>
                    <span>{room.name}</span>
                </div>

                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <div className="badges-row">
                            <span className="badge-verified">Verificado por Plus</span>
                            <div className="rating">
                                <Star size={16} className="star-filled" />
                                <span className="rating-number">4.92</span>
                                <span className="rating-count">(128 reseñas)</span>
                            </div>
                        </div>
                        <h1 className="space-title">{room.name}</h1>
                        <div className="location-row">
                            <MapPin size={18} />
                            <span>Av. San Martín, Equipetrol Norte, Santa Cruz de la Sierra</span>
                        </div>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="image-gallery">
                    <div className="main-image">
                        {galleryItems[0]?.type === 'video' ? (
                            <video
                                src={galleryItems[0].url}
                                className="h-full w-full object-cover"
                                onClick={() => {
                                    setActiveImageIndex(0);
                                    setShowGallery(true);
                                }}
                            />
                        ) : (
                            <img
                                src={galleryItems[0]?.url}
                                alt={room.name}
                                onClick={() => {
                                    setActiveImageIndex(0);
                                    setShowGallery(true);
                                }}
                            />
                        )}
                    </div>
                    <div className="gallery-grid">
                        {galleryItems.slice(1, 3).map((item, index) => (
                            <div key={index} className="gallery-item" style={{ position: index === 1 ? 'relative' : undefined }}>
                                {item.type === 'video' ? (
                                    <video
                                        src={item.url}
                                        className="gallery-img-small"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onClick={() => {
                                            setActiveImageIndex(index + 1);
                                            setShowGallery(true);
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={`Detail ${index + 1}`}
                                        className="gallery-img-small"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onClick={() => {
                                            setActiveImageIndex(index + 1);
                                            setShowGallery(true);
                                        }}
                                    />
                                )}

                                {index === 1 && galleryItems.length > 3 && (
                                    <div
                                        className="more-photos"
                                        onClick={() => setShowGallery(true)}
                                    >
                                        <Grid size={20} style={{ marginRight: '8px' }} />
                                        Ver todas las fotos ({galleryItems.length})
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="content-grid">
                    <div className="content-left">
                        {/* Description */}
                        <section className="section">
                            <h2 className="section-title">Acerca de este espacio</h2>
                            <p className="section-text">{room.description}</p>

                            <div className="specs-grid">
                                <div className="spec-item">
                                    <span className="spec-label">Capacidad</span>
                                    <span className="spec-value">{room.capacity} Personas</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Tamaño</span>
                                    <span className="spec-value">45 m²</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Tipo</span>
                                    <span className="spec-value">Oficina Privada</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Acceso</span>
                                    <span className="spec-value">24/7</span>
                                </div>
                            </div>
                        </section>

                        {/* Amenities */}
                        <section className="section">
                            <h2 className="section-title">Lo que ofrece este lugar</h2>
                            <div className="amenities-list">
                                <div className="amenity-item">
                                    <Wifi size={20} />
                                    <span>WiFi de alta velocidad (500 Mbps)</span>
                                </div>
                                <div className="amenity-item">
                                    <Monitor size={20} />
                                    <span>Pantalla 4K para presentaciones</span>
                                </div>
                                <div className="amenity-item">
                                    <Coffee size={20} />
                                    <span>Café de especialidad ilimitado</span>
                                </div>
                                <div className="amenity-item">
                                    <Building2 size={20} />
                                    <span>Acceso a áreas comunes</span>
                                </div>
                                <div className="amenity-item">
                                    <Video size={20} />
                                    <span>Sistema de videoconferencia</span>
                                </div>
                                <div className="amenity-item">
                                    <Lock size={20} />
                                    <span>Cerradura inteligente</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Booking Card Sticky */}
                    <div className="content-right">
                        <div className="booking-card">
                            <div className="booking-header">
                                <div className="price-section">
                                    <span className="price-amount">Bs. {room.price_per_hour}</span>
                                    <span className="price-unit">/ hora</span>
                                </div>
                                <div className="rating-small">
                                    <Star size={14} className="star-filled" />
                                    <span>4.92</span>
                                </div>
                            </div>

                            <form onSubmit={handleReserve}>
                                <div className="booking-inputs">
                                    <div className="input-group">
                                        <label>FECHA</label>
                                        <input
                                            type="date"
                                            className="booking-input"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div className="input-group">
                                            <label>INICIO</label>
                                            <input
                                                type="time"
                                                className="booking-input"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>FIN</label>
                                            <input
                                                type="time"
                                                className="booking-input"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-reserve-big"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Procesando...' : 'Reservar ahora'}
                                </button>
                                <p className="booking-note">No se te cobrará nada todavía</p>

                                <div className="price-breakdown">
                                    <div className="price-row">
                                        <span>Bs. {room.price_per_hour} x {calculateHours().toFixed(1)} horas</span>
                                        <span>Bs. {calculateTotalPrice().toFixed(2)}</span>
                                    </div>
                                    <div className="price-row">
                                        <span>Tarifa de servicio</span>
                                        <span>Bs. 0.00</span>
                                    </div>
                                </div>

                                <div className="price-total">
                                    <span>Total</span>
                                    <span>Bs. {calculateTotalPrice().toFixed(2)}</span>
                                </div>
                            </form>

                            <div className="security-badge">
                                <ShieldCheck size={24} />
                                <div>
                                    <div className="badge-title">Reserva segura</div>
                                    <div className="badge-subtitle">Tu reserva está protegida por nuestra garantía de satisfacción.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Success Modal */}
            {showSuccess && (
                <div className="success-modal-overlay">
                    <div className="success-modal">
                        <CheckCircle2 size={64} className="success-icon" />
                        <h2>¡Reserva Exitosa!</h2>
                        <p>Tu espacio ha sido reservado correctamente.</p>
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            {showGallery && (
                <div className="lightbox-overlay" onClick={() => setShowGallery(false)}>
                    <button className="btn-close-lightbox" onClick={() => setShowGallery(false)}>
                        <X size={24} />
                    </button>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        {galleryItems[activeImageIndex]?.type === 'video' ? (
                            <video
                                src={galleryItems[activeImageIndex].url}
                                controls
                                autoPlay
                                className="lightbox-image"
                            />
                        ) : (
                            <img
                                src={galleryItems[activeImageIndex]?.url}
                                alt={`Gallery ${activeImageIndex}`}
                                className="lightbox-image"
                            />
                        )}
                        <button
                            className="nav-btn prev"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveImageIndex(prev => prev > 0 ? prev - 1 : galleryItems.length - 1);
                            }}
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <button
                            className="nav-btn next"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveImageIndex(prev => prev < galleryItems.length - 1 ? prev + 1 : 0);
                            }}
                        >
                            <ArrowRight size={24} />
                        </button>
                        <div className="lightbox-counter">
                            {activeImageIndex + 1} / {galleryItems.length}
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="toast-error">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    <button onClick={() => setError('')}><X size={16} /></button>
                </div>
            )}
        </div>
    );
}
