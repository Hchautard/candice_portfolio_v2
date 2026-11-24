import "../styles/Contact.css";
import ContactForm from "../components/ContactForm";
import DocumentTitleSetter from "../utils/title-setter.ts";

function Contact() {
    DocumentTitleSetter("Contact", {
        description: "Demande de tatouage, flash à adopter ou simple question : écrivez à Candice, tatoueuse à Montpellier, via le formulaire ou sur Instagram.",
    });

    return (
        <div className="Contact">
            <h1 className="sr-only">Nous contacter — L&apos;Anomalie</h1>
            <ContactForm />
        </div>
    );
}

export default Contact;