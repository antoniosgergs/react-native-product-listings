import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuthStore from '../store/authStore';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import AddNewProductScreen from '../screens/AddNewProductScreen';
import {useTheme} from '../context/ThemeContext';
import {MyLightTheme, MyDarkTheme} from '../utils/theme';
import TabNavigator from './TabNavigator';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { isDarkMode } = useTheme();

  return (
    <NavigationContainer theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
      <Stack.Navigator>
        {accessToken ? (
          <>
            <Stack.Screen name={'Home'} component={TabNavigator} options={{headerShown: false}} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{title: 'Product details'}} />
            <Stack.Screen name="AddNewProduct" component={AddNewProductScreen} options={{title: 'Add new product'}} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login"  component={LoginScreen} options={{title: 'Login'}} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{title: 'Sign up'}} />
            <Stack.Screen name="Verification" component={VerificationScreen} options={{title: 'Verification'}} />
          </>
      )}
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
