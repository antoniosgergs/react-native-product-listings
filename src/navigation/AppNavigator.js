import React, {useEffect} from 'react';
import {Linking} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import crashlytics from '@react-native-firebase/crashlytics';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import AddNewProductScreen from '../screens/AddNewProductScreen';
import {useTheme} from '../context/ThemeContext';
import {MyLightTheme, MyDarkTheme} from '../utils/theme';
import TabNavigator from './TabNavigator';
import {APP_PREFIXES} from '../utils/constants';
import useAuthStore from '../store/authStore';
import useNotification from '../hooks/useNotification';
import useDeepLink from '../store/deepLink';
import EditProductScreen from '../screens/EditProductScreen';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: APP_PREFIXES,
  config: {
    screens: {
      // To test: adb shell am start -W -a android.intent.action.VIEW -d "antonios_product_listing://product/67f77e866ef080fc2f21c3fb"
      ProductDetails: 'product/:productId',
    },
  },
};

const AppNavigator = () => {
  const {setDeepLink } = useDeepLink();
  const {isLoggedIn } = useAuthStore();
  const { isDarkMode } = useTheme();

  useNotification();

  useEffect(() => {
      Linking.getInitialURL().then((url) => {
        setDeepLink(url);
      }).catch((error) => {
        crashlytics().recordError(error);
      });
  },[setDeepLink]);

  return (
    <NavigationContainer linking={linking} theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={TabNavigator} options={{headerShown: false}} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{title: 'Product details'}} />
            <Stack.Screen name="AddNewProduct" component={AddNewProductScreen} options={{title: 'Add new product'}} />
            <Stack.Screen name="EditProduct" component={EditProductScreen} options={{title: 'Edit product'}} />
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
