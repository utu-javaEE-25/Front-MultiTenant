// RUTA: src/pages/DashboardPage.js

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import { Link } from 'react-router-dom';
import SolicitarAcceso from '../components/SolicitarAcceso';
import GestionarPacientes from '../components/GestionarPacientes'; // --- IMPORTAR NUEVO COMPONENTE ---

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [documento, setDocumento] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [docId, setDocId] = useState('DOC-TENANT_A-1234abcd');

    const fetchDocumento = async () => {
        if (!user) return;
        setLoading(true);
        setError('');
        try {
            const tenantId = user.tenant_id;
            const response = await apiClient.get(`/${tenantId}/api/documentos/${docId}`);
            setDocumento(response.data);
        } catch (err) {
            setDocumento(null);
            setError(`No se pudo cargar el documento. (Error: ${err.response?.status || 'desconocido'})`);
        } finally {
            setLoading(false);
        }
    };

    // --- CORRECCIÓN: Definimos el objeto 'styles' aquí ---
    const styles = {
        container: { padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: 'auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' },
        navLink: { marginRight: '20px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' },
        logoutButton: { padding: '8px 12px', border: 'none', backgroundColor: '#dc3545', color: 'white', borderRadius: '5px', cursor: 'pointer' },
        welcomeText: { marginTop: '20px' },
        actionsContainer: { marginTop: '30px', padding: '20px', backgroundColor: '#e9f5ff', borderRadius: '8px', textAlign: 'center' },
        actionButtonContainer: { display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' },
        actionButton: { padding: '12px 20px', fontSize: '1.1em', border: 'none', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', cursor: 'pointer' },
        consultContainer: { marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' },
        inputGroup: { display: 'flex', gap: '10px', alignItems: 'center' },
        input: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc' },
        searchButton: { padding: '8px 12px', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', cursor: 'pointer' },
        errorText: { color: 'red', marginTop: '10px' },
        resultsContainer: { marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px', backgroundColor: 'white' },
        preformatted: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
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

            <SolicitarAcceso />

            {/* --- INTEGRACIÓN DEL NUEVO COMPONENTE --- */}
            <GestionarPacientes />

            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3>Consultar Documento Clínico (Local)</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label>ID del Documento: </label>
                    <input type="text" value={docId} onChange={(e) => setDocId(e.target.value)} style={styles.input} />
                    <button onClick={fetchDocumento} disabled={loading} style={styles.searchButton}>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>

                {error && <p style={styles.errorText}>{error}</p>}

                {documento && (
                    <div style={styles.resultsContainer}>
                        <h4>Resultado Encontrado:</h4>
                        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                            {JSON.stringify(documento, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;