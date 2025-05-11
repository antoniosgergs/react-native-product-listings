import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {fonts} from '../utils/fonts';
import {useTheme} from '../context/ThemeContext';

const ProductDetailsScreen = ({ route }) => {
  const { colors } = useTheme();
  const { product } = route.params;

  return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Image source={{ uri: product.images[0].url }} style={styles.image} />
        <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>
        <Text style={[styles.price, { color: colors.text }]}>${product.price}</Text>
        <Text style={[styles.description, { color: colors.text }]}>{product.description}</Text>
        <TouchableOpacity style={styles.buttonContainerShare}>
          <Icon name="share-outline" size={30} color= '#3250CD' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainerAddToList}>
          <Icon name="bag-add-outline" size={30} color="#3250CD" />
        </TouchableOpacity>
      </ScrollView>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    fontFamily: fonts.Light,
    marginBottom: 24,
  },
  buttonContainerShare: {
    position: 'absolute',
    bottom:-50,
    left: 16,
    marginLeft: 16,
  },
  buttonContainerAddToList: {
    position: 'absolute',
    bottom:-50,
    right: 16,
    marginRight: 16,
  },
});
