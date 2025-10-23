// Ubicación: src/pages/LoginPage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import { useNavigate, useParams } from 'react-router-dom';

const LoginPage = () => {
    // Hooks de React Router y de nuestros contextos
    const { tenantId } = useParams();
    const { theme, loading: themeLoading } = useTheme();
    const { login } = useAuth();
    const navigate = useNavigate();

    // Estado local del formulario
    const [username, setUsername] = useState('jgrimes');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efecto para limpiar el formulario si el tenantId cambia
    useEffect(() => {
        setError('');
    }, [tenantId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(tenantId, username, password);
            navigate(`/${tenantId}/dashboard`); // Redirige al dashboard del tenant
        } catch (err) {
            setError('Fallo el login. Revisa tus credenciales.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const styles = {
        pageContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: theme.colorFondo, // << Color de fondo dinámico
            transition: 'background-color 0.3s ease',
        },
        container: {
            maxWidth: '400px',
            width: '100%',
            margin: '20px',
            padding: '30px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            backgroundColor: '#fff',
        },
        logo: {
            maxWidth: '150px',
            display: 'block',
            margin: '0 auto 20px auto',
        },
        title: {
            textAlign: 'center',
            marginBottom: '25px',
            color: '#333',
        },
        tenantName: {
            color: theme.colorPrimario, // << Color primario dinámico
        },
        formGroup: {
            marginBottom: '20px',
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
        },
        input: {
            width: '100%',
            padding: '10px',
            boxSizing: 'border-box',
            borderRadius: '5px',
            border: '1px solid #ccc',
        },
        button: {
            width: '100%',
            padding: '12px',
            backgroundColor: theme.colorPrimario, // << Color primario dinámico
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
        },
        buttonDisabled: {
            backgroundColor: '#ccc',
            cursor: 'not-allowed',
        },
        error: {
            color: 'red',
            textAlign: 'center',
            marginBottom: '15px',
        },
    };

    // Muestra un estado de carga mientras el tema se obtiene de la API
    if (themeLoading) {
        return <div style={{ textAlign: 'center', marginTop: '100px' }}>Cargando personalización...</div>;
    }

    if (!tenantId) {
        return (
            <div style={styles.pageContainer}>
                <div style={styles.container}>
                    <h2 style={styles.error}>Error: Tenant no especificado en la URL.</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.pageContainer}>
            <div style={styles.container}>
                {/* 3. Usamos los datos del tema para renderizar el logo y el título */}
                {theme.logoUrl && <img src={theme.logoUrl} alt={`Logo de ${theme.tituloPrincipal}`} style={styles.logo} />}
                
                <h2 style={styles.title}>
                    {theme.tituloPrincipal}
                </h2>
                
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="username" style={styles.label}>Usuario</label>
                        <input
                            id="username"
                            style={styles.input}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>Contraseña</label>
                        <input
                            id="password"
                            style={styles.input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    <button
                        style={isSubmitting ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Ingresando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;