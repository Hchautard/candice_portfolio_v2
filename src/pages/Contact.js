import "../styles/Contact.css";
import ContactForm from "../components/ContactForm";
import DocumentTitleSetter from "../utils/title-setter.ts";

function Contact() {
    DocumentTitleSetter("Contact");

    document.body.classList.remove('tattoo-page');
    document.body.classList.remove('project-page');
    document.body.classList.remove('makeup-page');
    document.body.classList.add('contact-page');

    // Remove ::before of body
    document.body.style.setProperty('::before', 'none');

    return (
      <div className="Contact">
        <ContactForm />
      </div>
    );
  }
  
  export default Contact;
  