
export default function Button(props) {
    return (
        <button className="Button" onClick={props.onClick}>
            {props.text}
        </button>
    );
}