import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { solicitarAccesoPaciente } from '../services/api';

const SolicitarAcceso = () => {
    const { user } = useAuth();
    const [cedula, setCedula] = useState('');
    const [mensaje, setMensaje] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleSolicitarClick = async () => {
        if (!cedula.trim()) {
            setMensaje({ tipo: 'warning', texto: 'Por favor, ingrese la cédula del paciente.' });
            return;
        }

        setCargando(true);
        setMensaje(null);

        try {
            // Llamamos a la nueva función del API
            const response = await solicitarAccesoPaciente(user.tenant_id, cedula);

            // La respuesta exitosa es un simple string
            setMensaje({ tipo: 'success', texto: response.data });
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
            <div style={styles.cardIcon}>🔑</div>
            <h3 style={styles.cardTitle}>Solicitar Acceso a Paciente</h3>
            <p style={styles.cardDescription}>
                Ingrese la cédula del paciente para solicitar permiso de acceso a su historia clínica centralizada.
            </p>
            <div style={styles.inputGroup}>
                <input
                    type="text"
                    style={styles.input}
                    placeholder="Cédula del paciente"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    disabled={cargando}
                />
                <button style={styles.button} onClick={handleSolicitarClick} disabled={cargando}>
                    {cargando ? 'Enviando...' : 'Solicitar'}
                </button>
            </div>

            {mensaje && (
                <div style={{ ...styles.alert, ...styles[`alert_${mensaje.tipo}`] }}>
                    {mensaje.texto}
                </div>
            )}
        </div>
    );
};

const styles = {
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderLeft: '5px solid #ffc107', marginTop: '30px' },
    cardIcon: { fontSize: '2.5rem', marginBottom: '15px', color: '#ffc107' },
    cardTitle: { margin: '0 0 10px 0', color: '#333' },
    cardDescription: { margin: '0 0 20px 0', color: '#666', fontSize: '0.9rem' },
    inputGroup: { display: 'flex', gap: '10px' },
    input: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
    button: { padding: '10px 15px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    alert: { padding: '10px', marginTop: '15px', borderRadius: '5px', border: '1px solid' },
    alert_success: { color: '#0f5132', backgroundColor: '#d1e7dd', borderColor: '#badbcc' },
    alert_danger: { color: '#842029', backgroundColor: '#f8d7da', borderColor: '#f5c2c7' },
    alert_warning: { color: '#664d03', backgroundColor: '#fff3cd', borderColor: '#ffecb5' },
};

export default SolicitarAcceso;