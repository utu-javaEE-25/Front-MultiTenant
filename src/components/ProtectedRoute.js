import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const { tenantId } = useParams();

    if (loading) {
        // Es importante mostrar un estado de carga mientras se verifica el token
        return <div>Verificando sesión...</div>;
    }

    if (!isAuthenticated) {
        //CONSTRUIMOS LA URL DE REDIRECCIÓN DINÁMICAMENTE
        const loginPath = tenantId ? `/${tenantId}/login` : '/login';
        return <Navigate to={loginPath} />;
    }

    return <Outlet />; 
};

export default ProtectedRoute;