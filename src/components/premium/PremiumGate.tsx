import React, { useCallback } from 'react';
import { useFeatureAccess } from '@/hooks/usePremium';
import { useUpgradeModal } from '@/hooks/useUpgradeModal';

interface PremiumGateProps {
  children?: React.ReactNode;
  feature: string;
  variant?: 'blur' | 'soft' | 'limit';
  limitCurrent?: number;
  limitMax?: number;
}

export function PremiumGate({ 
  children, 
  feature, 
  variant = 'blur', 
  limitCurrent, 
  limitMax 
}: PremiumGateProps) {
  const { canAccess, isLoading, isPremium, currentUsage, limit, trackUsage } = useFeatureAccess(feature);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (canAccess) {
    React.useEffect(() => {
      trackUsage();
    }, [trackUsage]);
    
    return <>{children}</>;
  }

  switch (variant) {
    case 'blur':
      return (
        <div className="relative">
          <div 
            className="filter blur-[6px] pointer-events-none"
            style={{ filter: 'blur(6px)' }}
          >
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm mx-4">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature}
              </h3>
              <p className="text-gray-600 mb-6">
                {isPremium 
                  ? `You've reached your ${feature} limit. Upgrade for more.`
                  : 'This feature requires a Premium subscription'}
              </p>
              <UpgradeButton />
            </div>
          </div>
        </div>
      );

    case 'soft':
      return (
        <div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">✨</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">{feature}</span> is a Premium feature —{' '}
                  <UpgradeButton inline />
                </p>
              </div>
            </div>
          </div>
          {children}
        </div>
      );

    case 'limit':
      const current = limitCurrent ?? currentUsage;
      const max = limitMax ?? limit;
      const percentage = max > 0 ? (current / max) * 100 : 0;
      
      return (
        <div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {current} of {max} {feature.toLowerCase()} used {!isPremium && '(Free plan)'}
              </span>
              <UpgradeButton inline small />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
          {children}
        </div>
      );

    default:
      return <>{children}</>;
  }
}

function UpgradeButton({ inline = false, small = false }: { inline?: boolean; small?: boolean }) {
  const openUpgradeModal = useCallback(() => {
    const { openUpgradeModal: openModal } = useUpgradeModal.getState();
    openModal();
  }, []);

  if (inline) {
    return (
      <button
        onClick={openUpgradeModal}
        className="font-medium underline text-yellow-700 hover:text-yellow-800"
      >
        Upgrade to unlock full access
      </button>
    );
  }

  return (
    <button
      onClick={openUpgradeModal}
      className={`bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors ${
        small ? 'px-4 py-1.5 text-sm' : 'px-6 py-3'
      }`}
    >
      Upgrade to Premium →
    </button>
  );
}

/*
Example usage:

// Blur variant (default) - completely blurs content and shows upgrade overlay
<PremiumGate feature="Advanced Analytics">
  <AnalyticsDashboard />
</PremiumGate>

// Soft variant - shows banner but allows interaction
<PremiumGate feature="AI Assistant" variant="soft">
  <AIChatInterface />
</PremiumGate>

// Limit variant - shows usage progress bar
<PremiumGate 
  feature="Custom Collections" 
  variant="limit" 
  limitCurrent={2} 
  limitMax={3}
>
  <CollectionsList />
</PremiumGate>
*/
