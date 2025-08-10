import React, {useEffect, useState} from "react";
import vid_project from "../assets/video/vid_project.mp4";
import Video from "../components/Video";
import '../styles/Project.css';

function Project() {
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
        <div className="project-container">
            <div className="project-banner">
                <div className="project-content-container">
                    <h2 className="tracking-tight">Bienvenue dans mon (futur) shop</h2>
                    <p className="project-text text-pretty">
                        Entre deux gorgées de café artisanal, découvrez nos créations textile uniques ou offrez-vous le tatouage de vos rêves.
                        Notre boutique hybride cultive l'art de l'étrange et du merveilleux, où chaque visite devient une aventure au pays des possibles.
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
    );
}

export default Project;