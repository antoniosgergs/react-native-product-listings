import {useMutation} from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import {loginApi, signUpApi, verifyOtpApi} from '../api/authApis';
import client from '../api/client';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const useAuth = () =>{
  const navigation = useNavigation();
  const { setAuth,setEmail } = useAuthStore();

  const loginFn = async ({email, password}) => {
    setEmail({email});

    return await client().post(loginApi, {
      email: email,
      password: password,
      token_expires_in: '1y',
    });
  };

  const onSuccessLogin = (data) => {
    const { accessToken, expiresIn  } = data?.data?.data ?? {};

    setAuth({accessToken, expiresIn });
  };

  const onErrorLogin = (error) => {
    Alert.alert(error?.response?.data?.error?.message || 'Error occurred');
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

  const onErrorSignUp = (data) => {
    Alert.alert(data?.response?.data?.error?.message || 'Error occurred');
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
    Alert.alert(error?.response?.data?.error?.message || 'Error occurred');
  };

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtpFn,
    onSuccess: onSuccessVerifyOtp,
    onError: onErrorVerifyOtp,
  });

  return {loginMutation, signUpMutation, verifyOtpMutation};
};

export default useAuth;
