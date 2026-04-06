import React from 'react';

interface PremiumGateProps {
  children?: React.ReactNode;
  feature?: string;
  variant?: 'blur' | 'soft' | 'limit';
  limitCurrent?: number;
  limitMax?: number;
}

// All features are now free - this component simply renders children
// Premium is now only for ad-free experience
export function PremiumGate({ 
  children
}: PremiumGateProps) {
  // All features are free for everyone - no gating
  return <>{children}</>;
}
