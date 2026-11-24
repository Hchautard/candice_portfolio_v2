import { useRef, useState } from 'react';
import '../styles/ContactForm.css';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
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

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// Ordre d'affichage : le focus va sur le premier champ en erreur
const FIELD_ORDER = ['name', 'email', 'phone', 'birthdate', 'subject', 'message', 'size', 'placement', 'description', 'files'];
const SEND_ERROR = "L'envoi a échoué. Réessayez dans quelques minutes, ou écrivez-moi sur Instagram (@l__anomalie).";

// Date du jour en heure locale (toISOString donne la date UTC, donc la veille entre minuit et 1-2 h)
const todayLocal = () => new Date().toLocaleDateString('en-CA');

const formatSize = (bytes) => (bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} Ko`
    : `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`);

function ContactForm() {
    const [activeTab, setActiveTab] = useState('default');
    // Champ piège invisible : un humain le laisse vide, beaucoup de robots le remplissent
    const honeypotRef = useRef(null);

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

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const notImages = files.filter(file => !file.type.startsWith('image/'));
        const oversized = files.filter(file => file.size > MAX_FILE_SIZE);

        let error;
        if (files.length > MAX_FILES) {
            error = `${MAX_FILES} images maximum (vous en avez choisi ${files.length}).`;
        } else if (notImages.length > 0) {
            error = `Seules les images sont acceptées : ${notImages.map(file => file.name).join(', ')}.`;
        } else if (oversized.length > 0) {
            error = `Chaque image doit faire moins de 10 Mo : ${oversized.map(file => file.name).join(', ')}.`;
        }

        if (error) {
            // Le champ est vidé : l'ancienne sélection ne doit pas partir à l'insu de l'utilisateur
            e.target.value = '';
            setFormData({ ...formData, files: [] });
            setFieldErrors(prev => ({ ...prev, files: error }));
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
        const failed = files.filter((file, i) => results[i] === null).map(file => file.name);
        if (failed.length > 0) {
            // Pas d'envoi partiel : la demande partirait sans ces images sans que personne ne le sache
            throw new Error(failed.length > 1
                ? `Impossible d'envoyer les images ${failed.join(', ')}. Réessayez, ou retirez-les de la sélection.`
                : `Impossible d'envoyer l'image ${failed[0]}. Réessayez, ou retirez-la de la sélection.`);
        }
        return results;
    };

    const resetAfterSuccess = () => {
        toast.success("Votre message a été envoyé, merci !");
        setStatus({
            submitted: true,
            submitting: false,
            info: { error: false, msg: "Message envoyé ! Je vous réponds dès que possible." }
        });
        setFormData(activeTab === 'default' ? initialDefaultFormData : initialTattooFormData);
        const fileInput = document.getElementById('files');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ submitted: false, submitting: true, info: { error: false, msg: 'Envoi en cours…' } });
        setFieldErrors({});

        try {
            const schema = activeTab === 'default' ? contactFormDefaultSchema : contactFormTattooSchema;
            schema.parse(formData);

            // Robot détecté : on affiche un succès sans rien envoyer
            if (honeypotRef.current?.value) {
                resetAfterSuccess();
                return;
            }

            // Les objets File ne passent pas dans le mail (sérialisés en {}) : seules les URL partent
            const { files, ...emailData } = formData;

            if (activeTab === 'tattoo' && files && files.length > 0) {
                setStatus(prevStatus => ({
                    ...prevStatus,
                    info: { error: false, msg: files.length > 1 ? 'Envoi des images…' : "Envoi de l'image…" }
                }));

                const uploadedFiles = await uploadFilesToCloudinary(files);

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
                info: { error: false, msg: 'Envoi du message…' }
            }));

            const templateId = activeTab === 'default'
                ? process.env.REACT_APP_EMAILJS_DEFAULT_TEMPLATE_ID
                : process.env.REACT_APP_EMAILJS_TATTOO_TEMPLATE_ID;

            await emailjs.send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                templateId,
                emailData,
                {
                    publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
                    // Anti double envoi / rafale : 20 s minimum entre deux messages
                    limitRate: { id: 'contact-form', throttle: 20000 },
                }
            );

            resetAfterSuccess();
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
                const first = FIELD_ORDER.find(field => errors[field]);
                if (first) document.getElementById(first)?.focus();
                return;
            }

            // EmailJS rejette avec { status, text } (pas une Error) : message lisible plutôt qu'un cadre vide
            let msg = SEND_ERROR;
            if (error instanceof EmailJSResponseStatus) {
                console.error('EmailJS :', error.status, error.text);
                if (error.status === 429) msg = "Un message vient de partir. Patientez quelques secondes avant d'en envoyer un autre.";
            } else if (error?.message) {
                msg = error.message;
            }
            setStatus({
                submitted: false,
                submitting: false,
                info: { error: true, msg }
            });
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
                        Un projet ? Un flash ? Contactez-moi !
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
                    <div
                        className="flex justify-start w-full gap-4 items-baseline"
                        role="group"
                        aria-label="Type de demande"
                        aria-describedby="form-type-help"
                    >
                        <div className="icon-info">
                            <InfoIcon/>
                            <div className="info-text" id="form-type-help">
                                Choisissez le type de formulaire adapté à votre demande.
                            </div>
                        </div>

                        <button
                            type="button"
                            aria-pressed={activeTab === 'default'}
                            onClick={(e) => changeTab(e, 'default')}
                            className={`tab ${activeTab === 'default' ? 'active' : ''}`}
                        >
                            Question
                        </button>
                        <button
                            type="button"
                            aria-pressed={activeTab === 'tattoo'}
                            onClick={(e) => changeTab(e, 'tattoo')}
                            className={`tab ${activeTab === 'tattoo' ? 'active' : ''}`}
                        >
                            Projet tatouage
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-4 form">
                        {/* Piège à robots : hors écran, ignoré au clavier et par les lecteurs d'écran */}
                        <div className="hp-field" aria-hidden="true">
                            <label htmlFor="website">Ne pas remplir ce champ</label>
                            <input ref={honeypotRef} type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                        </div>

                        {/* Champs communs */}
                        <div className="col-span-1 form-field">
                            <label htmlFor="name" className="block">
                                Votre nom &amp; prénom<RequiredStar />
                            </label>
                            <input
                                type="text"
                                id="name"
                                autoComplete="name"
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
                                autoComplete="email"
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
                                autoComplete="tel"
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
                                autoComplete="bday"
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
                                        placeholder="Votre question, vos disponibilités…"
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
                                        placeholder="Décrivez votre projet de tatouage…"
                                        aria-invalid={fieldErrors.description ? true : undefined}
                                        aria-describedby={fieldErrors.description ? 'description-error' : undefined}
                                    ></textarea>
                                    <FieldError id="description-error" error={fieldErrors.description} />
                                </div>

                                <div className="col-span-1 md:col-span-2 form-field">
                                    <label htmlFor="files" className="block">
                                        Images de référence ou du tatouage à recouvrir <span className="optional-label">(5 max, 10 Mo chacune)</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="files"
                                        onChange={handleFileChange}
                                        className={`w-full${fieldErrors.files ? ' input-error' : ''}`}
                                        multiple
                                        accept="image/*"
                                        aria-invalid={fieldErrors.files ? true : undefined}
                                        aria-describedby={fieldErrors.files ? 'files-error' : undefined}
                                    />
                                    <FieldError id="files-error" error={fieldErrors.files} />
                                    {formData.files && formData.files.length > 0 && (
                                        <div className="file-preview">
                                            <p className="file-count">
                                                {formData.files.length} fichier{formData.files.length > 1 ? 's' : ''} sélectionné{formData.files.length > 1 ? 's' : ''}
                                            </p>
                                            <ul className="file-list">
                                                {Array.from(formData.files).map((file, index) => (
                                                    <li key={index}>
                                                        {file.name} ({formatSize(file.size)})
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
                                        min={todayLocal()}
                                    />
                                </div>
                            </>
                        )}

                        {/* Retours d'envoi à côté du bouton, là où se trouve l'utilisateur */}
                        {status.info.error && (
                            <div role="alert" className="col-span-1 md:col-span-2 form-status form-status-error text-center p-3 rounded">
                                {status.info.msg}
                            </div>
                        )}
                        {status.submitted && !status.info.error && (
                            <div role="status" className="col-span-1 md:col-span-2 form-status form-status-success text-center p-3 rounded">
                                {status.info.msg}
                            </div>
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
                                {status.submitting ? status.info.msg : 'Envoyer'}
                            </button>
                        </div>
                        {/* Progression annoncée aux lecteurs d'écran (le nouveau texte du bouton n'est pas lu) */}
                        <p className="sr-only" role="status">{status.submitting ? status.info.msg : ''}</p>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default ContactForm;
