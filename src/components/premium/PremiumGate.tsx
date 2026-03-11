import React from 'react';
import { usePremium } from '@/hooks/usePremium';

interface PremiumGateProps {
  children: React.ReactNode;
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
  const { isPremium, openUpgradeModal } = usePremium();

  if (isPremium) {
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
                This feature requires a Premium subscription
              </p>
              <button
                onClick={openUpgradeModal}
                className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Upgrade to Premium →
              </button>
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
                  <button
                    onClick={openUpgradeModal}
                    className="font-medium underline text-yellow-700 hover:text-yellow-800"
                  >
                    Upgrade to unlock full access
                  </button>
                </p>
              </div>
            </div>
          </div>
          {children}
        </div>
      );

    case 'limit':
      const current = limitCurrent ?? 0;
      const max = limitMax ?? 0;
      const percentage = max > 0 ? (current / max) * 100 : 0;
      
      return (
        <div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {current} of {max} collections used (Free plan)
              </span>
              <button
                onClick={openUpgradeModal}
                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                Upgrade for unlimited
              </button>
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
