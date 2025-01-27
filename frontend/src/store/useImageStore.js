import {create} from 'zustand';
import { persist } from 'zustand/middleware'; // Import the persist middleware

const useImageStore = create(
  persist(
    (set) => ({
      selectedImage: null,
      setSelectedImage: (image) => set({ selectedImage: image }),
      clearSelectedImage: () => set({ selectedImage: null }),
    }),
    {
      name: 'image-store', // name of the key in localStorage
      getStorage: () => localStorage, // use localStorage for persistence
    }
  )
);

export default useImageStore;

