import { useId, useRef } from "react";
import PropTypes from "prop-types";

// Pas d'autoplay : la vidéo (~20 Mo) n'est téléchargée que si le visiteur lance la lecture.
// preload="metadata" ne récupère que la durée et les dimensions ; le poster s'affiche en attendant.
// La transcription (si fournie) rend le contenu accessible sans le son et aux lecteurs d'écran.
// Elle s'ouvre dans un <dialog> natif : piège à focus et fermeture par Échap fournis par le navigateur.
const Video = ({ src, poster, transcript = [] }) => {
    const dialogRef = useRef(null);
    const titleId = useId();

    const closeOnBackdrop = (event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
    };

    return (
        <figure className="video-figure">
            <video controls width="100%" preload="metadata" poster={poster} playsInline>
                <source src={src} type="video/mp4" />
                Votre navigateur ne supporte pas la balise vidéo.
            </video>
            {transcript.length > 0 && (
                <>
                    <button type="button" className="video-transcript-open" onClick={() => dialogRef.current?.showModal()}>
                        Lire la transcription
                    </button>
                    {/* Le clic sur le fond referme ; au clavier, Échap fait de même nativement */}
                    <dialog ref={dialogRef} className="video-transcript" aria-labelledby={titleId} onClick={closeOnBackdrop}>
                        <div className="video-transcript-content">
                            <div className="video-transcript-header">
                                <h2 id={titleId}>Transcription de la vidéo</h2>
                                <button type="button" className="video-transcript-close" onClick={() => dialogRef.current?.close()} aria-label="Fermer la transcription">
                                    &times;
                                </button>
                            </div>
                            {transcript.map((paragraph) => (
                                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                            ))}
                        </div>
                    </dialog>
                </>
            )}
        </figure>
    );
};

Video.propTypes = {
    src: PropTypes.string.isRequired,
    poster: PropTypes.string,
    transcript: PropTypes.arrayOf(PropTypes.string),
};

export default Video;
