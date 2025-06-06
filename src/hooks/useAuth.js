import {useMutation} from '@tanstack/react-query';
import {useCallback} from 'react';
import {Linking} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {useNavigation} from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import useAuthStore from '../store/authStore';
import {loginApi, signUpApi, verifyOtpApi} from '../api/authApis';
import client from '../api/client';
import {storage} from '../utils/mmkv';
import useDeepLink from '../store/deepLink';

const useAuth = () =>{
  const navigation = useNavigation();
  const {deepLink } = useDeepLink();
  const { setAuth, setEmail, clearAuth } = useAuthStore();

  const loginFn = async ({email, password}) => {
    setEmail({email});

   return {
     email,
      result: await client().post(loginApi, {
        email: email,
        password: password,
        token_expires_in: '1y',
      }),
    };
  };

  const onSuccessLogin = async ({email, result}) => {
    crashlytics().log('User signed in.');
    const {accessToken, refreshToken} = result?.data?.data ?? {};

    // Navigate to deeplink after login if exists
    if(deepLink){
      Linking.openURL(deepLink)
        .then(()=>{})
        .catch(()=>{});
    }

    storage.set('accessToken', accessToken);

    try {
      await crashlytics().setAttributes({
        email,
      });
    } catch (error) {
      crashlytics().recordError(error);
    }

    setAuth({refreshToken, isLoggedIn: true});
  };

  const onErrorLogin = (error) => {
    Snackbar.show({
      text: error?.response?.data?.error?.message || 'Error occurred',
      textColor: 'red',
    });
  };

  const loginMutation = useMutation({
    mutationFn: loginFn,
    onSuccess: onSuccessLogin,
    onError: onErrorLogin,
  });

  const signUpFn = async ({firstName, lastName, email, password}) => {
    const formData = new FormData();

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('password', password);

    return {
      email,
      result:  await client().post(signUpApi, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    };
  };

  const onSuccessSignUp = ({email}) => {
    navigation.navigate('Verification', {
      email,
    });
  };

  const onErrorSignUp = (error) => {
    Snackbar.show({
      text: error?.response?.data?.error?.message || 'Error occurred',
      textColor: 'red',
    });
  };

  const signUpMutation = useMutation({
    mutationFn: signUpFn,
    onSuccess: onSuccessSignUp,
    onError: onErrorSignUp,
  });

  const verifyOtpFn = async ({email, otp}) => {
    return await client().post(verifyOtpApi, {
      email,
      otp,
    });
  };

  const onSuccessVerifyOtp = () => {
    navigation.navigate('Login');
  };

  const onErrorVerifyOtp = (error) =>{
    Snackbar.show({
      text: error?.response?.data?.error?.message || 'Error occurred',
      textColor: 'red',
    });
  };

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtpFn,
    onSuccess: onSuccessVerifyOtp,
    onError: onErrorVerifyOtp,
  });

  const onLogout = useCallback(() => {
    crashlytics().log('User logged out.');
    clearAuth();
    storage.set('accessToken', '');
  }, [clearAuth]);

  return {loginMutation, signUpMutation, verifyOtpMutation, onLogout};
};

export default useAuth;
