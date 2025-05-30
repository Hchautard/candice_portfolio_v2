import { useState } from 'react';
import '../styles/ContactForm.css';
import { motion } from "framer-motion";
import emailjs from 'emailjs-com';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));

    try {
      
        const result = await emailjs.send(
        'service_w9h8cka',
        'template_xhsw6ad',
        formData,
        'W-irZvg8Zk7ukz9Pt'
      );
      
      if (result.status === 200) {
        setStatus({
          submitted: true,
          submitting: false,
          info: { error: false, msg: "Message envoyé avec succès!" }
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error("Une erreur s'est produite lors de l'envoi du message.");
      }
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: error.message }
      });
    }
  };

  return ( 
    <section>
        <div className="flex flex-col md:flex-row px-4 mx-auto container-contact">

            <div className="flex flex-col text-content"> 
                <div className="flex flex-col mb-6 md:mb-0"> 
                    <h2 className="tracking-tight font-extrabold text-center md:text-left">
                        Un projet ? Un flash ? Contactez moi !
                    </h2>
                    <p className="mb-4 md:mb-8 text-left">
                        Vous avez une idée de tatouage ? Besoin d'informations sur mes disponibilités ? 
                        Envie de personnaliser un flash ? 
                        Ou simplement une question sur mes prestations ? 
                        N'hésitez pas à me contacter.
                    </p>
                </div>

                <div className="flex flex-col justify-start mb-6 md:mb-0"> 
                    <h2 className="tracking-tight font-extrabold text-center md:text-left">
                        Informations
                    </h2>
                    <p className="mb-4 md:mb-8 text-left">
                        7b Avenue du 19 mars 1962, 13210 Saint-Rémy-de-Provence <br />
                        Du mardi au samedi de <strong>9h</strong> à <strong>18h</strong>
                        <span className="block mt-4">
                            Attention, si vous souhaitez passer au tattoo shop, merci de me contacter au préalable.
                        </span>
                    </p> 
                </div>
            </div>


            <form onSubmit={handleSubmit} className="container-form grid grid-cols-1 md:grid-cols-2 gap-4">
                {status.info.error && (
                  <div className="col-span-1 md:col-span-2 text-red-500 mb-4 text-center p-3 rounded">
                    Error: {status.info.msg}
                  </div>
                )}
                {status.submitted && !status.info.error && (
                  <div className="col-span-1 md:col-span-2 text-green-500 mb-4 text-center p-3 rounded">
                    {status.info.msg}
                  </div>
                )}
                <div className="col-span-1">
                    <label htmlFor="name" className="block">Votre nom</label>
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
                <div className="col-span-1">
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
                <div className="col-span-1 md:col-span-2 mt-2 md:mt-4">
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
                <div className="col-span-1 md:col-span-2">
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
    </section>
    );
}

export default ContactForm;