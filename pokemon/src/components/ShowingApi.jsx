import { useEffect, useState } from "react";

function PokemonByGeneration() {
  const [generation, setGeneration] = useState(1);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <h1 className="text-2xl font-bold mb-4">Pokémon por Generación</h1>

      <select
        className="mb-6 p-2 border rounded"
        value={generation}
        onChange={(e) => setGeneration(e.target.value)}
      >
        {[...Array(9)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            Generación {i + 1}
          </option>
        ))}
      </select>

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
