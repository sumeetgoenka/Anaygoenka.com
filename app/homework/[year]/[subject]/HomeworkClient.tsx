'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, BookOpen } from 'lucide-react';
import { Homework } from '@/types';
import { format } from 'date-fns';

interface HomeworkClientProps {
  year: string;
  subject: string;
  yearDisplay: string;
  subjectDisplay: string;
}

export default function HomeworkClient({ year, subject, yearDisplay, subjectDisplay }: HomeworkClientProps) {
  const { data: session } = useSession();
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomework();
  }, [year, subject]);

  const fetchHomework = async () => {
    try {
      const params = new URLSearchParams();
      params.append('subject', subjectDisplay);
      params.append('yearGroup', yearDisplay);
      if (session?.user?.id) params.append('userId', session.user.id);

      const response = await fetch(`/api/homework?${params}`);
      if (response.ok) {
        const data = await response.json();
        setHomework(data);
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
        setHomework(prev => prev.map(hw => 
          hw.id === homeworkId 
            ? { ...hw, completed: !(hw as any).completed }
            : hw
        ));
      }
    } catch (error) {
      console.error('Error toggling homework completion:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {homework.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No homework found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No assignments available for {subjectDisplay} in {yearDisplay} yet.
          </p>
        </div>
      ) : (
        homework.map((hw) => (
          <div
            key={hw.id}
            className={`card transition-all duration-200 ${
              (hw as any).completed ? 'bg-green-50 border-green-200' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {hw.title}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                    {hw.subject}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-secondary-100 text-secondary-800 rounded-full">
                    {hw.yearGroup}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">
                  {hw.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {format(new Date(hw.dueDate + 'T00:00:00'), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>
              
              {session?.user && (
                <button
                  onClick={() => toggleHomeworkCompletion(hw.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    (hw as any).completed
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {(hw as any).completed ? 'Completed' : 'Mark Complete'}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
} 