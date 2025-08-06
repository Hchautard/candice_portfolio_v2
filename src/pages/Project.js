import React, {useEffect, useState} from "react";
import vid_project from "../assets/video/vid_project.mp4";
import Video from "../components/Video";
import '../styles/Project.css';

function Project() {
    const [showComponent, setShowComponent] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);

    useEffect(() => {
        document.body.classList.add('project-page');

        if (videoLoaded) {
            const timer = setTimeout(() => {
                setShowComponent(true);
            }, 500);

            return () => clearTimeout(timer);
        }

        // Remove class when component unmounts
        return () => {
            document.body.classList.remove('project-page');
        };
    }, [videoLoaded]);


    return (
        <div className="video-container">
            <Video src={vid_project} />
        </div>
    );
}

export default Project;