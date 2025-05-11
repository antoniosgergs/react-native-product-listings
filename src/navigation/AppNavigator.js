import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import Home from '../screens/Home';
import {useTheme} from '../context/ThemeContext';
import {MyLightTheme, MyDarkTheme} from '../utils/theme';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();
  const { isDarkMode } = useTheme();

  return (
    <NavigationContainer theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Products" component={ProductListScreen}/>
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
          </>
        ) : (
          <>
            {/*<Stack.Screen name="Home" component={Home} />*/}
            <Stack.Screen name="Login"  component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
          </>
      )}
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
