import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDocumentoLocal } from '../services/api';
import DocumentoDetalleView from '../components/DocumentoDetalleView'; 

const VerDocumentoLocalPage = () => {
    const { idExternaDoc } = useParams();
    const { user } = useAuth();
    const [documento, setDocumento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDocumento = async () => {
            try {
                const response = await getDocumentoLocal(user.tenant_id, idExternaDoc);
                setDocumento(response.data);
            } catch (err) {
                setError('No se pudo cargar el documento local.');
            } finally {
                setLoading(false);
            }
        };

        if (user && idExternaDoc) {
            fetchDocumento();
        }
    }, [user, idExternaDoc]);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando documento local...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
    }

    if (!documento) {
         return <Navigate to={`/${user.tenant_id}/historia-paciente`} />;
    }

    return (
        <DocumentoDetalleView
            documento={documento}
            backPath={`/${user?.tenant_id}/historia-paciente`}
        />
    );
};

export default VerDocumentoLocalPage;