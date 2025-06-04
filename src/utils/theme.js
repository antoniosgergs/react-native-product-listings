import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    text: '#000000',
    red: '#AA4A44',
    inputBackground: '#FFFFFF',
    inputText: '#000000',
    borderColor: '#CCCCCC',
  },
};

const  MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
    text: '#FFFFFF',
    red: '#AA4A44',
    inputBackground: '#1E1E1E',
    inputText: '#FFFFFF',
    borderColor: '#444444',
  },
};

export { MyLightTheme, MyDarkTheme };
