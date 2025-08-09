import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserRole } from '@/types';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    }),
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const username = credentials?.username || '';
        const password = credentials?.password || '';
        if (username === 'coolestanay' && password === 'happy123') {
          return {
            id: 'admin-user',
            name: 'Admin',
            email: 'admin@example.com',
            role: 'admin' as UserRole,
          } as any;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = (token?.sub as string) || session.user.id || 'dummy-id';
        session.user.role = ((token as any)?.role as UserRole) || 'user';
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // For demo purposes, allow all sign-ins
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }
  
  interface User {
    id: string;
    role: UserRole;
  }
} 