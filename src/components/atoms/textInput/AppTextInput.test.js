import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppTextInput from './AppTextInput';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from '../../../api/queryClient';
import {ThemeProvider} from '../../../context/ThemeContext';

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

describe('AppTextInput', () => {
  it('renders with placeholder text', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <AppTextInput placeholder="Enter your name" />
    );
    expect(getByPlaceholderText('Enter your name')).toBeTruthy();
  });

  it('fires onChangeText when user types', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <AppTextInput placeholder="Type here" onChangeText={onChangeTextMock} />
    );
    const input = getByPlaceholderText('Type here');
    fireEvent.changeText(input, 'Hello antonios');
    expect(onChangeTextMock).toHaveBeenCalledWith('Hello antonios');
  });

  it('displays error message', () => {
    const error = { message: 'This field is required' };
    const { getByText } = renderWithTheme(
      <AppTextInput placeholder="Type here" error={error} />
    );
    expect(getByText('This field is required')).toBeTruthy();
  });
});
