import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import ProfesionalLoginPage from './pages/ProfesionalLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';

import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import TenantLayout from './components/TenantLayout';
import AdminRoute from './components/AdminRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/:tenantId" element={<TenantLayout />}>
              
              {/* --- RUTAS DE LOGIN EXPLÍCITAS Y SEPARADAS --- */}
              <Route path="login" element={<ProfesionalLoginPage />} />
              <Route path="admin/login" element={<AdminLoginPage />} />
              
              {/* Rutas protegidas para PROFESIONALES */}
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<DashboardPage />} />
              </Route>

              {/* Rutas protegidas para ADMINISTRADORES */}
              <Route element={<AdminRoute />}>
                <Route path="admin/dashboard" element={<AdminDashboardPage />} />
                {/* Aquí irían las otras rutas de admin, como: */}
                {/* <Route path="admin/profesionales" element={<ManageProfesionalesPage />} /> */}
              </Route>
          </Route>
          
          <Route path="*" element={<h2>Bienvenido. Por favor, accede a través de la URL de tu organización.</h2>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;