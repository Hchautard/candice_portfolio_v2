import "../styles/Contact.css";
import ContactForm from "../components/ContactForm";
import {useEffect, useState} from "react";

function Contact() {
    const [showComponent, setShowComponent] = useState(false);

    document.body.classList.remove('tattoo-page');
    document.body.classList.add('contact-page');

    return (
      <div className="Contact">
        <ContactForm />
      </div>
    );
  }
  
  export default Contact;
  