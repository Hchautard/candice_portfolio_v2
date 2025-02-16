import { ThreeDCardDemo } from "../components/ThreeDCard";
import { motion } from "framer-motion";

function Makeup() {
    return (
      <motion.div 
        className="Makeup"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        exit={{ x: window.innerWidth }}
      >
        <div className="flex flex-col items-center h-screen mt-20">
          <ThreeDCardDemo />
          <div className="flex flex-col mx-auto max-w-5xl justify-center items-center mb-20">
            <h2 class="text-3xl font-semibold tracking-tight sm:text-5xl">Mes Makeup</h2>
          
            <p class="mt-8 font-medium text-pretty sm:text-xl/8">
              Anim aute id magna aliqua ad ad non deserunt sunt. 
              Qui irure qui lorem cupidatat commodo. 
              Elit sunt amet fugiat veniam occaecat fugiat.
            </p>
          </div>

          <div className="mx-auto w-[900px] h-[900px]">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-400 h-24"></div>
              <div className="bg-blue-300 h-24"></div>
              <div className="bg-blue-400 h-24"></div>
              
              <div className="bg-blue-400 h-32 col-span-2"></div>
              <div className="bg-blue-300 h-32"></div>
              
              <div className="bg-blue-400 h-24"></div>
              <div className="bg-blue-300 h-24"></div>
              <div className="bg-blue-200 h-24"></div>
              
              <div className="bg-blue-200 h-24"></div>
              <div className="bg-blue-300 h-24"></div>
              <div className="bg-blue-400 h-24"></div>
              
              <div className="bg-blue-300 h-32"></div>
              <div className="bg-blue-400 h-32 col-span-2"></div>
            </div>
          </div>
        
          <div className="mt-20">
            FOOTER
          </div>

        </div>
      </motion.div>
    );
  }
  
  export default Makeup;
