import { useState } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, MessageSquare, Mail, Github, Users, BookOpen, Search, Send, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

export default function Support() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqCategories = {
    'getting-started': {
      title: 'Getting Started',
      icon: BookOpen,
      questions: [
        {
          q: 'How do I get started with AIPulse?',
          a: 'Getting started is easy! Simply sign up for an account, and you\'ll have instant access to organize your AI tools. Start by adding your first tool using the "Add Tool" button, then explore features like collections and analytics.'
        },
        {
          q: 'Is AIPulse free to use?',
          a: 'Yes! AIPulse offers a generous free tier that includes all core features. We also offer premium plans for teams and power users who need advanced features like team collaboration and priority support.'
        },
        {
          q: 'What browsers are supported?',
          a: 'AIPulse works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of any of these browsers.'
        },
      ]
    },
    'features': {
      title: 'Features & Functionality',
      icon: LifeBuoy,
      questions: [
        {
          q: 'How do I create a collection?',
          a: 'Click the "Create Collection" button in the Collections tab, give it a name and description, then add tools by clicking the "Add to Collection" button on any tool card. You can also drag and drop tools into collections.'
        },
        {
          q: 'Can I share my collections with others?',
          a: 'Yes! Click on a collection, then click the "Share" button. You can generate a public link or invite specific users via email. Shared collections are read-only for viewers unless you grant edit permissions.'
        },
        {
          q: 'How does the AI Assistant work?',
          a: 'The AI Assistant helps you discover and manage tools using natural language. Just click the floating AI button in the bottom right corner and ask questions like "Show me productivity tools" or "Help me organize my design tools".'
        },
      ]
    },
    'technical': {
      title: 'Technical Issues',
      icon: AlertCircle,
      questions: [
        {
          q: 'Why isn\'t my data syncing?',
          a: 'Data sync issues are usually caused by connectivity problems. First, check your internet connection. If that\'s fine, try refreshing the page or clearing your browser cache. Your data is automatically saved and synced across devices.'
        },
        {
          q: 'How do I export my data?',
          a: 'Go to Settings > Data Management > Export. You can download all your tools, collections, and settings as a JSON file. This is useful for backups or migrating to another device.'
        },
        {
          q: 'I found a bug. What should I do?',
          a: 'We appreciate bug reports! Please visit our GitHub Issues page and create a new issue with details about the bug, steps to reproduce it, and your browser/system information. Screenshots are helpful!'
        },
      ]
    },
    'account': {
      title: 'Account & Billing',
      icon: Users,
      questions: [
        {
          q: 'How do I delete my account?',
          a: 'We\'re sorry to see you go! To delete your account, go to Settings > Account > Delete Account. This will permanently remove all your data. You can also choose to temporarily disable your account instead.'
        },
        {
          q: 'Can I change my subscription plan?',
          a: 'Absolutely! You can upgrade or downgrade your plan at any time from Settings > Subscription. Changes take effect immediately, and prorated charges/credits are applied automatically.'
        },
        {
          q: 'Do you offer discounts for students or nonprofits?',
          a: 'Yes! We offer a 50% discount for students and registered nonprofits. Contact us at support@aipulse.dev with proof of status, and we\'ll set up your discount.'
        },
      ]
    },
  };

  const contactOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      availability: 'Response within 24 hours',
      action: 'Send Email'
    },
    {
      icon: Github,
      title: 'GitHub Issues',
      description: 'Report bugs or request features',
      availability: 'Community driven',
      action: 'View Issues'
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const filteredFaqs = Object.entries(faqCategories).filter(([_, category]) => {
    if (!selectedCategory && !searchQuery) return true;
    if (searchQuery) {
      return category.questions.some(
        qa => qa.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
              qa.a.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return selectedCategory ? _ === selectedCategory : true;
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero */}
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
              <LifeBuoy className="w-12 h-12 text-accent" />
              <h1 className="text-5xl font-bold text-text-primary">Support Center</h1>
            </motion.div>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Get help, find answers, and connect with our team
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 text-lg bg-white dark:bg-background-dark border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary shadow-lg"
              />
            </div>

            {/* Quick Links - Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <div className="flex flex-wrap items-center gap-1.5 pb-2">
                {/* All Topics */}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden',
                    !selectedCategory
                      ? ''
                      : 'bg-white dark:bg-transparent text-text-primary dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-background-card border border-border dark:border-border/50'
                  )}
                  style={!selectedCategory ? { background: 'linear-gradient(to right, #00D9FF, #00B8D9)' } : {}}
                >
                  {!selectedCategory && (
                    <motion.div
                      layoutId="supportActiveTab"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'linear-gradient(to right, #00D9FF, #00B8D9)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <LifeBuoy className="w-3.5 h-3.5" />
                    All Topics
                  </span>
                  <span className={cn('relative z-10 px-1.5 py-0.5 rounded-full text-xs font-semibold', !selectedCategory ? 'bg-black/20 text-black' : 'bg-gray-100 dark:bg-background-dark text-text-secondary')}>
                    {Object.values(faqCategories).reduce((acc, cat) => acc + cat.questions.length, 0)}
                  </span>
                </button>

                {/* Category Buttons */}
                {Object.entries(faqCategories).map(([key, category]) => {
                  const isActive = selectedCategory === key;
                  const count = category.questions.length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={cn(
                        'relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden',
                        isActive
                          ? ''
                          : 'bg-white dark:bg-transparent text-text-primary dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-background-card border border-border dark:border-border/50'
                      )}
                      style={isActive ? { background: 'linear-gradient(to right, #00D9FF, #00B8D9)' } : {}}
                    >
                      {isActive && (
                        <motion.div
                          layoutId={`supportTab-${key}`}
                          className="absolute inset-0 rounded-full"
                          style={{ background: 'linear-gradient(to right, #00D9FF, #00B8D9)' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <category.icon className={cn('w-3.5 h-3.5', isActive ? 'text-black' : 'text-text-secondary')} />
                        {category.title}
                      </span>
                      <span className={cn('relative z-10 px-1.5 py-0.5 rounded-full text-xs font-semibold', isActive ? 'bg-black/20 text-black' : 'bg-gray-100 dark:bg-background-dark text-text-secondary')}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQs */}
          <div className="lg:col-span-2 space-y-8">
            {filteredFaqs.map(([key, category]) => (
              <motion.section
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <category.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary">{category.title}</h2>
                </div>

                <div className="space-y-4">
                  {category.questions.map((qa, index) => (
                    <FAQItem key={index} question={qa.q} answer={qa.a} />
                  ))}
                </div>
              </motion.section>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-text-primary mb-2">No results found</h3>
                <p className="text-text-secondary">Try a different search term or browse all topics</p>
              </div>
            )}
          </div>

          {/* Contact Options */}
          <aside className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-background-dark border border-border rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-text-primary mb-4">Contact Us</h3>
              <div className="space-y-4">
                {contactOptions.map((option) => (
                  <div
                    key={option.title}
                    className="p-4 bg-bg-secondary rounded-lg hover:bg-accent/10 transition-colors cursor-pointer group"
                  >
                    <option.icon className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold text-text-primary mb-1">{option.title}</h4>
                    <p className="text-sm text-text-secondary mb-2">{option.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {option.availability}
                      </span>
                      <span className="text-sm font-medium text-accent">{option.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-background-dark border border-border rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-text-primary mb-4">Send us a Message</h3>
              
              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-text-primary mb-2">Message Sent!</h4>
                  <p className="text-text-secondary">We'll get back to you within 24 hours</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your Name"
                      required
                      className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-text-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="Your Email"
                      required
                      className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-text-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="Subject"
                      required
                      className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-text-primary"
                    />
                  </div>
                  <div>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Your Message"
                      rows={4}
                      required
                      className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-text-primary resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-bg-secondary hover:bg-accent/10 transition-colors flex items-center justify-between"
      >
        <span className="font-semibold text-text-primary pr-4">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-accent"
        >
          ▼
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 text-text-secondary bg-white dark:bg-background-dark">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}
