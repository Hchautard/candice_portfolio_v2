import React, {useEffect, useState} from "react";
import vid_project from "../assets/video/vid_project.mp4";
import Video from "../components/Video";
import NewsGrid from "../components/News/NewsGrid";
import '../styles/Project.css';
import DocumentTitleSetter from "../utils/title-setter.ts";

function Project() {

    DocumentTitleSetter("Shop");

    document.body.classList.remove('tattoo-page');
    document.body.classList.remove('contact-page');
    document.body.classList.remove('makeup-page');
    document.body.classList.add('project-page');

    const [showComponent, setShowComponent] = useState(false);

    useEffect(() => {
        document.body.classList.add('project-page');

        // CHeck if the video file exists
        const checkVideoExists = async () => {
            try {
                const response = await fetch(vid_project, { method: 'HEAD' });
                if (response.ok) {
                    setShowComponent(true);
                } else {
                    console.error("Video file not found:", vid_project);
                }
            } catch (error) {
                console.error("Error checking video file:", error);
            }
        };

        if (checkVideoExists) {
            const timer = setTimeout(() => {
                setShowComponent(true);
            }, 500);

            return () => clearTimeout(timer);
        }

        // Remove class when component unmounts
        return () => {
            document.body.classList.remove('project-page');
        };
    }, []);

    return (
        <div className="project-page">
        <div className="project-container">
            <div className="project-banner">
                <div className="project-content-container">
                    <h2 className="tracking-tight">Bienvenue dans mon univers</h2>
                    <p className="project-text text-pretty">
                        Ce futur salon hybride, l’<span>Anomalie</span>, combinera salon de tatouage, café de spécialité et boutique
                        créative.
                        <br/>
                        <br/>
                        J’y créerai des tatouages organiques adaptés à chaque corps, les créateurs résidents vous
                        proposeront des pièces de mode uniques et des artistes indépendants locaux y exposeront leurs
                        œuvres.
                        <br/>
                        <br/>
                        Chaque visite sera l’occasion de découvrir un lieu vivant, à la fois artistique et convivial,
                        pensé pour accueillir et inspirer.
                    </p>
                </div>
            </div>
            {showComponent && (
                <div className="video-container">
                    <Video
                        src={vid_project}
                    />
                </div>
            )}
        </div>
            <NewsGrid />
        </div>
    );
}

export default Project;