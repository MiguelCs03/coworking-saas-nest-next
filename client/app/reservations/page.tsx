'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    Clock,
    Building2,
    MapPin,
    DollarSign,
    X,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Users,
} from 'lucide-react';
import './reservations.css';

interface Reservation {
    id: string;
    start_time: string;
    end_time: string;
    total_price: number;
    status: 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
    room: {
        id: string;
        name: string;
        description: string;
        capacity: number;
        price_per_hour: number;
        image_url: string;
    };
}

export default function ReservationsPage() {
    const router = useRouter();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled' | 'completed'>('all');
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id;

            const response = await fetch(`http://localhost:3002/reservations/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setReservations(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (id: string) => {
        setCancellingId(id);
        try {
            const response = await fetch(`http://localhost:3002/reservations/${id}/cancel`, {
                method: 'PATCH',
            });

            if (response.ok) {
                fetchReservations();
                setShowCancelModal(false);
                setSelectedReservation(null);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setCancellingId(null);
        }
    };

    const openCancelModal = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setShowCancelModal(true);
    };

    const filteredReservations = reservations.filter((res) => {
        if (filter === 'all') return true;
        return res.status === filter;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            confirmed: { label: 'Confirmada', color: 'status-confirmed', icon: CheckCircle2 },
            cancelled: { label: 'Cancelada', color: 'status-cancelled', icon: X },
            completed: { label: 'Completada', color: 'status-completed', icon: CheckCircle2 },
        };
        const badge = badges[status as keyof typeof badges];
        const Icon = badge.icon;
        return (
            <span className={`status-badge ${badge.color}`}>
                <Icon size={14} />
                {badge.label}
            </span>
        );
    };

    const canCancel = (reservation: Reservation) => {
        if (reservation.status !== 'confirmed') return false;
        const now = new Date();
        const startTime = new Date(reservation.start_time);
        return startTime > now;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-large"></div>
                <p>Cargando tus reservas...</p>
            </div>
        );
    }

    return (
        <div className="reservations-container">
            {/* Cancel Confirmation Modal */}
            {showCancelModal && selectedReservation && (
                <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <AlertCircle size={48} className="modal-icon-warning" />
                        <h2>¿Cancelar reserva?</h2>
                        <p>
                            ¿Estás seguro de que deseas cancelar la reserva en{' '}
                            <strong>{selectedReservation.room.name}</strong>?
                        </p>
                        <div className="modal-actions">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="btn-modal-secondary"
                            >
                                No, mantener
                            </button>
                            <button
                                onClick={() => handleCancelReservation(selectedReservation.id)}
                                className="btn-modal-danger"
                                disabled={cancellingId === selectedReservation.id}
                            >
                                {cancellingId === selectedReservation.id
                                    ? 'Cancelando...'
                                    : 'Sí, cancelar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="reservations-header">
                <div className="header-content-reservations">
                    <button onClick={() => router.push('/home')} className="btn-back-header">
                        <ArrowLeft size={20} />
                        Inicio
                    </button>
                    <h1 className="page-title">Mis Reservas</h1>
                </div>
            </header>

            <div className="reservations-content">
                {/* Filters */}
                <div className="filters-section">
                    <button
                        onClick={() => setFilter('all')}
                        className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
                    >
                        Todas ({reservations.length})
                    </button>
                    <button
                        onClick={() => setFilter('confirmed')}
                        className={`filter-chip ${filter === 'confirmed' ? 'active' : ''}`}
                    >
                        Confirmadas (
                        {reservations.filter((r) => r.status === 'confirmed').length})
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`filter-chip ${filter === 'completed' ? 'active' : ''}`}
                    >
                        Completadas (
                        {reservations.filter((r) => r.status === 'completed').length})
                    </button>
                    <button
                        onClick={() => setFilter('cancelled')}
                        className={`filter-chip ${filter === 'cancelled' ? 'active' : ''}`}
                    >
                        Canceladas (
                        {reservations.filter((r) => r.status === 'cancelled').length})
                    </button>
                </div>

                {/* Reservations List */}
                {filteredReservations.length === 0 ? (
                    <div className="empty-state">
                        <Calendar size={64} />
                        <h2>No tienes reservas</h2>
                        <p>
                            {filter === 'all'
                                ? 'Aún no has realizado ninguna reserva'
                                : `No tienes reservas ${filter === 'confirmed' ? 'confirmadas' : filter === 'completed' ? 'completadas' : 'canceladas'}`}
                        </p>
                        <button onClick={() => router.push('/home')} className="btn-explore">
                            Explorar Espacios
                        </button>
                    </div>
                ) : (
                    <div className="reservations-grid">
                        {filteredReservations.map((reservation) => (
                            <div key={reservation.id} className="reservation-card">
                                {/* Image */}
                                <div className="reservation-image-container">
                                    {reservation.room.image_url ? (
                                        <img
                                            src={reservation.room.image_url}
                                            alt={reservation.room.name}
                                            className="reservation-image"
                                        />
                                    ) : (
                                        <div className="reservation-placeholder">
                                            <Building2 size={48} />
                                        </div>
                                    )}
                                    <div className="image-overlay">
                                        {getStatusBadge(reservation.status)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="reservation-content">
                                    <h3 className="reservation-title">{reservation.room.name}</h3>

                                    <div className="reservation-details">
                                        <div className="detail-item">
                                            <Calendar size={16} />
                                            <span>{formatDate(reservation.start_time)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <Clock size={16} />
                                            <span>
                                                {formatTime(reservation.start_time)} -{' '}
                                                {formatTime(reservation.end_time)}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <Users size={16} />
                                            <span>Hasta {reservation.room.capacity} personas</span>
                                        </div>
                                        <div className="detail-item">
                                            <DollarSign size={16} />
                                            <span className="price-highlight">
                                                ${Number(reservation.total_price).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="reservation-actions">
                                        <button
                                            onClick={() => router.push(`/space/${reservation.room.id}`)}
                                            className="btn-action-secondary"
                                        >
                                            Ver Espacio
                                        </button>
                                        {canCancel(reservation) && (
                                            <button
                                                onClick={() => openCancelModal(reservation)}
                                                className="btn-action-danger"
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
