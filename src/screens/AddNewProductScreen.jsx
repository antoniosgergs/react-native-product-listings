import {
  ActivityIndicator,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import {useTheme} from '../context/ThemeContext';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {launchImageLibrary} from 'react-native-image-picker';
import {z} from 'zod';
import {normalize} from '../utils/responsive';
import useProducts from '../hooks/useProducts';
import AppTextInput from '../components/atoms/textInput/AppTextInput';

const screenWidth = Dimensions.get('window').width;

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(1, 'Price is required'),
  images: z.array(
    z.object({
      fileName: z.string(),
      uri: z.string(),
      type: z.string(),
    })
  ).min(1, 'Image is required'),
});

const AddNewProductScreen = () =>{
  const { colors } = useTheme();
  const navigation = useNavigation();
  const {addProductMutation} = useProducts({enabled:false});
  const {mutate, isSuccess, isPending} = addProductMutation;

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      images: [],
    },
  });

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  },[isSuccess, reset]);

  const onSubmit = useCallback(({title, description, price, images}) => {
    mutate({title, description, price,images});
  }, [mutate]);

  useLayoutEffect(() => {
    const getHeaderRight = () => {
      if(isPending) {
        return <ActivityIndicator />;
      }
      else {
        return (
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Ionicons name={'save-outline'} size={36} />
          </TouchableOpacity>
        );
      }
    };

    navigation.setOptions({
      headerRight: getHeaderRight,
    });
  }, [navigation, handleSubmit, onSubmit, isPending]);

  const images = watch('images');

  const addProductImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if(result?.assets){
        setError('images', {message: ''});
        setValue('images', [...images, result?.assets?.[0]]);
      }

    } catch (error) {
      crashlytics().recordError(error);
    }
  };

  // Adding uri:1 to allow user to add an image
  const tempImages = [...images, {uri:'1'}];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <AppTextInput placeholder={'Name'} error={errors.title} onChangeText={(text) => setValue('title', text)}  />

      <AppTextInput multiline numberOfLines={4} placeholder={'Description'} error={errors.description} onChangeText={(text) => setValue('description', text)}  />

      <AppTextInput keyboardType={'number-pad'} placeholder={'Price'} error={errors.price} onChangeText={(text) => setValue('price', +text)}  />

      {tempImages.map((image) => {
        const { uri } = image ?? {};

        if (uri === '1') {
          return (
            <TouchableOpacity onPress={addProductImage} key={uri} style={[styles.image, styles.emptyImage, { backgroundColor:colors.borderColor, width: screenWidth - (16 * 2) }]}>
              <Ionicons name={'add-outline'} size={36} />
              <Text>Add image</Text>
            </TouchableOpacity>
          );
        } else {
          return <Image source={{ uri }} style={[styles.image]} key={uri} />;
        }
      })}
      {errors.images && <Text style={styles.error}>{errors.images.message}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: normalize(24),
    marginBottom: normalize(20),
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: normalize(300),
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  emptyImage:{
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(62),
    marginTop: normalize(5),
  },
  error: {
    color: 'red',
    marginBottom: normalize(10),
  },
});


export default AddNewProductScreen;
