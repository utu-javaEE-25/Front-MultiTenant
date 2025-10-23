import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';

// Este componente envuelve todas las páginas que dependen de un tenant
const TenantLayout = () => {
    return (
        <ThemeProvider>
            {/* Outlet renderizará la ruta hija (Login, Dashboard, etc.) */}
            <Outlet />
        </ThemeProvider>
    );
};

export default TenantLayout;