// RUTA: src/pages/DashboardPage.js

import React from 'react'; // Eliminé useState porque ya no se usa para la consulta local
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
// Eliminados imports de SolicitarAcceso y GestionarPacientes

const DashboardPage = () => {
    const { user, logout } = useAuth();

    // Eliminada toda la lógica de fetchDocumento, loading, error, etc.

    const styles = {
        container: { padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: 'auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' },
        navLink: { marginRight: '20px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' },
        logoutButton: { padding: '8px 12px', border: 'none', backgroundColor: '#dc3545', color: 'white', borderRadius: '5px', cursor: 'pointer' },
        welcomeText: { marginTop: '20px' },
        actionsContainer: { marginTop: '30px', padding: '20px', backgroundColor: '#e9f5ff', borderRadius: '8px', textAlign: 'center' },
        actionButtonContainer: { display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' },
        actionButton: { padding: '12px 20px', fontSize: '1.1em', border: 'none', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', cursor: 'pointer' },
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <h1>Dashboard Profesional</h1>
                <div>
                    <Link to={`/${user?.tenant_id}/perfil`} style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                        Mi Perfil
                    </Link>
                    <button onClick={logout} style={styles.logoutButton}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            <p style={styles.welcomeText}>
                Bienvenido, <strong>{user?.sub}</strong> (Tenant: {user?.tenant_id}).
            </p>

            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e9f5ff', borderRadius: '8px', textAlign: 'center' }}>
                <h2>Acciones Rápidas</h2>
                <div style={styles.actionButtonContainer}>
                    <Link to={`/${user?.tenant_id}/crear-historia`}>
                        <button style={styles.actionButton}>➕ Crear Nueva Historia Clínica</button>
                    </Link>
                    <Link to={`/${user?.tenant_id}/historia-paciente`}>
                        <button style={{...styles.actionButton, backgroundColor: '#17a2b8'}}>
                            <i className="bi bi-search"></i> Consultar Historia HCEN
                        </button>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;