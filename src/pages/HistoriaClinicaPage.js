import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHistoriaClinica, solicitarAccesoHcen, getDocumentoExterno } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const HistoriaClinicaPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cedula, setCedula] = useState('');
    const [historia, setHistoria] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchedCedula, setSearchedCedula] = useState('');
    const [docStatus, setDocStatus] = useState({});

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!cedula.trim()) {
            setError('Por favor, ingrese una cédula.');
            return;
        }
        setLoading(true);
        setError('');
        setHistoria(null);
        setDocStatus({}); // Limpiar los estados de los documentos al iniciar una nueva búsqueda
        setSearchedCedula(cedula);
        try {
            const response = await getHistoriaClinica(user.tenant_id, cedula);
            setHistoria(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'No se pudo obtener la historia clínica.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

     const handleAccederExterno = async (idExternaDoc) => {
        setDocStatus(prev => ({ ...prev, [idExternaDoc]: { status: 'loading' } }));
        try {
            const response = await getDocumentoExterno(user.tenant_id, searchedCedula, idExternaDoc);
            
            // --- CAMBIO CLAVE: Redirigir en lugar de mostrar alert ---
            // Pasamos los datos del documento a través del 'state' de la navegación
            navigate(`/${user.tenant_id}/documento-externo/${idExternaDoc}`, { state: { documento: response.data } });

        } catch (err) {
            if (err.response && err.response.status === 403) {
                setDocStatus(prev => ({ ...prev, [idExternaDoc]: { status: 'permission_denied', error: err.response.data } }));
            } else {
                setDocStatus(prev => ({ ...prev, [idExternaDoc]: { status: 'error', error: 'Error al contactar a HCEN.' } }));
            }
        }
    };

    const handleSolicitarAcceso = async (idExternaDoc) => {
        setDocStatus(prev => ({ ...prev, [idExternaDoc]: { ...prev[idExternaDoc], status: 'requesting' } }));
        const motivo = prompt("Por favor, ingrese el motivo de la solicitud de acceso:", "Consulta médica de seguimiento");
        if (!motivo || !motivo.trim()) {
            setDocStatus(prev => ({ ...prev, [idExternaDoc]: { status: 'permission_denied', error: 'Debe ingresar un motivo para continuar.' } }));
            return;
        }
        try {
            const response = await solicitarAccesoHcen(user.tenant_id, { cedulaPaciente: searchedCedula, idExternaDoc, motivo });
            setDocStatus(prev => ({ ...prev, [idExternaDoc]: { status: 'request_sent', success: response.data } }));
        } catch (err) {
            setDocStatus(prev => ({ ...prev, [idExternaDoc]: { status: 'permission_denied', error: err.response?.data || "Error al enviar la solicitud." } }));
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Consultar Índice de Historia Clínica (HCEN)</h1>
                <Link to={`/${user?.tenant_id}/dashboard`}>Volver al Dashboard</Link>
            </div>

            <div style={styles.card}>
                <form onSubmit={handleSearch}>
                    <label htmlFor="cedula" style={styles.label}>Cédula del Paciente (sin puntos ni guion)</label>
                    <div style={styles.inputGroup}>
                        <input
                            id="cedula"
                            type="text"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            style={styles.input}
                            placeholder="Ingrese la cédula a buscar..."
                            required
                        />
                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </form>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            {historia && (
                <div style={{...styles.card, marginTop: '20px'}}>
                    <h2>Resultados para C.I. {searchedCedula}</h2>
                    {historia.length === 0 ? (
                        <p>El paciente no tiene documentos registrados en el índice de HCEN.</p>
                    ) : (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Tipo Documento</th>
                                        <th style={styles.th}>Fecha Creación</th>
                                        <th style={styles.th}>Prestador Custodio</th>
                                        <th style={styles.th}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historia.map((item) => {
                                        const id = item.idExternaDoc;
                                        const statusInfo = docStatus[id] || { status: 'idle' };

                                        return (
                                            <tr key={id}>
                                                <td style={styles.td}>{item.tipoDocumento}</td>
                                                <td style={styles.td}>{new Date(item.fechaCreacion).toLocaleString()}</td>
                                                <td style={styles.td}>{item.nombrePrestador}</td>
                                                <td style={styles.td}>
                                                    {user.tenant_id === item.schemaCustodio ? (
                                                        <Link to={`/${user.tenant_id}/documento/${id}`}>
                                                            <button style={styles.viewButton}>Ver Local</button>
                                                        </Link>
                                                    ) : (
                                                        <div>
                                                            {statusInfo.status === 'idle' && <button onClick={() => handleAccederExterno(id)} style={styles.requestButton}>Acceder</button>}
                                                            {statusInfo.status === 'loading' && <span>Verificando...</span>}
                                                            {statusInfo.status === 'success' && <span style={styles.successText}>Acceso Concedido</span>}
                                                            {statusInfo.status === 'requesting' && <span>Enviando...</span>}
                                                            {statusInfo.status === 'request_sent' && <span style={{...styles.successText, fontStyle: 'italic'}}>{statusInfo.success}</span>}
                                                            
                                                            {statusInfo.status === 'permission_denied' && (
                                                                <div>
                                                                    <div style={styles.requestError}>{statusInfo.error}</div>
                                                                    <button onClick={() => handleSolicitarAcceso(id)} style={styles.solicitarButton}>Solicitar Permiso</button>
                                                                </div>
                                                            )}
                                                            {statusInfo.status === 'error' && <div style={styles.requestError}>{statusInfo.error}</div>}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Estilos completos para la página
const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ccc', paddingBottom: '15px' },
    card: { padding: '25px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' },
    label: { display: 'block', marginBottom: '10px', fontWeight: 'bold' },
    inputGroup: { display: 'flex', gap: '10px' },
    input: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em' },
    button: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' },
    error: { color: '#dc3545', backgroundColor: '#f8d7da', border: '1px solid #f5c2c7', padding: '15px', borderRadius: '5px', textAlign: 'center', marginTop: '15px' },
    tableContainer: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', background: '#f8f9fa' },
    td: { padding: '12px', borderBottom: '1px solid #ddd', verticalAlign: 'middle' },
    viewButton: { padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    requestButton: { padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    solicitarButton: { padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '5px' },
    requestError: { color: '#dc3545', fontSize: '0.8em', marginTop: '5px' },
    successText: { color: '#198754', fontWeight: 'bold', fontSize: '0.9em' }
};

export default HistoriaClinicaPage;