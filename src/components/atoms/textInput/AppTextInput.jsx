import {StyleSheet, Text, TextInput} from 'react-native';
import React from 'react';
import {useTheme} from '../../../context/ThemeContext';
import {normalize} from '../../../utils/responsive';

const AppTextInput = ({onChangeText, error, placeholder, multiline, numberOfLines, keyboardType, secureTextEntry,value, maxLength}) => {
  const { colors } = useTheme();

  return (
    <>
      <TextInput
        value={value}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        numberOfLines={numberOfLines}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colors.inputText}
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]}
        onChangeText={onChangeText}
      />
      {error && <Text style={styles.error}>{error.message}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: normalize(10),
    marginBottom: normalize(10),
    borderRadius: normalize(5),
  },
  error: {
    color: 'red',
    marginBottom: normalize(10),
  },
});

export default AppTextInput;
