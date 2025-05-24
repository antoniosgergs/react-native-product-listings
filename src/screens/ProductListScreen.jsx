import React, {useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, RefreshControl, Alert, ActivityIndicator} from 'react-native';
import ProductCard from '../components/ProductCard';
import { useNavigation } from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import useProducts from '../hooks/useProducts';

export default function ProductListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const {getProductsQuery} = useProducts({enabled:true});
  const {isFetching, isRefetching, refetch, fetchNextPage,isFetchingNextPage, hasNextPage,isError, data} = getProductsQuery;

  const products = data?.pages[0]?.data ?? {};

  const refreshing = isFetching || isRefetching;

  useEffect(() => {
    if(isError){
      Alert.alert('Error occurred');
    }
  },[isError]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FlatList
          style={[styles.container, { backgroundColor: colors.background }]}
          data={products}
          refreshControl={<RefreshControl onRefresh={refetch} refreshing={refreshing} />}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text>No products found</Text>}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
             onPress={() =>  navigation.navigate('ProductDetails',
               {
                 productId: item._id,
               }
             )}
            />
          )}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
          }
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

});
