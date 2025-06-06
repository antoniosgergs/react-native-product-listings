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
  Share,
  Dimensions,
  FlatList,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {fonts} from '../utils/fonts';
import {useTheme} from '../context/ThemeContext';
import useProducts from '../hooks/useProducts';
import useAuthStore from '../store/authStore';
import {API_URL, APP_PREFIX} from '../utils/constants';
import Counter from '../components/molecules/Counter';
import useShoppingCart from '../store/shoppingCart';
import useSaveImage from '../hooks/useSaveImage';
import Button from '../components/atoms/button/Button';
import MapView, {Marker} from 'react-native-maps';

const ProductDetailsScreen = () => {
  const { colors } = useTheme();
  const route = useRoute();
  const {saveImage} = useSaveImage();
  const navigation = useNavigation();
  const { productId } = route.params;
  const email = useAuthStore((state) => state.email);
  const {getProductByIdQuery, deleteProductMutation} = useProducts({productId, enabled:false});
  const {isFetching, refetch, isRefetching, isError, data} = getProductByIdQuery;

  const {data: product} = data ?? {};

  const isProductOwner = email === product?.user?.email;

  const { shoppingCart, removeItemFromShoppingCart, addItemToShoppingCart } = useShoppingCart();
  const onIncrementCount = () => addItemToShoppingCart({item:product});
  const onDecreaseCount = () => removeItemFromShoppingCart({item:product});
  const count = shoppingCart.find((val) => val._id === productId)?.count ?? 0;

  const deleteProduct = () => {
    deleteProductMutation.mutate();
  };

  const onEditProduct = useCallback(()=>{
    navigation.navigate('EditProduct',{
      productId,
    });
  },[navigation, productId]);

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
      <>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={36} />
        </TouchableOpacity>

        {isProductOwner && (
          <TouchableOpacity onPress={onEditProduct}>
            <Ionicons name="pencil-outline" size={36} />
          </TouchableOpacity>
        )}
      </>
    );

    navigation.setOptions({
      headerRight: getHeaderRight,
    });
  }, [handleShare, isProductOwner, navigation, onEditProduct]);

  useEffect(() => {
    if(isError){
      Snackbar.show({
        text: 'Error occurred',
        textColor: 'red',
      });
    }
  },[isError]);

  const onSaveImage = (image) => () => {
    saveImage(image);
  };

  // 16 * 2 i want to remove the padding from the right and left
  const imageWidth = Dimensions.get('window').width - (16 * 2);

  const keyExtractor = (item) => item._id;

  const renderItem = ({ item }) => (
    <TouchableOpacity onLongPress={onSaveImage(`${API_URL}/${item.url}`)} style={[styles.imageContainer, { width: imageWidth }]}>
      <Animated.Image source={{ uri: `${API_URL}/${item.url}` }} style={[styles.image, { width: imageWidth }]} sharedTransitionTag="tag" />
    </TouchableOpacity>
  );

  return (
      <ScrollView refreshControl={<RefreshControl onRefresh={refetch} refreshing={isRefetching} />} contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Skeleton
          isLoading={isFetching}
          containerStyle={styles.skeleton}
          layout={[
            { key: 'image', ...styles.image, height: 350, width: '100%' },
            { key: 'title', ...styles.title, height: 20, width: 220, margin: 6 },
            { key: 'price', ...styles.price, height: 20, width: 220, margin: 6 },
            { key: 'email', ...styles.price, height: 20, width: 220, margin: 6 },
          ]}>
            <FlatList
              data={product?.images}
              horizontal
              pagingEnabled
              keyExtractor={keyExtractor}
              renderItem={renderItem}
            />

            <Text style={[styles.title, { color: colors.text }]}>{productTitle}</Text>
            <Text style={[styles.price, { color: colors.text }]}>${product?.price}</Text>
            <Text style={[styles.description, { color: colors.text }]}>{product?.description}</Text>

            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${product?.user?.email}`)}>
              <Text style={[styles.body, { color: colors.text }]}>Press to send email to the owner:{product?.user?.email}</Text>
            </TouchableOpacity>

            <View style={styles.counter}>
              <Counter count={count} onIncrementCount={onIncrementCount} onDecreaseCount={onDecreaseCount} />
            </View>

          {product?.location &&
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 33.8938,
                  longitude: 35.5018,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{ latitude: product.location.latitude, longitude: product.location.longitude }}
                />
              </MapView>
            }

            {isProductOwner &&
              <View style={styles.buttonContainer}>
                <Button isLoading={deleteProductMutation.isPending} onPress={deleteProduct}>
                  Delete product
                </Button>
              </View>
            }
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
  imageContainer:{
    height:350,
  },
  image: {
    height: '100%',
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
  counter: {
    marginVertical: 16,
    width: '30%',
  },
  map: {
    width:'100%',
    height:400,
  },
  buttonContainer:{
    marginTop: 8,
  },
});
