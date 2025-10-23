import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [documento, setDocumento] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [docId, setDocId] = useState('1'); // ID del documento a buscar

    const fetchDocumento = async () => {
        if (!user) return;
        setLoading(true);
        setError('');
        try {
            // El tenantId viene del token, que fue extraído y guardado en el objeto 'user'
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

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Dashboard del Tenant: {user?.tenant_id}</h1>
            <p>Bienvenido, <strong>{user?.sub}</strong>.</p>
            <button onClick={logout} style={{marginBottom: '20px'}}>Cerrar Sesión</button>
            <hr />
            
            <h3>Consultar Documento Clínico</h3>
            <div>
                <label>ID del Documento: </label>
                <input type="text" value={docId} onChange={(e) => setDocId(e.target.value)} />
                <button onClick={fetchDocumento} disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>
            
            {error && <p style={{color: 'red'}}>{error}</p>}
            
            {documento && (
                <div style={{marginTop: '20px', border: '1px solid green', padding: '10px'}}>
                    <h4>Resultado:</h4>
                    <pre>{JSON.stringify(documento, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;