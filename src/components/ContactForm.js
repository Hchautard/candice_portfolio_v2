import { useState } from 'react';
import '../styles/ContactForm.css';
import emailjs from 'emailjs-com';
import * as z from 'zod';
import { ToastContainer } from 'react-toastify';
import InfoIcon from '@mui/icons-material/Info';
import { contactFormDefaultSchema } from "./ContactFormDefaultSchema";
import { contactFormTattooSchema } from "./ContactFormTattooSchema";

function ContactForm() {
    const [activeTab, setActiveTab] = useState('default');

    // État initial pour le formulaire par défaut
    const initialDefaultFormData = {
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        subject: '',
        message: ''
    };

    // État initial pour le formulaire tatouage
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
        appointmentPreferredDate: ''
    };

    const [formData, setFormData] = useState(initialDefaultFormData);

    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    });

    const changeTab = (e, tab) => {
        e.preventDefault();
        setActiveTab(tab);
        // Réinitialiser le formulaire selon l'onglet sélectionné
        setFormData(tab === 'default' ? initialDefaultFormData : initialTattooFormData);
        // Réinitialiser le statut
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
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            files: files
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }));

        try {
            // Valider avec le bon schéma selon l'onglet actif
            const schema = activeTab === 'default' ? contactFormDefaultSchema : contactFormTattooSchema;
            schema.parse(formData);

            // Choisir le bon template EmailJS selon le formulaire
            const templateId = activeTab === 'default'
                ? process.env.REACT_APP_EMAILJS_DEFAULT_TEMPLATE_ID
                : process.env.REACT_APP_EMAILJS_TATTOO_TEMPLATE_ID;

            const result = await emailjs.send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                templateId,
                formData,
                process.env.REACT_APP_EMAILJS_PUBLIC_KEY
            );

            if (result.status === 200) {
                setStatus({
                    submitted: true,
                    submitting: false,
                    info: { error: false, msg: "Message envoyé avec succès!" }
                });

                // Réinitialiser avec le bon formulaire
                setFormData(activeTab === 'default' ? initialDefaultFormData : initialTattooFormData);
            } else {
                throw new Error("Une erreur s'est produite lors de l'envoi du message.");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstError = error.issues[0];
                setStatus({
                    submitted: false,
                    submitting: false,
                    info: { error: true, msg: firstError.message }
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
            <ToastContainer />
            <div className="flex flex-col md:flex-row px-4 mx-auto container-contact">
                <div className="flex flex-col text-content">
                    <div className="flex flex-col mb-6 md:mb-0">
                        <h2 className="tracking-tight font-extrabold text-center md:text-left">
                            Un projet ? Un flash ? Contactez moi !
                        </h2>
                        <p className="mb-4 md:mb-8 text-left">
                            Vous avez une idée de tatouage ? Besoin d'informations sur mes disponibilités ?
                            Envie de personnaliser ou d'adopter un flash ?
                            Ou simplement une question sur mes prestations ?
                            <br />
                            N'hésitez pas à me contacter via ce formulaire de contact !
                        </p>
                    </div>

                    <div className="flex flex-col justify-start mb-6 md:mb-0">
                        <h2 className="tracking-tight font-extrabold text-center md:text-left">
                            Informations
                        </h2>
                        <p className="mb-4 md:mb-8 text-left">
                            7b Avenue du 19 mars 1962, 13210 Saint-Rémy-de-Provence <br/>
                            Ouvert du lundi au samedi <strong>sur rendez-vous</strong> <br/>
                            <a href="tel:+33658863420" className="underline">06 52 57 99 44</a> <br/>
                            <span className="block mt-4">
                                Attention, si vous souhaitez passer au tattoo shop, merci de me contacter au préalable.
                            </span>
                        </p>
                    </div>
                </div>

                <div className="container-form">
                    {/* Tab buttons */}
                    <div className="flex justify-start w-full gap-4 items-center">
                        <div className="icon-info">
                            <InfoIcon/>
                            <div className="info-text">
                                Choisissez le type de formulaire adapté à votre demande.
                            </div>
                        </div>

                        <a
                            href="#"
                            onClick={(e) => changeTab(e, 'default')}
                            className={`tab ${activeTab === 'default' ? 'active' : ''}`}
                        >
                            Défaut
                        </a>
                        <a
                            href="#"
                            onClick={(e) => changeTab(e, 'tattoo')}
                            className={`tab ${activeTab === 'tattoo' ? 'active' : ''}`}
                        >
                            Tatouage
                        </a>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 form">
                        {status.info.error && (
                            <div className="col-span-1 md:col-span-2 text-red-500 mb-4 text-center p-3 rounded">
                                {status.info.msg}
                            </div>
                        )}
                        {status.submitted && !status.info.error && (
                            <div className="col-span-1 md:col-span-2 text-green-500 mb-4 text-center p-3 rounded">
                                {status.info.msg}
                            </div>
                        )}

                        {/* Champs communs */}
                        <div className="col-span-1 form-field">
                            <label htmlFor="name" className="block">Votre nom & prénom</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full"
                                placeholder="Patati Patata"
                                required
                            />
                        </div>
                        <div className="col-span-1 form-field">
                            <label htmlFor="email" className="block">Votre e-mail</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full"
                                placeholder="patati@patata.com"
                                required
                            />
                        </div>

                        <div className="col-span-1 form-field">
                            <label htmlFor="phone" className="block">Téléphone</label>
                            <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full"
                                placeholder="06 12 34 56 78"
                            />
                        </div>

                        <div className="col-span-1 form-field">
                            <label htmlFor="birthdate" className="block">Date de naissance</label>
                            <input
                                type="date"
                                id="birthdate"
                                value={formData.birthdate}
                                onChange={handleChange}
                                className="w-full"
                                required
                            />
                        </div>

                        {/* Champs spécifiques au formulaire par défaut */}
                        {activeTab === 'default' && (
                            <>
                                <div className="col-span-1 md:col-span-2 mt-2 md:mt-4 form-field">
                                    <label htmlFor="subject" className="block">Objet</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="block p-3 w-full"
                                        placeholder="Projet, flash, détails..."
                                        required
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 form-field">
                                    <label htmlFor="message" className="block">Votre message</label>
                                    <textarea
                                        id="message"
                                        rows="7"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="block p-2.5 w-full"
                                        placeholder="Laisser un commentaire..."
                                        required
                                    ></textarea>
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
                                        <span className="checkbox-label">J'ai déjà un ou plusieurs tattoos</span>
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
                                        <span className="checkbox-label">C'est pour un recouvrement / cover</span>
                                    </label>
                                </div>

                                <div className="col-span-1 form-field">
                                    <label htmlFor="size" className="block">Taille</label>
                                    <input
                                        type="text"
                                        id="size"
                                        value={formData.size}
                                        onChange={handleChange}
                                        className="w-full"
                                        placeholder="Ex: 10x15cm"
                                        required
                                    />
                                </div>

                                <div className="col-span-1 form-field">
                                    <label htmlFor="placement" className="block">Emplacement</label>
                                    <input
                                        type="text"
                                        id="placement"
                                        value={formData.placement}
                                        onChange={handleChange}
                                        className="w-full"
                                        placeholder="Ex: Avant-bras"
                                        required
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2 form-field">
                                    <label htmlFor="description" className="block">Description du projet</label>
                                    <textarea
                                        id="description"
                                        rows="5"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="block p-2.5 w-full"
                                        placeholder="Décrivez votre projet de tatouage..."
                                    ></textarea>
                                </div>

                                <div className="col-span-1 md:col-span-2 form-field">
                                    <label htmlFor="files" className="block">Images de référence ou du tatouage à recouvrir (max 5) </label>
                                    <input
                                        type="file"
                                        id="files"
                                        onChange={handleFileChange}
                                        className="w-full"
                                        multiple
                                        accept="image/*"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2 form-field">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="icon-info">
                                            <InfoIcon/>
                                            <div className="info-text">
                                                Merci de m'indiquer tes souhaits pour venir te faire tatouer en m'indiquant :
                                                <ul className="list-disc list-inside">
                                                    <li>le mois où tu voudrais le réaliser</li>
                                                    <li>les jours où tu es disponible (au moins deux)</li>
                                                    <li>le matin ou l'après midi</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <label htmlFor="appointmentPreferredDate" className="block">
                                            Date de rendez-vous souhaitée (optionnel)
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        id="appointmentPreferredDate"
                                        value={formData.appointmentPreferredDate}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>
                            </>
                        )}

                        <div className="w-full flex justify-center md:justify-end col-span-1 md:col-span-2">
                            <button
                                type="submit"
                                className="px-5 rounded w-full md:w-auto"
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