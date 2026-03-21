import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Zap, Clock, Copy, Sparkles, Lock } from 'lucide-react';
import { useUpgradeModal } from '@/hooks/useUpgradeModal';
import { cn } from '@/utils/cn';

interface WorkflowsPremiumButtonProps {
  className?: string;
}

const PREMIUM_FEATURES = [
  { icon: GitBranch, text: 'Unlimited Workflows', color: '#667eea' },
  { icon: Zap, text: 'Advanced Automation', color: '#764ba2' },
  { icon: Clock, text: 'Scheduled Workflows', color: '#667eea' },
  { icon: Copy, text: 'Workflow Templates', color: '#764ba2' },
];

export function WorkflowsPremiumButton({ className }: WorkflowsPremiumButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { openUpgradeModal } = useUpgradeModal();

  return (
    <motion.div
      className={cn('relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        onClick={openUpgradeModal}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="workflows-premium-fab"
        aria-label="Unlock Premium Workflows"
      >
        <span className="workflows-premium-fab__pulse" aria-hidden="true" />
        <span className="workflows-premium-fab__glow" aria-hidden="true" />
        <span className="workflows-premium-fab__icon">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
        </span>
        <span className="workflows-premium-fab__badge">PRO</span>
      </motion.button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="workflows-premium-fab__tooltip"
          >
            <div className="tooltip-header">
              <Sparkles className="w-4 h-4" />
              <span>Unlock Unlimited Workflows</span>
            </div>
            <div className="tooltip-features">
              {PREMIUM_FEATURES.map((feature, index) => (
                <div key={index} className="tooltip-feature">
                  <feature.icon className="w-3.5 h-3.5" style={{ color: feature.color }} />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            <div className="tooltip-cta">
              <span className="tooltip-price">
                <span className="price-old">$4.99</span>
                <span className="price-new">$1</span>
                <span className="price-period">/mo first month</span>
              </span>
              <button onClick={openUpgradeModal} className="tooltip-button">
                Upgrade Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface WorkflowsUpgradeInlineProps {
  className?: string;
}

export function WorkflowsUpgradeInline({ className }: WorkflowsUpgradeInlineProps) {
  const { openUpgradeModal } = useUpgradeModal();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('workflows-upgrade-inline', className)}
    >
      <div className="upgrade-inline__icon">
        <Lock className="w-5 h-5" />
      </div>
      <div className="upgrade-inline__content">
        <h3 className="upgrade-inline__title">Unlock Unlimited Workflows</h3>
        <p className="upgrade-inline__description">
          Create advanced automations, use templates, and schedule workflows.
        </p>
      </div>
      <div className="upgrade-inline__pricing">
        <span className="pricing-highlight">
          <span className="price-old">$4.99</span>
          <span className="price-new">$1</span>
        </span>
        <button onClick={openUpgradeModal} className="upgrade-inline__button">
          Upgrade
        </button>
      </div>
    </motion.div>
  );
}

export default WorkflowsPremiumButton;
