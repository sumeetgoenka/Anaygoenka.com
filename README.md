# AnayGoenka.com - Upgraded

An upgraded version of AnayGoenka.com featuring homework management, interactive games, AI assistants, and comprehensive user management.

## Features

### 🏠 Public View (Read-only)
- Browse homework by subject and year group
- View games and AI assistants
- About the founders section
- Responsive design for all devices

### 👤 User View (After Login)
- Mark homework as completed
- Sort homework by date, subject, or title
- Personal dashboard with progress tracking
- User profile management

### 🔧 Admin View (Admin Role)
- Add, edit, and delete homework assignments
- Schedule when homework goes live
- Manage games and AI assistant content
- Dashboard with comprehensive statistics
- User management and role assignment

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Firebase Firestore
- **Backend**: Next.js API Routes
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## Project Structure

```
anaygoenka-upgraded/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── homework/             # Homework CRUD operations
│   │   └── admin/                # Admin-specific endpoints
│   ├── admin/                    # Admin pages
│   ├── games/                    # Games pages
│   ├── homework/                 # Homework pages
│   ├── ai-assistants/            # AI assistant pages
│   ├── dashboard/                # User dashboard
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable components
│   ├── layout/                   # Layout components
│   ├── providers/                # Context providers
│   └── ui/                       # UI components
├── lib/                          # Utility libraries
│   ├── firebase.ts               # Firebase configuration
│   └── auth.ts                   # NextAuth configuration
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## Database Schema

### Users Collection
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'public' | 'user' | 'admin';
  createdAt: Date;
  lastLoginAt: Date;
}
```

### Homework Collection
```typescript
interface Homework {
  id: string;
  title: string;
  subject: string;
  description: string;
  yearGroup: string;
  dueDate: Date;
  isLive: boolean;
  liveDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // admin user ID
}
```

### UserHomework Collection
```typescript
interface UserHomework {
  id: string;
  userId: string;
  homeworkId: string;
  completedAt: Date;
  completed: boolean;
}
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd anaygoenka-upgraded
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
1. Copy `env.example` to `.env.local`
2. Fill in your Firebase and Google OAuth credentials:

```bash
cp env.example .env.local
```

### 4. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Copy your Firebase config to `.env.local`

### 5. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Features in Detail

### Homework Management
- **Public View**: Read-only access to all live homework
- **User View**: Mark homework as completed, filter and sort
- **Admin View**: Full CRUD operations, scheduling, and management

### Games
- Ping Pong (with modern controls)
- Geometry Dash (rhythm-based platformer)
- Polytrack (puzzle game)
- Educational games (Math Quiz, Word Scramble, Memory Match)

### AI Assistants
- Multiple AI chatbots for different purposes
- Educational assistance
- Homework help
- Study guidance

### User Management
- Role-based access control (public, user, admin)
- Google OAuth authentication
- User profiles and preferences
- Activity tracking

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@anaygoenka.com or create an issue in the repository.

## Founders

- **Anay Goenka** - Founder & Lead Developer
- **Noah Lee** - Co-Founder & Designer  
- **James Efstathiou** - Co-Founder & Content Manager 