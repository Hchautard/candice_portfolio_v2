import PropTypes from "prop-types";

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};
export default function Button(props) {
    return (
        <button className="btn-primary" onClick={props.onClick}>
            {props.text}
        </button>
    );
}