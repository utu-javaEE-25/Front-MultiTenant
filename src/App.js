import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import TenantLayout from './components/TenantLayout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta principal que captura el tenantId */}
          <Route path="/:tenantId" element={<TenantLayout />}>
              {/* Rutas anidadas que se renderizarán dentro del Outlet */}
              <Route path="login" element={<LoginPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<DashboardPage />} />
              </Route>
          </Route>
          
          <Route path="*" element={<h2>Bienvenido. Por favor, accede a través de la URL de tu organización.</h2>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;