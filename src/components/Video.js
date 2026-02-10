import PropTypes from "prop-types";

Video.PropTypes = {
    src: PropTypes.string.isRequired,
};
const Video = ({ src }) => {
    return (
        <video controls width="100%" autoPlay muted>
            <source src={src} type="video/mp4" />
            Votre navigateur ne supporte pas la balise vidéo.
        </video>
    );
};

export default Video;