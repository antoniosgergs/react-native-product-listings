import { create } from 'zustand';

const useAuthStore = create(
      (set) => ({
          accessToken: null,
          expiresIn: null,
          email: null,
          setAuth: ({ accessToken, expiresIn }) =>
              set({ accessToken, expiresIn }),
          setEmail: ({ email }) =>
          set({ email }),
          clearAuth: () => set({ accessToken: null, expiresIn: null }),
          clearEmail: () => set({ email:null }),
      })
);

export default useAuthStore;
