import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTenantConfig, updateAdminConfig } from '../services/api';

const AdminSettingsPage = () => {
    const { tenantId } = useParams();
    const [config, setConfig] = useState({
        tituloPrincipal: '',
        colorPrimario: '#000000',
        colorFondo: '#ffffff',
        logoUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await getTenantConfig(tenantId);
                setConfig(response.data);
            } catch (err) {
                setError('No se pudo cargar la configuración actual.');
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, [tenantId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setConfig(prev => ({ ...prev, logoUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');
        try {
            await updateAdminConfig(tenantId, config);
            setSuccessMessage('¡Configuración guardada con éxito!');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar la configuración.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div style={styles.container}>Cargando configuración...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Configuración de la Clínica</h1>
                <Link to={`/${tenantId}/admin/dashboard`}>Volver al Dashboard</Link>
            </div>
            <div style={styles.card}>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Título Principal</label>
                        <input name="tituloPrincipal" value={config.tituloPrincipal} onChange={handleInputChange} style={styles.input} />
                    </div>
                    <div style={styles.colorPickers}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Color Primario</label>
                            <input name="colorPrimario" type="color" value={config.colorPrimario} onChange={handleInputChange} style={styles.colorInput} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Color de Fondo</label>
                            <input name="colorFondo" type="color" value={config.colorFondo} onChange={handleInputChange} style={styles.colorInput} />
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Logo de la Clínica</label>
                        <input type="file" accept="image/*" onChange={handleLogoChange} />
                        {config.logoUrl && <img src={config.logoUrl} alt="Vista previa del logo" style={styles.logoPreview} />}
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
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold' },
    input: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' },
    colorInput: { width: '100px', height: '40px', border: '1px solid #ccc', padding: '5px', cursor: 'pointer' },
    colorPickers: { display: 'flex', gap: '40px', marginBottom: '20px' },
    logoPreview: { maxWidth: '150px', maxHeight: '100px', marginTop: '10px', border: '1px solid #ddd', padding: '5px' },
    formActions: { display: 'flex', justifyContent: 'flex-end', marginTop: '20px' },
    buttonSave: { padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' },
    error: { color: '#dc3545', marginTop: '15px', textAlign: 'center' },
    success: { color: '#198754', marginTop: '15px', textAlign: 'center', fontWeight: 'bold' },
};

export default AdminSettingsPage;