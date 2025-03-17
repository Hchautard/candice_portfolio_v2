import '../styles/Makeup.css';
import { CardGrid } from "../components/CardGrid";
import { motion } from "framer-motion";

function Makeup() {
  return (
    <motion.div 
      className="Makeup w-full"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth }}
    >
      {/* This outer div should be full width */}
      <div className="flex flex-col items-center w-full">
        {/* Your content container with max-width */}
        <div className="flex flex-col mx-auto max-w-5xl justify-center items-center mb-20 mt-20">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Mes Makeup</h2>
          
          <p className="mt-8 font-medium text-pretty sm:text-xl/8">
            Anim aute id magna aliqua ad ad non deserunt sunt. 
            Qui irure qui lorem cupidatat commodo. 
            Elit sunt amet fugiat veniam occaecat fugiat.
          </p>
        </div>

        <div className="mx-auto h-auto card-grid-container">
          <CardGrid />
        </div>
      </div>
    </motion.div>
  );
}
  
  export default Makeup;
