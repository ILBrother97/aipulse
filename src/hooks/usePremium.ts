import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Return type for the usePremium hook
 */
export interface UsePremiumReturn {
  /** Whether the current user has premium access */
  isPremium: boolean;
  /** Whether the premium status is being loaded/fetched */
  isLoading: boolean;
  /** Opens the upgrade modal for non-premium users */
  openUpgradeModal: () => void;
}

/**
 * Hook to access and manage premium user status.
 * Provides premium status, loading state, and a function to open the upgrade modal.
 *
 * @returns {UsePremiumReturn} Object containing premium status, loading state, and modal control
 *
 * @example
 * ```tsx
 * import { usePremium } from '@/hooks/usePremium';
 *
 * function PremiumFeature() {
 *   const { isPremium, isLoading, openUpgradeModal } = usePremium();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   if (!isPremium) {
 *     return (
 *       <button onClick={openUpgradeModal}>
 *         Upgrade to Premium
 *       </button>
 *     );
 *   }
 *
 *   return <div>Premium content here</div>;
 * }
 * ```
 */
export function usePremium(): UsePremiumReturn {
  const { isPremium, isLoading: authLoading } = useAuthStore();

  const openUpgradeModal = useCallback(() => {
    // Dispatch a custom event that the app can listen for to show upgrade modal
    window.dispatchEvent(new CustomEvent('open-upgrade-modal'));
  }, []);

  return {
    isPremium,
    isLoading: authLoading,
    openUpgradeModal,
  };
}

/**
 * Hook to check if a feature is accessible based on premium status.
 * Returns the feature availability and a function to prompt upgrade if not available.
 *
 * @param {boolean} requiresPremium - Whether the feature requires premium access
 * @returns {object} Feature availability state and upgrade prompt function
 *
 * @example
 * ```tsx
 * import { useFeatureAccess } from '@/hooks/usePremium';
 *
 * function FeatureComponent() {
 *   const { canAccess, promptUpgrade } = useFeatureAccess(true);
 *
 *   const handleClick = () => {
 *     if (!canAccess) {
 *       promptUpgrade();
 *       return;
 *     }
 *     // Execute premium feature
 *   };
 *
 *   return <button onClick={handleClick}>Use Feature</button>;
 * }
 * ```
 */
export function useFeatureAccess(requiresPremium: boolean = true): {
  canAccess: boolean;
  promptUpgrade: () => void;
  isLoading: boolean;
} {
  const { isPremium, isLoading } = usePremium();

  const promptUpgrade = useCallback(() => {
    // This can be extended to show a modal or toast notification
    console.log('Premium feature required');
  }, []);

  return {
    canAccess: requiresPremium ? isPremium : true,
    promptUpgrade: requiresPremium && !isPremium ? promptUpgrade : () => {},
    isLoading,
  };
}
