import '../styles/Spinner.css';

function Spinner({ fullScreen = false }) {
    return (
        <div className={`spinner-wrapper${fullScreen ? ' spinner-fullscreen' : ''}`}>
            <div className="spinner" />
        </div>
    );
}

export default Spinner;
