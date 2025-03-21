import '../styles/ContactForm.css';
import { motion } from "framer-motion";

function ContactForm() {
  return ( 
    <motion.div 
        className="ContactForm"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        exit={{ x: window.innerWidth }}
    >
    <section>
        <div className="flex flex-row px-4 mx-auto container-contact">

            <div className="flex flex-col text-content"> 
                <div className="flex flex-col"> 
                    <h2 className="tracking-tight font-extrabold">Un projet ? Un flash ? Contactez moi !</h2>
                    <p className="mb-8 text-left">
                        Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.
                    </p>
                </div>

                <div className="flex flex-col justify-start"> 
                    <h2 className="tracking-tight font-extrabold text-left">Informations</h2>
                    <p className="mb-8 text-left">
                    
                        7b Avenue du 19 mars 1962, 13210 Saint-Rémy-de-Provence <br />
                        Du mardi au samedi de <strong>9h</strong> à <strong>18h</strong>
                        
                        <span className="block mt-4">
                            Attention, si vous souhaitez passer au tattoo shop, merci de me contacter au préalable.
                        </span>
                    </p> 
                </div>
            </div>


            <form action="#" className="container-form grid grid-cols-2">
                <div>
                    <label for="name" className="block">Votre nom</label>
                    <input type="name" id="name" className=""
                    placeholder="Patati Patata" required />
                </div>
                <div>
                    <label for="email" className="block">Votre e-mail</label>
                    <input type="email" id="email" className="" 
                    placeholder="patati@patata.com" required />
                </div>
                <div className="sm:col-span-2 mt-4">
                    <label for="subject" className="block">Objet</label>
                    <input 
                    type="text" 
                    id="subject" 
                    className="block p-3" 
                    placeholder="Projet, flash, détails..." required />
                </div>
                <div className="sm:col-span-2">
                    <label for="message" className="block">Votre message</label>
                    <textarea id="message" rows="7" className="block p-2.5 w-full" 
                    placeholder="Laisser un commentaire..."></textarea>
                </div>
                <div className="w-full flex justify-end sm:col-span-2">
                    <button type="submit" 
                    className="px-5 rounded">
                        Envoyer
                    </button>
                </div>
            </form>
        </div>
    </section>
    </motion.div>
    );
}

export default ContactForm;