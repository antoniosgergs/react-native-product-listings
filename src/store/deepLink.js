import { create } from 'zustand';

const useDeepLink = create(
  (set) => ({
    deepLink:null,
    setDeepLink: (deepLink) => set({ deepLink }),
  })
);

export default useDeepLink;
