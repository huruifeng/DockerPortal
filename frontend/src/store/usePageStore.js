import {create} from "zustand";

const usePageStore = create((set) => ({
  selectedPage: "home", // Default page
  setSelectedPage: (page) => set({ selectedPage: page }),
}));

export default usePageStore;
