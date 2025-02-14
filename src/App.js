import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Tattoo from "./pages/Tattoo";
import Makeup from "./pages/Makeup";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="tattoo" element={<Tattoo />} />
          <Route path="contact" element={<Contact />} />
          <Route path="makeup" element={<Makeup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
