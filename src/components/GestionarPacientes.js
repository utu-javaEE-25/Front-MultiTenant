import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { searchPacientes, desactivarPaciente } from '../services/api';

const GestionarPacientes = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSearch = async () => {
        if (searchTerm.length < 3) {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            const response = await searchPacientes(user.tenant_id, searchTerm);
            setSearchResults(response.data);
        } catch (error) {
            setMessage({ tipo: 'danger', texto: 'Error al buscar pacientes.' });
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDesactivar = async (pacienteId) => {
        if (!window.confirm('¿Está seguro de que desea desactivar a este paciente? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            await desactivarPaciente(user.tenant_id, pacienteId);
            setMessage({ tipo: 'success', texto: '¡Paciente desactivado con éxito!' });
            handleSearch();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'No se pudo desactivar el paciente.';
            setMessage({ tipo: 'danger', texto: errorMsg });
        }
    };


    return (
        <div style={styles.card}>
            <div style={styles.cardIcon}>📋</div>
            <h3 style={styles.cardTitle}>Gestionar Pacientes</h3>
            <p style={styles.cardDescription}>
                Busque un paciente por su cédula para ver su estado o realizar acciones.
            </p>
            <div style={styles.inputGroup}>
                <input
                    type="text"
                    style={styles.input}
                    placeholder="Buscar por cédula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button style={styles.button} onClick={handleSearch} disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>
            {message && (
                <div style={{ ...styles.alert, ...styles[`alert_${message.tipo}`] }}>
                    {message.texto}
                </div>
            )}
            {searchResults.length > 0 && (
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Cédula</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    {searchResults.map(p => (
                        <tr key={p.pacienteId}>
                            <td style={styles.td}>{p.nombre} {p.apellido}</td>
                            <td style={styles.td}>{p.nroDocumento}</td>
                            <td style={styles.td}>
                                {/* --- CAMBIO 1: Usar el booleano 'activo' para el estilo y el texto --- */}
                                <span style={p.activo ? styles.badgeActive : styles.badgeInactive}>
                                        {p.activo ? 'ACTIVO' : 'DESACTIVADO'}
                                    </span>
                            </td>
                            <td style={styles.td}>
                                {/* --- CAMBIO 2: Usar el booleano 'activo' para mostrar el botón --- */}
                                {p.activo && (
                                    <button
                                        style={styles.buttonDelete}
                                        onClick={() => handleDesactivar(p.pacienteId)}>
                                        Desactivar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// ... (los estilos se mantienen igual) ...
const styles = {
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderLeft: '5px solid #6f42c1', marginTop: '30px' },
    cardIcon: { fontSize: '2.5rem', marginBottom: '15px', color: '#6f42c1' },
    cardTitle: { margin: '0 0 10px 0', color: '#333' },
    cardDescription: { margin: '0 0 20px 0', color: '#666', fontSize: '0.9rem' },
    inputGroup: { display: 'flex', gap: '10px' },
    input: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
    button: { padding: '10px 15px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    alert: { padding: '10px', marginTop: '15px', borderRadius: '5px', border: '1px solid' },
    alert_success: { color: '#0f5132', backgroundColor: '#d1e7dd', borderColor: '#badbcc' },
    alert_danger: { color: '#842029', backgroundColor: '#f8d7da', borderColor: '#f5c2c7' },
    table: { width: '100%', marginTop: '20px', borderCollapse: 'collapse' },
    th: { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd', background: '#f8f9fa' },
    td: { padding: '10px', borderBottom: '1px solid #ddd' },
    buttonDelete: { padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    badgeActive: { backgroundColor: '#d1e7dd', color: '#0f5132', padding: '4px 8px', borderRadius: '10px', fontSize: '0.8em' },
    badgeInactive: { backgroundColor: '#e2e3e5', color: '#495057', padding: '4px 8px', borderRadius: '10px', fontSize: '0.8em' },
};

export default GestionarPacientes;