import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Home = () => {
  return(
    <View style={styles.container}>
      <Text style={styles.text}>Shop</Text>
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
});
