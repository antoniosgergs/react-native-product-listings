import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { normalize } from '../utils/responsive';
import {useTheme} from '../context/ThemeContext';

const ProductCard = ({ item, onPress }) =>{
  const { colors } = useTheme();
  return(
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: item.images[0].url }} style={styles.image} />
      <View style={[styles.infocontainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.price, { color: colors.text }]}>${item.price}</Text>
      </View>
    </Pressable>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: normalize(20),
    backgroundColor: '#f9f9f9',
    borderRadius: normalize(10),
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: normalize(300),
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  info: {
    padding: normalize(12),
  },
  title: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginBottom: normalize(6),
  },
  description: {
    fontSize: normalize(14),
    color: '#555',
    marginBottom: normalize(8),
  },
  price: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#1c1c1c',
  },
});
