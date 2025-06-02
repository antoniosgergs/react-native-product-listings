import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {launchImageLibrary} from 'react-native-image-picker';
import {z} from 'zod';
import {normalize} from '../utils/responsive';
import useProducts from '../hooks/useProducts';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(1, 'Price is required'),
  images: z.object({
    fileName: z.string(),
    uri: z.string(),
    type: z.string(),
  }),
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
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

  const addProductImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });


      setValue('images', result?.assets?.[0]);
    } catch {
    }
  };

  const images = watch('images');

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput placeholder="Name" placeholderTextColor={colors.inputText} style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]} onChangeText={(text) => setValue('title', text)} />
      {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

      <TextInput multiline numberOfLines={4} placeholder="Description" placeholderTextColor={colors.inputText} style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]} onChangeText={(text) => setValue('description', text)} />
      {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}

      <TextInput keyboardType={'number-pad'} placeholder="Price" placeholderTextColor={colors.inputText} style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]} onChangeText={(text) => setValue('price', +text)} />
      {errors.price && <Text style={styles.error}>{errors.price.message}</Text>}

      {images?.uri && <Image source={{ uri: images.uri }} style={styles.image} />}

      <View style={styles.button}>
        <Button title={'Add image'} onPress={addProductImage} />
      </View>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: normalize(10),
    marginBottom: normalize(10),
    borderRadius: normalize(5),
  },
  error: {
    color: 'red',
    marginBottom: normalize(10) },
  image: {
    width: '100%',
    height: normalize(300),
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button:{
    marginTop: normalize(9),
    marginBottom: normalize(70),
  }
});


export default AddNewProductScreen;
