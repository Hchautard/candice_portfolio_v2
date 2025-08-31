import "../styles/Contact.css";
import ContactForm from "../components/ContactForm";

function Contact() {
    document.body.classList.remove('tattoo-page');
    document.body.classList.add('contact-page');

    return (
      <div className="Contact">
        <ContactForm />
      </div>
    );
  }
  
  export default Contact;
  