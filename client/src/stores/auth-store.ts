import api from "@/apis/api";
import { AxiosError } from "axios";
import { create, StateCreator } from "zustand";

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  role: string;
}

interface Store {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const authStore: StateCreator<Store> = (set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/auth/me");

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        set({ user: null, isAuthenticated: false, isLoading: false });
      } else {
        console.error("Error checking auth:", error);
        set({ isLoading: false });
      }
    }
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },
});

const useAuthStore = create(authStore);

export default useAuthStore;
