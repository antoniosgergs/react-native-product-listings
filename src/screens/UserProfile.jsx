import {ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '../context/ThemeContext';
import useAuthStore from '../store/authStore';
import useProfile from '../hooks/useProfile';
import {normalize} from '../utils/responsive';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {launchImageLibrary} from 'react-native-image-picker';
import {z} from 'zod';

const API_URL = 'https://backend-practice.eurisko.me';

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
  const { clearAuth } = useAuthStore();

  const {getUserQuery,updateUserMutation} = useProfile();
  const {isPending, data} = getUserQuery;
  const {mutate} = updateUserMutation;
  const {data: user} = data ?? {};

  const onLogout = () => {
    clearAuth();
  };

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

  const onSubmit = ({firstName, lastName,newProfileImage}) => {
    mutate({firstName, lastName,profileImage:newProfileImage});
  };

  const addUserImageFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      setValue('newProfileImage', result?.assets?.[0]);
    } catch {
    }
  };


  const profileImage = watch('profileImage') || watch('newProfileImage');

  if(isPending){
    return <ActivityIndicator />;
  }

   return (
     <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
       <TextInput value={watch('firstName')} placeholder="First name" placeholderTextColor={colors.inputText} style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]} onChangeText={(text) => setValue('firstName', text)} />
       {errors.firstName && <Text style={styles.error}>{errors.firstName.message}</Text>}

       <TextInput value={watch('lastName')} placeholder="Last name" placeholderTextColor={colors.inputText} style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.borderColor }]} onChangeText={(text) => setValue('lastName', text)} />
       {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}

       <Text style={[{ color: colors.text }]}>Email: {watch('email')}</Text>

       {profileImage && <Image source={{ uri: watch('newProfileImage')?.uri ?  watch('newProfileImage').uri: `${API_URL}/${watch('profileImage')}` }} style={styles.image} />}

       <View style={styles.button}>
         <Button title={'Add profile image from gallery'} onPress={addUserImageFromGallery} />
       </View>

       <View style={styles.button}>
         <Button title={updateUserMutation.isPending ? 'Loading...' : 'Update profile'} onPress={handleSubmit(onSubmit)} />
       </View>

       <Button title={'Logout'} onPress={onLogout} />
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
  },
});

export default UserProfile;
