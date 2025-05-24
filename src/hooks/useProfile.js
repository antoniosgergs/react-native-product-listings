import {useMutation, useQuery} from '@tanstack/react-query';
import client from '../api/client';
import {userApi} from '../api/user';
import useAuthStore from '../store/authStore';
import {Alert} from 'react-native';

const useProfile = () => {
  const email = useAuthStore((state) => state.email);

  const getUser = async () => {
    const result = await client().get(userApi, {
      email,
    });

    return result.data;
  };

  const getUserQuery = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });

  const updateUserFn = async (user) => {
    const formData = new FormData();

    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);

    if (user?.profileImage?.uri) {
      const image = {
        uri: user.profileImage.uri,
        type: user.profileImage.type,
        name: user.profileImage.fileName,
      };

      formData.append('profileImage', image);
    }

    return await client().put(userApi, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const onSuccessUpdateUserFn = () => {
    Alert.alert('User updated');
  };

  const onErrorUpdateUserFn = (error) => {
    Alert.alert(error?.response?.data?.error?.message || 'Error occurred');
  };

  const updateUserMutation = useMutation({
    mutationFn: updateUserFn,
    onSuccess: onSuccessUpdateUserFn,
    onError: onErrorUpdateUserFn,
  });

  return {getUserQuery,updateUserMutation};
};

export default useProfile;
