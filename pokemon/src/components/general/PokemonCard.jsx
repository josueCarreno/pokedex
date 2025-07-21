import { useState } from "react";

function PokemonCard({ name, front, shiny }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-28 h-32 perspective"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative w-full h-full duration-500 transform-style preserve-3d ${isHovered ? "rotate-y-180" : ""}`}>
        {/* Cara frontal */}
        <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-md">
          <img src={front} alt={name} className="w-20 h-20" />
          <p className="capitalize text-sm mt-1">{name}</p>
        </div>

        {/* Cara trasera (shiny) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-yellow-50 dark:bg-yellow-900 rounded-xl shadow-md">
          <img src={shiny} alt={`${name} shiny`} className="w-20 h-20" />
          <p className="capitalize text-sm mt-1 text-yellow-600 dark:text-yellow-300">{name} ✨</p>
        </div>
      </div>
    </div>
  );
}

export { PokemonCard };