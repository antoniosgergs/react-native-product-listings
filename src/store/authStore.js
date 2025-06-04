import { create } from 'zustand';

const useAuthStore = create(
      (set) => ({
          isLoggedIn:false,
          expiresIn: null,
          email: null,
          setAuth: ({ expiresIn, isLoggedIn }) => set({ expiresIn, isLoggedIn }),
          setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
          setEmail: ({ email }) => set({ email }),
          clearAuth: () => set({ expiresIn: null, email: null, isLoggedIn:false }),
      })
);

export default useAuthStore;
