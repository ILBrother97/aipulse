import { motion } from 'framer-motion';
import { BookOpen, Clock, Star, ArrowRight, Play, CheckCircle, Zap, TrendingUp, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Guides() {
  const navigate = useNavigate();
  const guides = [
    {
      category: 'Getting Started',
      icon: Zap,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      items: [
        {
          title: 'Your First 10 Minutes with AIPulse',
          description: 'A complete walkthrough to get you started',
          duration: '10 min',
          level: 'Beginner',
          rating: 4.9,
          students: 1250,
        },
        {
          title: 'Setting Up Your Workspace',
          description: 'Organize your tools for maximum productivity',
          duration: '8 min',
          level: 'Beginner',
          rating: 4.8,
          students: 980,
        },
        {
          title: 'Understanding Collections',
          description: 'Learn how to group and manage tools effectively',
          duration: '12 min',
          level: 'Beginner',
          rating: 4.7,
          students: 856,
        },
      ]
    },
    {
      category: 'Advanced Tutorials',
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      items: [
        {
          title: 'Building Custom Workflows',
          description: 'Create automated workflows that save time',
          duration: '25 min',
          level: 'Advanced',
          rating: 4.9,
          students: 542,
        },
        {
          title: 'Analytics Deep Dive',
          description: 'Master the analytics dashboard for insights',
          duration: '20 min',
          level: 'Intermediate',
          rating: 4.8,
          students: 623,
        },
        {
          title: 'AI Assistant Best Practices',
          description: 'Get the most out of AI-powered features',
          duration: '15 min',
          level: 'Intermediate',
          rating: 4.9,
          students: 789,
        },
      ]
    },
    {
      category: 'Use Cases',
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      items: [
        {
          title: 'AIPulse for Developers',
          description: 'Streamline your development workflow',
          duration: '18 min',
          level: 'Intermediate',
          rating: 4.8,
          students: 1100,
        },
        {
          title: 'AIPulse for Product Teams',
          description: 'Collaborate and share tools effectively',
          duration: '16 min',
          level: 'Intermediate',
          rating: 4.7,
          students: 734,
        },
        {
          title: 'AIPulse for Researchers',
          description: 'Organize research tools and resources',
          duration: '14 min',
          level: 'Beginner',
          rating: 4.6,
          students: 445,
        },
      ]
    },
  ];

  const featuredGuide = {
    title: 'Complete AIPulse Masterclass',
    description: 'From beginner to expert - a comprehensive guide covering everything you need to know',
    duration: '2 hours',
    modules: 12,
    students: 2500,
    rating: 5.0,
  };

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
              <BookOpen className="w-12 h-12 text-accent" />
              <h1 className="text-5xl font-bold text-text-primary">Guides & Tutorials</h1>
            </motion.div>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Learn how to master AIPulse with step-by-step tutorials and real-world examples
            </p>
          </div>
        </div>
      </motion.div>

      {/* Featured Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent to-accent-dark p-8 md:p-12 shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-black dark:text-white uppercase tracking-wider">Featured Guide</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">{featuredGuide.title}</h2>
            <p className="text-lg text-black dark:text-white mb-6 max-w-2xl">{featuredGuide.description}</p>
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <span className="flex items-center gap-2 text-black dark:text-white">
                <Clock className="w-5 h-5" />
                {featuredGuide.duration}
              </span>
              <span className="flex items-center gap-2 text-black dark:text-white">
                <Play className="w-5 h-5" />
                {featuredGuide.modules} modules
              </span>
              <span className="flex items-center gap-2 text-black dark:text-white">
                <Users className="w-5 h-5" />
                {featuredGuide.students} students
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                {featuredGuide.rating}
              </span>
            </div>
            <button 
              className="relative overflow-hidden px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-xl"
              style={{ background: 'linear-gradient(to right, #00D9FF, #00B8D9)' }}
            >
              <span className="relative z-10 flex items-center gap-2 text-black">
                Start Learning
                <ArrowRight className="w-5 h-5 text-black" />
              </span>
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>
      </motion.div>

      {/* Guide Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {guides.map((category, categoryIndex) => (
            <motion.section
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (categoryIndex + 1) * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg ${category.bgColor}`}>
                  <category.icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <h2 className="text-2xl font-bold text-text-primary">{category.category}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((guide, guideIndex) => (
                  <motion.article
                    key={guide.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: guideIndex * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="group bg-white dark:bg-background-dark border border-border rounded-xl p-6 hover:border-accent/50 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        guide.level === 'Beginner' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                        guide.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                      }`}>
                        {guide.level}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <Clock className="w-4 h-4" />
                        {guide.duration}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-text-secondary mb-4 line-clamp-2">{guide.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {guide.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {guide.students.toLocaleString()}
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-accent" />
            <span className="text-sm font-semibold text-text-primary">Want More?</span>
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-4">Request Custom Guides</h3>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Have a specific use case or topic you'd like us to cover? We'd love to hear from you!
          </p>
          <button 
            className="relative overflow-hidden px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 inline-flex items-center gap-2"
            style={{ background: 'linear-gradient(to right, #00D9FF, #00B8D9)' }}
          >
            <span className="relative z-10 text-black">
              Suggest a Topic
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
