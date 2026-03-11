import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minimize2, Maximize2, Trash2, Zap, ExternalLink, Sparkles } from 'lucide-react';
import { useToolsStore } from '../../stores/toolsStore';
import { usePremium } from '@/hooks/usePremium';
import { cn } from '../../utils/cn';
import type { AITool } from '../../types/index';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  tools?: AITool[];
  timestamp: number;
}

// ── Local intelligence (no API key required) ──────────────────────────
function getLocalResponse(input: string, tools: AITool[], recentIds: string[]): { text: string; tools: AITool[] } {
  const q = input.toLowerCase();

  // Website help and navigation
  if (q.includes('help') || q.includes('how to') || q.includes('tutorial') || q.includes('getting started')) {
    return {
      text: `🚀 **AIPulse Complete Help Center**

## 🎯 Getting Started Guide

**First Steps:**
1. **Explore the Interface**: Familiarize yourself with the layout
2. **Add Your First Tool**: Click "Add Tool" to build your collection
3. **Create Collections**: Organize tools by project or category
4. **Set Up Favorites**: Star frequently used tools
5. **Browse Categories**: Discover tools by type (Text & Writing, Image Generation, etc.)

**Navigation Mastery:**
• **Header**: Main navigation with logo, search, and page links
• **Category Tabs**: Horizontal scrolling tabs for filtering
• **Tool Cards**: Interactive cards with launch, edit, and collection options
• **Sidebar**: Context-sensitive information and actions
• **Footer**: Quick links to all major sections

**Core Concepts:**
• **Tools**: Individual AI applications you use
• **Collections**: Custom groups of related tools
• **Categories**: Pre-defined tool types (Text & Writing, Image Generation, Video & Audio, etc.)
• **Favorites**: Quick-access starred tools
• **Analytics**: Usage tracking and insights
• **Workflows**: Automated tool sequences

**Essential Features:**
• **Search Bar**: Real-time tool search with filters
• **View Modes**: Grid, List, Expanded, Kanban layouts
• **Theme System**: Light/dark modes with custom accents
• **Keyboard Shortcuts**: Power-user navigation
• **Activity Log**: Track all your actions
• **Import/Export**: Backup and share your tool collection

**Pro Workflow:**
1. **Daily**: Check recently used and favorites
2. **Weekly**: Review analytics for usage patterns
3. **Monthly**: Organize collections and remove unused tools
4. **Quarterly**: Update tool descriptions and categories

**Advanced Tips:**
• Use **Ctrl+K** for instant search access
• Create **workflows** for repetitive tasks
• Set up **collections** for different projects
• Monitor **analytics** to optimize your tool stack
• Customize **themes** for visual comfort
• Enable **keyboard shortcuts** for speed

**Integration Possibilities:**
• **API Access**: Connect with external applications
• **Data Export**: Share insights with teams
• **Workflow Automation**: Integrate with other tools
• **Team Collaboration**: Share collections and workflows

**Troubleshooting Basics:**
• **Refresh page** (F5) for most issues
• **Clear cache** if performance is slow
• **Check browser compatibility** (Chrome, Firefox, Safari, Edge)
• **Disable ad blockers** if tools don't launch
• **Update browser** for latest features

**Resource Hierarchy:**
1. **Quick Help**: Ask me anything! 🤖
2. **Keyboard Shortcuts**: Press "?" for instant reference
3. **Documentation**: Detailed guides and tutorials
4. **Support Page**: Contact the AIPulse team
5. **Community**: User forums and discussions

**Performance Optimization:**
• **Reduce animations** in Settings for older devices
• **Use Grid view** for faster scrolling with many tools
• **Enable "Reduce Motion"** for accessibility
• **Close unused tabs** to improve memory usage
• **Regular cleanup** of unused tools

**Security & Privacy:**
• All data stored locally in your browser
• No tool URLs or personal data sent to servers
• Optional export for backup purposes
• Clear data option available in Settings

What specific area would you like to explore in detail?`,
      tools: []
    };
  }

  // Documentation and resources
  if (q.includes('documentation') || q.includes('docs') || q.includes('guide') || q.includes('api')) {
    return {
      text: `📚 **Complete AIPulse Resource Library**

## 📖 Documentation Sections

**Getting Started Documentation:**
• **Installation & Setup**: Browser requirements, first-time configuration
• **Interface Tour**: Complete walkthrough of all UI elements
• **Basic Operations**: Adding tools, creating collections, navigation
• **Account Setup**: Profile configuration, preferences, privacy settings

**Feature Deep Dives:**
• **Tool Management**: Detailed guide to adding, editing, organizing tools
• **Collections System**: Advanced organization strategies and best practices
• **Analytics Dashboard**: Understanding metrics, reports, and insights
• **Workflow Builder**: Step-by-step workflow creation and automation
• **Search System**: Advanced search techniques and filters
• **Theme Customization**: Personalizing your AIPulse experience

**Advanced Guides:**
• **Power User Techniques**: Keyboard shortcuts, bulk operations, automation
• **Integration Strategies**: Connecting with external tools and services
• **Data Management**: Import/export, backup, migration strategies
• **Performance Optimization**: Speed tips and resource management
• **Security Best Practices**: Data protection and privacy controls

## 🔧 API Reference

**Core API Endpoints:**
• **Tools API**: CRUD operations for tool management
• **Collections API**: Create, organize, and manage collections
• **Analytics API**: Usage data and insights extraction
• **Workflow API**: Build and execute automated sequences
• **Search API**: Advanced tool discovery and filtering

**Integration Examples:**
• **JavaScript SDK**: Browser-based integration examples
• **Python Library**: Server-side integration scripts
• **Webhook Support**: Real-time event notifications
• **OAuth Authentication**: Secure API access methods
• **Rate Limiting**: Usage quotas and throttling information

**Developer Resources:**
• **Postman Collections**: Ready-to-use API testing collections
• **Code Examples**: Sample implementations in multiple languages
• **SDK Documentation**: Library-specific guides and references
• **Error Handling**: Complete error codes and troubleshooting
• **Testing Frameworks**: Unit and integration test examples

## 🎯 Tutorial Library

**Beginner Tutorials:**
• **"Your First Hour with AIPulse"**: Quick start walkthrough
• **"Building Your Tool Collection"**: Adding and organizing tools
• **"Collections Mastery"**: Creating effective tool groups
• **"Search Like a Pro"**: Finding tools efficiently

**Intermediate Tutorials:**
• **"Analytics for Growth"**: Using data to optimize your tool stack
• **"Workflow Automation"**: Building repeatable processes
• **"Advanced Organization"**: Complex collection strategies
• **"Integration Fundamentals"**: Connecting external services

**Advanced Tutorials:**
• **"Custom Theme Development"**: Creating personalized interfaces
• **"API Integration Mastery"**: Building custom applications
• **"Performance Engineering"**: Optimizing for large collections
• **"Team Collaboration Setup"**: Multi-user workflows

## 🛠️ Technical Documentation

**Architecture Overview:**
• **System Architecture**: Component breakdown and data flow
• **Database Schema**: Data models and relationships
• **Security Model**: Authentication, authorization, and data protection
• **Performance Characteristics**: Scalability and optimization details

**Development Guides:**
• **Local Development**: Setting up development environment
• **Contributing Guidelines**: Code standards and submission process
• **Testing Strategies**: Unit, integration, and E2E testing
• **Deployment Guide**: Production deployment best practices

**Maintenance & Support:**
• **Troubleshooting Guide**: Common issues and solutions
• **Performance Tuning**: Optimization techniques and monitoring
• **Backup & Recovery**: Data protection and restoration procedures
• **Migration Guides**: Version upgrades and data migration

## 🆘 Support Resources

**Self-Service Support:**
• **FAQ Database**: Comprehensive question-answer database
• **Knowledge Base**: Detailed articles and how-to guides
• **Video Tutorials**: Visual walkthroughs of common tasks
• **Interactive Demos**: Hands-on learning experiences

**Community Support:**
• **User Forums**: Community discussions and peer support
• **Discord Server**: Real-time chat and community help
• **GitHub Discussions**: Feature requests and bug reports
• **Stack Overflow Tag**: Technical questions and answers

**Direct Support:**
• **Support Tickets**: Formal issue tracking and resolution
• **Email Support**: Detailed problem assistance
• **Live Chat**: Real-time help during business hours
• **Screen Sharing**: Guided troubleshooting sessions

## 📊 Resource Metrics

**Documentation Coverage:**
• **200+ Articles**: Comprehensive feature documentation
• **50+ Tutorials**: Step-by-step learning guides
• **100+ Code Examples**: Practical implementation samples
• **30+ Videos**: Visual learning content

**API Statistics:**
• **15+ Endpoints**: Complete REST API coverage
• **5 SDKs**: Multi-language support libraries
• **1000+ Calls/month**: Generous free tier limits
• **99.9% Uptime**: Reliable service availability

**Community Engagement:**
• **10,000+ Users**: Active community members
• **500+ Contributors**: Open source participants
• **24/7 Discussion**: Global community support
• **Weekly Updates**: Regular content and feature updates

**Access Methods:**
1. **Header Resources Dropdown**: Quick access to main sections
2. **Footer Navigation Links**: Comprehensive site navigation
3. **Search Functionality**: Find specific topics instantly
4. **Table of Contents**: Structured navigation within pages
5. **Related Articles**: Contextual content suggestions

**Resource Updates:**
• **Weekly Documentation**: Continuous content improvement
• **Monthly API Updates**: New features and endpoints
• **Quarterly Tutorials**: Fresh learning content
• **Annual Guides**: Comprehensive strategy updates

What specific documentation topic would you like to explore?`,
      tools: []
    };
  }

  // Features explanation
  if (q.includes('features') || q.includes('what can i do') || q.includes('capabilities')) {
    return {
      text: `⚡ **Complete AIPulse Feature Encyclopedia**

## 🔧 Advanced Tool Management

**Core Tool Operations:**
• **Unlimited Tools**: No limits on your AI tool collection
• **Rich Metadata**: Store descriptions, categories, tags, URLs, and custom fields
• **Bulk Operations**: Add, edit, delete multiple tools simultaneously
• **Duplicate Detection**: Automatically identify and merge duplicate tools
• **URL Validation**: Verify tool links are active and accessible
• **Custom Icons**: Upload or select icons for visual identification
• **Version Tracking**: Keep track of tool updates and changes

**Tool Organization:**
• **Smart Categories**: Automatic categorization based on tool descriptions
• **Custom Tags**: Create flexible tagging systems for fine-grained organization
• **Tool Relationships**: Link related tools and create dependency maps
• **Usage Contexts**: Tag tools for specific projects or use cases
• **Priority Levels**: Set importance levels for tool ranking
• **Expiration Dates**: Track tool subscription renewals and updates

**Tool Discovery:**
• **AI-Powered Suggestions**: Get recommendations based on your usage patterns
• **Marketplace Integration**: Browse and import tools from external catalogs
• **Community Tools**: Discover tools used by other AIPulse users
• **Trending Tools**: See popular and emerging AI tools
• **Tool Reviews**: Rate and review tools in your collection
• **Similar Tools**: Find alternatives and complementary tools

## 📁 Sophisticated Collections System

**Collection Types:**
• **Project Collections**: Group tools for specific client projects
• **Workflow Collections**: Tools that work together in sequences
• **Team Collections**: Shared collections for team collaboration
• **Template Collections**: Reusable collection patterns
• **Dynamic Collections**: Auto-updating based on criteria
• **Archive Collections**: Store inactive or seasonal tools

**Collection Features:**
• **Color Coding**: Visual organization with custom colors
• **Collection Icons**: Visual identification with emoji or custom icons
• **Nested Collections**: Create hierarchical organization structures
• **Collection Templates**: Quick setup with predefined structures
• **Sharing & Collaboration**: Share collections with team members
• **Collection Analytics**: Track usage patterns per collection
• **Collection Workflows**: Apply workflows to entire collections

**Advanced Organization:**
• **Smart Rules**: Automatic tool assignment based on criteria
• **Collection Linking**: Create relationships between collections
• **Collection Permissions**: Control access and editing rights
• **Collection History**: Track changes and revert if needed
• **Collection Search**: Find tools within specific collections
• **Collection Export**: Share collections as files or links

## 📊 Comprehensive Analytics Suite

**Usage Analytics:**
• **Tool Usage Metrics**: Launch frequency, time spent, success rates
• **Category Analytics**: Which tool types you use most
• **Time-Based Analysis**: Daily, weekly, monthly usage patterns
• **ROI Tracking**: Measure value and productivity gains
• **Cost Analysis**: Track subscription costs vs. usage value
• **Performance Metrics**: Tool response times and reliability

**Advanced Insights:**
• **Usage Predictions**: AI-powered forecasting of future needs
• **Optimization Suggestions**: Recommendations for tool stack improvement
• **Redundancy Detection**: Identify overlapping or unnecessary tools
• **Gap Analysis**: Discover missing tools in your workflow
• **Trend Analysis**: Emerging tool adoption patterns
• **Benchmarking**: Compare your usage with similar users

**Reporting & Visualization:**
• **Interactive Dashboards**: Customizable analytics views
• **Export Options**: PDF, CSV, JSON data export
• **Scheduled Reports**: Automated analytics delivery
• **Custom Metrics**: Define and track your own KPIs
• **Visual Charts**: Graphs, heatmaps, and trend lines
• **Executive Summaries**: High-level insights for stakeholders

## ⚙️ Powerful Workflow Engine

**Workflow Building:**
• **Visual Builder**: Drag-and-drop workflow creation
• **Conditional Logic**: If/then branching and decision trees
• **Variable Management**: Pass data between workflow steps
• **Loop Structures**: Repeat actions and iterate over data
• **Error Handling**: Robust error recovery and retry logic
• **Parallel Processing**: Run multiple steps simultaneously
• **Workflow Templates**: Pre-built workflow patterns

**Workflow Features:**
• **Scheduling**: Time-based and event-triggered execution
• **API Integration**: Connect with external services
• **Data Transformation**: Process and format data between steps
• **Human-in-the-Loop**: Require manual approval at key points
• **Workflow Monitoring**: Real-time execution tracking
• **Version Control**: Track and rollback workflow changes
• **Performance Metrics**: Measure workflow efficiency

**Advanced Capabilities:**
• **Workflow Marketplace**: Share and discover workflows
• **Custom Actions**: Build your own workflow steps
• **Integration Library**: Pre-built connectors for popular tools
• **Workflow Analytics**: Track success rates and bottlenecks
• **Workflow Testing**: Debug and validate before deployment
• **Workflow Documentation**: Auto-generate process documentation

## 🎨 Deep Customization System

**Theme Engine:**
• **Multiple Themes**: Light, dark, high-contrast, custom themes
• **Accent Colors**: 8+ color schemes with custom color picker
• **Typography Control**: Font families, sizes, and spacing
• **Layout Options**: Flexible grid systems and component arrangements
• **Animation Library**: Smooth transitions and micro-interactions
• **Responsive Design**: Optimize for any screen size
• **Accessibility Features**: WCAG compliance and screen reader support

**Personalization:**
• **Custom Dashboards**: Arrange widgets and information panels
• **Quick Actions**: Customize toolbar and context menus
• **Notification Preferences**: Control alerts and updates
• **Language Support**: Multi-language interface options
• **Time Zone Settings**: Localized time display and scheduling
• **Date Formats**: Regional date and time preferences
• **Measurement Units**: Metric/imperial and currency options

**Advanced Settings:**
• **Performance Tuning**: Optimize for your hardware and network
• **Privacy Controls**: Granular data sharing and tracking options
• **Security Settings**: Two-factor auth, session management
• **Backup Configuration**: Automatic backup scheduling and storage
• **Integration Settings**: Configure third-party connections
• **Developer Options**: Advanced debugging and experimental features

## 🔍 Intelligent Search & Discovery

**Search Capabilities:**
• **Natural Language**: Search using conversational queries
• **Semantic Search**: Find tools based on meaning, not just keywords
• **Fuzzy Matching**: Find results even with typos and variations
• **Advanced Filters**: Multi-criteria filtering with boolean logic
• **Search History**: Track and reuse previous searches
• **Saved Searches**: Save complex search queries for reuse
• **Search Analytics**: Track what you're looking for

**Discovery Features:**
• **Recommendation Engine**: AI-powered tool suggestions
• **Similar Tools**: Find alternatives and complementary tools
• **Trending Tools**: Discover popular and emerging tools
• **Tool Clusters**: Visualize relationships between tools
• **Usage Patterns**: Learn how others use similar tools
• **Integration Ideas**: Discover new tool combinations
• **Learning Resources**: Find tutorials and guides for tools

## ⌨️ Productivity & Automation

**Keyboard Shortcuts:**
• **Comprehensive Coverage**: Shortcuts for every major function
• **Custom Shortcuts**: Create your own key combinations
• **Context-Aware**: Different shortcuts based on current context
• **Shortcut Learning**: Interactive tutorial system
• **Conflict Resolution**: Handle browser and system shortcut conflicts
• **Accessibility**: Full keyboard navigation support
• **Shortcut Analytics**: Track your most used shortcuts

**Automation Features:**
• **Bulk Operations**: Process multiple tools simultaneously
• **Import/Export**: CSV, JSON, API data exchange
• **Scheduled Tasks**: Automated maintenance and updates
• **Macro Recording**: Record and replay common actions
• **Script Support**: Custom JavaScript automation
• **API Integration**: Connect with external automation tools
• **Workflow Triggers**: Event-based automation

**Advanced Productivity:**
• **Quick Actions**: Context-sensitive action menus
• **Multi-Select**: Advanced selection modes and operations
• **Clipboard Integration**: Copy/paste tools and collections
• **Undo/Redo**: Full history tracking and reversal
• **Auto-Save**: Prevent data loss with automatic saving
• **Session Management**: Save and restore work sessions
• **Focus Mode**: Minimize distractions for deep work

## 🔗 Integration & Ecosystem

**API & Integrations:**
• **REST API**: Complete programmatic access
• **Webhooks**: Real-time event notifications
• **OAuth Authentication**: Secure third-party access
• **Rate Limiting**: Fair usage and performance protection
• **API Documentation**: Comprehensive developer resources
• **SDK Libraries**: Multi-language support
• **Integration Templates**: Ready-to-use connection patterns

**Third-Party Services:**
• **Cloud Storage**: Google Drive, Dropbox, OneDrive integration
• **Productivity Tools**: Slack, Teams, Notion connections
• **Development Tools**: GitHub, GitLab, JIRA integration
• **Analytics Services**: Google Analytics, Mixpanel tracking
• **Communication**: Email, SMS, push notification support
• **Calendar Integration**: Schedule and sync with calendars
• **Payment Systems**: Subscription and billing management

**Developer Ecosystem:**
• **Plugin System**: Extend functionality with custom plugins
• **Theme Development**: Create and share custom themes
• **Workflow Marketplace**: Share automation patterns
• **Open Source**: Community-driven development
• **Contributor Program**: Rewards for community contributions
• **Beta Testing**: Early access to new features
• **Developer Support**: Technical assistance and resources

## 🛡️ Security & Privacy

**Data Protection:**
• **End-to-End Encryption**: Protect sensitive data
• **Local Storage**: Data stays on your device by default
• **Secure Backup**: Encrypted cloud backup options
• **Data Portability**: Export your data anytime
• **Privacy Controls**: Granular data sharing preferences
• **Compliance**: GDPR, CCPA, and privacy regulation adherence
• **Security Audits**: Regular security assessments

**Access Control:**
• **Multi-Factor Authentication**: Extra security layer
• **Session Management**: Control active sessions and devices
• **Permission System**: Fine-grained access controls
• **Audit Logging**: Track all system activities
• **Rate Limiting**: Prevent abuse and attacks
• **IP Whitelisting**: Restrict access by location
• **Backup Encryption**: Secure data backup and recovery

Which feature area would you like to explore in detail?`,
      tools: []
    };
  }

  // Settings and customization
  if (q.includes('settings') || q.includes('customize') || q.includes('theme') || q.includes('appearance')) {
    return {
      text: `⚙️ **Settings & Customization**

**Appearance Settings:**
• **Theme**: Light, Dark, or Auto
• **Accent Color**: Choose from 8 color options
• **Font Size**: Adjust text size for comfort
• **View Mode**: Grid, List, Expanded, or Kanban

**Animation Settings:**
• **Intensity**: Subtle, Normal, Bold, or None
• **Reduce Motion**: Accessibility option

**Account Settings:**
• **Profile**: Update your information
• **Preferences**: Customize your experience
• **Privacy**: Control data and settings

**Advanced Options:**
• **Export Data**: Download your tool collection
• **Import Tools**: Bulk add from CSV/JSON
• **Backup Settings**: Save your configuration

Access Settings by clicking the **gear icon** in the header or footer. Each section has tabs for easy navigation!`,
      tools: []
    };
  }

  // Keyboard shortcuts
  if (q.includes('shortcuts') || q.includes('keyboard') || q.includes('hotkeys') || q.includes('keys')) {
    return {
      text: `⌨️ **Keyboard Shortcuts**

**Navigation:**
• **?** or **Ctrl+/**: Show shortcuts dialog
• **Ctrl+D**: Go to Analytics
• **Ctrl+S**: Open Settings
• **Ctrl+K**: Focus search bar

**Tool Management:**
• **Ctrl+N**: Add new tool
• **Enter**: Launch selected tool
• **Space**: Toggle favorite status
• **Delete**: Remove selected tool

**View Modes:**
• **Ctrl+1**: Grid view
• **Ctrl+2**: List view
• **Ctrl+3**: Expanded view
• **Ctrl+4**: Kanban view

**Chat:**
• **Esc**: Close any modal/dialog
• **Enter**: Send message (in chat)
• **Shift+Enter**: New line (in chat)

**Productivity:**
• **Ctrl+F**: Find in current view
• **Ctrl+A**: Select all items
• **Esc**: Cancel current action

Press **?** anytime to see the shortcuts dialog!`,
      tools: []
    };
  }

  // Collections help
  if (q.includes('collection') || q.includes('organize') || q.includes('group')) {
    return {
      text: `📁 **Collections - Organize Your Tools**

**What are Collections?**
Collections are custom groups that help you organize related AI tools for better workflow management.

**Creating Collections:**
1. Click **"New Collection"** button above categories
2. Give it a name and choose a color
3. Add tools by clicking **"Add to Collection"** on tool cards
4. Drag and drop to reorder within collections

**Collection Ideas:**
• **Work Projects**: Tools for specific clients/projects
• **Daily Routine**: Tools you use every day
• **Creative Suite**: Design and content creation tools
• **Development Stack**: Programming and debugging tools
• **Research Tools**: Data analysis and research tools

**Managing Collections:**
• **Edit**: Click the settings icon on collection tabs
• **Delete**: Remove unwanted collections
• **Reorder**: Drag tabs to rearrange priority
• **Color Code**: Use colors for visual organization

**Benefits:**
• Faster tool access
• Better workflow organization
• Reduced clutter
• Team collaboration ready

Start organizing by clicking the **"New Collection"** button!`,
      tools: []
    };
  }

  // Analytics help
  if (q.includes('analytics') || q.includes('statistics') || q.includes('usage') || q.includes('tracking')) {
    return {
      text: `📊 **Analytics Dashboard**

**What Analytics Track:**
• **Tool Usage**: How often you launch each tool
• **Favorite Tools**: Most-starred and accessed tools
• **Category Breakdown**: Usage by tool categories
• **Time Trends**: Usage patterns over time
• **Unused Tools**: Tools you haven't accessed recently

**Key Metrics:**
• **Total Tools**: Number of tools in your collection
• **Active Tools**: Tools used in the last 30 days
• **Favorite Count**: How many tools you've starred
• **Collection Usage**: How you use organized groups

**Analytics Features:**
• **Visual Charts**: Easy-to-read graphs and charts
• **Date Ranges**: Filter by time periods
• **Export Data**: Download usage reports
• **Insights**: AI-powered recommendations

**Getting Insights:**
• Discover your most productive tools
• Identify underutilized tools
• Optimize your tool collection
• Track ROI on AI tool investments

Access Analytics from the **Header navigation** or **Footer links**. The dashboard updates in real-time as you use tools!`,
      tools: []
    };
  }

  // Workflows help
  if (q.includes('workflow') || q.includes('automation') || q.includes('sequence')) {
    return {
      text: `⚡ **Workflows - Automate Your AI Tasks**

**What are Workflows?**
Workflows are sequences of AI tools that work together to complete complex tasks automatically.

**Creating Workflows:**
1. Go to **Workflows** page from header navigation
2. Click **"Create New Workflow"**
3. Add tools in sequence (order matters!)
4. Configure connections between tools
5. Test and save your workflow

**Workflow Examples:**
• **Content Creation**: Writer → Editor → Formatter → Publisher
• **Image Processing**: Generator → Editor → Upscaler → Exporter
• **Data Analysis**: Collector → Processor → Visualizer → Reporter
• **Code Development**: Generator → Tester → Debugger → Deployer

**Workflow Features:**
• **Drag & Drop**: Easy tool sequencing
• **Conditional Logic**: Branch based on results
• **Variables**: Pass data between tools
• **Scheduling**: Run workflows automatically
• **Templates**: Save and reuse workflow patterns

**Benefits:**
• Save time on repetitive tasks
• Ensure consistent results
• Reduce manual errors
• Scale your AI operations

**Tips:**
• Start with simple 2-3 tool workflows
• Test each step individually
• Use descriptive names for clarity
• Document complex workflows

Ready to automate? Click **Workflows** in the header to get started!`,
      tools: []
    };
  }

  // Categories and organization
  if (q.includes('category') || q.includes('categories') || q.includes('organize') || q.includes('group')) {
    return {
      text: `📂 **Complete Category & Organization Guide**

## 🏷️ Built-in Categories

**Content Creation:**
• **Text & Writing**: ChatGPT, Claude, Jasper, Copy.ai, Grammarly
• **Image Generation**: DALL-E, Midjourney, Stable Diffusion, Leonardo
• **Video & Audio**: Runway, Descript, ElevenLabs, Synthesia
• **Design & Graphics**: Canva, Figma, Adobe Creative Suite, Sketch

**Development & Technical:**
• **Code & Development**: GitHub Copilot, Replit, CodePen, Stack Overflow
• **Data & Analytics**: Tableau, Power BI, Google Analytics, Mixpanel
• **API & Integration**: Zapier, Make.com, IFTTT, Postman
• **Testing & QA**: Selenium, Cypress, Jest, Mocha

**Business & Productivity:**
• **Marketing & Sales**: HubSpot, Salesforce, Mailchimp, Buffer
• **Project Management**: Asana, Trello, Notion, Monday.com
• **Research Tools**: Perplexity, Elicit, Semantic Scholar, Google Scholar
• **Productivity**: Todoist, RescueTime, Forest, Clockify

**Specialized Categories:**
• **Education & Learning**: Coursera, Khan Academy, Duolingo, Quizlet
• **Finance & Accounting**: QuickBooks, Xero, Mint, YNAB
• **Customer Service**: Zendesk, Intercom, Freshdesk, LiveChat
• **HR & Recruitment**: LinkedIn, Indeed, Greenhouse, Lever

## 🎯 Category Management

**Category Features:**
• **Automatic Categorization**: AI suggests categories based on tool descriptions
• **Custom Categories**: Create your own category types
• **Category Icons**: Visual identification with unique icons
• **Category Colors**: Color-coded organization system
• **Category Statistics**: Track usage per category
• **Category Workflows**: Apply workflows to entire categories

**Advanced Organization:**
• **Subcategories**: Create hierarchical category structures
• **Category Tags**: Add multiple tags for cross-referencing
• **Category Relationships**: Link related categories
• **Category Permissions**: Control access to specific categories
• **Category Templates**: Pre-configured category setups
• **Category Analytics**: Deep insights into category usage

**Category Optimization:**
• **Usage Analysis**: See which categories you use most
• **Redundancy Detection**: Find overlapping categories
• **Category Merging**: Combine similar categories
• **Category Splitting**: Break down broad categories
• **Category Archiving**: Hide unused categories
• **Category Export**: Share category structures

## 🔍 Advanced Search System

**Search Types:**
• **Quick Search**: Instant results as you type
• **Advanced Search**: Complex queries with filters
• **Semantic Search**: Find tools by meaning, not just keywords
• **Visual Search**: Search by tool icons and screenshots
• **Voice Search**: Search using voice commands
• **Image Search**: Find tools by uploading screenshots

**Search Filters:**
• **Category Filter**: Search within specific categories
• **Collection Filter**: Limit search to selected collections
• **Date Range Filter**: Search tools added in specific timeframes
• **Usage Filter**: Find frequently or rarely used tools
• **Tag Filter**: Search by custom tags
• **Status Filter**: Active, inactive, archived tools

**Search Features:**
• **Search History**: Track and reuse previous searches
• **Saved Searches**: Save complex search queries
• **Search Suggestions**: AI-powered search recommendations
• **Search Analytics**: Track what you're looking for
• **Search Shortcuts**: Quick access to common searches
• **Search Export**: Export search results

## 📊 Smart Organization

**AI-Powered Organization:**
• **Smart Suggestions**: Get organization recommendations
• **Duplicate Detection**: Find and merge duplicate tools
• **Usage Patterns**: Learn from your organization habits
• **Optimization Tips**: Improve your organization structure
• **Automated Tagging**: Auto-tag tools based on content
• **Relationship Mapping**: Visualize tool connections

**Organization Strategies:**
• **Project-Based**: Organize by client or project
• **Workflow-Based**: Group by process or workflow
• **Skill-Based**: Organize by skill level or expertise
• **Frequency-Based**: Group by usage frequency
• **Priority-Based**: Organize by importance or urgency
• **Cost-Based**: Group by subscription costs or ROI

**Best Practices:**
• **Consistent Naming**: Use clear, descriptive names
• **Logical Structure**: Create intuitive organization hierarchies
• **Regular Maintenance**: Review and update organization regularly
• **Team Collaboration**: Share organization with team members
• **Backup Strategies**: Save and backup organization structures
• **Documentation**: Document your organization system

## 🎨 Visual Organization

**Layout Options:**
• **Grid View**: Traditional card-based layout
• **List View**: Compact, information-dense layout
• **Kanban View**: Board-style organization
• **Expanded View**: Detailed tool information
• **Timeline View**: Chronological organization
• **Mind Map View**: Visual relationship mapping

**Customization Features:**
• **Card Size**: Adjust tool card dimensions
• **Information Density**: Control how much information is displayed
• **Sorting Options**: Multiple sorting criteria
• **Grouping Options**: Various grouping strategies
• **Filter Presets**: Save common filter combinations
• **View Templates**: Reusable view configurations

**Visual Enhancements:**
• **Tool Icons**: Custom icons for visual identification
• **Category Colors**: Color-coded organization
• **Status Indicators**: Visual status for each tool
• **Progress Bars**: Usage or completion indicators
• **Thumbnail Previews**: Tool interface previews
• **Interactive Elements**: Hover effects and animations

What aspect of organization would you like to explore further?`,
      tools: []
    };
  }

  // Import export and data management
  if (q.includes('import') || q.includes('export') || q.includes('backup') || q.includes('data')) {
    return {
      text: `💾 **Complete Data Management Guide**

## 📤 Export Options

**Export Formats:**
• **CSV Export**: Spreadsheet-compatible format for tools and collections
• **JSON Export**: Complete data structure with all metadata
• **PDF Export**: Printable reports and documentation
• **XML Export**: Structured data for system integration
• **SQL Export**: Database-ready format
• **Custom Export**: Tailored export formats

**Export Content:**
• **Tool Collection**: All tools with metadata and usage data
• **Collections Structure**: Organization hierarchy and relationships
• **Analytics Data**: Usage statistics and insights
• **Workflow Definitions**: Complete workflow configurations
• **Settings & Preferences**: Customization and configuration
• **Activity Logs**: Historical action records

**Export Features:**
• **Scheduled Exports**: Automated regular backups
• **Incremental Exports**: Only export changed data
• **Filtered Exports**: Export specific subsets of data
• **Encrypted Exports**: Password-protected data files
• **Cloud Storage**: Direct export to cloud services
• **Email Delivery**: Automatic email sending of exports

## 📥 Import Capabilities

**Import Sources:**
• **CSV Files**: Spreadsheet imports with validation
• **JSON Data**: Structured data imports
• **API Imports**: Direct data from external APIs
• **Database Imports**: SQL database connections
• **Web Scraping**: Automated data extraction
• **Manual Entry**: Guided data input process

**Import Processing:**
• **Data Validation**: Ensure data quality and consistency
• **Duplicate Detection**: Identify and handle duplicates
• **Data Mapping**: Map import fields to AIPulse structure
• **Category Assignment**: Auto-categorize imported tools
• **Metadata Enrichment**: Add missing information automatically
• **Error Handling**: Comprehensive error reporting and recovery

**Import Features:**
• **Preview Mode**: Review imports before committing
• **Batch Processing**: Handle large datasets efficiently
• **Progress Tracking**: Real-time import progress monitoring
• **Rollback Capability**: Undo failed imports
• **Transformation Rules**: Custom data transformation logic
• **Import Templates**: Reusable import configurations

## 🔄 Backup & Recovery

**Backup Types:**
• **Full Backups**: Complete system state backup
• **Incremental Backups**: Only changed data since last backup
• **Differential Backups**: All changes since last full backup
• **Continuous Backup**: Real-time data protection
• **Scheduled Backups**: Automated backup routines
• **Manual Backups**: On-demand backup creation

**Backup Storage:**
• **Local Storage**: Save to your computer
• **Cloud Storage**: Google Drive, Dropbox, OneDrive
• **Network Storage**: NAS or enterprise storage
• **Encrypted Storage**: Secure encrypted backup locations
• **Redundant Storage**: Multiple backup locations
• **Archive Storage**: Long-term data retention

**Recovery Options:**
• **Point-in-Time Recovery**: Restore to specific dates
• **Selective Recovery**: Restore only specific data
• **Granular Recovery**: Individual tool or collection recovery
• **Emergency Recovery**: Quick system restoration
• **Cross-Platform Recovery**: Restore on different systems
• **Data Validation**: Verify recovered data integrity

## 🔐 Data Security

**Encryption Options:**
• **AES-256 Encryption**: Military-grade data protection
• **End-to-End Encryption**: Data encrypted during transmission
• **At-Rest Encryption**: Encrypted storage protection
• **Key Management**: Secure encryption key handling
• **Password Protection**: Custom password security
• **Two-Factor Encryption**: Multiple authentication factors

**Security Features:**
• **Access Controls**: Granular permission management
• **Audit Logging**: Complete access and modification tracking
• **Data Integrity**: Checksums and validation
• **Secure Deletion**: Permanent data removal
• **Compliance Standards**: GDPR, HIPAA, SOX compliance
• **Security Audits**: Regular security assessments

## 📊 Data Analytics

**Data Insights:**
• **Usage Analytics**: Tool and collection usage patterns
• **Growth Metrics**: Collection growth over time
• **Performance Data**: System performance statistics
• **User Behavior**: Interaction and preference analysis
• **Trend Analysis**: Long-term usage trends
• **Predictive Analytics**: Future usage predictions

**Reporting Features:**
• **Custom Reports**: Tailored data reports
• **Automated Reports**: Scheduled report generation
• **Interactive Dashboards**: Real-time data visualization
• **Export Options**: Multiple report formats
• **Sharing Capabilities**: Report distribution and collaboration
• **Historical Tracking**: Long-term data comparison

## 🛠️ Advanced Data Management

**Data Transformation:**
• **Format Conversion**: Convert between different data formats
• **Data Cleansing**: Remove duplicates and fix errors
• **Data Enrichment**: Add missing information automatically
• **Normalization**: Standardize data formats
• **Validation Rules**: Custom data quality checks
• **Data Profiling**: Analyze data characteristics

**Integration Options:**
• **API Integration**: Connect with external systems
• **Webhook Support**: Real-time data synchronization
• **Database Integration**: Direct database connections
• **Enterprise Systems**: ERP, CRM integration
• **Third-Party Tools**: External software connections
• **Custom Integrations**: Bespoke integration solutions

**Data Governance:**
• **Data Classification**: Categorize data by sensitivity
• **Retention Policies**: Automated data lifecycle management
• **Compliance Reporting**: Regulatory compliance documentation
• **Data Lineage**: Track data origin and transformations
• **Quality Metrics**: Data quality assessment
• **Governance Workflows**: Automated approval processes

What specific data management task would you like help with?`,
      tools: []
    };
  }

  // Performance and optimization
  if (q.includes('performance') || q.includes('speed') || q.includes('optimization') || q.includes('slow')) {
    return {
      text: `⚡ **Complete Performance & Optimization Guide**

## 🚀 Performance Fundamentals

**System Requirements:**
• **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
• **Memory Requirements**: Minimum 4GB RAM, recommended 8GB+
• **Storage**: Local storage for data and cache (100MB recommended)
• **Network**: Stable internet connection for cloud features
• **Processor**: Modern dual-core processor or better
• **Graphics**: Hardware acceleration support recommended

**Performance Monitoring:**
• **Page Load Time**: Track initial load performance
• **Interaction Response**: Measure UI responsiveness
• **Memory Usage**: Monitor browser memory consumption
• **Network Activity**: Track API calls and data transfer
• **Rendering Performance**: Monitor frame rates and animations
• **Storage Usage**: Track local storage consumption

## 🔧 Optimization Strategies

**Browser Optimization:**
• **Enable Hardware Acceleration**: Use GPU for rendering
• **Clear Cache Regularly**: Remove old cached data
• **Disable Unnecessary Extensions**: Reduce browser overhead
• **Update Browser**: Use latest browser versions
• **Configure Browser Settings**: Optimize for performance
• **Use Browser DevTools**: Identify performance bottlenecks

**AIPulse Settings:**
• **Reduce Animation Intensity**: Lower or disable animations
• **Enable Reduce Motion**: Accessibility-friendly mode
• **Optimize View Mode**: Choose performance-optimized layouts
• **Limit Tool Cards**: Display fewer tools per page
• **Disable Auto-Refresh**: Reduce background updates
• **Optimize Search**: Limit search result counts

**Data Optimization:**
• **Archive Unused Tools**: Hide inactive tools from main view
• **Optimize Collections**: Streamline organization structure
• **Clean Up Metadata**: Remove unnecessary tool information
• **Compress Images**: Optimize tool icons and screenshots
• **Limit History**: Reduce stored activity data
• **Regular Cleanup**: Schedule data maintenance

## 📊 Performance Metrics

**Key Performance Indicators:**
• **Time to Interactive**: Time until page is fully usable
• **First Contentful Paint**: Initial content display time
• **Largest Contentful Paint**: Main content load time
• **Cumulative Layout Shift**: Visual stability metric
• **First Input Delay**: Response time to first interaction
• **Memory Footprint**: Browser memory consumption

**Monitoring Tools:**
• **Browser DevTools**: Performance profiling and analysis
• **AIPulse Analytics**: Built-in performance tracking
• **Network Monitor**: API call performance tracking
• **Memory Profiler**: Memory usage analysis
• **Rendering Inspector**: Animation and rendering performance
• **Storage Analyzer**: Local storage usage tracking

## 🎯 Specific Optimizations

**Large Collection Performance:**
• **Virtual Scrolling**: Only render visible tools
• **Lazy Loading**: Load tools on demand
• **Pagination**: Break large collections into pages
• **Search Optimization**: Improve search algorithm efficiency
• **Caching Strategy**: Smart data caching
• **Background Loading**: Load data in background

**Animation Performance:**
• **CSS Transforms**: Use hardware-accelerated animations
• **RequestAnimationFrame**: Smooth JavaScript animations
• **Animation Throttling**: Reduce animation frequency
• **Reduced Motion**: Accessibility-friendly animations
• **Performance Budgets**: Limit animation complexity
• **Fallback Options**: Graceful degradation for slow devices

**Network Optimization:**
• **API Caching**: Reduce redundant API calls
• **Data Compression**: Minimize data transfer
• **Batch Operations**: Group multiple operations
• **Offline Support**: Work without internet connection
• **Progressive Loading**: Load essential data first
• **Error Handling**: Robust network error recovery

## 🔍 Performance Troubleshooting

**Common Issues:**
• **Slow Loading**: Check network and browser performance
• **High Memory Usage**: Reduce data and optimize storage
• **Unresponsive UI**: Identify blocking operations
• **Animation Stutter**: Reduce animation complexity
• **Search Lag**: Optimize search algorithms
• **Crash Issues**: Check browser compatibility

**Diagnostic Steps:**
1. **Check Browser Console**: Look for JavaScript errors
2. **Monitor Network Tab**: Identify slow API calls
3. **Profile Memory**: Find memory leaks
4. **Test Different Browsers**: Isolate browser-specific issues
5. **Disable Extensions**: Rule out extension conflicts
6. **Clear Data**: Start with clean state

**Performance Testing:**
• **Load Testing**: Test with large tool collections
• **Stress Testing**: Test system limits
• **Regression Testing**: Prevent performance degradation
• **A/B Testing**: Compare optimization strategies
• **User Testing**: Real-world performance validation
• **Automated Testing**: Continuous performance monitoring

## 🛠️ Advanced Optimization

**Code Optimization:**
• **Bundle Size Reduction**: Minimize JavaScript payload
• **Tree Shaking**: Remove unused code
• **Code Splitting**: Load code on demand
• **Minification**: Compress code files
• **Image Optimization**: Compress visual assets
• **Font Optimization**: Optimize text rendering

**Database Optimization:**
• **Indexing Strategy**: Improve query performance
• **Query Optimization**: Efficient data retrieval
• **Caching Layer**: Memory-based data caching
• **Data Archiving**: Move old data to archive
• **Connection Pooling**: Optimize database connections
• **Query Caching**: Cache frequent queries

**Infrastructure Optimization:**
• **CDN Usage**: Content delivery network
• **Load Balancing**: Distribute server load
• **Caching Strategy**: Multi-level caching
• **Compression**: Reduce data transfer size
• **Security Optimization**: Efficient security measures
• **Monitoring**: Real-time performance tracking

## 📈 Performance Planning

**Performance Budgets:**
• **Load Time Budget**: Target load time limits
• **Memory Budget**: Memory usage constraints
• **Network Budget**: Data transfer limits
• **Animation Budget**: Animation complexity limits
• **Feature Budget**: Feature performance impact
• **User Experience Budget**: Overall UX performance

**Scaling Strategies:**
• **Horizontal Scaling**: Add more resources
• **Vertical Scaling**: Increase resource capacity
• **Caching Strategy**: Improve data access
• **Load Distribution**: Balance system load
• **Performance Monitoring**: Track scaling effectiveness
• **Capacity Planning**: Anticipate growth needs

What specific performance aspect would you like to optimize?`,
      tools: []
    };
  }

  // Troubleshooting and support
  if (q.includes('problem') || q.includes('issue') || q.includes('trouble') || q.includes('broken') || q.includes('not working')) {
    return {
      text: `🔧 **Complete Troubleshooting & Support Guide**

## 🚨 Common Issues & Solutions

### Tool Launch Problems
**Issue**: Tools not opening or launching
**Solutions**:
• Check internet connection stability
• Verify tool URLs are correct and accessible
• Clear browser cache and cookies (Ctrl+Shift+Delete)
• Disable ad blockers and popup blockers temporarily
• Try opening tools in incognito/private mode
• Check if tool requires specific browser extensions
• Verify tool subscription status and API keys
• Test tool URLs directly in browser

**Advanced Troubleshooting**:
• Check browser console for JavaScript errors (F12 → Console)
• Verify network requests in DevTools (F12 → Network)
• Test with different browsers (Chrome, Firefox, Safari, Edge)
• Disable browser extensions one by one
• Check for CORS or security policy issues
• Verify tool API endpoints are accessible
• Test tool authentication methods

### Search and Filter Issues
**Issue**: Search not returning results or filters not working
**Solutions**:
• Try different search terms and keywords
• Check spelling and try partial matches
• Browse by category instead of search
• Reset search filters and try again
• Clear search history and cache
• Check if tools have proper metadata
• Verify category assignments are correct
• Test with broader search terms

**Advanced Solutions**:
• Rebuild search index in settings
• Check tool descriptions and tags
• Verify collection assignments
• Test search with different criteria
• Check for special characters in search terms
• Verify database integrity
• Test search performance with large collections

### Collection and Organization Issues
**Issue**: Collections not saving, displaying, or organizing properly
**Solutions**:
• Refresh the page (F5 or Ctrl+R)
• Check browser local storage permissions
• Try creating a new collection
• Verify collection names don't have special characters
• Check collection color assignments
• Test with different collection structures
• Verify tool assignments to collections
• Check for duplicate collection names

**Advanced Troubleshooting**:
• Clear browser local storage for AIPulse
• Export and re-import collections
• Check for JavaScript errors in console
• Test collection creation in incognito mode
• Verify browser storage quota isn't exceeded
• Check for conflicting browser extensions
• Test collection sharing and permissions

## 🐛 Performance Issues

### Slow Loading and Responsiveness
**Symptoms**:
• Slow page load times
• Unresponsive interface
• Laggy animations and transitions
• High memory usage
• Browser crashes or freezes

**Solutions**:
• Reduce animation intensity in Settings
• Switch to Grid view for better performance
• Enable "Reduce Motion" in accessibility settings
• Close unused browser tabs
• Clear browser cache and data
• Update browser to latest version
• Disable unnecessary browser extensions
• Restart browser and computer

**Performance Optimization**:
• Limit number of tools displayed per page
• Archive unused tools and collections
• Optimize tool images and icons
• Reduce search result counts
• Enable performance monitoring in settings
• Use browser developer tools to identify bottlenecks
• Check for memory leaks in browser console

### Memory and Storage Issues
**Symptoms**:
• "Out of memory" errors
• Slow performance with large collections
• Data not saving properly
• Browser storage quota exceeded

**Solutions**:
• Clear browser local storage and cache
• Archive or delete unused tools
• Export and backup data regularly
• Reduce tool metadata and descriptions
• Optimize collection structures
• Use browser storage management tools
• Consider upgrading to browser with higher storage limits

## 🔧 Browser-Specific Issues

### Chrome Issues
**Common Problems**:
• Extensions interfering with functionality
• Strict security policies blocking features
• Memory leaks with heavy usage
• Sync conflicts across devices

**Solutions**:
• Disable problematic extensions
• Adjust security settings in chrome://settings
• Clear browsing data regularly
• Reset Chrome settings if needed
• Check for Chrome updates
• Use Chrome DevTools for debugging
• Test in incognito mode

### Firefox Issues
**Common Problems**:
• Tracking protection blocking features
• Extension compatibility issues
• Different rendering engine quirks
• Storage permission problems

**Solutions**:
• Adjust tracking protection settings
• Update extensions to latest versions
• Check Firefox compatibility
• Verify storage permissions
• Use Firefox Developer Tools
• Test in private browsing mode
• Reset Firefox if needed

### Safari Issues
**Common Problems**:
• Stricter security policies
• Different storage mechanisms
• Touch interface issues
• Extension limitations

**Solutions**:
• Adjust security and privacy settings
• Enable developer menu for debugging
• Check Safari storage permissions
• Test with different Safari versions
• Use Web Inspector for debugging
• Clear Safari cache and data
• Reset Safari if needed

## 🆘 Support Resources

### Self-Service Support
**Available Resources**:
• **Comprehensive Documentation**: Detailed guides and tutorials
• **FAQ Database**: 500+ common questions and answers
• **Video Tutorials**: Step-by-step visual guides
• **Interactive Demos**: Hands-on learning experiences
• **Community Forums**: Peer support and discussions
• **Knowledge Base**: In-depth articles and how-to guides

**Diagnostic Tools**:
• **System Check**: Browser compatibility and performance test
• **Network Test**: Connection speed and reliability test
• **Storage Analysis**: Local storage usage and optimization
• **Performance Monitor**: Real-time performance tracking
• **Error Log Viewer**: Detailed error information
• **Health Check**: Overall system status assessment

### Community Support
**Platforms**:
• **Discord Server**: Real-time chat with community and team
• **GitHub Discussions**: Feature requests and bug reports
• **Stack Overflow**: Technical questions and answers
• **Reddit Community**: User discussions and tips
• **Twitter Support**: Quick questions and updates
• **YouTube Channel**: Video tutorials and walkthroughs

**Community Resources**:
• **User-Generated Guides**: Community-created tutorials
• **Workflow Templates**: Shared automation patterns
• **Collection Templates**: Pre-built organization structures
• **Integration Examples**: Real-world use cases
• **Best Practices**: Community-optimized workflows
• **Troubleshooting Tips**: User-provided solutions

### Direct Support Channels
**Available Options**:
• **Support Tickets**: Formal issue tracking and resolution
• **Email Support**: Detailed problem assistance
• **Live Chat**: Real-time help during business hours
• **Screen Sharing**: Guided troubleshooting sessions
• **Video Calls**: In-depth problem resolution
• **Priority Support**: Premium support options

**Support Process**:
1. **Initial Assessment**: Quick problem identification
2. **Information Gathering**: Collect system and usage details
3. **Troubleshooting Steps**: Systematic problem solving
4. **Solution Implementation**: Apply fixes and workarounds
5. **Follow-up**: Ensure problem resolution
6. **Documentation**: Record solutions for future reference

## 📋 Issue Reporting Guidelines

### What to Include
**Essential Information**:
• **Problem Description**: Clear, detailed issue description
• **Steps to Reproduce**: Exact steps to recreate the problem
• **Expected vs Actual**: What should happen vs. what happens
• **Error Messages**: Complete error text and screenshots
• **System Information**: Browser, OS, and device details
• **Recent Changes**: Any recent updates or changes

**Additional Context**:
• **Usage Patterns**: How you typically use AIPulse
• **Collection Size**: Number of tools and collections
• **Custom Settings**: Any custom configurations
• **Browser Extensions**: List of enabled extensions
• **Network Environment**: Corporate network, VPN, etc.
• **Time of Issue**: When the problem occurs

### Reporting Channels
**Preferred Methods**:
• **Support Form**: Structured issue reporting
• **GitHub Issues**: Technical bug reports
• **Email Support**: Detailed problem descriptions
• **Discord Support**: Quick questions and live help
• **Community Forums**: General questions and discussions

**Response Times**:
• **Critical Issues**: Within 24 hours
• **High Priority**: Within 48 hours
• **Normal Priority**: Within 72 hours
• **Low Priority**: Within 1 week
• **Community Questions**: As community responds

## 🔄 Prevention and Maintenance

### Regular Maintenance
**Weekly Tasks**:
• Clear browser cache and cookies
• Check for browser updates
• Review tool collection for duplicates
• Backup important data
• Check storage usage
• Test key functionalities

**Monthly Tasks**:
• Archive unused tools
• Review and update categories
• Check collection organization
• Update tool metadata
• Review analytics and insights
• Test backup and restore procedures

**Quarterly Tasks**:
• Deep clean browser data
• Review all settings and preferences
• Update tool descriptions and URLs
• Optimize collection structures
• Review security settings
• Test performance optimization

### Proactive Monitoring
**Key Metrics to Track**:
• Page load times and responsiveness
• Memory usage patterns
• Search performance
• Tool launch success rates
• Error frequency and types
• User interaction patterns

**Alert Thresholds**:
• Load time > 3 seconds
• Memory usage > 1GB
• Error rate > 5%
• Search time > 2 seconds
• Tool launch failures > 10%
• Storage usage > 80% of quota

Still experiencing issues? Start with the **System Check** in Settings, then contact support through your preferred channel!`,
      tools: []
    };
  }

  // "unused" / "haven't used"
  if (q.includes('unused') || q.includes("haven't used") || q.includes("not used")) {
    const thirtyDaysAgo = Date.now() - 30 * 86_400_000;
    const unused = tools.filter((t) => !t.lastAccessed || t.lastAccessed < thirtyDaysAgo).slice(0, 5);
    if (unused.length === 0) return { text: "You've used all your tools recently. Great job exploring everything!", tools: [] };
    return {
      text: `Here are tools you haven't launched in the past 30 days — time to revisit them!`,
      tools: unused,
    };
  }

  // "favorite" / "pinned"
  if (q.includes('favorite') || q.includes('pinned') || q.includes('starred')) {
    const favs = tools.filter((t) => t.isFavorite);
    if (favs.length === 0) return { text: "You haven't favorited any tools yet. Click the ⭐ on any card to pin it!", tools: [] };
    return { text: `You have ${favs.length} favorited tool${favs.length > 1 ? 's' : ''}:`, tools: favs.slice(0, 5) };
  }

  // "recent" / "recently"
  if (q.includes('recent') || q.includes('last used') || q.includes('latest')) {
    const recent = recentIds.map((id) => tools.find((t) => t.id === id)).filter(Boolean) as AITool[];
    if (recent.length === 0) return { text: "You haven't launched any tools yet. Click 'Launch' on any tool card!", tools: [] };
    return { text: `Your recently used tools:`, tools: recent.slice(0, 5) };
  }

  // "free" tools
  if (q.includes('free')) {
    const free = tools.filter((t) => t.description?.toLowerCase().includes('free')).slice(0, 5);
    if (free.length === 0) {
      return { text: "I couldn't find tools explicitly marked as free. Try editing tool descriptions to include 'free' for better search results.", tools: [] };
    }
    return { text: `Here are tools marked as free in your collection:`, tools: free };
  }

  // "trending" / "popular"
  if (q.includes('trending') || q.includes('popular') || q.includes('most used')) {
    return {
      text: `Check the Analytics page for your most-used tools! Based on your collection, here are some popular AI tools:`,
      tools: tools.slice(0, 5),
    };
  }

  // "compare"
  const compareMatch = q.match(/compare (.+?) and (.+)/);
  if (compareMatch) {
    const [, a, b] = compareMatch;
    const toolA = tools.find((t) => t.name.toLowerCase().includes(a.trim()));
    const toolB = tools.find((t) => t.name.toLowerCase().includes(b.trim()));
    const found = [toolA, toolB].filter(Boolean) as AITool[];
    if (found.length === 0) return { text: `I couldn't find those tools in your collection. Add them first!`, tools: [] };
    return {
      text: `Here's a side-by-side view of the tools I found. Click Launch on each to compare them yourself:`,
      tools: found,
    };
  }

  // Category search
  const categories = [...new Set(tools.map((t) => t.category))];
  for (const cat of categories) {
    if (q.includes(cat.toLowerCase())) {
      const catTools = tools.filter((t) => t.category === cat);
      return {
        text: `Found ${catTools.length} tools in "${cat}":`,
        tools: catTools.slice(0, 5),
      };
    }
  }

  // Keyword search in tool names/descriptions
  const keyword = q.replace(/\b(find|show|get|need|want|best|tool|for|me|a|an|the|is|what|recommend)\b/g, '').trim();
  if (keyword.length > 2) {
    const matched = tools.filter(
      (t) =>
        t.name.toLowerCase().includes(keyword) ||
        t.description?.toLowerCase().includes(keyword) ||
        t.category.toLowerCase().includes(keyword)
    );
    if (matched.length > 0) {
      return {
        text: `Here are tools matching "${keyword}":`,
        tools: matched.slice(0, 5),
      };
    }
  }

  // How many tools
  if (q.includes('how many')) {
    const cats = [...new Set(tools.map((t) => t.category))];
    return {
      text: `You have **${tools.length} tools** across ${cats.length} categories:\n${cats.map((c) => `• ${c}: ${tools.filter((t) => t.category === c).length}`).join('\n')}`,
      tools: [],
    };
  }

  // Fallback
  const randomTools = [...tools].sort(() => Math.random() - 0.5).slice(0, 3);
  return {
    text: `I'm your AIPulse assistant! I can help you:\n• Find tools ("find a free image generator")\n• Compare tools ("compare ChatGPT and Claude")\n• Browse by category ("show coding tools")\n• Review favorites, recent, or unused tools\n\nHere are some random picks from your collection:`,
    tools: randomTools,
  };
}

const SUGGESTIONS = [
  'Show my favorites',
  'What tools have I not used?',
  'Find coding tools',
  'Show recently used',
  'Compare tools',
  'How do I create collections?',
  'What are keyboard shortcuts?',
  'Help getting started',
  'Tell me about all features',
  'How does analytics work?',
  'Performance optimization tips',
  'Documentation and resources',
  'Troubleshooting issues',
  'Data management guide',
  'Category organization',
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello! I'm your AIPulse Assistant. I can help you find the perfect AI tools, organize your collection, and optimize your workflow. What would you like to explore?",
      tools: [],
      timestamp: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { tools, recordUsage, recentlyUsed } = useToolsStore();
  const { isPremium, openUpgradeModal } = usePremium();

  // Free query tracking
  const getFreeQueryKey = () => `aipulse_free_queries_${new Date().toISOString().split('T')[0]}`;
  const getFreeQueriesUsed = () => {
    const key = getFreeQueryKey();
    return parseInt(localStorage.getItem(key) || '0');
  };
  const incrementFreeQueries = () => {
    const key = getFreeQueryKey();
    const current = getFreeQueriesUsed();
    localStorage.setItem(key, (current + 1).toString());
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const query = input.trim();
    if (!query) return;

    // Check free query limit for non-premium users
    if (!isPremium) {
      const freeQueriesUsed = getFreeQueriesUsed();
      if (freeQueriesUsed >= 1) {
        // Show limit message instead of processing
        const limitMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: "You've used your free daily query — Upgrade for unlimited AI assistance!\n\nGet personalized tool recommendations, smart search, and workflow suggestions based on your usage patterns.",
          tools: [],
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, limitMsg]);
        setInput('');
        return;
      }
      incrementFreeQueries();
    }

    setInput('');
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: query,
      tools: [],
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate brief thinking time
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const response = getLocalResponse(query, tools, recentlyUsed);
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: response.text,
      tools: response.tools,
      timestamp: Date.now(),
    };
    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      text: "Chat cleared! How can I help you today?",
      tools: [],
      timestamp: Date.now(),
    }]);
  };

  const chatWidth = isExpanded ? 'w-[480px]' : 'w-[360px]';
  const chatHeight = isExpanded ? 'max-h-[80vh] min-h-[400px]' : 'max-h-[75vh] min-h-[500px]';

  // Show teaser for free users, full assistant for premium
  if (!isPremium && isOpen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-[380px] bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl shadow-2xl overflow-hidden sm:right-6 max-sm:right-2 max-sm:left-2 max-sm:w-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-border bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-text-primary">✨ AI Assistant — Premium</p>
                <p className="text-xs text-violet-600 dark:text-violet-400">Upgrade to unlock</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Get AI-powered tool recommendations, smart search, and workflow suggestions based on your usage patterns.
            </p>

            {/* Feature previews */}
            <div className="space-y-3 mb-6">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 blur-sm" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Find me the best tool for image generation</p>
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg blur-sm" />
              </div>
              
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 blur-sm" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">What tools haven't I used in 30 days?</p>
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg blur-sm" />
              </div>
            </div>

            {/* CTA buttons */}
            <div className="space-y-2">
              <button
                onClick={openUpgradeModal}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm"
              >
                Unlock AI Assistant →
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium py-2 px-4 rounded-xl transition-colors text-sm"
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
            className={cn(
              'fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden',
              chatWidth, chatHeight,
              'sm:right-6 max-sm:right-2 max-sm:left-2 max-sm:w-auto max-sm:max-h-[90vh]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-border bg-gray-100 dark:bg-background-dark/50 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                  <img src="/logo.svg" alt="AIPulse" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-text-primary">AIPulse Assistant</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card transition-colors" title="Clear chat">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card transition-colors" title="Expand">
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div className={cn('max-w-[85%] space-y-2', msg.role === 'user' ? 'items-end' : 'items-start')}>
                    <div className={cn(
                      'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-primary text-black rounded-tr-sm'
                        : 'bg-gray-100 dark:bg-background-dark text-gray-900 dark:text-text-primary rounded-tl-sm'
                    )}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    {/* Tool results */}
                    {msg.tools && msg.tools.length > 0 && (
                      <div className="space-y-1.5 w-full">
                        {msg.tools.map((tool) => (
                          <div key={tool.id} className="flex items-center gap-2.5 px-3 py-2 bg-gray-100 dark:bg-background-dark border border-gray-200 dark:border-border rounded-xl hover:border-primary/50 transition-colors group">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 dark:text-text-primary truncate">{tool.name}</p>
                              <p className="text-xs text-gray-500 dark:text-text-muted truncate">{tool.category}</p>
                            </div>
                            <button
                              onClick={() => {
                                recordUsage(tool.id);
                                window.open(tool.url, '_blank', 'noopener,noreferrer');
                              }}
                              className="flex-shrink-0 p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100"
                              title="Launch"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="px-4 py-3 bg-gray-100 dark:bg-background-dark rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-text-muted"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex gap-1.5 flex-wrap flex-shrink-0 max-h-32 overflow-y-auto">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="px-3 py-1.5 text-xs bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-full text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/30 hover:border-primary/50 dark:hover:border-primary/60 transition-all font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-border flex-shrink-0">
              <div className="flex items-center gap-2 bg-white dark:bg-background-card border-2 border-primary/30 dark:border-primary/40 rounded-xl px-3 py-2 focus-within:border-primary transition-colors shadow-sm">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your tools..."
                  className="flex-1 bg-transparent text-sm text-gray-900 dark:text-text-primary placeholder:text-primary/60 dark:placeholder:text-primary/50 outline-none min-w-0 font-medium"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="flex-shrink-0 p-1.5 rounded-lg bg-primary text-black hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-center text-xs text-gray-500 dark:text-text-muted mt-2">Powered by AIPulse Intelligence</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-300 relative',
          isOpen
            ? 'bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border text-gray-900 dark:text-text-primary'
            : 'bg-primary text-black shadow-primary/40'
        )}
        aria-label="Open AI Assistant"
      >
        {/* PRO badge for free users */}
        {!isPremium && !isOpen && (
          <div className="absolute -top-1 -right-1 bg-violet-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
            ✨ PRO
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <img src="/logo.svg" alt="AIPulse" className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
