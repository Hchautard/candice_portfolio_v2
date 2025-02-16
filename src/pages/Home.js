import Button from "../components/Button"
import { ThreeDCardDemo } from "../components/ThreeDCard";
import "../styles/Home.css"

function Home() {
  return (
    <div className="Home">

      <div className="container-home">

        <div className="container-title">
          <h1>Home</h1>
        </div>

        <div className="container-text">
          <p>Home is where the heart is.</p>
        </div>

        <div className="container-buttons">
          <Button text="Makeup" onClick={() => window.location.href = "/makeup"} />
          <Button text="Tattoo" onClick={() => window.location.href = "/tattoo"} />
          <Button text="Contact" onClick={() => window.location.href = "/contact"} />
        </div>

      </div>

      <ThreeDCardDemo />

    </div>
  );
}

export default Home;
