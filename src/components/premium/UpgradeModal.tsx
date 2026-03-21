import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUpgradeModal } from '@/hooks/useUpgradeModal';
import { useAuthStore } from '@/stores/authStore';

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
              className="upgrade-modal bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="upgrade-modal-content flex flex-col lg:flex-row h-full">
                {/* Left Panel */}
                <div className="upgrade-modal-left bg-violet-700 text-white p-6 sm:p-8 lg:p-12 flex-1">
                  <div className="max-w-md mx-auto">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                      Upgrade to AIPulse Premium
                    </h2>
                    
                    <div className="mb-6 sm:mb-8">
                      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                        $4.99
                        <span className="text-lg sm:text-xl lg:text-2xl font-normal text-violet-200"> / month</span>
                      </div>
                      <div className="inline-block bg-yellow-400 text-violet-900 px-3 py-1 rounded-full text-sm font-semibold">
                        $1 first month
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-green-400 text-lg sm:text-xl">✓</span>
                        <span className="text-base sm:text-lg">Unlimited Collections</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-green-400 text-lg sm:text-xl">✓</span>
                        <span className="text-base sm:text-lg">Advanced Analytics & exports</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-green-400 text-lg sm:text-xl">✓</span>
                        <span className="text-base sm:text-lg">Unlimited Workflows</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-green-400 text-lg sm:text-xl">✓</span>
                        <span className="text-base sm:text-lg">AI Assistant & Recommendations</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-green-400 text-lg sm:text-xl">✓</span>
                        <span className="text-base sm:text-lg">All Themes & Customization</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-green-400 text-lg sm:text-xl">✓</span>
                        <span className="text-base sm:text-lg">Priority support</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="upgrade-modal-right bg-white p-6 sm:p-8 lg:p-12 flex-1 relative">
                  {/* Close Button */}
                  <button
                    onClick={closeUpgradeModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">What you get</h3>
                    
                    {/* Feature Cards */}
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-1">Unlimited Collections</h4>
                        <p className="text-sm text-gray-600">Create as many collections as you need to organize your AI tools perfectly.</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-1">Advanced Analytics</h4>
                        <p className="text-sm text-gray-600">Deep insights into your tool usage, export data, and track productivity trends.</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-1">AI Assistant</h4>
                        <p className="text-sm text-gray-600">Get personalized recommendations and help finding the perfect AI tools for your needs.</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-1">Priority Support</h4>
                        <p className="text-sm text-gray-600">Get faster response times and dedicated support from our team.</p>
                      </div>
                    </div>

                    {/* CTA Button - Always visible */}
                    <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100">
                      <button
                        onClick={handleUpgrade}
                        className="upgrade-cta w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-lg transition-colors text-base sm:text-lg"
                      >
                        Start for $1 →
                      </button>

                      {/* Fine Print */}
                      <p className="text-xs text-gray-500 text-center mt-3 sm:mt-4">
                        Cancel anytime · Secure payment by Stripe
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
