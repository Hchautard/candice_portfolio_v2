import { useState } from 'react';
import '../styles/ContactForm.css';
import emailjs from 'emailjs-com';
import * as z from 'zod';
import { toast, ToastContainer } from 'react-toastify';
import { contactFormDefaultSchema } from "./ContactFormDefaultSchema";
import { contactFormTattooSchema } from "./ContactFormTattooSchema";

function InfoIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
    );
}

function RequiredStar() {
    return <abbr title="Champ obligatoire" className="required-star"> *</abbr>;
}

function FieldError({ id, error }) {
    if (!error) return null;
    return <span id={id} className="field-error">{error}</span>;
}

function ContactForm() {
    const [activeTab, setActiveTab] = useState('default');

    const initialDefaultFormData = {
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        subject: '',
        message: ''
    };

    const initialTattooFormData = {
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        oneOrManyTattoos: false,
        isForACoverage: false,
        size: '',
        placement: '',
        description: '',
        files: [],
        appointmentPreferredDate: '',
    };

    const [formData, setFormData] = useState(initialDefaultFormData);
    const [fieldErrors, setFieldErrors] = useState({});

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    });

    const changeTab = (e, tab) => {
        e.preventDefault();
        setActiveTab(tab);
        setFormData(tab === 'default' ? initialDefaultFormData : initialTattooFormData);
        setFieldErrors({});
        setStatus({
            submitted: false,
            submitting: false,
            info: { error: false, msg: null }
        });
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? checked : value
        });
        if (fieldErrors[id]) {
            setFieldErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            setStatus({
                submitted: false,
                submitting: false,
                info: { error: true, msg: "Vous ne pouvez télécharger que 5 fichiers maximum." }
            });
            e.target.value = '';
            return;
        }

        const maxSize = 10 * 1024 * 1024;
        const oversizedFiles = files.filter(file => file.size > maxSize);
        if (oversizedFiles.length > 0) {
            setStatus({
                submitted: false,
                submitting: false,
                info: { error: true, msg: "Chaque fichier doit faire moins de 10MB." }
            });
            e.target.value = '';
            return;
        }

        setFormData({ ...formData, files });
        setFieldErrors(prev => ({ ...prev, files: undefined }));
    };

    const uploadFilesToCloudinary = async (files) => {
        if (!files || files.length === 0) return [];

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;
        const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', 'tattoo_requests');

            try {
                const response = await fetch(cloudinaryUrl, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    return {
                        name: file.name,
                        url: data.secure_url,
                        thumbnail: data.thumbnail_url || data.secure_url,
                        publicId: data.public_id
                    };
                } else {
                    throw new Error('Upload failed');
                }
            } catch (error) {
                console.error(`Erreur upload ${file.name}:`, error);
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        return results.filter(result => result !== null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }));
        setFieldErrors({});

        try {
            const schema = activeTab === 'default' ? contactFormDefaultSchema : contactFormTattooSchema;
            schema.parse(formData);

            let emailData = { ...formData };

            if (activeTab === 'tattoo' && formData.files && formData.files.length > 0) {
                setStatus(prevStatus => ({
                    ...prevStatus,
                    info: { error: false, msg: "Upload des images en cours..." }
                }));

                toast.info("Upload des images en cours...");

                const uploadedFiles = await uploadFilesToCloudinary(formData.files);

                if (uploadedFiles.length === 0) {
                    toast.error("Échec de l'upload des images. Veuillez réessayer.");
                    throw new Error("Échec de l'upload des images. Veuillez réessayer.");
                }

                emailData.imageUrls = uploadedFiles.map(f => f.url).join('\n');
                emailData.imagesList = uploadedFiles.map((f, i) =>
                    `${i + 1}. ${f.name}\n   ${f.url}`
                ).join('\n\n');

                emailData.imagesData = uploadedFiles;
            }

            if (activeTab === 'tattoo') {
                emailData.oneOrManyTattoosText = formData.oneOrManyTattoos ? 'Plusieurs tatouages' : 'Un seul tatouage';
                emailData.isForACoverageText = formData.isForACoverage ? 'Oui - Recouvrement' : 'Non';
            }

            setStatus(prevStatus => ({
                ...prevStatus,
                info: { error: false, msg: "Envoi du message..." }
            }));

            const templateId = activeTab === 'default'
                ? process.env.REACT_APP_EMAILJS_DEFAULT_TEMPLATE_ID
                : process.env.REACT_APP_EMAILJS_TATTOO_TEMPLATE_ID;

            const result = await emailjs.send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                templateId,
                emailData,
                process.env.REACT_APP_EMAILJS_PUBLIC_KEY
            );

            if (result.status === 200) {
                toast.success("Votre message a été envoyé avec succès !");
                setStatus({
                    submitted: true,
                    submitting: false,
                    info: { error: false, msg: "Message envoyé avec succès!" }
                });

                setFormData(activeTab === 'default' ? initialDefaultFormData : initialTattooFormData);

                const fileInput = document.getElementById('files');
                if (fileInput) fileInput.value = '';
            } else {
                throw new Error("Une erreur s'est produite lors de l'envoi du message.");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = {};
                error.issues.forEach(issue => {
                    const field = issue.path[0];
                    if (field && !errors[field]) {
                        errors[field] = issue.message;
                    }
                });
                setFieldErrors(errors);
                setStatus({
                    submitted: false,
                    submitting: false,
                    info: { error: false, msg: null }
                });
            } else {
                setStatus({
                    submitted: false,
                    submitting: false,
                    info: { error: true, msg: error.message }
                });
            }
        }
    };

    return (
        <section>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="px-4 mx-auto container-contact">

                {/* Intro Part */}
                <div className="glass-card text-intro">
                    <h2 className="tracking-tight font-extrabold text-center md:text-left">
                        Un projet ? Un flash ? Contactez moi !
                    </h2>
                    <p className="mb-4 md:mb-8 text-left">
                        Vous avez une idée de tatouage ? <br/> Besoin d&apos;informations sur mes disponibilités ? <br/>
                        Envie de personnaliser ou d&apos;adopter un flash ? <br/>
                        Ou simplement une question sur mes prestations ?
                        <br/>
                        <br/>
                        N&apos;hésitez pas à me contacter via ce formulaire de contact !
                    </p>
                </div>

                {/* Coords Part */}
                <div className="text-coords">
                    <h2 className="tracking-tight font-extrabold text-center md:text-left">
                        Informations
                    </h2>
                    <p className="mb-4 md:mb-8 text-left">
                        Montpellier <br/>
                        Insta : <a href="https://www.instagram.com/l__anomalie/" target="_blank" rel="noreferrer" className="underline">@l__anomalie</a>
                    </p>
                </div>

                {/* Form Part */}
                <div className="container-form">
                    {/* Tab buttons */}
                    <div className="flex justify-start w-full gap-4 items-baseline" role="tablist" aria-label="Type de formulaire">
                        <div className="icon-info">
                            <InfoIcon/>
                            <div className="info-text">
                                Choisissez le type de formulaire adapté à votre demande.
                            </div>
                        </div>

                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'default'}
                            onClick={(e) => changeTab(e, 'default')}
                            className={`tab ${activeTab === 'default' ? 'active' : ''}`}
                        >
                            Défaut
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'tattoo'}
                            onClick={(e) => changeTab(e, 'tattoo')}
                            className={`tab ${activeTab === 'tattoo' ? 'active' : ''}`}
                        >
                            Tatouage
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 form">
                        {status.info.error && (
                            <div role="alert" className="col-span-1 md:col-span-2 form-status form-status-error mb-4 text-center p-3 rounded">
                                {status.info.msg}
                            </div>
                        )}
                        {status.submitted && !status.info.error && (
                            <div role="status" className="col-span-1 md:col-span-2 form-status form-status-success mb-4 text-center p-3 rounded">
                                {status.info.msg}
                            </div>
                        )}

                        {/* Champs communs */}
                        <div className="col-span-1 form-field">
                            <label htmlFor="name" className="block">
                                Votre nom &amp; prénom<RequiredStar />
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full${fieldErrors.name ? ' input-error' : ''}`}
                                placeholder="Patati Patata"
                                aria-invalid={fieldErrors.name ? true : undefined}
                                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                            />
                            <FieldError id="name-error" error={fieldErrors.name} />
                        </div>

                        <div className="col-span-1 form-field">
                            <label htmlFor="email" className="block">
                                Votre e-mail<RequiredStar />
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full${fieldErrors.email ? ' input-error' : ''}`}
                                placeholder="patati@patata.com"
                                aria-invalid={fieldErrors.email ? true : undefined}
                                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                            />
                            <FieldError id="email-error" error={fieldErrors.email} />
                        </div>

                        <div className="col-span-1 form-field">
                            <label htmlFor="phone" className="block">Téléphone</label>
                            <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full${fieldErrors.phone ? ' input-error' : ''}`}
                                placeholder="06 12 34 56 78"
                                aria-invalid={fieldErrors.phone ? true : undefined}
                                aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                            />
                            <FieldError id="phone-error" error={fieldErrors.phone} />
                        </div>

                        <div className="col-span-1 form-field">
                            <label htmlFor="birthdate" className="block">
                                Date de naissance<RequiredStar />
                            </label>
                            <input
                                type="date"
                                id="birthdate"
                                value={formData.birthdate}
                                onChange={handleChange}
                                className={`w-full${fieldErrors.birthdate ? ' input-error' : ''}`}
                                aria-invalid={fieldErrors.birthdate ? true : undefined}
                                aria-describedby={fieldErrors.birthdate ? 'birthdate-error' : undefined}
                            />
                            <FieldError id="birthdate-error" error={fieldErrors.birthdate} />
                        </div>

                        {/* Champs spécifiques au formulaire par défaut */}
                        {activeTab === 'default' && (
                            <>
                                <div className="col-span-1 md:col-span-2 mt-2 md:mt-4 form-field">
                                    <label htmlFor="subject" className="block">
                                        Objet<RequiredStar />
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={`block p-3 w-full${fieldErrors.subject ? ' input-error' : ''}`}
                                        placeholder="Projet, flash, détails..."
                                        aria-invalid={fieldErrors.subject ? true : undefined}
                                        aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
                                    />
                                    <FieldError id="subject-error" error={fieldErrors.subject} />
                                </div>
                                <div className="col-span-1 md:col-span-2 form-field">
                                    <label htmlFor="message" className="block">
                                        Votre message<RequiredStar />
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="7"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`block p-2.5 w-full${fieldErrors.message ? ' input-error' : ''}`}
                                        placeholder="Laisser un commentaire..."
                                        aria-invalid={fieldErrors.message ? true : undefined}
                                        aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                                    ></textarea>
                                    <FieldError id="message-error" error={fieldErrors.message} />
                                </div>
                            </>
                        )}

                        {/* Champs spécifiques au formulaire tatouage */}
                        {activeTab === 'tattoo' && (
                            <>
                                <div className="col-span-1 md:col-span-2 form-field">
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            id="oneOrManyTattoos"
                                            checked={formData.oneOrManyTattoos}
                                            onChange={handleChange}
                                        />
                                        <span className="checkbox-label">J&apos;ai déjà un ou plusieurs tattoos</span>
                                    </label>
                                </div>

                                <div className="col-span-1 md:col-span-2 form-field">
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            id="isForACoverage"
                                            checked={formData.isForACoverage}
                                            onChange={handleChange}
                                        />
                                        <span className="checkbox-label">C&apos;est pour un recouvrement / cover</span>
                                    </label>
                                </div>

                                <div className="col-span-1 form-field">
                                    <label htmlFor="size" className="block">
                                        Taille<RequiredStar />
                                    </label>
                                    <input
                                        type="text"
                                        id="size"
                                        value={formData.size}
                                        onChange={handleChange}
                                        className={`w-full${fieldErrors.size ? ' input-error' : ''}`}
                                        placeholder="Ex: 10x15cm"
                                        aria-invalid={fieldErrors.size ? true : undefined}
                                        aria-describedby={fieldErrors.size ? 'size-error' : undefined}
                                    />
                                    <FieldError id="size-error" error={fieldErrors.size} />
                                </div>

                                <div className="col-span-1 form-field">
                                    <label htmlFor="placement" className="block">
                                        Emplacement<RequiredStar />
                                    </label>
                                    <input
                                        type="text"
                                        id="placement"
                                        value={formData.placement}
                                        onChange={handleChange}
                                        className={`w-full${fieldErrors.placement ? ' input-error' : ''}`}
                                        placeholder="Ex: Avant-bras"
                                        aria-invalid={fieldErrors.placement ? true : undefined}
                                        aria-describedby={fieldErrors.placement ? 'placement-error' : undefined}
                                    />
                                    <FieldError id="placement-error" error={fieldErrors.placement} />
                                </div>

                                <div className="col-span-1 md:col-span-2 form-field">
                                    <label htmlFor="description" className="block">
                                        Description du projet<RequiredStar />
                                    </label>
                                    <textarea
                                        id="description"
                                        rows="5"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={`block p-2.5 w-full${fieldErrors.description ? ' input-error' : ''}`}
                                        placeholder="Décrivez votre projet de tatouage..."
                                        required
                                        aria-invalid={fieldErrors.description ? true : undefined}
                                        aria-describedby={fieldErrors.description ? 'description-error' : undefined}
                                    ></textarea>
                                    <FieldError id="description-error" error={fieldErrors.description} />
                                </div>

                                <div className="col-span-1 md:col-span-2 form-field">
                                    <label htmlFor="files" className="block">
                                        Images de référence ou du tatouage à recouvrir (max 5)
                                    </label>
                                    <input
                                        type="file"
                                        id="files"
                                        onChange={handleFileChange}
                                        className="w-full"
                                        multiple
                                        accept="image/*"
                                    />
                                    {formData.files && formData.files.length > 0 && (
                                        <div className="file-preview">
                                            <p className="file-count">
                                                {formData.files.length} fichier{formData.files.length > 1 ? 's' : ''} sélectionné{formData.files.length > 1 ? 's' : ''}
                                            </p>
                                            <ul className="file-list">
                                                {Array.from(formData.files).map((file, index) => (
                                                    <li key={index}>
                                                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-1 md:col-span-2 form-field">
                                    <label htmlFor="appointmentPreferredDate" className="block">
                                        Date de rendez-vous souhaitée <span className="optional-label">(optionnel)</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="appointmentPreferredDate"
                                        value={formData.appointmentPreferredDate}
                                        onChange={handleChange}
                                        className="w-full"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </>
                        )}

                        <div className="col-span-1 md:col-span-2 flex justify-between items-center flex-wrap gap-2">
                            <p className="required-legend">
                                <abbr title="Champ obligatoire" className="required-star">*</abbr> Champ obligatoire
                            </p>
                            <button
                                type="submit"
                                className="px-5 rounded"
                                disabled={status.submitting}
                            >
                                {status.submitting ? 'Envoi en cours...' : 'Envoyer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default ContactForm;
