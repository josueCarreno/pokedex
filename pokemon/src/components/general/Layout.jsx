import { useDarkMode } from './../hooks/useDarkMode';

function Layout({ children }) {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0C1328] text-black dark:text-white transition-colors duration-500">
      <header className="p-4 flex justify-end">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
        </button>
      </header>

      <main>{children}</main>
    </div>
  );
}

export { Layout };