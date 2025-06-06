import React, { useState } from 'react';
import {useRoute} from '@react-navigation/native';
import { View, StyleSheet, Text } from 'react-native';
import {useTheme} from '../context/ThemeContext';
import useAuth from '../hooks/useAuth';
import Button from '../components/atoms/button/Button';
import AppTextInput from '../components/atoms/textInput/AppTextInput';

const  VerificationScreen = ()=> {
  const route = useRoute();
  const { email } = route.params;

  const {verifyOtpMutation} = useAuth();
  const {mutate, isPending} = verifyOtpMutation;

  const { colors } = useTheme();
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    mutate({email, otp});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Enter OTP</Text>

      <AppTextInput maxLength={4} keyboardType="number-pad" placeholder={'4-digit code'} onChangeText={setOtp} value={otp}  />

      <Button isLoading={isPending} onPress={handleVerify}>
        Verify
      </Button>
    </View>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});
