import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import Tattoo from "../pages/Tattoo";
import Makeup from "../pages/Makeup";
import Project from "../pages/Project";
import NewsDetail from "../pages/NewsDetail";

function AnimatedRoutes() {
  return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="tattoo" element={<Tattoo />} />
            <Route path="contact" element={<Contact />} />
            <Route path="makeup" element={<Makeup />} />
            <Route path="project" element={<Project />} />
            <Route path="/news">
                <Route path=":id" element={<NewsDetail />} />
            </Route>
        </Routes>
  );
}

export default AnimatedRoutes;