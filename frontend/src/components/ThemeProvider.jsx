import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  const { theme } = useSelector(state => state.theme);

  return (
    <div className={theme}>
      <div className="text-gray-100 bg-gray-900
       dark:text-gray-100 dark:bg-gray-950">
        {children}
      </div>
    </div>
  );
}
