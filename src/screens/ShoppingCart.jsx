import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import {useNavigation} from '@react-navigation/native';
import ProductCard from '../components/molecules/ProductCard';
import {useTheme} from '../context/ThemeContext';
import useShoppingCart from '../store/shoppingCart';

const ShoppingCart = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const { shoppingCart,deleteItemFromShoppingCart } = useShoppingCart();

  const onDeleteItem = (item) => () => {
    deleteItemFromShoppingCart({item});
  };

  const onProductPress = (item) => () => {
    navigation.navigate('ProductDetails',
      {
        productId: item._id,
      }
    );
  };

  const renderHiddenItem = ({item}) => (
    <View style={styles.deleteContainer}>
      <TouchableOpacity style={styles.deleteButton} onPress={onDeleteItem(item)}>
        <Text style={[styles.deleteText, {color: colors.red}]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({item}) => (
    <ProductCard
      isLoading={false}
      item={item}
      onPress={onProductPress(item)}
    />
  );

  const keyExtractor =  (item) => item._id;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SwipeListView
        style={[styles.container, { backgroundColor: colors.background }]}
        data={shoppingCart}
        rightOpenValue={-75}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<Text>No items found in the cart</Text>}
        renderHiddenItem={renderHiddenItem}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  deleteContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    justifyContent: 'center',
    padding: 20,
  },
  deleteText: {
    fontWeight:'bold',
    fontSize: 18,
  },
});

export default ShoppingCart;
