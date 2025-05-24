import { create } from 'zustand';

const useAuthStore = create(
      (set) => ({
          accessToken: null,
          expiresIn: null,
          setAuth: ({ accessToken, expiresIn }) =>
              set({ accessToken, expiresIn }),
          clearAuth: () => set({ accessToken: null, expiresIn: null }),
      })
);

export default useAuthStore;
