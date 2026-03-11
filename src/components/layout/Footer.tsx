import { ExternalLink, ChevronRight, BarChart3, Workflow, Home, BookOpen, FileText, GraduationCap, LifeBuoy, Info, Shield, FileCheck, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToolsStore } from '../../stores/toolsStore';

type PageLink = { name: string; page: 'home' | 'analytics' | 'workflows' | 'settings'; icon: React.ElementType; settingsTab?: string; highlight?: 'collections' };
type ExternalLinkType = { name: string; href: string; icon: React.ElementType };
type LinkItem = PageLink | ExternalLinkType;

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentPage } = useToolsStore();

  const isResourcePage = ['/docs', '/api', '/guides', '/support'].includes(location.pathname);

  const footerLinks = {
    product: [
      { name: 'Features', page: 'home' as const, icon: Home, settingsTab: undefined },
      { name: 'Collections', page: 'home' as const, icon: BarChart3, settingsTab: undefined, highlight: 'collections' as const },
      { name: 'Analytics', page: 'analytics' as const, icon: BarChart3 },
      { name: 'Workflows', page: 'workflows' as const, icon: Workflow },
    ] as LinkItem[],
    resources: [
      { name: 'Documentation', href: '/docs', icon: BookOpen },
      { name: 'API Reference', href: '/api', icon: FileText },
      { name: 'Guides', href: '/guides', icon: GraduationCap },
      { name: 'Support', href: '/support', icon: LifeBuoy },
    ] as LinkItem[],
    company: [
      { name: 'About', page: 'settings' as const, icon: Info, settingsTab: 'about' },
      { name: 'Privacy Policy', page: 'settings' as const, icon: Shield, settingsTab: 'privacy' },
      { name: 'Terms of Service', page: 'settings' as const, icon: FileCheck, settingsTab: 'terms' },
      { name: 'Contact', page: 'settings' as const, icon: MessageSquare },
    ] as LinkItem[],
  };

  const handleNavigation = (link: PageLink) => {
    if (isResourcePage) {
      navigate('/');
      setTimeout(() => {
        setCurrentPage(link.page);
        // Store the settings tab preference in sessionStorage for SettingsPage to read
        if (link.settingsTab) {
          sessionStorage.setItem('settingsActiveTab', link.settingsTab);
        }
        // Store highlight preference for home page
        if (link.highlight) {
          sessionStorage.setItem('homeHighlight', link.highlight);
        }
      }, 100);
    } else {
      setCurrentPage(link.page);
      // Store the settings tab preference in sessionStorage for SettingsPage to read
      if (link.settingsTab) {
        sessionStorage.setItem('settingsActiveTab', link.settingsTab);
      }
      // Store highlight preference for home page
      if (link.highlight) {
        sessionStorage.setItem('homeHighlight', link.highlight);
      }
    }
  };

  const linkVariants = {
    hover: {
      x: 4,
      transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const iconVariants = {
    hover: {
      rotate: 5,
      scale: 1.1,
      transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }
    }
  };

  return (
    <footer className="relative bg-white dark:bg-background-dark">
      {/* Dynamic Energy Flow Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <img 
          src="/energy-line.svg" 
          alt="" 
          className="w-full h-full object-cover opacity-80"
        />
      </div>
      
      {/* Regular Border */}
      <div className="border-t border-border" />
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Product Links */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-4"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-text-primary uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-accent" />
                Product
              </h3>
            </motion.div>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {'page' in link ? (
                    <motion.button
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleNavigation(link)}
                      className="text-sm text-text-secondary dark:text-text-mutedDark hover:text-accent transition-colors duration-200 inline-flex items-center gap-2 group w-full text-left"
                    >
                      <motion.div
                        variants={iconVariants}
                        className="w-4 h-4 flex items-center justify-center"
                      >
                        <link.icon className="w-4 h-4" />
                      </motion.div>
                      <span>{link.name}</span>
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </motion.div>
                    </motion.button>
                  ) : (
                    <motion.button
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => navigate(link.href)}
                      className="text-sm text-text-secondary dark:text-text-mutedDark hover:text-accent transition-colors duration-200 inline-flex items-center gap-2 group w-full text-left cursor-pointer"
                    >
                      <motion.div
                        variants={iconVariants}
                        className="w-4 h-4 flex items-center justify-center"
                      >
                        <link.icon className="w-4 h-4" />
                      </motion.div>
                      <span>{link.name}</span>
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </motion.div>
                    </motion.button>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-4"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-text-primary uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                Resources
              </h3>
            </motion.div>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {'page' in link ? (
                    <motion.button
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleNavigation(link)}
                      className="text-sm text-text-secondary dark:text-text-mutedDark hover:text-accent transition-colors duration-200 inline-flex items-center gap-2 group w-full text-left"
                    >
                      <motion.div
                        variants={iconVariants}
                        className="w-4 h-4 flex items-center justify-center"
                      >
                        <link.icon className="w-4 h-4" />
                      </motion.div>
                      <span>{link.name}</span>
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </motion.div>
                    </motion.button>
                  ) : (
                    <motion.button
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => navigate(link.href)}
                      className="text-sm text-text-secondary dark:text-text-mutedDark hover:text-accent transition-colors duration-200 inline-flex items-center gap-2 group w-full text-left cursor-pointer"
                    >
                      <motion.div
                        variants={iconVariants}
                        className="w-4 h-4 flex items-center justify-center"
                      >
                        <link.icon className="w-4 h-4" />
                      </motion.div>
                      <span>{link.name}</span>
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </motion.div>
                    </motion.button>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-4"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-accent" />
                Company
              </h3>
            </motion.div>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {'page' in link ? (
                    <motion.button
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleNavigation(link)}
                      className="text-sm text-text-secondary dark:text-text-mutedDark hover:text-accent transition-colors duration-200 inline-flex items-center gap-2 group w-full text-left"
                    >
                      <motion.div
                        variants={iconVariants}
                        className="w-4 h-4 flex items-center justify-center"
                      >
                        <link.icon className="w-4 h-4" />
                      </motion.div>
                      <span>{link.name}</span>
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </motion.div>
                    </motion.button>
                  ) : (
                    <motion.button
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => navigate(link.href)}
                      className="text-sm text-text-secondary dark:text-text-mutedDark hover:text-accent transition-colors duration-200 inline-flex items-center gap-2 group w-full text-left cursor-pointer"
                    >
                      <motion.div
                        variants={iconVariants}
                        className="w-4 h-4 flex items-center justify-center"
                      >
                        <link.icon className="w-4 h-4" />
                      </motion.div>
                      <span>{link.name}</span>
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </motion.div>
                    </motion.button>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
