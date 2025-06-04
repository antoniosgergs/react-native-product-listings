import React from 'react';
import Animated from 'react-native-reanimated';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import { normalize } from '../../utils/responsive';
import {useTheme} from '../../context/ThemeContext';
import Counter from './Counter';
import useShoppingCart from '../../store/shoppingCart';
import {API_URL} from '../../utils/constants';

const ProductCard = ({ item, onPress, isLoading }) =>{
  const { colors } = useTheme();

  const { shoppingCart, removeItemFromShoppingCart, addItemToShoppingCart } = useShoppingCart();
  const onIncrementCount = () => addItemToShoppingCart({item});
  const onDecreaseCount = () => removeItemFromShoppingCart({item});
  const count = shoppingCart.find((val) => val._id === item._id)?.count ?? 0;

  return(
    <Skeleton
      isLoading={isLoading}
      containerStyle={styles.card}
      layout={[
      { key: 'image', ...styles.image },
      { key: 'title', ...styles.title, height: 20, width: 220, margin: 6 },
      { key: 'price', ...styles.price, height: 20, width: 220, margin: 6 },
    ]}>
      <Pressable onPress={onPress}>
        <Animated.Image source={{ uri: `${API_URL}/${item?.images[0].url}` }} style={styles.image} sharedTransitionTag="tag" />
        <View style={[styles.info, { backgroundColor: colors.background }]}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>{item?.title}</Text>
            <Text style={[styles.price, { color: colors.text }]}>${item?.price}</Text>
          </View>
          <Counter count={count} onIncrementCount={onIncrementCount} onDecreaseCount={onDecreaseCount} />
        </View>
      </Pressable>
    </Skeleton>
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: normalize(12),
  },
  title: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginBottom: normalize(6),
  },
  price: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#1c1c1c',
  },
});
