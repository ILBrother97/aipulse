import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuthStore } from '../stores/authStore'

interface PremiumContextValue {
  isPremium: boolean | null
  isLoading: boolean
  isAdFree: boolean
}

const PremiumContext = createContext<PremiumContextValue>({
  isPremium: null,
  isLoading: true,
  isAdFree: false
})

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { isPremium, isLoading: authLoading, fetchProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false)
    }
  }, [authLoading])

  useEffect(() => {
    fetchProfile()
  }, [])

  // isPremium now means "ad-free user" - all features are free for everyone
  const isAdFree = isPremium === true

  return (
    <PremiumContext.Provider value={{ isPremium, isLoading, isAdFree }}>
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  return useContext(PremiumContext)
}
