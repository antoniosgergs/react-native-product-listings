import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, Switch} from 'react-native';
import Snackbar from 'react-native-snackbar';
import ProductCard from '../components/molecules/ProductCard';
import { useNavigation } from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import useProducts from '../hooks/useProducts';

export default function ProductListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [sortBy, setSortBy] = useState('');

  const {getProductsQuery} = useProducts({enabled:true, sortBy});
  const {isFetching, isRefetching, refetch, fetchNextPage,isFetchingNextPage, hasNextPage,isError, data} = getProductsQuery;

  const products = data?.pages[0]?.data ?? {};

  useEffect(() => {
    if(isError){
      Snackbar.show({
        text: 'Error occurred',
        textColor: 'red',
      });
    }
  },[isError]);

  const onProductPress = (item) => () => {
    navigation.navigate('ProductDetails',
      {
        productId: item._id,
      }
    );
  };

  const renderItem = ({item}) => (
    <ProductCard
      isLoading={false}
      item={item}
      onPress={onProductPress(item)}
    />
  );

  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const onSortByPrice = () => {
    setSortBy(prevState => prevState ? '' : 'price');
  };

  const ListHeaderComponent =
    <View style={styles.sort}>
     <Text>Sort by price</Text>
     <Switch value={sortBy === 'price'} onValueChange={onSortByPrice} />
    </View>;

  const ListFooterComponent = isFetchingNextPage ? <ActivityIndicator style={styles.footer} /> : null;

  const keyExtractor =  (item) => item._id;

  if (isFetching) {
    return (
      <View style={styles.container}>
        <ProductCard isLoading />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FlatList
          ListHeaderComponent={ListHeaderComponent}
          style={[styles.container, { backgroundColor: colors.background }]}
          data={products}
          refreshControl={<RefreshControl onRefresh={refetch} refreshing={isRefetching} />}
          keyExtractor={keyExtractor}
          ListEmptyComponent={<Text>No products found</Text>}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sort: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footer: {
    marginVertical: 20,
  },
});
