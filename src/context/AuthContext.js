import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { setAuthToken } from '../services/api';
import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Al cargar la app, revisa si hay un token en localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
            const decoded = jwtDecode(token);
            // Opcional: verificar si el token ha expirado
            if (decoded.exp * 1000 > Date.now()) {
                setAuthToken(token);
                setUser({ token, ...decoded });
            } else {
                localStorage.removeItem('authToken'); // Limpiar token expirado
            }
        }
        setLoading(false);
    }, []);

    /*const login = async (tenantId, username, password) => {
        try {
            // Construimos la URL dinámica
            const response = await apiClient.post(`/${tenantId}/api/auth/login`, { username, password });
            const { token } = response.data;

            localStorage.setItem('authToken', token);
            setAuthToken(token);
            const decoded = jwtDecode(token);
            setUser({ token, ...decoded });
            return true;
        } catch (error) {
            console.error("Error en el login:", error);
            throw error; 
        }
    };*/
    const login = async (tenantId, username, password, userType) => {
        // Determina el endpoint correcto basado en el tipo de usuario
        const loginEndpoint = userType === 'admin' ? 'admin' : 'profesional';

        try {
            const response = await apiClient.post(
                `/${tenantId}/api/auth/login/${loginEndpoint}`,
                { username, password }
            );
            const { token } = response.data;

            localStorage.setItem('authToken', token);
            setAuthToken(token);
            const decoded = jwtDecode(token);
            setUser({ token, ...decoded });
            
        } catch (error) {
            console.error(`Error en el login de ${userType}:`, error);
            // Propaga el error para que el componente de la página de login pueda manejarlo
            throw error;
        }
    };


    const logout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUser(null);
    };

    const value = { user, isAuthenticated: !!user, loading, login, logout };

    if (loading) {
        return <div>Cargando sesión...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);