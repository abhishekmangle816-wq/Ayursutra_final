import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosClient from '../api/axiosClient';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user, isAuthenticated: true }),
      
      login: async (email, password) => {
        const response = await axiosClient.post('accounts/login/', { email, password });
        set({ accessToken: response.data.access, refreshToken: response.data.refresh });
        await get().fetchUser();
      },

      logout: () => {
        const refresh = get().refreshToken;
        if(refresh) {
            // Optional: call API to blacklist token
            axiosClient.post('accounts/logout/', { refresh }).catch(e=>e);
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        window.location.href = '/login';
      },

      fetchUser: async () => {
        try {
          const response = await axiosClient.get('accounts/me/');
          set({ user: response.data, isAuthenticated: true });
        } catch (error) {
          get().logout();
        }
      }
    }),
    {
      name: 'ayursutra-auth',
    }
  )
);

export default useAuthStore;
