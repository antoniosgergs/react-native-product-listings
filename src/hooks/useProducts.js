import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import Snackbar from 'react-native-snackbar';
import {useNavigation} from '@react-navigation/native';
import client from '../api/client';
import {productsApi} from '../api/productsApi';
import {queryClient} from '../api/queryClient';

const useProducts = ({productId, sortBy, enabled = false}) => {
  const navigation = useNavigation();

  const getProducts = async (pageParam = 1) => {
    const params = {
      page: pageParam,
    };

    if(sortBy){
      params.sortBy = sortBy;
    }

    const result = await client().get(productsApi, {
      params,
    });

    return result.data;
  };

  const getProductsQuery = useInfiniteQuery({
    enabled: enabled,
    queryKey: ['products', sortBy],
    queryFn: ({pageParam}) => getProducts(pageParam),
    getNextPageParam: lastPage => {
      if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
  });

  const getProductById = async () => {
    const result = await client().get(`${productsApi}/${productId}`);
    return result.data;
  };

  const getProductByIdQuery = useQuery({
    queryKey: ['product',  productId],
    queryFn: getProductById,
    enabled: productId ? true : false,
  });

  const addProductFn = async (product) => {
    const formData = new FormData();

    formData.append('title', product.title);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('location', JSON.stringify({'name':'Dummy Place','longitude':35.12345,'latitude':33.56789}));

    if(product?.images?.length > 0) {
      product.images.forEach(image => {
        if(image.uri !== '-1'){
          formData.append('images', {
            uri: image.uri,
            type: image.type,
            name: image.fileName,
          });
        }
      });
    }

    return await client().post(productsApi, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const onSuccessAddProduct = () => {
    navigation.navigate('Home');

    queryClient.invalidateQueries(['products']);

    Snackbar.show({
      text: 'Product added successfully',
      textColor: 'green',
    });
  };

  const onErrorAddProduct = (error) => {
    Snackbar.show({
      text: error?.response?.data?.error?.message || 'Error occurred',
      textColor: 'red',
    });
  };

  const addProductMutation = useMutation({
    mutationFn: addProductFn,
    onSuccess: onSuccessAddProduct,
    onError: onErrorAddProduct,
  });

  const editProductFn = async (product, id) => {
    const formData = new FormData();

    formData.append('title', product.title);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('location', JSON.stringify({'name': 'Dummy Place', 'longitude': 35.12345, 'latitude': 33.56789}));

    if(product?.images?.length > 0) {
      product.images.forEach(image => {
        if(image.uri !== '-1'){
          formData.append('images', {
            uri: image.uri,
            type: image.type,
            name: image.fileName,
          });
        }
      });
    }

    return await client().put(`${productsApi}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const onSuccessEditProduct = () => {
    queryClient.invalidateQueries(['products', productId]);

    navigation.goBack();

    Snackbar.show({
      text: 'Product edited successfully',
      textColor: 'green',
    });
  };

  const onErrorEditProduct = (error) => {
    Snackbar.show({
      text: error?.response?.data?.error?.message || 'Error occurred',
      textColor: 'red',
    });
  };

  const editProductMutation = useMutation({
    mutationFn: editProductFn,
    onSuccess: onSuccessEditProduct,
    onError: onErrorEditProduct,
  });

  const deleteProductFn = async (id) => {
    return await client().delete(`${productsApi}/${id}`);
  };

  const onSuccessDeleteProduct = () => {
    Snackbar.show({
      text: 'Product deleted successfully',
      textColor: 'green',
    });
  };

  const onErrorDeleteProduct = (error) => {
    Snackbar.show({
      text: error?.response?.data?.error?.message || 'Error occurred',
      textColor: 'red',
    });
  };

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductFn,
    onSuccess: onSuccessDeleteProduct,
    onError: onErrorDeleteProduct,
  });


  return {getProductsQuery, getProductByIdQuery, addProductMutation,editProductMutation,deleteProductMutation};
};

export default useProducts;
