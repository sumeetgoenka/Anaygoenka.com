'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { Homework } from '@/types';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    fetchUserHomework();
  }, [session, status, router]);

  const fetchUserHomework = async () => {
    try {
      const response = await fetch(`/api/homework?userId=${session?.user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setHomework(data);
        
        // Calculate stats
        const total = data.length;
        const completed = data.filter((hw: any) => hw.completed).length;
        const pending = total - completed;
        const overdue = data.filter((hw: any) => 
          !hw.completed && new Date(hw.dueDate) < new Date()
        ).length;
        
        setStats({ total, completed, pending, overdue });
      }
    } catch (error) {
      console.error('Error fetching homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHomeworkCompletion = async (homeworkId: string) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/homework/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeworkId,
          userId: session.user.id,
        }),
      });

      if (response.ok) {
        // Update local state
        setHomework(prev => prev.map(hw => 
          hw.id === homeworkId 
            ? { ...hw, completed: !(hw as any).completed }
            : hw
        ));
        
        // Recalculate stats
        fetchUserHomework();
      }
    } catch (error) {
      console.error('Error toggling homework completion:', error);
    }
  };

  const upcomingHomework = homework
    .filter((hw: any) => !hw.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  const recentCompleted = homework
    .filter((hw: any) => hw.completed)
    .sort((a, b) => b.dueDate.localeCompare(a.dueDate))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session?.user?.name}. Here's your homework overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Homework</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Completion Rate</span>
            <span className="text-sm font-medium text-gray-900">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{stats.completed} completed</span>
            <span>{stats.pending} remaining</span>
          </div>
        </div>
      </div>

      {/* Upcoming Homework */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary-600" />
            Upcoming Homework
          </h2>
          <div className="space-y-3">
            {upcomingHomework.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming homework!</p>
            ) : (
              upcomingHomework.map((hw) => (
                <div
                  key={hw.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{hw.title}</h3>
                                         <p className="text-sm text-gray-600">
                       {hw.subject} • Due {format(new Date(hw.dueDate + 'T00:00:00'), 'MMM dd')}
                     </p>
                  </div>
                  <button
                    onClick={() => toggleHomeworkCompletion(hw.id)}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-md text-sm hover:bg-primary-200 transition-colors"
                  >
                    Mark Complete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            Recently Completed
          </h2>
          <div className="space-y-3">
            {recentCompleted.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No completed homework yet!</p>
            ) : (
              recentCompleted.map((hw) => (
                <div
                  key={hw.id}
                  className="flex items-center p-3 bg-green-50 rounded-lg"
                >
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">{hw.title}</h3>
                                         <p className="text-sm text-gray-600">
                       {hw.subject} • Completed {format(new Date(hw.dueDate + 'T00:00:00'), 'MMM dd')}
                     </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="/homework"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <BookOpen className="h-6 w-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-gray-900">View All Homework</h3>
            <p className="text-sm text-gray-600">Browse all assignments</p>
          </a>
          <a
            href="/games"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <TrendingUp className="h-6 w-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-gray-900">Play Games</h3>
            <p className="text-sm text-gray-600">Take a study break</p>
          </a>
          <a
            href="/ai-assistants"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Award className="h-6 w-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-gray-900">Get Help</h3>
            <p className="text-sm text-gray-600">Chat with AI assistants</p>
          </a>
        </div>
      </div>
    </div>
  );
} 