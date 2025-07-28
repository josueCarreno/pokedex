import { useEffect, useState } from 'react';

/**
 * @component Layout
 * @description Component to apply a dark theme to the application. Y dar disposición a la página
 * @param {string} name - The name of the Pokémon
 * @param {string} front - The URL of the front image of the Pokémon
 * @param {string} shiny - The URL of the shiny image of the Pokémon
 */

function Layout({ children }) {
  const themes = ["light", "dark", "auto"];

  const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    return themes.includes(stored) ? stored : "auto";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Cambiar al siguiente tema al hacer clic
  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  // Aplicar tema en efecto secundario
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else if (theme === "auto") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
      }
    };

    applyTheme();
    localStorage.setItem("theme", theme);

    if (theme === "auto") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        root.classList.toggle("dark", media.matches);
      };
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, [theme]);

  // Iconos y etiquetas por tema
  const themeIcons = {
    light: "☀️ Claro",
    dark: "🌙 Oscuro",
    auto: "🌓 Automático",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0C1328] text-black dark:text-white transition-colors duration-500">
      
      <header>
        <nav className='flex justify-between p-4 max-w-screen-xl mx-auto'>
          <h1 className="text-3xl font-bold text-center text-red-600 dark:text-red-400 transition-colors duration-300">
            Pokedex
          </h1>
          <div className='flex md:mr-4 lg:mr-16 xl:mr-32'>
            <button
              onClick={cycleTheme}
              className="bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-full text-[14px] font-semibold shadow hover:scale-105 transition-transform"
            >
              {themeIcons[theme]}
            </button>
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}

export { Layout };