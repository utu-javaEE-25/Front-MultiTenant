import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
    const { user, logout } = useAuth();

    // Estilos básicos para la página
    const styles = {
        container: {
            padding: '20px',
            fontFamily: 'sans-serif',
        },
        header: {
            borderBottom: '2px solid #eee',
            paddingBottom: '10px',
            marginBottom: '20px',
        },
        button: {
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        nav: {
            marginTop: '30px',
        },
        navList: {
            listStyle: 'none',
            padding: 0,
        },
        navItem: {
            marginBottom: '10px',
        },
        navLink: {
            textDecoration: 'none',
            color: '#007bff',
            fontSize: '1.1em',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Dashboard de Administración del Tenant: {user?.tenant_id}</h1>
                <p>Bienvenido, Administrador <strong>{user?.sub}</strong>.</p>
                <button onClick={logout} style={styles.button}>Cerrar Sesión</button>
            </div>
            
            <p>Desde aquí puedes gestionar los recursos de la clínica.</p>

            <nav style={styles.nav}>
                <h3>Menú de Administración</h3>
                <ul style={styles.navList}>
                    <li style={styles.navItem}>
                        {/* En el futuro, estos enlaces usarán <Link> de react-router-dom */}
                        <a href={`/${user?.tenant_id}/admin/profesionales`} style={styles.navLink}>
                            Gestionar Profesionales
                        </a>
                    </li>
                    <li style={styles.navItem}>
                        <a href={`/${user?.tenant_id}/admin/settings`} style={styles.navLink}>
                            Configuración de la Clínica
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminDashboardPage;