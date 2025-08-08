'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Calendar, BookOpen, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function PersonalHomeworkPage() {
  const { data: session } = useSession();
  const [showAddForm, setShowAddForm] = useState(false);
  const [personalAssignments, setPersonalAssignments] = useState<any[]>([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    dueDate: '',
    description: ''
  });

  // Check if user is logged in
  if (!session?.user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/homework"
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Database
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">My Homework Manager</h1>
          <p className="text-gray-600 mt-2">
            Please log in to manage your personal homework assignments
          </p>
        </div>

        <div className="card max-w-md mx-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Login Required</h2>
              <p className="text-gray-600 mt-1">
                You need to be logged in to manage your personal homework.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => signIn('google')}
                className="w-full btn-primary"
              >
                Sign in with Google
              </button>
              <p className="text-sm text-gray-500">
                Or <Link href="/homework" className="text-primary-600 hover:text-primary-700">return to database</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const addPersonalAssignment = () => {
    if (!newAssignment.title || !newAssignment.subject) return;
    
    const assignment = {
      id: Date.now().toString(),
      ...newAssignment,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setPersonalAssignments(prev => [...prev, assignment]);
    setNewAssignment({ title: '', subject: '', dueDate: '', description: '' });
    setShowAddForm(false);
  };

  const removePersonalAssignment = (id: string) => {
    setPersonalAssignments(prev => prev.filter(assignment => assignment.id !== id));
  };

  const findSimilarAssignments = (subject: string) => {
    // Redirect to the database with the subject filter
    window.location.href = `/homework?subject=${encodeURIComponent(subject)}`;
  };

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
          <h1 className="text-3xl font-bold text-gray-900">My Homework Manager</h1>
          <p className="text-gray-600 mt-2">
            Manage your personal homework assignments and track your progress
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showAddForm ? 'Cancel' : 'Add Assignment'}
        </button>
      </div>

      {/* Add Personal Assignment Form */}
      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Add Personal Assignment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Assignment Title"
              className="input-field"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
            />
            <input
              type="text"
              placeholder="Subject"
              className="input-field"
              value={newAssignment.subject}
              onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
            />
            <input
              type="date"
              className="input-field"
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
            />
            <textarea
              placeholder="Description/Notes"
              className="input-field"
              rows={3}
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={addPersonalAssignment}
              className="btn-primary"
              disabled={!newAssignment.title || !newAssignment.subject}
            >
              Add Assignment
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Personal Assignments List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">My Assignments</h2>
        
        <div className="space-y-3">
          {personalAssignments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No personal assignments yet. Add your first one!</p>
          ) : (
            personalAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">
                    {assignment.subject} • Due {format(new Date(assignment.dueDate + 'T00:00:00'), 'MMM dd, yyyy')}
                  </p>
                  {assignment.description && (
                    <p className="text-sm text-gray-500 mt-1">{assignment.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => findSimilarAssignments(assignment.subject)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    Find Help
                  </button>
                  <button
                    onClick={() => removePersonalAssignment(assignment.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{personalAssignments.length}</div>
          <div className="text-sm text-gray-600">Total Assignments</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {personalAssignments.filter(a => new Date(a.dueDate) > new Date()).length}
          </div>
          <div className="text-sm text-gray-600">Upcoming</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600">
            {personalAssignments.filter(a => new Date(a.dueDate) <= new Date()).length}
          </div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
      </div>
    </div>
  );
} 