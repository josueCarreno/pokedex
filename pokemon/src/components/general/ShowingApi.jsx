import { useEffect, useState } from "react";
import { PokemonCard } from "./PokemonCard";

function PokemonByGeneration() {
  const [generation, setGeneration] = useState(1);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  const generations = [
    { id: 1, label: "Generación 1 (Kanto)" },
    { id: 2, label: "Geneneración 2 (johto)" },
    { id: 3, label: "Geneneración 4 (Hoenn)" },
    { id: 4, label: "Geneneración 4 (Sinnoh)" },
    { id: 5, label: "Geneneración 5 (Teselia" },
    { id: 6, label: "Geneneración 6 (Kalos)" },
    { id: 7, label: "Geneneración 7 (Alola" },
    { id: 8, label: "Geneneración 8 (Galar)" },
    { id: 9, label: "Geneneración 9 (Paldea )" }
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
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
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

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pokemones por la Generación {generation}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {generations.map((gen) => (
          <button
            key={gen.id}
            onClick={() => setGeneration(gen.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition 
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
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
