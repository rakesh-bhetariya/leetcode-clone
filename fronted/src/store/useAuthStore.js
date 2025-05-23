import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check");
      console.log("checkauth response", res.data);
      set({ authUser: res.data.user });
    } catch (error) {
      // handle this catch part
      set({ isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ isSigninUp: true });
      const res = await axiosInstance.get("/auth/register", data);

      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      // handle this catch part
      set({ isSigninUp: false });
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.get("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      // handle the error and use toast to show this
    } finally {
      [
        // also handle this one
      ];
    }
  },
}));
