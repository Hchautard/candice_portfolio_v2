import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import Tattoo from "../pages/Tattoo";
import Makeup from "../pages/Makeup";

function AnimatedRoutes() {
    
  const location = useLocation();

  return (
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="tattoo" element={<Tattoo />} />
            <Route path="contact" element={<Contact />} />
            <Route path="makeup" element={<Makeup />} />
        </Routes>
  );
}

export default AnimatedRoutes;