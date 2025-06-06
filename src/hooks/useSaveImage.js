import {PermissionsAndroid, Platform} from 'react-native';
import Snackbar from 'react-native-snackbar';
import RNBlobUtil from 'react-native-blob-util';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import crashlytics from '@react-native-firebase/crashlytics';

const useSaveImage = () => {
  const hasAndroidPermission = async () => {
    const getCheckPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return Promise.all([
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          (statuses) =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  };

  const saveImage = async (url) => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    RNBlobUtil.config({
      fileCache: true,
      appendExt: 'jpg',
    })
      .fetch('GET', url)
      .then((res) => {
        CameraRoll.save(res.path(), {type: 'photo'})
          .then(() => {
            Snackbar.show({
              text: 'Image saved successfully',
              textColor: 'green',
            });
          })
          .catch(error => {
            crashlytics().recordError(error);

            Snackbar.show({
              text: 'Unable to save image',
              textColor: 'red',
            });
          });
      })
      .catch((error) => {
        crashlytics().recordError(error);

        Snackbar.show({
          text: 'Unable to save image',
          textColor: 'red',
        });
      });
  };

  return {
    saveImage,
  };
};

export default useSaveImage;
