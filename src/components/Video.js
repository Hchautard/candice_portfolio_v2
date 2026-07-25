const Video = ({ src }) => {
    return (
        <video controls width="100%" autoPlay muted playsInline>
            <source src={src} type="video/mp4" />
            Votre navigateur ne supporte pas la balise vidéo.
        </video>
    );
};

export default Video;