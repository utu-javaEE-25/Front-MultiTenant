import React from 'react';
import { useLocation, useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DocumentoDetalleView from '../components/DocumentoDetalleView';

const VerDocumentoExternoPage = () => {
    const { state } = useLocation();
    const { user } = useAuth();

    const documento = state?.documento;

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

export default VerDocumentoExternoPage;