// Pas d'autoplay : la vidéo (~20 Mo) n'est téléchargée que si le visiteur lance la lecture.
// preload="metadata" ne récupère que la durée et les dimensions ; le poster s'affiche en attendant.
const Video = ({ src, poster }) => {
    return (
        <video controls width="100%" preload="metadata" poster={poster} playsInline>
            <source src={src} type="video/mp4" />
            Votre navigateur ne supporte pas la balise vidéo.
        </video>
    );
};

export default Video;
