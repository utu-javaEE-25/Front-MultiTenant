import React from 'react';
    import { Link } from 'react-router-dom';

    const DocumentoDetalleView = ({ documento, backPath }) => {

        const renderInfoRow = (label, value) => (
            <tr key={label}>
                <td style={styles.labelCell}>{label}</td>
                <td style={styles.valueCell}>{value || 'N/A'}</td>
            </tr>
        );

        // Función "inteligente" para manejar datos que pueden ser string JSON o arrays de objetos.
        const getDataAsArray = (data) => {
            if (!data) return [];
            // Si es un string, lo parseamos.
            if (typeof data === 'string') {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    console.error("Error al parsear JSON:", e);
                    return [];
                }
            }
            // Si ya es un objeto/array, lo devolvemos tal cual.
            return Array.isArray(data) ? data : [];
        };
        
        if (!documento) {
            return <p>No hay datos del documento para mostrar.</p>;
        }

        // Usamos la función helper para obtener los datos de forma segura.
        // Maneja tanto 'motivos' (local) como 'motivosDeConsulta' (externo).
        const motivos = getDataAsArray(documento.motivos || documento.motivosDeConsulta);
        const diagnosticos = getDataAsArray(documento.diagnosticos);
        const instrucciones = getDataAsArray(documento.instrucciones || documento.instruccionesDeSeguimiento);

        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2>Consulta de Documento Clínico</h2>
                    <Link to={backPath}>Volver al Índice</Link>
                </div>

                <div style={styles.card}>
                    <table style={styles.infoTable}>
                        <tbody>
                            {renderInfoRow('PACIENTE', documento.pacienteNombre || documento.paciente?.nombreCompleto)}
                            {renderInfoRow('Nro. Documento', documento.pacienteNroDocumento || documento.paciente?.nroDocumento)}
                            {renderInfoRow('Fecha de Nacimiento', documento.pacienteFechaNacimiento || documento.paciente?.fechaNacimiento)}
                            {renderInfoRow('Sexo', documento.pacienteSexo || documento.paciente?.sexo)}
                            {renderInfoRow('INSTANCIA MÉDICA', documento.instanciaMedica)}
                            {renderInfoRow('Fecha Atención', documento.fechaAtencion)}
                            {renderInfoRow('Lugar', documento.lugar)}
                            {renderInfoRow('AUTOR', documento.autor || documento.profesional?.nombreCompleto)}
                            {renderInfoRow('DOCUMENTO ID', documento.documentoId || documento.idExternaDoc)}
                            {renderInfoRow('Fecha Generación', new Date(documento.fechaGeneracion).toLocaleString())}
                            {renderInfoRow('Custodio', documento.custodio)}
                        </tbody>
                    </table>

                    {/* Lógica de renderizado universal para listas */}
                    {motivos.length > 0 && (
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Motivos de Consulta</h3>
                            <ul style={styles.list}>
                                {motivos.map((motivo, index) => (
                                    <li key={index}>{typeof motivo === 'object' ? motivo.descripcion : motivo}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {diagnosticos.length > 0 && (
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Diagnósticos</h3>
                            {diagnosticos.map((diag, index) => (
                                <table key={index} style={styles.diagnosticoTable}>
                                    <tbody>
                                        {renderInfoRow('Descripción', diag.descripcion)}
                                        {renderInfoRow('Fecha de Inicio', diag.fechaInicio)}
                                        {renderInfoRow('Estado del Problema', diag.estadoProblema)}
                                        {renderInfoRow('Grado de Certeza', diag.gradoCerteza)}
                                    </tbody>
                                </table>
                            ))}
                        </div>
                    )}
                    
                    {instrucciones.length > 0 && (
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Instrucciones de Seguimiento</h3>
                            <ul style={styles.list}>
                                {instrucciones.map((inst, index) => (
                                    <li key={index}>
                                        {typeof inst === 'object' && inst !== null
                                            ? <>{inst.tipo && <strong>{inst.tipo}:</strong>} {inst.descripcion}</>
                                            : inst
                                        }
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const styles = {
        container: { padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: 'auto', backgroundColor: '#f4f7f9' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ddd' },
        card: { padding: '25px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' },
        infoTable: { width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6' },
        labelCell: { backgroundColor: '#007bff', color: 'white', fontWeight: 'bold', padding: '10px', width: '200px', border: '1px solid #dee2e6' },
        valueCell: { padding: '10px', border: '1px solid #dee2e6' },
        section: { marginTop: '30px' },
        sectionTitle: { color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '5px', marginBottom: '15px' },
        list: { listStyleType: 'disc', paddingLeft: '20px' },
        diagnosticoTable: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffe0', marginTop: '15px' }
    };

    export default DocumentoDetalleView;