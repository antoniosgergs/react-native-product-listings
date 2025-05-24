import React from 'react';
import { View, Text, TextInput, Button,Switch, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '../hooks/useAuth';
import { normalize } from '../utils/responsive';
import { useTheme } from '../context/ThemeContext';



const schema = z.object({
  email: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const {loginMutation} = useAuth();
  const {mutate, isPending} = loginMutation;

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = ({ email, password }) => {
    mutate({email, password});
  };

  return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
      />

        <Text style={[styles.title, { color: colors.text }]}>Login</Text>


        <TextInput
            placeholder="Username"
            placeholderTextColor={colors.inputText}
            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]}
            onChangeText={text => setValue('email', text)}
        />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <TextInput
            placeholder="Password"
            placeholderTextColor={colors.inputText}
            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]}
            secureTextEntry
            onChangeText={text => setValue('password', text)}
        />
        {errors.password && <Text style={[styles.error, { color: 'red' }]}>{errors.password.message}</Text>}

        <Button title={isPending ? 'Loading...' : 'Login'} onPress={handleSubmit(onSubmit)} />
        <View style={styles.link}>
          <Text style={{ color: colors.text }} onPress={() => navigation.navigate('SignUp')}>
            Don't have an account? Sign Up
          </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: normalize(20),
    flex: 1,
    justifyContent: 'center',
  },
  title:{
    fontSize: normalize(24),
    marginBottom: normalize(20),
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: normalize(10),
    marginBottom: normalize(10),
    borderRadius: normalize(5),
  },
  error: {
    color: 'red',
    marginBottom: normalize(10) },
  link: {
    marginTop: normalize(10),
    alignItems: 'center',
  },
});
