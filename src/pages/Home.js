import "../styles/Home.css"
import { motion } from "framer-motion";

function Home() {
  return (
    <motion.div 
      className="Home bg-red-500"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth }}
    >
      {/* <img src="https://images.unsplash.com/photo-1521308452854-e037c0062a1e?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" class="absolute inset-0 -z-10 size-full object-cover object-right md:object-center"></img> */}

      <div className="mx-auto mx-20">

        <div className="mx-auto max-w-5xl lg:mx-0">
          <h2 class="text-5xl font-semibold tracking-tight sm:text-7xl">Bienvenue chez l'anomalie</h2>
        
          <p class="mt-8 font-medium text-pretty sm:text-xl/8">
            Anim aute id magna aliqua ad ad non deserunt sunt. 
            Qui irure qui lorem cupidatat commodo. 
            Elit sunt amet fugiat veniam occaecat fugiat.
            Anim aute id magna aliqua ad ad non deserunt sunt. 
            Qui irure qui lorem cupidatat commodo. 
            Elit sunt amet fugiat veniam occaecat fugiat.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold sm:grid-cols-2 md:flex lg:gap-x-10 mt-8">
          <a href="/tattoo" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Tattoo</a>
          <a href="/makeup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Makeup</a>
          <a href="/contact" className="font-bold py-2 px-4 rounded">Contact<span aria-hidden="true">&rarr;</span></a>
        </div>

      </div>

      

    </motion.div>
  );
}

export default Home;
