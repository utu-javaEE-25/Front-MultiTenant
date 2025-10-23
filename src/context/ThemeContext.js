import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';

const ThemeContext = createContext(null);


const defaultTheme = {
    logoUrl: '/logo_default.png',
    tituloPrincipal: 'Portal de Servicios',
    colorPrimario: '#6c757d',
    colorFondo: '#ffffff'
};

export const ThemeProvider = ({ children }) => {
    const { tenantId } = useParams(); // Lee el tenant de la URL actual
    const [theme, setTheme] = useState(defaultTheme);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTheme = async () => {
            if (!tenantId) {
                setTheme(defaultTheme);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await apiClient.get(`/${tenantId}/api/config`);
                setTheme(response.data);
            } catch (error) {
                console.error(`Error al cargar el tema para el tenant ${tenantId}:`, error);
                setTheme(defaultTheme); // Si falla, usa el tema por defecto
            } finally {
                setLoading(false);
            }
        };

        fetchTheme();
    }, [tenantId]); // Se ejecuta cada vez que el tenantId en la URL cambie

    const value = { theme, loading };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);