import api from "@/apis/api";
import { AxiosError } from "axios";
import { create, StateCreator } from "zustand";

interface IBusiness {
  code: string;
  name: string;
  address: string;
}

interface Store {
  business: IBusiness | null;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
}

const authStore: StateCreator<Store> = (set) => ({
  business: null,
  isAuthenticated: false,
  checkAuth: async () => {
    try {
      const response = await api.get("/auth/me");

      set({
        business: response.data.business,
        isAuthenticated: true,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        set({ business: null, isAuthenticated: false });
      } else {
        console.error("Error checking auth:", error);
      }
    }
  },
});

const useAuthStore = create(authStore);

export default useAuthStore;
