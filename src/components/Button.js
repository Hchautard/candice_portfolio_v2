
export default function Button(props) {
    return (
        <button className="btn-primary" onClick={props.onClick}>
            {props.text}
        </button>
    );
}