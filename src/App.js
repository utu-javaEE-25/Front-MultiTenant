// RUTA: src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Importaciones de páginas y componentes
import ProfesionalLoginPage from './pages/ProfesionalLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ManageProfesionalesPage from './pages/ManageProfesionalesPage';
import EditProfesionalPage from './pages/EditProfesionalPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import HistoriaClinicaPage from './pages/HistoriaClinicaPage';
import VerDocumentoLocalPage from './pages/VerDocumentoLocalPage'
import VerDocumentoExternoPage from './pages/VerDocumentoExternoPage';

// --- PASO 1: Importar la nueva página de perfil ---
import ProfilePage from './pages/ProfilePage';
import CrearHistoriaClinicaPage from './pages/CrearHistoriaClinicaPage';

import TenantLayout from './components/TenantLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/:tenantId" element={<TenantLayout />}>

                        {/* Rutas Públicas */}
                        <Route path="login" element={<ProfesionalLoginPage />} />
                        <Route path="admin/login" element={<AdminLoginPage />} />

                        {/* Rutas Protegidas para Profesionales */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="dashboard" element={<DashboardPage />} />

                            {/* --- PASO 2: Añadir la nueva ruta para el perfil --- */}
                            <Route path="perfil" element={<ProfilePage />} />
                            <Route path="crear-historia" element={<CrearHistoriaClinicaPage />} />
                            <Route path="historia-paciente" element={<HistoriaClinicaPage />} />
                            <Route path="documento/:idExternaDoc" element={<VerDocumentoLocalPage />} />
                            <Route path="documento-externo/:idExternaDoc" element={<VerDocumentoExternoPage />} />
                        </Route>

                        {/* Rutas Protegidas para Administradores */}
                        <Route element={<AdminRoute />}>
                            <Route path="admin/dashboard" element={<AdminDashboardPage />} />
                            <Route path="admin/profesionales" element={<ManageProfesionalesPage />} />
                            <Route path="admin/profesionales/editar" element={<EditProfesionalPage />} />
                            <Route path="admin/settings" element={<AdminSettingsPage />} />
                        </Route>
                    </Route>

                    {/* Ruta para URLs sin tenantId */}
                    <Route path="*" element={<h2 style={{textAlign: 'center', marginTop: '50px'}}>Bienvenido. Por favor, accede a través de la URL de tu organización.</h2>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;