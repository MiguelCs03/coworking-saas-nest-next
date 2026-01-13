'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Loader2,
    Building2,
    Shield,
    Zap,
    CheckCircle2
} from 'lucide-react';
import './login.css';

export default function LoginPage() {
    const router = useRouter();

    // Estados
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Manejar cambios
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    // Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3002/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            // Verificar si la respuesta es JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('El servidor no está disponible. Verifica que el backend esté corriendo en puerto 3002.');
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión');

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            router.push('/dashboard');
        } catch (err: any) {
            if (err.message.includes('fetch')) {
                setError('No se puede conectar al servidor. Verifica que el backend esté corriendo.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Registro
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3002/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'client',
                }),
            });

            // Verificar si la respuesta es JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('El servidor no está disponible. Verifica que el backend esté corriendo en puerto 3002.');
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al registrarse');

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            router.push('/dashboard');
        } catch (err: any) {
            if (err.message.includes('fetch')) {
                setError('No se puede conectar al servidor. Verifica que el backend esté corriendo.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Imagen de fondo con overlay */}
            <div className="auth-background">
                <Image
                    src="/coworking-hero.jpg"
                    alt="Coworking Space"
                    fill
                    priority
                    className="background-image"
                    quality={100}
                />
                <div className="background-overlay"></div>
            </div>

            {/* Grid de dos columnas con efecto parallax */}
            <div className="auth-content">
                {/* Panel izquierdo con glassmorphism */}
                <div className="auth-brand-panel glass-card-3d">
                    <div className="brand-content">
                        {/* Logo con efecto 3D */}
                        <div className="brand-header">
                            <div className="brand-logo floating-3d">
                                <Building2 className="logo-icon" strokeWidth={2} />
                                <div className="logo-glow"></div>
                            </div>
                            <h1 className="brand-name">Coworking SaaS</h1>
                            <p className="brand-tagline">
                                La plataforma inteligente para gestionar espacios de trabajo
                            </p>
                        </div>

                        {/* Features con efecto hover 3D */}
                        <div className="features-grid">
                            <div className="feature hoverable-3d">
                                <div className="feature-icon-wrapper">
                                    <Zap className="feature-icon" />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">Reservas Instantáneas</h3>
                                    <p className="feature-desc">Reserva tu espacio en segundos</p>
                                </div>
                            </div>

                            <div className="feature hoverable-3d">
                                <div className="feature-icon-wrapper">
                                    <Shield className="feature-icon" />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">Seguridad Total</h3>
                                    <p className="feature-desc">Tus datos siempre protegidos</p>
                                </div>
                            </div>

                            <div className="feature hoverable-3d">
                                <div className="feature-icon-wrapper">
                                    <CheckCircle2 className="feature-icon" />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">Gestión Eficiente</h3>
                                    <p className="feature-desc">Todo desde un solo lugar</p>
                                </div>
                            </div>
                        </div>

                        {/* Estadísticas con efecto glass */}
                        <div className="stats-row glass-stats">
                            <div className="stat">
                                <div className="stat-value">500+</div>
                                <div className="stat-label">Usuarios activos</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <div className="stat-value">1,200+</div>
                                <div className="stat-label">Reservas exitosas</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <div className="stat-value">99.9%</div>
                                <div className="stat-label">Uptime</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel derecho con glass card 3D */}
                <div className="auth-form-panel">
                    <div className="form-container glass-form-3d">
                        {/* Tabs con efecto glass */}
                        <div className="auth-tabs">
                            <button
                                className={`tab ${isLogin ? 'active' : ''}`}
                                onClick={() => {
                                    setIsLogin(true);
                                    setError('');
                                }}
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                className={`tab ${!isLogin ? 'active' : ''}`}
                                onClick={() => {
                                    setIsLogin(false);
                                    setError('');
                                }}
                            >
                                Crear Cuenta
                            </button>
                        </div>

                        {/* Header */}
                        <div className="form-header">
                            <h2 className="form-title">
                                {isLogin ? 'Bienvenido de nuevo' : 'Comienza gratis'}
                            </h2>
                            <p className="form-subtitle">
                                {isLogin
                                    ? 'Ingresa tus credenciales para acceder'
                                    : 'Crea tu cuenta en segundos'}
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="error-alert glass-alert">
                                <Shield className="alert-icon" size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Formulario */}
                        <form onSubmit={isLogin ? handleLogin : handleRegister} className="auth-form">
                            {!isLogin && (
                                <div className="form-field">
                                    <label className="field-label">Nombre completo</label>
                                    <div className="input-group glass-input">
                                        <User className="input-icon" size={20} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Juan Pérez"
                                            className="field-input"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-field">
                                <label className="field-label">Correo electrónico</label>
                                <div className="input-group glass-input">
                                    <Mail className="input-icon" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="tu@email.com"
                                        className="field-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="field-label">Contraseña</label>
                                <div className="input-group glass-input">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Mínimo 6 caracteres"
                                        className="field-input"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Botón con efecto 3D */}
                            <button type="submit" className="submit-button button-3d" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="spinner-icon" size={20} />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                                        <ArrowRight className="arrow-icon" size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="form-footer">
                            <p className="footer-text">
                                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                    }}
                                    className="footer-link"
                                >
                                    {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
