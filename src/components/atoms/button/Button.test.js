import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../../../context/ThemeContext';
import Button from './Button';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from '../../../api/queryClient';

const renderWithTheme = (ui) => {
  const MockThemeProvider = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: MockThemeProvider });
};

describe('Button', () => {
  it('renders the button with text', () => {
    const { getByText } = renderWithTheme(<Button onPress={() => {}}>Hi toto</Button>);
    expect(getByText('Hi toto')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockPress = jest.fn();
    const { getByText } = renderWithTheme(<Button onPress={mockPress}>Hi toto</Button>);
    fireEvent.press(getByText('Hi toto'));
    expect(mockPress).toHaveBeenCalled();
  });
});
