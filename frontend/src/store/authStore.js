import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/user/token/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          })

          if (!response.ok) {
            throw new Error('Login failed')
          }

          const data = await response.json()
          localStorage.setItem('access_token', data.access)
          localStorage.setItem('refresh_token', data.refresh)

          // Get user info
          const userResponse = await fetch('/api/user/me/', {
            headers: {
              'Authorization': `Bearer ${data.access}`,
            },
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            })
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/user/register/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          })

          if (!response.ok) {
            throw new Error('Registration failed')
          }

          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      checkAuth: async () => {
        const token = localStorage.getItem('access_token')
        if (!token) {
          set({ isAuthenticated: false, user: null })
          return
        }

        try {
          const response = await fetch('/api/user/me/', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            set({
              user: userData,
              isAuthenticated: true,
            })
          } else {
            get().logout()
          }
        } catch (error) {
          get().logout()
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

export default useAuthStore 