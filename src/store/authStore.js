import { create } from 'zustand';

const useAuthStore = create(
      (set) => ({
          isLoggedIn:false,
          refreshToken: null,
          email: null,
          setAuth: ({ refreshToken, isLoggedIn }) => set({ refreshToken, isLoggedIn }),
          setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
          setEmail: ({ email }) => set({ email }),
          clearAuth: () => set({ refreshToken: null, email: null, isLoggedIn:false }),
      })
);

export default useAuthStore;
