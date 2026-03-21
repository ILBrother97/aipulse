import { useCallback, useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUpgradeModal } from '@/hooks/useUpgradeModal';
import { validateUserUsage, incrementUsage, ValidationResponse } from '@/lib/api/usageValidation';

export interface UsePremiumReturn {
  isPremium: boolean;
  isLoading: boolean;
  openUpgradeModal: () => void;
}

export interface UseFeatureAccessReturn {
  canAccess: boolean;
  isLoading: boolean;
  isPremium: boolean;
  currentUsage: number;
  limit: number;
  promptUpgrade: () => void;
  trackUsage: () => Promise<void>;
}

export function usePremium(): UsePremiumReturn {
  const { isPremium, isLoading: authLoading } = useAuthStore();

  const openUpgradeModal = useCallback(() => {
    const { openUpgradeModal: openModal } = useUpgradeModal.getState();
    openModal();
  }, []);

  return {
    isPremium,
    isLoading: authLoading,
    openUpgradeModal,
  };
}

export function useFeatureAccess(feature: string): UseFeatureAccessReturn {
  const { user } = useAuthStore();
  const [validation, setValidation] = useState<ValidationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setValidation({
        canAccess: false,
        isPremium: false,
        currentUsage: 0,
        limit: 0,
      });
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const checkAccess = async () => {
      setIsLoading(true);
      try {
        const result = await validateUserUsage(user.id, feature);
        if (!cancelled) {
          setValidation(result);
        }
      } catch {
        if (!cancelled) {
          setValidation({
            canAccess: false,
            isPremium: false,
            currentUsage: 0,
            limit: 0,
          });
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [user, feature]);

  const promptUpgrade = useCallback(() => {
    console.log('Premium feature required:', feature);
  }, [feature]);

  const trackUsage = useCallback(async () => {
    if (!user || !validation?.canAccess) return;
    
    try {
      await incrementUsage(user.id, feature);
      setValidation(prev => prev ? {
        ...prev,
        currentUsage: prev.currentUsage + 1,
      } : prev);
    } catch (error) {
      console.error('Failed to track usage:', error);
    }
  }, [user, feature, validation]);

  return {
    canAccess: validation?.canAccess ?? false,
    isLoading,
    isPremium: validation?.isPremium ?? false,
    currentUsage: validation?.currentUsage ?? 0,
    limit: validation?.limit ?? 0,
    promptUpgrade,
    trackUsage,
  };
}

export function useFeatureAccessSimple(requiresPremium: boolean = true): {
  canAccess: boolean;
  promptUpgrade: () => void;
  isLoading: boolean;
} {
  const { isPremium, isLoading } = usePremium();

  const promptUpgrade = useCallback(() => {
    console.log('Premium feature required');
  }, []);

  return {
    canAccess: requiresPremium ? isPremium : true,
    promptUpgrade: requiresPremium && !isPremium ? promptUpgrade : () => {},
    isLoading,
  };
}
