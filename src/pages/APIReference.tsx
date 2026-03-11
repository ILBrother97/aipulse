import { motion } from 'framer-motion';
import { FileText, Code, Terminal, Lock, Database, Globe, Zap, Copy, Check, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function APIReference() {
  const navigate = useNavigate();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const apiSections = [
    {
      title: 'Authentication',
      icon: Lock,
      description: 'Learn how to authenticate your requests',
      endpoints: [
        {
          method: 'POST',
          path: '/api/auth/token',
          description: 'Generate authentication token',
          request: `{
  "apiKey": "your_api_key_here"
}`,
          response: `{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}`
        }
      ]
    },
    {
      title: 'Tools',
      icon: Zap,
      description: 'Manage and retrieve AI tools',
      endpoints: [
        {
          method: 'GET',
          path: '/api/tools',
          description: 'List all tools',
          response: `{
  "tools": [
    {
      "id": "uuid",
      "name": "Tool Name",
      "category": "category",
      "description": "Description",
      "url": "https://..."
    }
  ],
  "total": 100
}`
        },
        {
          method: 'POST',
          path: '/api/tools',
          description: 'Create a new tool',
          request: `{
  "name": "My Tool",
  "category": "Productivity",
  "description": "Tool description",
  "url": "https://example.com"
}`,
          response: `{
  "id": "uuid",
  "name": "My Tool",
  "createdAt": "2024-01-01T00:00:00Z"
}`
        },
        {
          method: 'DELETE',
          path: '/api/tools/:id',
          description: 'Delete a tool',
          response: `{
  "success": true,
  "message": "Tool deleted successfully"
}`
        }
      ]
    },
    {
      title: 'Collections',
      icon: Database,
      description: 'Organize tools into collections',
      endpoints: [
        {
          method: 'GET',
          path: '/api/collections',
          description: 'List all collections',
          response: `{
  "collections": [
    {
      "id": "uuid",
      "name": "My Collection",
      "toolCount": 10,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}`
        },
        {
          method: 'POST',
          path: '/api/collections',
          description: 'Create collection',
          request: `{
  "name": "Development Tools",
  "description": "Tools for development",
  "toolIds": ["uuid1", "uuid2"]
}`
        }
      ]
    },
    {
      title: 'Analytics',
      icon: FileText,
      description: 'Access usage analytics',
      endpoints: [
        {
          method: 'GET',
          path: '/api/analytics/usage',
          description: 'Get usage statistics',
          response: `{
  "totalTools": 50,
  "favoriteCount": 15,
  "recentlyUsed": 25,
  "usageHistory": [...]
}`
        }
      ]
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'POST': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'PUT': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'DELETE': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default: return 'bg-gray-500/10 text-gray-600';
    }
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
              <Code className="w-12 h-12 text-accent" />
              <h1 className="text-5xl font-bold text-text-primary">API Reference</h1>
            </motion.div>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Complete API documentation for integrating with AIPulse
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                RESTful API
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Base URL: https://api.aipulse.dev
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {apiSections.map((section, sectionIndex) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <section.icon className="w-8 h-8 text-accent" />
                <div>
                  <h2 className="text-3xl font-bold text-text-primary">{section.title}</h2>
                  <p className="text-text-muted mt-1">{section.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                {section.endpoints.map((endpoint, index) => (
                  <motion.div
                    key={`${endpoint.method}-${endpoint.path}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-border rounded-xl overflow-hidden"
                  >
                    {/* Endpoint Header */}
                    <div className="bg-bg-secondary p-4 border-b border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-md text-sm font-mono font-semibold ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm text-text-primary font-mono">{endpoint.path}</code>
                      </div>
                      <p className="text-sm text-text-muted">{endpoint.description}</p>
                    </div>

                    {/* Request/Response */}
                    <div className="p-4 space-y-4">
                      {endpoint.request && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-text-primary">Request Body</h4>
                            <button
                              onClick={() => copyToClipboard(endpoint.request!, `${endpoint.method}-${endpoint.path}-req`)}
                              className="text-xs text-accent hover:text-accent-dark flex items-center gap-1"
                            >
                              {copiedEndpoint === `${endpoint.method}-${endpoint.path}-req` ? (
                                <>
                                  <Check className="w-3 h-3" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copy
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="bg-gray-50 dark:bg-background-card p-4 rounded-lg overflow-x-auto text-sm border border-border font-mono text-text-secondary">
                            <code>{endpoint.request}</code>
                          </pre>
                        </div>
                      )}

                      {endpoint.response && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-text-primary">Response</h4>
                            <button
                              onClick={() => copyToClipboard(endpoint.response!, `${endpoint.method}-${endpoint.path}-res`)}
                              className="text-xs text-accent hover:text-accent-dark flex items-center gap-1"
                            >
                              {copiedEndpoint === `${endpoint.method}-${endpoint.path}-res` ? (
                                <>
                                  <Check className="w-3 h-3" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copy
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="bg-gray-50 dark:bg-background-card p-4 rounded-lg overflow-x-auto text-sm border border-border font-mono text-text-secondary">
                            <code>{endpoint.response}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 p-8 bg-gradient-to-r from-accent/10 to-transparent rounded-2xl border border-accent/20"
        >
          <h3 className="text-2xl font-bold text-text-primary mb-4">Need More Help?</h3>
          <div className="space-y-2 text-text-muted">
            <p>• Rate Limiting: 100 requests per minute for authenticated requests</p>
            <p>• Error Codes: Standard HTTP status codes (200, 400, 401, 404, 500)</p>
            <p>• Versioning: Current API version is v1 (included in base URL)</p>
            <p>• Support: Contact us at api@aipulse.dev for assistance</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
