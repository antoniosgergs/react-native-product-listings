import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import client from '../api/client';
import {productsApi} from '../api/productsApi';
import {Alert} from 'react-native';
import {queryClient} from '../api/queryClient';

const useProducts = ({productId, enabled = false}) => {
  const getProducts = async (pageParam = 1) => {
    const result = await client().get(`${productsApi}?page=${pageParam}`);
    return result.data;
  };

  const getProductsQuery = useInfiniteQuery({
    enabled: enabled,
    queryKey: ['products'],
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
    queryKey: ['product'],
    queryFn: getProductById,
    enabled: productId ? true : false,
  });

  const addProductFn = async (product) => {
    const formData = new FormData();

    formData.append('title', product.title);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('location', JSON.stringify({'name':'Dummy Place','longitude':35.12345,'latitude':33.56789}));

    if(product.images){
      const image = {
        uri: product.images.uri,
        type: product.images.type,
        name: product.images.fileName,
      };

     formData.append('images', image);
    }

    return await client().post(productsApi, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const onSuccessAddProduct = () => {
    queryClient.invalidateQueries(['products']);
    Alert.alert('Product added successfully');
  };

  const onErrorAddProduct = (error) => {
    Alert.alert(error?.response?.data?.error?.message || 'Error occurred');
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

    if (product.images) {
      const image = {
        uri: product.images.uri,
        type: product.images.type,
        name: product.images.fileName,
      };

      formData.append('images', image);
    }

    return await client().put(`${productsApi}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const onSuccessEditProduct = () => {
    Alert.alert('Product edited successfully');
  };

  const onErrorEditProduct = (error) => {
    Alert.alert(error?.response?.data?.error?.message || 'Error occurred');
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
    Alert.alert('Product deleted successfully');
  };

  const onErrorDeleteProduct = (error) => {
    Alert.alert(error?.response?.data?.error?.message || 'Error occurred');
  };

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductFn,
    onSuccess: onSuccessDeleteProduct,
    onError: onErrorDeleteProduct,
  });


  return {getProductsQuery, getProductByIdQuery, addProductMutation,editProductMutation,deleteProductMutation};
};

export default useProducts;
