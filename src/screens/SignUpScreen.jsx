import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '../hooks/useAuth';
import { normalize } from '../utils/responsive';
import {useTheme} from '../context/ThemeContext';
import Button from '../components/atoms/button/Button';
import AppTextInput from '../components/atoms/textInput/AppTextInput';

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
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = ({firstName, lastName, email, password}) => {
    mutate({firstName, lastName, email, password});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Sign Up</Text>

      <AppTextInput placeholder={'First name'} error={errors.firstName} onChangeText={(text) => setValue('firstName', text)}  />

      <AppTextInput placeholder={'Last name'} error={errors.lastName} onChangeText={(text) => setValue('lastName', text)}  />

      <AppTextInput placeholder={'Email'} error={errors.email} onChangeText={(text) => setValue('email', text)}  />

      <AppTextInput secureTextEntry placeholder={'Password'} error={errors.password} onChangeText={(text) => setValue('password', text)}  />

      <Button isLoading={isPending} onPress={handleSubmit(onSubmit)}>
        Sign up
      </Button>
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
});
