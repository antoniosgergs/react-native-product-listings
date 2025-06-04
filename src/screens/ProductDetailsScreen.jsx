import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import Animated from 'react-native-reanimated';
import Skeleton from 'react-native-reanimated-skeleton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  View,
  Linking,
  Button,
  Share,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {fonts} from '../utils/fonts';
import {useTheme} from '../context/ThemeContext';
import useProducts from '../hooks/useProducts';
import useAuthStore from '../store/authStore';
import {API_URL, APP_PREFIX} from '../utils/constants';
import Counter from '../components/molecules/Counter';
import useShoppingCart from '../store/shoppingCart';

const ProductDetailsScreen = () => {
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;
  const {email} = useAuthStore();
  const {getProductByIdQuery, deleteProductMutation} = useProducts({productId});
  const {isFetching, refetch, isRefetching, isError, data} = getProductByIdQuery;

  const {data: product} = data ?? {};

  const isProductOwner = email === product?.user?.email;

  const { shoppingCart, removeItemFromShoppingCart, addItemToShoppingCart } = useShoppingCart();
  const onIncrementCount = () => addItemToShoppingCart({product});
  const onDecreaseCount = () => removeItemFromShoppingCart({product});
  const count = shoppingCart.find((val) => val._id === product?._id)?.count ?? 0;

  const deleteProduct = () => {
    deleteProductMutation.mutate();
  };

  const productTitle = product?.title;

  const handleShare = useCallback(() => {
    const url = `${APP_PREFIX}product/${productId}`;

    Share.share({
      url,
      title: productTitle,
      message: `Hello check this product: ${url}`,
    });
  }, [productTitle, productId]);


  useLayoutEffect(() => {
    const getHeaderRight = () => (
      <TouchableOpacity onPress={handleShare}>
        <Ionicons name={'share-outline'} size={36} />
      </TouchableOpacity>
    );

    navigation.setOptions({
      headerRight: getHeaderRight,
    });
  }, [navigation, handleShare]);

  useEffect(() => {
    if(isError){
      Snackbar.show({
        text: 'Error occurred',
        textColor: 'red',
      });
    }
  },[isError]);

  return (
      <ScrollView refreshControl={<RefreshControl onRefresh={refetch} refreshing={isRefetching} />} contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Skeleton
          isLoading={isFetching}
          containerStyle={styles.skeleton}
          layout={[
            { key: 'image', ...styles.image },
            { key: 'title', ...styles.title, height: 20, width: 220, margin: 6 },
            { key: 'price', ...styles.price, height: 20, width: 220, margin: 6 },
            { key: 'email', ...styles.price, height: 20, width: 220, margin: 6 },
          ]}>
            <Animated.Image source={{ uri: `${API_URL}/${product?.images[0].url}` }} style={styles.image} sharedTransitionTag="tag" />
            <Text style={[styles.title, { color: colors.text }]}>{productTitle}</Text>
            <Text style={[styles.price, { color: colors.text }]}>${product?.price}</Text>
            <Text style={[styles.description, { color: colors.text }]}>{product?.description}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${product?.user?.email}`)}>
              <Text style={[styles.body, { color: colors.text }]}>Press to send email to the owner:{product?.user?.email}</Text>
            </TouchableOpacity>
            <View style={styles.counter}>
              <Counter count={count} onIncrementCount={onIncrementCount} onDecreaseCount={onDecreaseCount} />
            </View>

            {isProductOwner ?
              <View syle={styles.button}>
                <Button title={deleteProductMutation.isPending ? 'Loading...' : 'Delete product'} onPress={deleteProduct} />
              </View>
              : null}
        </Skeleton>
      </ScrollView>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  skeleton: {
    flex: 1,
  },
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
  body: {
    fontSize: 16,
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
  button: {
    marginTop: 70,
  },
  counter: {
    marginTop: 16,
    width: '30%',
  },
});
