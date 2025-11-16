// RUTA: src/pages/EditProfesionalPage.js

import React, { useState } from 'react';
import { getProfesionalByEmail, updateProfesional } from '../services/api';
import { Link, useParams } from 'react-router-dom';

const EditProfesionalPage = () => {
    const { tenantId } = useParams();

    const [searchEmail, setSearchEmail] = useState('');
    const [searchedProfesional, setSearchedProfesional] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsSearching(true);
        setSearchError('');
        setSearchedProfesional(null);
        try {
            const response = await getProfesionalByEmail(tenantId, searchEmail);
            setSearchedProfesional(response.data);
            setFormData({
                id: response.data.id,
                nombre: response.data.nombre,
                apellido: response.data.apellido,
                especializacion: response.data.especializacion,
                password: ''
            });
        } catch (err) {
            setSearchError(err.response?.data?.message || 'No se encontró el profesional.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        try {
            await updateProfesional(tenantId, formData.id, formData);
            alert('¡Profesional actualizado con éxito!');
            setSearchEmail('');
            setSearchedProfesional(null);
        } catch (err) {
            setSubmitError(err.response?.data?.message || 'Error al actualizar.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Editar Profesional por Email</h1>
                <Link to={`/${tenantId}/admin/dashboard`}>Volver al Dashboard</Link>
            </div>

            <div style={styles.card}>
                <h2>Buscar Profesional</h2>
                <form onSubmit={handleSearch} style={styles.searchForm}>
                    <input type="email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} placeholder="Introduce el email del profesional" required style={styles.input}/>
                    <button type="submit" style={styles.button} disabled={isSearching}>
                        {isSearching ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>
                {searchError && <p style={styles.error}>{searchError}</p>}
            </div>

            {searchedProfesional && (
                <div style={{...styles.card, marginTop: '30px'}}>
                    <h2>Editando a: {searchedProfesional.nombre} {searchedProfesional.apellido}</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nombre</label>
                                <input name="nombre" value={formData.nombre} onChange={handleFormChange} required style={styles.input} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Apellido</label>
                                <input name="apellido" value={formData.apellido} onChange={handleFormChange} required style={styles.input} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Especialización</label>
                                <input name="especializacion" value={formData.especializacion} onChange={handleFormChange} style={styles.input} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nueva Contraseña (opcional)</label>
                                <input name="password" type="password" value={formData.password} onChange={handleFormChange} placeholder="Dejar en blanco para no cambiar" style={styles.input} />
                            </div>
                        </div>
                        {submitError && <p style={styles.error}>{submitError}</p>}
                        <div style={styles.formActions}>
                            <button type="submit" style={styles.buttonSave} disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

// Estilos
const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ccc', paddingBottom: '15px' },
    card: { padding: '25px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' },
    searchForm: { display: 'flex', gap: '10px' },
    input: { flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc' },
    button: { padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    error: { color: 'red', marginTop: '10px' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
    formGroup: { display: 'flex', flexDirection: 'column' },
    label: { marginBottom: '5px', fontWeight: 'bold' },
    formActions: { display: 'flex', justifyContent: 'flex-end' },
    buttonSave: { padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
};

export default EditProfesionalPage;