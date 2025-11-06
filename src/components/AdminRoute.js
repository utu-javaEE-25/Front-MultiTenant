import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();
    const { tenantId } = useParams();

    // Muestra un estado de carga mientras se verifica la sesión del token
    if (loading) {
        return <div>Verificando sesión de administrador...</div>;
    }

    // 1. REGLA: Si no hay usuario, redirige a la página de login de admin
    // Usamos tenantId de la URL como fallback si el usuario es nulo
    if (!user) {
        return <Navigate to={`/${tenantId}/admin/login`} />;
    }

    // 2. REGLA: Si el usuario existe pero su rol NO es 'ADMIN',
    // lo redirigimos a su propio dashboard (el de profesional)
    if (user.rol !== 'ADMIN') {
        return <Navigate to={`/${user.tenant_id}/dashboard`} />;
    }

    // Si pasaron ambas reglas, permite el acceso a la ruta hija.
    return <Outlet />;
};

export default AdminRoute;