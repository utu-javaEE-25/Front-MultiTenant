// RUTA: src/components/pacientes/ImportarPaciente.js

import React, { useState } from 'react';

// --- CORRECCIÓN: Rutas relativas corregidas ---
import { useAuth } from '../context/AuthContext';
import { importarPaciente } from '../services/api';

const ImportarPaciente = () => {
    const { user } = useAuth();
    const [cedula, setCedula] = useState('');
    const [mensaje, setMensaje] = useState(null);
    const [pacienteImportado, setPacienteImportado] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleImportarClick = async () => {
        if (!cedula.trim()) {
            setMensaje({ tipo: 'warning', texto: 'Por favor, ingrese una cédula.' });
            return;
        }

        setCargando(true);
        setMensaje(null);
        setPacienteImportado(null);

        try {
            const response = await importarPaciente(user.tenant_id, cedula);

            setPacienteImportado(response.data);
            setMensaje({ tipo: 'success', texto: '¡Paciente importado con éxito!' });
            setCedula('');
        } catch (error) {
            const errorMessage = error.response?.data || 'Error de red. No se pudo conectar al servidor.';
            setMensaje({ tipo: 'danger', texto: `Error: ${errorMessage}` });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.cardIcon}>➕</div>
            <h3 style={styles.cardTitle}>Alta de Paciente (Importar)</h3>
            <p style={styles.cardDescription}>
                Ingrese la cédula para buscar y dar de alta a un paciente desde el sistema central HCEN.
            </p>
            <div style={styles.inputGroup}>
                <input
                    type="text"
                    style={styles.input}
                    placeholder="Cédula sin puntos ni guion"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    disabled={cargando}
                />
                <button style={styles.button} onClick={handleImportarClick} disabled={cargando}>
                    {cargando ? 'Importando...' : 'Importar'}
                </button>
            </div>

            {mensaje && (
                <div style={{ ...styles.alert, ...styles[`alert_${mensaje.tipo}`] }}>
                    {mensaje.texto}
                </div>
            )}

            {pacienteImportado && (
                <div style={styles.resultadoContainer}>
                    <strong>Datos del Paciente Creado:</strong>
                    <ul>
                        <li><strong>ID Local:</strong> {pacienteImportado.pacienteId}</li>
                        <li><strong>Nombre:</strong> {pacienteImportado.nombre} {pacienteImportado.apellido}</li>
                        <li><strong>Cédula:</strong> {pacienteImportado.nroDocumento}</li>
                        <li><strong>Email:</strong> {pacienteImportado.email}</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

// ... (los estilos se mantienen igual) ...

const styles = {
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderLeft: '5px solid #198754' },
    cardIcon: { fontSize: '2.5rem', marginBottom: '15px', color: '#198754' },
    cardTitle: { margin: '0 0 10px 0', color: '#333' },
    cardDescription: { margin: '0 0 20px 0', color: '#666', fontSize: '0.9rem' },
    inputGroup: { display: 'flex', gap: '10px' },
    input: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
    button: { padding: '10px 15px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    alert: { padding: '10px', marginTop: '15px', borderRadius: '5px', border: '1px solid' },
    alert_success: { color: '#0f5132', backgroundColor: '#d1e7dd', borderColor: '#badbcc' },
    alert_danger: { color: '#842029', backgroundColor: '#f8d7da', borderColor: '#f5c2c7' },
    alert_warning: { color: '#664d03', backgroundColor: '#fff3cd', borderColor: '#ffecb5' },
    resultadoContainer: { marginTop: '15px', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }
};

export default ImportarPaciente;