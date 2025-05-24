import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import {useTheme} from '../context/ThemeContext';
import useAuth from '../hooks/useAuth';

const  VerificationScreen = ({ route })=> {
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
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]}
        placeholder="4-digit code"
        placeholderTextColor={colors.inputText}
        keyboardType="number-pad"
        maxLength={4}
        value={otp}
        onChangeText={setOtp}
      />
      <Button title={isPending ? 'Loading...' : 'Verify'} onPress={handleVerify} />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    textAlign: 'center',
  },
});
