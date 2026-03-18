import React, {useEffect, useState} from "react";
import vid_project from "../assets/video/vid_project.mp4";
import Video from "../components/Video";
import NewsGrid from "../components/News/NewsGrid";
import '../styles/Project.css';
import DocumentTitleSetter from "../utils/title-setter.ts";
import NewsList from "../components/News/NewsList";

function Project() {

    DocumentTitleSetter("Shop");

    const [showComponent, setShowComponent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowComponent(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="project-page">
            <div className="project-container">
                <div className="project-banner">
                    <div className="project-content-container">
                        <h2 className="tracking-tight">Bienvenue dans mon univers</h2>
                        <p className="project-text text-pretty">
                            Ce futur salon hybride, l\&#39;<span>Anomalie</span>, combinera salon de tatouage, café de
                            spécialité et boutique
                            créative.
                            <br/>
                            <br/>
                            J\&#39;y créerai des tatouages organiques adaptés à chaque corps, les créateurs résidents vous
                            proposeront des pièces de mode uniques et des artistes indépendants locaux y exposeront
                            leurs
                            œuvres.
                            <br/>
                            <br/>
                            Chaque visite sera l\&#39;occasion de découvrir un lieu vivant, à la fois artistique et
                            convivial,
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

            {/* Last News */}
            <NewsGrid/>

            <br />

            {/* All News */}
            <NewsList/>
        </div>
    );
}

export default Project;