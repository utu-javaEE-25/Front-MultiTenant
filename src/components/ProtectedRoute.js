import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const { tenantId } = useParams();

    if (loading) {
        return <div>Verificando sesión...</div>;
    }

    // 1. REGLA: Si no hay usuario, redirige a la página de login de profesional
    if (!user) {
        return <Navigate to={`/${tenantId}/login`} />;
    }

    // 2. [OPCIONAL PERO RECOMENDADO] REGLA: Si el usuario es un ADMIN, no debería estar aquí.
    // Lo redirigimos a su propio dashboard de admin.
    if (user.rol === 'ADMIN') {
        return <Navigate to={`/${user.tenant_id}/admin/dashboard`} />;
    }
    
    // Si el usuario existe y no es un admin, es un profesional. Permite el acceso.
    return <Outlet />;
};

export default ProtectedRoute;