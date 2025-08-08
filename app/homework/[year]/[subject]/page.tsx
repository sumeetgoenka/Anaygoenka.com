import { Suspense } from 'react';
import { use } from 'react';
import { Homework } from '@/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { Calendar, BookOpen, ArrowLeft } from 'lucide-react';
import HomeworkClient from './HomeworkClient';

interface PageProps {
  params: Promise<{
    year: string;
    subject: string;
  }>;
}

async function getHomeworkData(year: string, subject: string) {
  try {
    const params = new URLSearchParams();
    params.append('subject', subject.replace(/\b\w/g, l => l.toUpperCase()));
    params.append('yearGroup', year.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()));

    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/homework?${params}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error fetching homework:', error);
    return [];
  }
}

export default function SubjectHomeworkPage({ params }: PageProps) {
  const resolvedParams = use(params);
  
  // Convert URL params to display format
  const yearDisplay = resolvedParams.year.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const subjectDisplay = resolvedParams.subject.replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/homework"
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Database
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{subjectDisplay} - {yearDisplay}</h1>
          <p className="text-gray-600 mt-2">
            All homework assignments for {subjectDisplay} in {yearDisplay}
          </p>
        </div>
        
        <Link href="/homework/personal" className="btn-primary">
          My Homework Manager
        </Link>
      </div>

      {/* Homework List */}
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      }>
        <HomeworkClient 
          year={resolvedParams.year} 
          subject={resolvedParams.subject}
          yearDisplay={yearDisplay}
          subjectDisplay={subjectDisplay}
        />
      </Suspense>

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link href="/homework" className="hover:text-primary-600">Homework Database</Link>
        <span className="mx-2">→</span>
        <span>{yearDisplay}</span>
        <span className="mx-2">→</span>
        <span>{subjectDisplay}</span>
      </div>
    </div>
  );
} 