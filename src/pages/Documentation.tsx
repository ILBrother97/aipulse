import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, ChevronRight, ExternalLink, Clock, Bookmark, FileText, Layers, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Documentation() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      articles: [
        { title: 'Introduction to AIPulse', readTime: '5 min', description: 'Learn what AIPulse is and how it can help you manage AI tools' },
        { title: 'Quick Start Guide', readTime: '10 min', description: 'Get up and running with AIPulse in minutes' },
        { title: 'Installation & Setup', readTime: '8 min', description: 'Step-by-step installation instructions' },
        { title: 'First Steps', readTime: '7 min', description: 'Your first workflow with AIPulse' },
      ]
    },
    {
      id: 'features',
      title: 'Features',
      icon: Layers,
      articles: [
        { title: 'Tool Management', readTime: '12 min', description: 'Organize and categorize your AI tools effectively' },
        { title: 'Collections', readTime: '10 min', description: 'Create and manage custom tool collections' },
        { title: 'Analytics Dashboard', readTime: '15 min', description: 'Track usage and gain insights' },
        { title: 'Workflows', readTime: '20 min', description: 'Build automated workflows' },
        { title: 'AI Assistant', readTime: '8 min', description: 'Leverage AI-powered assistance' },
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Usage',
      icon: FileText,
      articles: [
        { title: 'Keyboard Shortcuts', readTime: '6 min', description: 'Master productivity shortcuts' },
        { title: 'Customization Guide', readTime: '14 min', description: 'Theme and personalize your experience' },
        { title: 'Integration Tips', readTime: '18 min', description: 'Connect with external tools' },
        { title: 'Best Practices', readTime: '12 min', description: 'Optimize your workflow' },
      ]
    },
  ];

  const filteredSections = sections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.articles.length > 0);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120; // Account for header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-accent/10 via-transparent to-transparent py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 mb-6 text-text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to App
            </motion.button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <BookOpen className="w-12 h-12 text-accent" />
              <h1 className="text-5xl font-bold text-text-primary">Documentation</h1>
            </motion.div>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Everything you need to know about AIPulse. From setup to advanced features.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full pl-12 pr-4 py-4 text-lg bg-white dark:bg-background-dark border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary shadow-lg"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Getting Started', desc: 'New to AIPulse? Start here!', icon: Zap },
            { title: 'Tutorials', desc: 'Step-by-step guides', icon: Bookmark },
            { title: 'FAQ', desc: 'Common questions answered', icon: FileText },
          ].map((item, i) => (
            <motion.button
              key={item.title}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white dark:bg-background-dark border border-border rounded-xl hover:border-accent transition-all duration-200 text-left group"
            >
              <item.icon className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-text-primary mb-1">{item.title}</h3>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <nav className="sticky top-24 space-y-2">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-left transition-all duration-300 relative overflow-hidden ${
                    activeSection === section.id
                      ? ''
                      : 'bg-white dark:bg-transparent text-text-secondary hover:bg-gray-50 dark:hover:bg-background-card border border-border dark:border-border/50'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  style={activeSection === section.id ? { background: 'linear-gradient(to right, #00D9FF, #00B8D9)' } : {}}
                >
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="sidebarActive"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'linear-gradient(to right, #00D9FF, #00B8D9)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <section.icon className={`w-5 h-5 flex-shrink-0 relative z-10 ${activeSection === section.id ? 'text-black' : ''}`} />
                  <span className={`flex-1 font-medium relative z-10 ${activeSection === section.id ? 'text-black' : ''}`}>
                    {section.title}
                  </span>
                </motion.button>
              ))}
            </nav>
          </motion.aside>

          {/* Articles */}
          <main className="lg:col-span-3">
            {filteredSections.map((section) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <section.icon className="w-8 h-8 text-accent" />
                  <h2 className="text-3xl font-bold text-text-primary">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.articles.map((article, index) => (
                    <motion.article
                      key={article.title}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="group p-6 bg-white dark:bg-background-dark border border-border rounded-xl hover:border-accent/50 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-text-secondary mb-3">{article.description}</p>
                          <div className="flex items-center gap-4 text-sm text-text-secondary">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {article.readTime}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.section>
            ))}

            {filteredSections.length === 0 && (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-text-primary mb-2">No results found</h3>
                <p className="text-text-secondary">Try searching with different keywords</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
