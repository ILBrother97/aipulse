# AIPulse - AI Tools Management Platform

🚀 Modern AI tools management platform with premium features, analytics, and Stripe payments. Built with React 19, TypeScript, and Supabase.

## 🚀 Overview

AIPulse is a comprehensive AI tools management platform that helps users discover, organize, and track their favorite AI tools and workflows. Built with a modern tech stack including React 19, TypeScript, Supabase, and Stripe, it offers both free and premium features with robust authentication, usage tracking, and analytics capabilities.

## ✨ Key Features

### Core Functionality
- **AI Tool Discovery**: Browse and search through a curated collection of AI tools
- **Smart Organization**: Create collections and categorize tools efficiently
- **Workflow Management**: Build and manage custom AI workflows
- **Usage Analytics**: Track tool usage patterns and insights
- **Favorites & Recently Used**: Quick access to preferred tools

### Premium Features
- **Unlimited Collections**: No limits on tool organization
- **Advanced Analytics**: Comprehensive usage statistics and history
- **Workflow Builder**: Create complex AI-powered workflows
- **Premium Themes**: Enhanced customization options
- **AI Assistant**: Intelligent tool recommendations

### Technical Features
- **Server-Side Validation**: Secure premium feature enforcement
- **Real-Time Analytics**: Performance monitoring and usage tracking
- **Caching Strategy**: Optimized premium status caching
- **Webhook Processing**: Reliable Stripe payment handling
- **Rate Limiting**: Abuse detection and prevention

## 🛠 Tech Stack

- **Frontend**: React 19.2.4, TypeScript, Vite
- **UI/UX**: TailwindCSS, Framer Motion, Lucide React
- **State Management**: Zustand with persistence
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Payments**: Stripe (webhooks + checkout)
- **Deployment**: Vercel
- **Testing**: Vitest, Playwright

## 🏗 Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Vercel        │─────▶│   Supabase       │─────▶│   Stripe        │
│   (Frontend)    │      │   • Auth         │      │   • Payments    │
│   React + Vite  │◀─────│   • Database     │◀─────│   • Webhooks    │
│   Static Build  │      │   • Edge Functions│     │                 │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

## 📊 Current Implementation Status

### ✅ Completed
- Authentication system (Email + Google OAuth)
- Basic AI tools management
- Collection system with limits
- Premium upgrade flow
- Stripe payment integration
- Usage validation API
- Premium status caching
- Analytics dashboard

### 🚧 In Progress
- Server-side limit validation scaling
- Performance optimization
- Advanced webhook processing
- Real-time monitoring

## 🎯 Business Model

- **Free Tier**: 3 collections, 1 workflow, 1 AI query/day
- **Premium Tier**: Unlimited features, advanced analytics, priority support
- **Revenue Protection**: Server-side validation prevents abuse

## 📈 Scalability Features

- **Caching Layer**: Redis-based premium status caching (5-minute TTL)
- **Database Optimization**: Indexed queries and materialized views
- **Performance Monitoring**: Real-time metrics and alerting
- **Auto-scaling**: Vercel edge distribution and CDN caching

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 🚀 Deployment

The application is designed for Vercel deployment with Supabase backend. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

## 📋 Project Structure

- `/src/components` - React components organized by feature
- `/src/lib` - Core utilities and API integrations
- `/src/stores` - Zustand state management
- `/src/contexts` - React contexts (Premium, Auth)
- `/supabase` - Database migrations and edge functions
- `/docs` - Documentation and guides

## 🔒 Security

- Row Level Security (RLS) policies in Supabase
- Server-side premium validation
- Rate limiting and abuse detection
- Secure webhook processing
- Environment-based configuration

## 📚 Documentation

- [API Reference](./docs/api-reference.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Stripe Setup](./STRIPE_WEBHOOK_SETUP.md)
- [Task Management](./TASK.md)

## 🤝 Contributing

This project follows a structured development approach with clear phases for scaling premium features. See [TASK.md](./TASK.md) for the current roadmap and implementation priorities.

## 📄 License

Private project - All rights reserved

---

**Built with ❤️ using modern web technologies to help users navigate the AI landscape efficiently.**
