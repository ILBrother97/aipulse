import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUpgradeModal } from '@/hooks/useUpgradeModal';
import { useAuthStore } from '@/stores/authStore';
import { Sparkles } from 'lucide-react';

export function UpgradeModal() {
  const { isOpen, closeUpgradeModal } = useUpgradeModal();
  const { user } = useAuthStore();

  const handleUpgrade = () => {
    const stripeUrl = `${import.meta.env.VITE_STRIPE_PAYMENT_LINK}?client_reference_id=${user?.id}`;
    window.open(stripeUrl, '_blank');
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={closeUpgradeModal}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-auto">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="upgrade-modal bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto my-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeUpgradeModal}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6" />
                  <span className="text-lg font-semibold">AIPulse Pro</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Enjoy an Ad-Free Experience
                </h2>
                <p className="text-violet-100 text-lg max-w-md mx-auto">
                  Support AIPulse and browse without interruptions. All features remain free for everyone!
                </p>
                
                <div className="mt-6">
                  <div className="text-4xl sm:text-5xl font-bold">
                    $4.99
                    <span className="text-xl sm:text-2xl font-normal text-violet-200"> / month</span>
                  </div>
                  <div className="inline-block bg-yellow-400 text-violet-900 px-4 py-1 rounded-full text-sm font-semibold mt-2">
                    $1 first month
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="max-w-md mx-auto text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">What You Get with Pro</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-center gap-3 text-gray-700">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-lg">100% Ad-free browsing experience</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-gray-700">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-lg">Faster page loading times</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-gray-700">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-lg">Support ongoing development</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-gray-700">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-lg">Priority customer support</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-8">
                    <p className="text-sm text-gray-600">
                      <strong>All features are free!</strong> Analytics, collections, themes, and AI assistant are available to everyone. Pro simply removes ads.
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleUpgrade}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
                  >
                    Upgrade to Pro →
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Cancel anytime · Secure payment by Stripe
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
