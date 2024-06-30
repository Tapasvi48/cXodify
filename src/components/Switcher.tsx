import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  console.log(theme);
  return (
    <div>
      The current theme is: {theme}
      <button
        onClick={() => {
          setTheme("light");
          console.log(theme);
        }}
      >
        Light Mode
      </button>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
    </div>
  );
};
