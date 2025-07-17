# Rentory - Nigeria's Digital-First Rental Platform

![Rentory Logo](https://via.placeholder.com/200x80/16a34a/ffffff?text=Rentory)

## 🏠 Overview

Rentory is a revolutionary digital-first rental platform designed specifically for the Nigerian real estate market. We're transforming the traditional rental experience by connecting renters directly with verified landlords, eliminating agent fees, inspection charges, and lengthy bureaucratic processes.

### 🎯 Mission
To revolutionize Nigeria's rental market by creating a digital-first platform that connects renters directly with verified property owners, eliminating traditional pain points of agent fees, inspection charges, and lengthy processes.

### 🌟 Vision
To become Africa's leading rental platform, making quality housing accessible and affordable for every Nigerian family while empowering property owners with the tools they need to succeed.

## ✨ Key Features

### For Renters
### For Tenants
- **🔍 Smart Property Search**: Advanced filters for location, price, property type, and amenities
- **💰 No Agent Fees**: Connect directly with landlords and save thousands in commission
- **📱 Digital Applications**: Complete rental applications online with document upload
- **🔔 Search Alerts**: Get notified when properties matching your criteria become available
- **💬 Direct Messaging**: Communicate directly with property owners
- **⭐ Verified Properties**: All properties are physically inspected and verified
- **📊 Transparent Pricing**: Clear pricing with no hidden fees

### For Landlords
- **📝 Easy Property Listing**: Multi-step property listing with photo upload
- **👥 Tenant Management**: Manage applications and communicate with potential tenants
- **📈 Analytics Dashboard**: Track property views, applications, and performance
- **🔐 Tenant Verification**: Built-in tenant screening and verification system
- **💳 Secure Payments**: Integrated payment processing for rent collection
- **📱 Mobile Management**: Manage properties on-the-go

### For Agents (Professional Tier)
- **🏢 Multi-Property Management**: Manage multiple landlord accounts
- **📊 Advanced Analytics**: Comprehensive reporting and insights
- **👥 Client Management**: Organize and manage landlord relationships
- **🎯 Lead Generation**: Access to qualified leads and prospects

### For Admins
- **🛡️ Platform Management**: Complete oversight of users, properties, and transactions
- **👥 Agent Management**: Create and manage agent accounts
- **📈 System Analytics**: Platform-wide statistics and performance metrics
- **🔍 Verification System**: Manage property and user verification processes

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.3.5 (React 18.2.0)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom components
- **Icons**: Lucide React
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **Real-time**: Supabase Realtime subscriptions
- **File Storage**: Supabase Storage for images and documents
- **Email**: Resend API for transactional emails

### Infrastructure
- **Hosting**: Vercel (Frontend) / Supabase (Backend)
- **CDN**: Cloudinary for image optimization

## 📁 Project Structure

```
rentory/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── admin/                    # Admin dashboard
│   ├── agent/                    # Agent dashboard
│   ├── landlord/                 # Landlord dashboard
│   ├── dashboard/                # User dashboard
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── properties/
│   │   ├── applications/
│   │   └── messages/
│   ├── search/                   # Property search
│   ├── property/[id]/            # Property details
│   ├── list-property/            # Property listing form
│   ├── messages/                 # Messaging system
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── ui/                       # UI component library
│   ├── Navigation.jsx            # Main navigation
│   ├── Footer.jsx                # Site footer
│   ├── LiveChat.jsx              # Real-time messaging
│   └── MessageCenter.jsx         # Message management
├── hooks/                        # Custom React hooks
│   ├── useAuth.js                # Authentication hook
│   ├── useRealtime.js            # Real-time subscriptions
│   └── use-toast.js              # Toast notifications
├── lib/                          # Utility libraries
│   ├── db.js                     # Database client
│   ├── admin.js                  # Admin operations
│   └── storage.js                # File storage utilities
├── supabase/                     # Database schema & migrations
│   └── migrations/               # SQL migration files
└── middleware.js                 # Next.js middleware
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- Cloudinary account (for image storage)
- Resend account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rentory.git
   cd rentory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Set up the database**
   ```bash
   # Install Supabase CLI
   npm install -g @supabase/cli
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Run migrations
   supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄️ Database Schema

### Core Tables

#### `profiles`
User profiles with role-based access control
- `id` (UUID, Primary Key)
- `user_type` (admin, landlord, agent, tenant)
- `first_name`, `last_name`, `phone`, `avatar_url`
- `verification_status`, `managed_by`

#### `properties`
Property listings with comprehensive details
- `id` (UUID, Primary Key)
- `owner_id` (Foreign Key to profiles)
- `city`, `state`, `property_type`
- `price`, `bedrooms`, `bathrooms`
- `description`, `amenities[]`, `images[]`

#### `applications`
Rental applications and status tracking
- `id` (UUID, Primary Key)
- `applicant_id`, `landlord_id`, `property_id`
- `status` (pending, approved, rejected)
- `payment_made`, `message`

#### `conversations` & `messages`
Real-time messaging system
- Conversation management between users
- Message history and read status
- Real-time updates via Supabase subscriptions

### Security
- **Row Level Security (RLS)** enabled on all tables
- **Role-based access control** with custom policies
- **User authentication** via Supabase Auth
- **Data validation** at database and application level

## 🔐 Authentication & Authorization

### User Roles
1. **Tenant/Renter**: Search properties, apply for rentals, message landlords
2. **Landlord**: List properties, manage applications, communicate with tenants
3. **Agent**: Manage multiple landlords, advanced analytics, lead generation
4. **Admin**: Platform oversight, user management, system configuration

### Security Features
- JWT-based authentication
- Row-level security policies
- Email verification
- Password reset functionality
- Session management
- CSRF protection

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/reset-password` - Password reset

### Property Endpoints
- `GET /api/properties` - List properties with filters
- `POST /api/properties` - Create new property
- `GET /api/properties/[id]` - Get property details
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

### Application Endpoints
- `GET /api/applications` - List applications
- `POST /api/applications` - Submit application
- `PUT /api/applications/[id]` - Update application status

### Messaging Endpoints
- `GET /api/conversations` - List conversations
- `POST /api/conversations` - Create conversation
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message

## 🎨 Design System

### Colors
- **Primary**: Green (#16a34a) - Trust, growth, success
- **Secondary**: Blue (#2563eb) - Reliability, professionalism
- **Accent**: Purple (#7c3aed) - Premium features
- **Success**: Green variants
- **Warning**: Yellow (#eab308)
- **Error**: Red (#dc2626)

### Typography
- **Font Family**: Inter (system fallback)
- **Headings**: 700 weight, 120% line height
- **Body**: 400 weight, 150% line height
- **Scale**: Tailwind's default type scale

### Components
- Consistent 8px spacing system
- Rounded corners (0.5rem default)
- Subtle shadows and hover states
- Responsive breakpoints (sm, md, lg, xl)

## 🚀 Deployment

### Environment Setup
1. **Production Database**: Set up Supabase production project
2. **Environment Variables**: Configure all required environment variables
3. **Domain Configuration**: Set up custom domain and SSL

### Deployment Steps
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Run database migrations**
   ```bash
   supabase db push --linked
   ```

4. **Configure environment variables** in Vercel dashboard

## 🧪 Testing

### Test Structure
```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Critical user journey testing
- **Database Tests**: Migration and query testing

## 📊 Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals** tracking
- **Database query** performance
- **API response times**
- **Error tracking** and alerting

### Business Analytics
- **User engagement** metrics
- **Property listing** performance
- **Application conversion** rates
- **Revenue tracking**

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **ESLint** for code linting
- **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **TypeScript** for type safety (where applicable)

### Pull Request Process
1. Ensure all tests pass
2. Update documentation as needed
3. Add appropriate labels
4. Request review from maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend-as-a-service platform
- **Vercel** for seamless deployment and hosting
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible component primitives
- **Next.js** team for the incredible React framework

## 📞 Support

### Documentation
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guide](docs/contributing.md)

### Community
- **Email**: hello@rentory.ng
- **Twitter**: [@RentoryNG](https://twitter.com/RentoryNG)
- **LinkedIn**: [Rentory](https://linkedin.com/company/rentory)

### Issues
For bug reports and feature requests, please use the [GitHub Issues](https://github.com/your-username/rentory/issues) page.

---

**Built with ❤️ for Nigeria's rental market**

*Rentory - Making home hunting simple, transparent, and accessible to everyone.*