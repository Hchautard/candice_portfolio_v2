import "../styles/Contact.css";
import ContactForm from "../components/ContactForm";
import DocumentTitleSetter from "../utils/title-setter.ts";

function Contact() {
    DocumentTitleSetter("Contact");

    return (
        <div className="Contact">
            <ContactForm />
        </div>
    );
}

export default Contact;