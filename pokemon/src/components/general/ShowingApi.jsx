import { useEffect, useState, useRef } from "react";
import { PokemonCard } from "./PokemonCard";

/**
 * @component PokemonByGeneration
 * @description component used to display the Pokémon by generation, in addition to the buttons for each one
 */

function PokemonByGeneration() {
  const [generation, setGeneration] = useState(1);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  const secondBtnRef = useRef(null);
  const [hasClicked, setHasClicked] = useState(false);

  const generations = [
    { id: 1, label: "Gen 1 (Kanto)" },
    { id: 2, label: "Gen 2 (johto)" },
    { id: 3, label: "Gen 3 (Hoenn)" },
    { id: 4, label: "Gen 4 (Sinnoh)" },
    { id: 5, label: "Gen 5 (Teselia" },
    { id: 6, label: "Gen 6 (Kalos)" },
    { id: 7, label: "Gen 7 (Alola" },
    { id: 8, label: "Gen 8 (Galar)" },
    { id: 9, label: "Gen 9 (Paldea )" }
  ];

  useEffect(() => {
    const fetchGenerationData = async () => {
      setLoading(true);
      const resGen = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`);
      const dataGen = await resGen.json();

      const species = dataGen.pokemon_species;

      const detailedData = await Promise.all(
        species.map(async (pokemon) => {
          try {
            const cleaned = pokemon.url.replace(/pokemon-species\/?/, "pokemon/");
            const res = await fetch(cleaned);
            const data = await res.json();

            // Verificamos que tenga sprite válido
            if (data.sprites.front_default) {
              return {
                name: data.name,
                sprite: data.sprites.front_default,
                shiny: data.sprites.front_shiny
              };
            } else {
              return null; // Si no hay sprite, no lo usamos
            }

          } catch (error) {
            console.warn(`Error cargando ${pokemon.name}`, error);
            return null; // Si falla la API, lo ignoramos
          }
        })
      );

      // Filtramos los Pokémon nulos (errores o sin imagen)
      const cleanData = detailedData.filter(p => p !== null);

      setPokemonList(cleanData);
      setLoading(false);
    };

    fetchGenerationData();
  }, [generation]);

  useEffect(() => {
  if (secondBtnRef.current) {
    if (!hasClicked && generation !== generations[1]?.id) {
      secondBtnRef.current.classList.add('animate-pulse');
    } else {
      secondBtnRef.current.classList.remove('animate-pulse');
    }
  }
}, [generation, hasClicked]);

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <h2 className="md:text-2xl font-bold mb-4">Pokemones por la Generación {generation}</h2>

      <div className="flex flex-wrap justify-between gap-2 mb-6 text-[12px]">
        {generations.map((gen, index) => (
          <button
            key={gen.id}
            ref={index === 1 ? secondBtnRef : null} // Solo el segundo botón tendrá la ref
            tabIndex={0}
            onClick={() => {
              setGeneration(gen.id);
              setHasClicked(true);
            }}
            className={`px-4 py-2 min-w-[130px] rounded-full text-sm font-semibold cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-blue-500
              ${generation === gen.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-blue-200 text-gray-800'}`}
          >
            {gen.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando Pokémon...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 place-items-center  gap-4">
          {pokemonList.map((pokemon) => (
            <PokemonCard
              key={pokemon.name}
              name={pokemon.name}
              front={pokemon.sprite}
              shiny={pokemon.shiny}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export {  PokemonByGeneration };
