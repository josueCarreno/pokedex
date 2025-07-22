import { useEffect, useState } from 'react';

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
      
      <header className="p-4 flex justify-end">
        <button
        onClick={cycleTheme}
        className="bg-gray-200 dark:bg-gray-700 px-6 py-3 rounded text-lg font-semibold shadow hover:scale-105 transition-transform"
      >
        {themeIcons[theme]}
      </button>
      </header>

      <main>{children}</main>
    </div>
  );
}

export { Layout };