import React, { createContext, useContext, useState } from 'react';
import { MyLightTheme, MyDarkTheme } from '../utils/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const theme = isDarkMode ? MyDarkTheme : MyLightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors: theme.colors, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
