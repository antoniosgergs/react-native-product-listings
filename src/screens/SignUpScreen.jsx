import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '../utils/responsive';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number is required'),
});

export default function SignUpScreen() {
  const navigation = useNavigation();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = () => {
    navigation.navigate('Verification');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput placeholder="Name" style={styles.input} onChangeText={(text) => setValue('name', text)} />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <TextInput placeholder="Email" style={styles.input} onChangeText={(text) => setValue('email', text)} />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={(text) => setValue('password', text)}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <TextInput placeholder="Phone" style={styles.input} onChangeText={(text) => setValue('phone', text)} />
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

      <Button title="Sign Up" onPress={handleSubmit(onSubmit)} />
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
