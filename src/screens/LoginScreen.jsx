import React, {useLayoutEffect} from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import { zodResolver } from '@hookform/resolvers/zod';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuth from '../hooks/useAuth';
import { normalize } from '../utils/responsive';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/atoms/button/Button';
import AppTextInput from '../components/atoms/textInput/AppTextInput';

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
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = ({ email, password }) => {
    mutate({email, password});
  };

  useLayoutEffect(() => {
    const getHeaderRight = () => (
      <View style={styles.header}>
        <Ionicons name={'sunny-outline'} size={18} color={colors.text} />
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
        <Ionicons name={'moon-outline'} size={18} color={colors.text} />
      </View>
    );

    navigation.setOptions({
      headerRight: getHeaderRight,
    });
  }, [colors.text, isDarkMode, navigation, toggleTheme]);

  return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Login</Text>

        <AppTextInput placeholder={'Username'} error={errors.email} onChangeText={(text) => setValue('email', text)}  />

        <AppTextInput secureTextEntry placeholder={'Password'} error={errors.password} onChangeText={(text) => setValue('password', text)}  />

        <Button isLoading={isPending} onPress={handleSubmit(onSubmit)}>
          Login
        </Button>
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
  header:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  title:{
    fontSize: normalize(24),
    marginBottom: normalize(20),
    textAlign: 'center',
  },
  link: {
    marginTop: normalize(10),
    alignItems: 'center',
  },
});
