// RUTA: src/pages/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// --- Importamos la nueva función getOwnProfile ---
import { updateOwnProfile, getOwnProfile } from '../services/api';
// --- CORRECCIÓN 1: El import tenía un doble guion ---
import { Link, useParams } from 'react-router-dom';

const ProfilePage = () => {
    const { user } = useAuth();
    const { tenantId } = useParams();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        especializacion: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadProfileData = async () => {
            if (!user) return;
            try {
                // Es mejor usar un endpoint que devuelva el perfil del usuario actual
                const response = await getOwnProfile(tenantId);
                const profile = response.data;
                setFormData({
                    nombre: profile.nombre || '',
                    apellido: profile.apellido || '',
                    especializacion: profile.especializacion || '',
                    email: profile.email || '',
                    password: ''
                });
            } catch (err) {
                setError('No se pudieron cargar los datos del perfil.');
            } finally {
                setLoading(false);
            }
        };
        loadProfileData();
    }, [user, tenantId]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');
        try {
            // --- CORRECCIÓN 2: La llamada a la función debe incluir el tenantId ---
            await updateOwnProfile(tenantId, formData);
            setSuccessMessage('¡Perfil actualizado con éxito!');
            setFormData(prev => ({ ...prev, password: '' }));
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar el perfil.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div style={{textAlign: 'center', marginTop: '50px'}}>Cargando perfil...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Mi Perfil</h1>
                <Link to={`/${tenantId}/dashboard`}>Volver al Dashboard</Link>
            </div>
            <div style={styles.card}>
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
                            <label style={styles.label}>Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleFormChange} required style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Especialización</label>
                            <input name="especializacion" value={formData.especializacion} onChange={handleFormChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroupFull}>
                            <label style={styles.label}>Cambiar Contraseña</label>
                            <input name="password" type="password" value={formData.password} onChange={handleFormChange} placeholder="Dejar en blanco para no cambiar" style={styles.input} />
                        </div>
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    {successMessage && <p style={styles.success}>{successMessage}</p>}
                    <div style={styles.formActions}>
                        <button type="submit" style={styles.buttonSave} disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ccc', paddingBottom: '15px' },
    card: { padding: '25px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' },
    input: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' },
    error: { color: '#dc3545', marginTop: '15px', textAlign: 'center' },
    success: { color: '#198754', marginTop: '15px', textAlign: 'center', fontWeight: 'bold' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
    formGroup: { display: 'flex', flexDirection: 'column' },
    formGroupFull: { gridColumn: '1 / -1' },
    label: { marginBottom: '5px', fontWeight: 'bold' },
    formActions: { display: 'flex', justifyContent: 'flex-end' },
    buttonSave: { padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' },
};

export default ProfilePage;