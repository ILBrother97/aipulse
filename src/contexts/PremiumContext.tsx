import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuthStore } from '../stores/authStore'

interface PremiumContextValue {
  isPremium: boolean | null
  isLoading: boolean
  canUseFeature: (feature: string) => boolean
}

const PremiumContext = createContext<PremiumContextValue>({
  isPremium: null,
  isLoading: true,
  canUseFeature: () => false
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

  const canUseFeature = (feature: string): boolean => {
    if (isPremium === null) return false
    if (isPremium) return true
    
    const freeLimits: Record<string, number> = {
      ai_queries: 1,
      collections: 3,
      workflows: 1
    }
    
    return true // Client-side check - server will validate
  }

  return (
    <PremiumContext.Provider value={{ isPremium, isLoading, canUseFeature }}>
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  return useContext(PremiumContext)
}
