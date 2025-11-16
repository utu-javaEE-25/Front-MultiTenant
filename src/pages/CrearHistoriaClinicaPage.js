// RUTA: src/pages/CrearHistoriaClinicaPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { searchPacientes, createDocumentoClinico } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const CrearHistoriaClinicaPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Estado del Paciente
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState(null);

    // Estado del Documento Clínico
    const [motivo, setMotivo] = useState('');
    const [motivos, setMotivos] = useState([]);
    const [diagnostico, setDiagnostico] = useState({ descripcion: '', fechaInicio: '', estadoProblema: 'Activo', gradoCerteza: 'Presuntivo' });
    const [diagnosticos, setDiagnosticos] = useState([]);
    const [instruccion, setInstruccion] = useState({ tipo: 'Indicación', descripcion: '' });
    const [instrucciones, setInstrucciones] = useState([]);

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Búsqueda de pacientes
    useEffect(() => {
        if (searchTerm.length > 2) {
            const timer = setTimeout(async () => {
                const response = await searchPacientes(user.tenant_id, searchTerm);
                setSearchResults(response.data);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, user.tenant_id]);


    // Handlers para añadir items a las listas
    const addMotivo = () => {
        if (motivo.trim()) {
            setMotivos([...motivos, { descripcion: motivo }]);
            setMotivo('');
        }
    };
    const addDiagnostico = () => {
        if (diagnostico.descripcion.trim()) {
            setDiagnosticos([...diagnosticos, diagnostico]);
            setDiagnostico({ descripcion: '', fechaInicio: '', estadoProblema: 'Activo', gradoCerteza: 'Presuntivo' });
        }
    };
    const addInstruccion = () => {
        if (instruccion.descripcion.trim()) {
            setInstrucciones([...instrucciones, instruccion]);
            setInstruccion({ tipo: 'Indicación', descripcion: '' });
        }
    };

    // Handler para el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPaciente) {
            setError("Debe seleccionar un paciente.");
            return;
        }
        setIsSubmitting(true);
        setError('');

        const documentoData = {
            pacienteId: selectedPaciente.pacienteId,
            instanciaMedica: 'Consulta General',
            lugar: 'Consultorio',
            fechaAtencionInicio: new Date().toISOString(),
            fechaAtencionFin: new Date().toISOString(),
            motivos,
            diagnosticos,
            instrucciones
        };

        try {
            await createDocumentoClinico(user.tenant_id, documentoData);
            alert("¡Historia clínica creada con éxito!");
            navigate(`/${user.tenant_id}/dashboard`);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear la historia clínica.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Nueva Historia Clínica Electrónica</h1>
                <Link to={`/${user?.tenant_id}/dashboard`}>Volver al Dashboard</Link>
            </div>

            {/* SECCIÓN DE BÚSQUEDA DE PACIENTE */}
            <div style={styles.card}>
                <h2>1. Paciente</h2>
                {!selectedPaciente ? (
                    <>
                        <label>Buscar por Cédula:</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.input}
                            placeholder="Ingrese al menos 3 dígitos..."
                        />
                        {searchResults.length > 0 && (
                            <ul style={styles.resultsList}>
                                {searchResults.map(p => (
                                    <li key={p.pacienteId} onClick={() => {
                                        setSelectedPaciente(p);
                                        setSearchResults([]);
                                        setSearchTerm('');
                                    }}>
                                        {p.nombre} {p.apellido} ({p.nroDocumento})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                ) : (
                    <div style={styles.selectedPaciente}>
                        <p><strong>Paciente:</strong> {selectedPaciente.nombre} {selectedPaciente.apellido} (CI: {selectedPaciente.nroDocumento})</p>
                        <button onClick={() => setSelectedPaciente(null)}>Cambiar Paciente</button>
                    </div>
                )}
            </div>

            {/* FORMULARIO PRINCIPAL */}
            <form onSubmit={handleSubmit} style={{ opacity: selectedPaciente ? 1 : 0.5, pointerEvents: selectedPaciente ? 'auto' : 'none' }}>
                {/* Motivos de Consulta */}
                <div style={styles.card}>
                    <h2>2. Motivos de Consulta</h2>
                    <div style={styles.inputGroup}>
                        <input value={motivo} onChange={e => setMotivo(e.target.value)} style={styles.input} placeholder="Añadir motivo..."/>
                        <button type="button" onClick={addMotivo} style={styles.buttonIcon}>➕</button>
                    </div>
                    <ul style={styles.itemList}>
                        {motivos.map((m, i) => <li key={i}>{m.descripcion}</li>)}
                    </ul>
                </div>

                {/* Diagnósticos */}
                <div style={styles.card}>
                    <h2>3. Diagnósticos</h2>
                    <div style={styles.formGrid}>
                        <input value={diagnostico.descripcion} onChange={e => setDiagnostico({...diagnostico, descripcion: e.target.value})} placeholder="Descripción del diagnóstico" style={{...styles.input, gridColumn: '1 / -1'}}/>
                        <input type="date" value={diagnostico.fechaInicio} onChange={e => setDiagnostico({...diagnostico, fechaInicio: e.target.value})} style={styles.input}/>
                        <select value={diagnostico.estadoProblema} onChange={e => setDiagnostico({...diagnostico, estadoProblema: e.target.value})} style={styles.input}>
                            <option>Activo</option>
                            <option>Resuelto</option>
                            <option>Crónico</option>
                        </select>
                        <select value={diagnostico.gradoCerteza} onChange={e => setDiagnostico({...diagnostico, gradoCerteza: e.target.value})} style={styles.input}>
                             <option>Presuntivo</option>
                             <option>Confirmado</option>
                             <option>Descartado</option>
                        </select>
                    </div>
                    <button type="button" onClick={addDiagnostico} style={styles.button}>Agregar Diagnóstico</button>
                    <ul style={styles.itemList}>
                        {diagnosticos.map((d, i) => <li key={i}>{d.descripcion} ({d.estadoProblema})</li>)}
                    </ul>
                </div>

                 {/* Instrucciones */}
                <div style={styles.card}>
                    <h2>4. Instrucciones de Seguimiento</h2>
                    <div style={styles.formGrid}>
                         <select value={instruccion.tipo} onChange={e => setInstruccion({...instruccion, tipo: e.target.value})} style={styles.input}>
                            <option>Indicación</option>
                            <option>Tratamiento</option>
                            <option>Referencia</option>
                            <option>Próxima Consulta</option>
                        </select>
                        <input value={instruccion.descripcion} onChange={e => setInstruccion({...instruccion, descripcion: e.target.value})} placeholder="Descripción de la instrucción" style={{...styles.input, gridColumn: '2 / -1'}}/>
                    </div>
                    <button type="button" onClick={addInstruccion} style={styles.button}>Agregar Instrucción</button>
                     <ul style={styles.itemList}>
                        {instrucciones.map((item, i) => <li key={i}><strong>{item.tipo}:</strong> {item.descripcion}</li>)}
                    </ul>
                </div>

                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.submitButton} disabled={isSubmitting || !selectedPaciente}>
                    {isSubmitting ? 'Guardando...' : 'Salvar Historia'}
                </button>
            </form>
        </div>
    );
};

// Estilos (similares a otras páginas para consistencia)
const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ccc', paddingBottom: '15px' },
    card: { padding: '25px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', marginBottom: '25px' },
    input: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' },
    inputGroup: { display: 'flex', gap: '10px' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' },
    button: { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    buttonIcon: { padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    submitButton: { width: '100%', padding: '15px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold' },
    error: { color: 'red', textAlign: 'center', margin: '15px 0' },
    resultsList: { listStyle: 'none', padding: '0', margin: '10px 0 0 0', border: '1px solid #ddd', borderRadius: '5px' },
    itemList: { paddingLeft: '20px' },
    selectedPaciente: { padding: '10px', backgroundColor: '#e9f5ff', border: '1px solid #b3d7ff', borderRadius: '5px' }
};

export default CrearHistoriaClinicaPage;