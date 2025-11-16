// RUTA: src/services/api.js

import axios from 'axios';

const API_URL = 'https://pruebamulti.web.elasticloud.uy';
//const API_URL = 'http://localhost:8082';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};


// ===========================================
// === Funciones de Autenticación y Perfil ===z
// ===========================================

export const login = (tenantId, username, password, userType) => {
    const loginEndpoint = userType === 'admin' ? 'admin' : 'profesional';
    return apiClient.post(`/${tenantId}/api/auth/login/${loginEndpoint}`, { username, password });
};

// Obtiene los datos del perfil del profesional autenticado
export const getOwnProfile = (tenantId) => apiClient.get(`/${tenantId}/api/auth/perfil`);

// Actualiza los datos del perfil del profesional autenticado
export const updateOwnProfile = (tenantId, data) => apiClient.put(`/${tenantId}/api/auth/perfil`, data);


// ===================================================
// === Funciones de Administración de Profesionales ===
// ===================================================

// Obtiene la lista de todos los profesionales
export const getProfesionales = (tenantId) => apiClient.get(`/${tenantId}/api/admin/profesionales`);

// Crea un nuevo profesional
export const createProfesional = (tenantId, data) => apiClient.post(`/${tenantId}/api/admin/profesionales`, data);

// Actualiza un profesional por su ID
export const updateProfesional = (tenantId, id, data) => apiClient.put(`/${tenantId}/api/admin/profesionales/${id}`, data);

// Elimina un profesional por su ID
export const deleteProfesional = (tenantId, id) => apiClient.delete(`/${tenantId}/api/admin/profesionales/${id}`);

// Busca un profesional por su email
export const getProfesionalByEmail = (tenantId, email) => apiClient.get(`/${tenantId}/api/admin/profesionales/email/${email}`);

export const importarPaciente = (tenantId, cedula) => {return apiClient.post(`/${tenantId}/api/auth/admin/importar-paciente/${cedula}`);};

// ===========================================
// === Funciones de Pacientes y Documentos ===
// ===========================================

// Busca pacientes por su número de documento
export const searchPacientes = (tenantId, nroDocumento) => {
    return apiClient.get(`/${tenantId}/api/pacientes/search`, {
        params: { nroDocumento }
    });
};

// Crea un nuevo documento clínico
export const createDocumentoClinico = (tenantId, data) => {
    return apiClient.post(`/${tenantId}/api/documentos`, data);
};

export const getHistoriaClinica = (tenantId, cedulaPaciente) => {
    return apiClient.get(`/${tenantId}/api/historia-clinica/${cedulaPaciente}`);
};

export const getDocumentoLocal = (tenantId, docId) => {
    return apiClient.get(`/${tenantId}/api/documentos/${docId}`);
};

export const solicitarAccesoHcen = (tenantId, { cedulaPaciente, idExternaDoc, motivo }) => {
    return apiClient.post(`/${tenantId}/api/accesos/solicitar`, {
        cedulaPaciente,
        idExternaDoc,
        motivo
    });
};

export const getDocumentoExterno = (tenantId, cedulaPaciente, docId) => {
    return apiClient.get(`/${tenantId}/api/documento-externo`, {
        params: { cedulaPaciente, docId }
    });
};
// Solicita acceso para ver la historia de un paciente
export const solicitarAccesoPaciente = (tenantId, cedulaPaciente) => {
    return apiClient.post(`/${tenantId}/api/pacientes/solicitar-acceso`, { cedulaPaciente });
};

// --- NUEVA FUNCIÓN PARA DESACTIVAR PACIENTE ---
export const desactivarPaciente = (tenantId, pacienteId) => {
    return apiClient.put(`/${tenantId}/api/pacientes/${pacienteId}/desactivar`);
};

export const getTenantConfig = (tenantId) => apiClient.get(`/${tenantId}/api/config`);

export const updateAdminConfig = (tenantId, configData) => {
    return apiClient.put(`/${tenantId}/api/admin/config`, configData);
};

export const crearPacienteLocal = (tenantId, pacienteData) => {
    // CORRECCIÓN: La URL correcta es la ruta base del AdminPacienteController
    return apiClient.post(`/${tenantId}/api/admin/pacientes`, pacienteData);
};

export default apiClient;