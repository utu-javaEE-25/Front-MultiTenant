import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useParams } from 'react-router-dom';

const AdminLoginPage = () => {
    const { tenantId } = useParams();
    const { theme, loading: themeLoading } = useTheme();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('admin_a');
    const [password, setPassword] = useState('adminpass456');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setError('');
    }, [tenantId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            // Llama a la función de login, SIEMPRE con el tipo 'admin'
            await login(tenantId, username, password, 'admin');
            // Redirige al dashboard de administración
            navigate(`/${tenantId}/admin/dashboard`);
        } catch (err) {
            setError('Fallo el login. Revisa tus credenciales de administrador.');
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
            backgroundColor: theme.colorFondo,
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
            color: theme.colorPrimario,
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
            backgroundColor: theme.colorPrimario,
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

    if (themeLoading) {
        return <div style={{ textAlign: 'center', marginTop: '100px' }}>Cargando personalización...</div>;
    }

    return (
        <div style={styles.pageContainer}>
            <div style={styles.container}>
                {theme.logoUrl && <img src={theme.logoUrl} alt={`Logo de ${theme.tituloPrincipal}`} style={styles.logo} />}

                <h2 style={styles.title}>
                    Portal de Administración
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="username" style={styles.label}>Usuario Administrador</label>
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

export default AdminLoginPage;