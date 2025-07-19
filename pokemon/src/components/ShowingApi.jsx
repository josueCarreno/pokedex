import { useEffect, useState } from "react";

function PokemonByGeneration() {
  const [generation, setGeneration] = useState(1);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  const generations = [
    { id: 1, label: "Gen 1" },
    { id: 2, label: "Gen 2" },
    { id: 3, label: "Gen 3" },
    { id: 4, label: "Gen 4" },
    { id: 5, label: "Gen 5" },
    { id: 6, label: "Gen 6" },
    { id: 7, label: "Gen 7" },
    { id: 8, label: "Gen 8" },
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
                sprite: data.sprites.front_default
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {pokemonList.map((p) => (
            <div key={p.name} className="text-center">
              <img src={p.sprite} alt={p.name} className="mx-auto" />
              <p className="capitalize">{p.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export {  PokemonByGeneration };
