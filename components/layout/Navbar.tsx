'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, LogOut, LogIn } from 'lucide-react';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const router = useRouter();

  const isAdmin = session?.user?.role === 'admin';
  const isUser = session?.user?.role === 'user' || isAdmin;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'All Latymer HW', href: '/homework' },
    { name: 'Games', href: '/games' },
    { name: 'AI Assistants', href: '/ai-assistants' },
    { name: 'More', href: '/more' },
  ];

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My Homework', href: '/my-homework' },
  ];

  const adminNavigation = [
    { name: 'Manage Homework', href: '/admin/homework' },
    { name: 'Manage Users', href: '/admin/users' },
  ];

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setAdminError(null);
    setAdminLoading(true);
    const res = await signIn('credentials', {
      username: adminUsername,
      password: adminPassword,
      redirect: false,
    });
    setAdminLoading(false);
    if (res?.ok) {
      setShowAdminLogin(false);
      setAdminUsername('');
      setAdminPassword('');
      router.push('/admin');
    } else {
      setAdminError('Invalid credentials');
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600">AnayGoenka.com</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <>
                {isAdmin && (
                  <>
                    <Link href="/admin" className="px-3 py-2 rounded bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 transition-colors">Admin Dashboard</Link>
                     <button onClick={() => signOut()} className="px-3 py-2 rounded bg-primary-600 text-white hover:bg-primary-700">Sign Out</button>
                  </>
                )}
                {!isAdmin && (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      <User className="h-4 w-4" />
                      <span>{session.user.name}</span>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {isUser && userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="text-gray-700 hover:text-primary-600 text-sm px-2 py-2 bg-transparent"
                >
                  Admin
                </button>
                <button
                  onClick={() => signIn('google')}
                  className="btn-primary flex items-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {session && (
              <>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="px-3 py-2 text-sm text-gray-500">User Menu</p>
                  {isUser && userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isAdmin && adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-primary-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
            
            {!session && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  onClick={() => {
                    signIn('google');
                    setIsMenuOpen(false);
                  }}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 pointer-events-auto">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6" onClick={(e)=>e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Admin Login</h2>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input type="hidden" name="csrfToken" value="" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  className="w-full border rounded px-3 py-2 text-black placeholder-gray-500"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Enter username"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full border rounded px-3 py-2 text-black placeholder-gray-500"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              {adminError && <p className="text-sm text-red-600">{adminError}</p>}
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200" onClick={() => setShowAdminLogin(false)}>Cancel</button>
                <button type="submit" disabled={adminLoading} className="px-3 py-2 rounded bg-black text-white hover:opacity-90 disabled:opacity-50">{adminLoading ? 'Signing in...' : 'Sign In'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
} 