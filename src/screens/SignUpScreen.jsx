import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '../hooks/useAuth';
import { normalize } from '../utils/responsive';
import {useTheme} from '../context/ThemeContext';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function SignUpScreen() {
  const { colors } = useTheme();
  const {signUpMutation} = useAuth();
  const {mutate, isPending} = signUpMutation;

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = ({firstName, lastName, email, password}) => {
    mutate({firstName, lastName, email, password});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Sign Up</Text>

      <TextInput placeholder="First name" placeholderTextColor={colors.inputText} style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]} onChangeText={(text) => setValue('firstName', text)} />
      {errors.firstName && <Text style={styles.error}>{errors.firstName.message}</Text>}

      <TextInput placeholder="Last name" placeholderTextColor={colors.inputText} style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]} onChangeText={(text) => setValue('lastName', text)} />
      {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}

      <TextInput placeholder="Email" placeholderTextColor={colors.inputText} style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]} onChangeText={(text) => setValue('email', text)} />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <TextInput
        placeholder="Password"
        placeholderTextColor={colors.inputText}
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]}
        secureTextEntry
        onChangeText={(text) => setValue('password', text)}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}


      <Button title={isPending ? 'Loading...' : 'Sign Up'} onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: normalize(20),
    flex: 1,
    justifyContent: 'center',
  },
  title: {
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
