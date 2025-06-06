import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import {useTheme} from '../context/ThemeContext';
import useAuth from '../hooks/useAuth';
import useProfile from '../hooks/useProfile';
import {normalize} from '../utils/responsive';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {z} from 'zod';
import {API_URL} from '../utils/constants';
import AppTextInput from '../components/atoms/textInput/AppTextInput';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  profileImage: z.string(),
  newProfileImage: z.object({
    fileName: z.string(),
    uri: z.string(),
    type: z.string(),
  }),
});

const UserProfile = () => {
  const { colors } = useTheme();
  const {onLogout} = useAuth();
  const navigation = useNavigation();

  const {getUserQuery,updateUserMutation} = useProfile();
  const {isPending, data} = getUserQuery;
  const {mutate} = updateUserMutation;
  const {data: user} = data ?? {};

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      profileImage: '',
      email: '',
      newProfileImage:{
        fileName: '',
        uri: '',
        type: '',
      },
    },
  });

  useEffect(() => {
    if(user) {
      reset({
        firstName: user?.user?.firstName || '',
        lastName: user?.user?.lastName || '',
        profileImage: user?.user?.profileImage?.url || '',
        email: user?.user?.email || '',
        newProfileImage: {
          fileName: '',
          uri: '',
          type: '',
        },
      });
    }
  }, [user,reset]);

  const onSubmit = useCallback(({firstName, lastName,newProfileImage}) => {
    mutate({firstName, lastName,profileImage:newProfileImage});
  }, [mutate]);

  const isLoadingUpdate = updateUserMutation.isPending;

  useLayoutEffect(() => {
    const getHeaderRight = () => (
      <View style={styles.header}>
        {isLoadingUpdate ? <ActivityIndicator/> : (
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Ionicons name={'save-outline'} size={36} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onLogout}>
          <Ionicons name={'log-out-outline'} size={36} />
        </TouchableOpacity>
      </View>
    );

    navigation.setOptions({
      headerRight: getHeaderRight,
    });
  }, [handleSubmit, navigation, onLogout, onSubmit, isLoadingUpdate]);

  const addUserImageFromGallery =  () => {
      launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      }).then((result) => {
        setValue('newProfileImage', result?.assets?.[0]);
      }).catch((error) => {
        crashlytics().recordError(error);
      });
  };

  const addUserImageFromCamera = () => {
    launchCamera().then(result=>{
        setValue('newProfileImage', result?.assets?.[0]);
      }).catch((error) => {
        crashlytics().recordError(error);
    });
  };

  const onAddImage = () => {
    Alert.alert('Add image', 'Choose how you want to add your profile image', [
      {
        text: 'Add from gallery',
        onPress: addUserImageFromGallery,
        isPreferred: true,
      },
      {
        text: 'Add from camera',
        onPress: addUserImageFromCamera,
      },
    ],{
      cancelable: true,
    });
  };

  const profileImage = watch('profileImage')?.uri || watch('newProfileImage')?.uri;

   return (
     <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
       <Skeleton
         isLoading={false}
         containerStyle={styles.skeleton}
         layout={[
           { key: 'image', ...styles.image, ...styles.imageProfile },
           { key: 'firstName', ...styles.title, height: 20, width: 220, margin: 6 },
           { key: 'lastName', ...styles.title, height: 20, width: 220, margin: 6 },
           { key: 'email', ...styles.price, height: 20, width: 220, margin: 6 },
         ]}>
         <View style={styles.imageContainer}>
           <View style={styles.imageProfile}>
             {profileImage
               ? <Image source={{ uri: watch('newProfileImage')?.uri ?  watch('newProfileImage').uri : `${API_URL}/${watch('profileImage')}` }} style={styles.image} />
               : <TouchableOpacity onPress={onAddImage} style={[styles.image, styles.emptyImage, { backgroundColor:colors.borderColor }]}>
                 <Ionicons name={'add-outline'} size={36} />
                 <Text>Add image</Text>
               </TouchableOpacity>
             }
           </View>
         </View>

         <AppTextInput placeholder={'First name'} value={watch('firstName')} error={errors.firstName} onChangeText={(text) => setValue('firstName', text)}  />

         <AppTextInput placeholder={'Last name'} value={watch('lastName')} error={errors.lastName} onChangeText={(text) => setValue('lastName', text)}  />

         <Text style={[styles.email, { color: colors.text }]}>Email: {watch('email')}</Text>
       </Skeleton>
     </ScrollView>
   );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  skeleton: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  email:{
    marginBottom: normalize(10),
  },
  imageContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(10),
  },
  imageProfile:{
    borderRadius: '50%',
    overflow: 'hidden',
  },
  image: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  emptyImage:{
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserProfile;
