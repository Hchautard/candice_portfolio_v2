import { motion } from "framer-motion";

function ContactForm() {
  return ( 
    <motion.div 
        className="ContactForm"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        exit={{ x: window.innerWidth }}
    >
    <section className="dark:bg-gray-900 h-auto">
        <div className="flex flex-row lg:py-16 px-4 mx-auto max-w-7xl">

            <div className="flex flex-col justify-start w-full lg:w-1/2"> 
                <div className="flex flex-col justify-start"> 
                    <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-left text-gray-900 dark:text-white">Un projet ? Un flash ? Contactez moi !</h2>
                    <p className="mb-8 lg:mb-16 font-light text-left text-gray-500 dark:text-gray-400 sm:text-xl w-5/6">
                        Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.
                    </p>
                </div>

                <div className="flex flex-col justify-start"> 
                    <h2 className="mb-4 text-2xl tracking-tight font-extrabold text-left text-gray-900 dark:text-white">Informations</h2>
                    <p className="mb-8 lg:mb-16 font-light text-left text-gray-500 dark:text-gray-400 sm:text-xl w-6/6">
                    
                        7b Avenue du 19 mars 1962, 13210 Saint-Rémy-de-Provence, France <br />
                        Du mardi au samedi de <strong>9h</strong> à <strong>18h</strong>
                        {/* Text avertissement */}
                        <span className="block mt-4 text-red-500 dark:text-red-400 w-5/6">
                            Attention, si vous souhaitez passer au tattoo shop, merci de me contacter au préalable.
                        </span>
                    </p> 
                </div>
            </div>


            <form action="#" className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 lg:w-1/2">
                <div>
                    <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Votre e-mail</label>
                    <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" 
                    placeholder="patati@patata.com" required />
                </div>
                <div>
                    <label for="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Objet</label>
                    <input 
                    type="text" 
                    id="subject" 
                    className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" 
                    placeholder="Projet, flash, détails..." required />
                </div>
                <div className="sm:col-span-2">
                    <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Votre message</label>
                    <textarea id="message" rows="7" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                    placeholder="Laisser un commentaire..."></textarea>
                </div>
                <div className="w-full flex justify-end sm:col-span-2">
                    <button type="submit" 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded">
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