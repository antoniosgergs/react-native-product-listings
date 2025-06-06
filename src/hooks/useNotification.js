import {useCallback, useEffect} from 'react';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { getMessaging, getInitialNotification, requestPermission } from '@react-native-firebase/messaging';
import {APP_PREFIX} from '../utils/constants';

const useNotification = () => {
   const requestUserPermission =  useCallback(async() => {
     try{
       if(Platform.OS === 'android'){
         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
       }
       else {
         await requestPermission();
       }
     }
     catch(error) {
       crashlytics().recordError(error);
     }
  },[]);

  useEffect(() => {
    requestUserPermission();
  },[requestUserPermission]);

  // Handle deep link navigation on notification press
  useEffect(() => {
    const messagingInstance = getMessaging();

    getInitialNotification(messagingInstance).then(message => {
      if (message?.data?.productId) {
        Linking.openURL(`${APP_PREFIX}product/${message?.data?.productId}`);
      }
    }).catch((error) => {
      crashlytics().recordError(error);
    });
  }, []);
};

export default useNotification;
