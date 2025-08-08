'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react';

export default function HomeworkPage() {
  const { data: session } = useSession();
  const [expandedYear, setExpandedYear] = useState<string | null>(null);

  const yearGroups = [
    {
      year: 'Year 7',
      subjects: [
        { name: 'Mathematics', slug: 'mathematics' },
        { name: 'English', slug: 'english' },
        { name: 'Science', slug: 'science' },
        { name: 'History', slug: 'history' },
        { name: 'Geography', slug: 'geography' },
        { name: 'Religious Education', slug: 're' },
        { name: 'Art', slug: 'art' },
        { name: 'Music', slug: 'music' },
        { name: 'Physical Education', slug: 'pe' },
        { name: 'Computing', slug: 'computing' },
        { name: 'Design & Technology', slug: 'dt' },
        { name: 'Modern Foreign Languages', slug: 'mfl' },
      ]
    },
    {
      year: 'Year 8',
      subjects: [
        { name: 'Mathematics', slug: 'mathematics' },
        { name: 'English', slug: 'english' },
        { name: 'Science', slug: 'science' },
        { name: 'History', slug: 'history' },
        { name: 'Geography', slug: 'geography' },
        { name: 'Religious Education', slug: 're' },
        { name: 'Art', slug: 'art' },
        { name: 'Music', slug: 'music' },
        { name: 'Physical Education', slug: 'pe' },
        { name: 'Computing', slug: 'computing' },
        { name: 'Design & Technology', slug: 'dt' },
        { name: 'Modern Foreign Languages', slug: 'mfl' },
      ]
    },
    {
      year: 'Year 9',
      subjects: [
        { name: 'Mathematics', slug: 'mathematics' },
        { name: 'English', slug: 'english' },
        { name: 'Science', slug: 'science' },
        { name: 'History', slug: 'history' },
        { name: 'Geography', slug: 'geography' },
        { name: 'Religious Education', slug: 're' },
        { name: 'Art', slug: 'art' },
        { name: 'Music', slug: 'music' },
        { name: 'Physical Education', slug: 'pe' },
        { name: 'Computing', slug: 'computing' },
        { name: 'Design & Technology', slug: 'dt' },
        { name: 'Modern Foreign Languages', slug: 'mfl' },
      ]
    },
    {
      year: 'Year 10',
      subjects: [
        { name: 'Mathematics', slug: 'mathematics' },
        { name: 'English', slug: 'english' },
        { name: 'Science', slug: 'science' },
        { name: 'History', slug: 'history' },
        { name: 'Geography', slug: 'geography' },
        { name: 'Religious Education', slug: 're' },
        { name: 'Art', slug: 'art' },
        { name: 'Music', slug: 'music' },
        { name: 'Physical Education', slug: 'pe' },
        { name: 'Computing', slug: 'computing' },
        { name: 'Design & Technology', slug: 'dt' },
        { name: 'Modern Foreign Languages', slug: 'mfl' },
      ]
    },
    {
      year: 'Year 11',
      subjects: [
        { name: 'Mathematics', slug: 'mathematics' },
        { name: 'English', slug: 'english' },
        { name: 'Science', slug: 'science' },
        { name: 'History', slug: 'history' },
        { name: 'Geography', slug: 'geography' },
        { name: 'Religious Education', slug: 're' },
        { name: 'Art', slug: 'art' },
        { name: 'Music', slug: 'music' },
        { name: 'Physical Education', slug: 'pe' },
        { name: 'Computing', slug: 'computing' },
        { name: 'Design & Technology', slug: 'dt' },
        { name: 'Modern Foreign Languages', slug: 'mfl' },
      ]
    }
  ];

  const toggleYear = (year: string) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Latymer Homework Database</h1>
          <p className="text-gray-600 mt-2">
            Browse homework assignments by year group and subject
          </p>
        </div>
        
        {session?.user && (
          <div className="flex gap-3">
            <a href="/homework/personal" className="btn-primary">
              My Homework Manager
            </a>
            {session?.user?.role === 'admin' && (
              <a href="/admin/homework/new" className="btn-primary">
                Add Assignment
              </a>
            )}
          </div>
        )}
      </div>

      {/* Year Group Dropdowns */}
      <div className="space-y-4">
        {yearGroups.map((yearGroup) => (
          <div key={yearGroup.year} className="card">
            <button
              onClick={() => toggleYear(yearGroup.year)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">{yearGroup.year}</h2>
              </div>
              {expandedYear === yearGroup.year ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedYear === yearGroup.year && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {yearGroup.subjects.map((subject) => (
                    <a
                      key={subject.slug}
                      href={`/homework/${yearGroup.year.toLowerCase().replace(' ', '-')}/${subject.slug}`}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-200 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{subject.name}</h3>
                        <p className="text-sm text-gray-500">View assignments</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900">How to use this database</h3>
            <p className="text-blue-700 mt-1">
              Click on a year group to see all available subjects. Then click on a subject to view all homework assignments for that specific subject and year group.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 