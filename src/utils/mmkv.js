import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'mmkv.default',
  encryptionKey: 'My-Encrypt-Key',
});
