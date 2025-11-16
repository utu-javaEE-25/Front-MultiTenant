// RUTA: src/components/CrearPacienteAdmin.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { crearPacienteLocal } from '../services/api';

const initialFormState = {
    nombre: '',
    apellido: '',
    nroDocumento: '',
    sexo: 'Otro',
    fechaNacimiento: '',
    email: ''
};

const CrearPacienteAdmin = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState(initialFormState);
    const [mensaje, setMensaje] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMensaje(null);
        try {
            const response = await crearPacienteLocal(user.tenant_id, formData);
            setMensaje({ tipo: 'success', texto: `¡Paciente ${response.data.nombre} creado con éxito!` });
            setFormData(initialFormState); // Limpiar formulario
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'No se pudo crear el paciente.';
            setMensaje({ tipo: 'danger', texto: `Error: ${errorMessage}` });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.cardIcon}>👤</div>
            <h3 style={styles.cardTitle}>Alta Manual de Paciente</h3>
            <p style={styles.cardDescription}>
                Cree un nuevo registro de paciente directamente en este sistema.
            </p>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGrid}>
                    <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required style={styles.input} />
                    <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" required style={styles.input} />
                    <input name="nroDocumento" value={formData.nroDocumento} onChange={handleChange} placeholder="N° Documento (sin puntos ni guion)" required style={styles.input} />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required style={styles.input} />
                    <div>
                        <label style={styles.label}>Fecha de Nacimiento</label>
                        <input name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} required style={styles.input} />
                    </div>
                    <div>
                        <label style={styles.label}>Sexo</label>
                        <select name="sexo" value={formData.sexo} onChange={handleChange} style={styles.input}>
                            <option>Otro</option>
                            <option>Masculino</option>
                            <option>Femenino</option>
                        </select>
                    </div>
                </div>
                {mensaje && (
                    <div style={{ ...styles.alert, ...styles[`alert_${mensaje.tipo}`] }}>
                        {mensaje.texto}
                    </div>
                )}
                <div style={styles.formActions}>
                    <button type="submit" style={styles.button} disabled={cargando}>
                        {cargando ? 'Guardando...' : 'Dar de Alta'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderLeft: '5px solid #0d6efd', marginTop: '30px' },
    cardIcon: { fontSize: '2.5rem', marginBottom: '15px', color: '#0d6efd' },
    cardTitle: { margin: '0 0 10px 0', color: '#333' },
    cardDescription: { margin: '0 0 20px 0', color: '#666', fontSize: '0.9rem' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' },
    input: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' },
    label: { fontSize: '0.8em', marginBottom: '5px', display: 'block', color: '#555' },
    button: { padding: '10px 15px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    formActions: { marginTop: '20px', display: 'flex', justifyContent: 'flex-end' },
    alert: { padding: '10px', marginTop: '15px', borderRadius: '5px', border: '1px solid' },
    alert_success: { color: '#0f5132', backgroundColor: '#d1e7dd', borderColor: '#badbcc' },
    alert_danger: { color: '#842029', backgroundColor: '#f8d7da', borderColor: '#f5c2c7' }
};

export default CrearPacienteAdmin;