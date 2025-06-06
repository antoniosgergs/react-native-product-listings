import { create } from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create(
  persist((set) => ({
      isLoggedIn:false,
      refreshToken: null,
      email: null,
      setAuth: ({ refreshToken, isLoggedIn }) => set({ refreshToken, isLoggedIn }),
      setEmail: ({ email }) => set({ email }),
      clearAuth: () => set({ refreshToken: null, email: null, isLoggedIn:false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        refreshToken: state.refreshToken,
        email: state.email,
      }),
    }
  )
);

export default useAuthStore;
