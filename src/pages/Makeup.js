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
          <div className="flex flex-col mx-auto max-w-5xl justify-center items-center mb-20">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Mes Makeup</h2>
          
            <p className="mt-8 font-medium text-pretty sm:text-xl/8">
              Anim aute id magna aliqua ad ad non deserunt sunt. 
              Qui irure qui lorem cupidatat commodo. 
              Elit sunt amet fugiat veniam occaecat fugiat.
            </p>
          </div>

          <div className="mx-auto  h-auto">
            <div className="grid grid-cols-3 gap-2 ">

              {/* 1 row */}
              <div className="h-70">
                <ThreeDCardDemo />
              </div>
              <div className="h-70 ">
                <ThreeDCardDemo width="10" />
              </div>
              <div className="h-70 ">
                <ThreeDCardDemo />
              </div>

              {/* 2 row */}
              <div className="h-70 col-span-2 ">
                <ThreeDCardDemo />
              </div>
              <div className="h-70 ">
                {/* <ThreeDCardDemo /> */}
              </div>

              {/* 3 row */}
              <div className="h-70 ">
                <ThreeDCardDemo />
              </div>
              <div className="h-70 ">
                <ThreeDCardDemo />
              </div>
              <div className="h-70 ">
                <ThreeDCardDemo />
              </div>

              {/* 4 row */}
              <div className="h-70 ">
                <ThreeDCardDemo />
              </div>
              <div className="h-70 col-span-2 ">
                {/* <ThreeDCardDemo /> */}
              </div>

              {/* 5 row */}
              <div className="h-70 ">
                <ThreeDCardDemo />
              </div>
              <div className="h-70 ">
                <ThreeDCardDemo />
              </div>
              <div className="h-70 ">
                <ThreeDCardDemo />
              </div>
              
            
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
