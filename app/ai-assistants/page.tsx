import Link from 'next/link';
import { Bot, MessageCircle, Brain, BookOpen, Calculator, Palette } from 'lucide-react';

export default function AIAssistantsPage() {
  const assistants = [
    {
      id: 'homework-helper',
      title: 'Homework Helper',
      description: 'Get help with your homework assignments. Ask questions, get explanations, and receive step-by-step guidance.',
      icon: BookOpen,
      category: 'Education',
      featured: true,
      usageCount: 2340
    },
    {
      id: 'math-tutor',
      title: 'Math Tutor',
      description: 'Specialized AI tutor for mathematics. Solve equations, understand concepts, and practice problems.',
      icon: Calculator,
      category: 'Education',
      featured: true,
      usageCount: 1890
    },
    {
      id: 'creative-writer',
      title: 'Creative Writer',
      description: 'AI-powered writing assistant for essays, stories, and creative projects. Get ideas and improve your writing.',
      icon: Palette,
      category: 'Creative',
      featured: true,
      usageCount: 1567
    },
    {
      id: 'study-planner',
      title: 'Study Planner',
      description: 'Create personalized study schedules and track your learning progress with AI recommendations.',
      icon: Brain,
      category: 'Productivity',
      featured: false,
      usageCount: 890
    },
    {
      id: 'language-tutor',
      title: 'Language Tutor',
      description: 'Learn new languages with interactive conversations and grammar explanations.',
      icon: MessageCircle,
      category: 'Education',
      featured: false,
      usageCount: 654
    },
    {
      id: 'science-explainer',
      title: 'Science Explainer',
      description: 'Understand complex scientific concepts with simplified explanations and visual aids.',
      icon: Bot,
      category: 'Education',
      featured: false,
      usageCount: 432
    }
  ];

  const categories = ['All', 'Education', 'Creative', 'Productivity'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Assistants
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Intelligent AI-powered tools to help with your learning and productivity
        </p>
      </div>

      {/* Featured Assistants */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary-600" />
          Featured Assistants
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {assistants.filter(assistant => assistant.featured).map((assistant) => (
            <div key={assistant.id} className="card group hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <assistant.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {assistant.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {assistant.category}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {assistant.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {assistant.usageCount} uses
                </span>
                <Link
                  href={`/ai-assistants/${assistant.id}`}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Start Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Assistants */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          All AI Assistants
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assistants.map((assistant) => (
            <div key={assistant.id} className="card group hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <assistant.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {assistant.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {assistant.category}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {assistant.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {assistant.usageCount} uses
                </span>
                <Link
                  href={`/ai-assistants/${assistant.id}`}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Start Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant Categories */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Assistant Categories
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
            <p className="text-sm text-gray-600">
              AI tutors and educational assistants for various subjects
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Creative</h3>
            <p className="text-sm text-gray-600">
              AI tools for writing, art, and creative projects
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Productivity</h3>
            <p className="text-sm text-gray-600">
              AI assistants to boost your productivity and organization
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How AI Assistants Work
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Choose Assistant</h3>
            <p className="text-sm text-gray-600">
              Select the AI assistant that best fits your needs
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Start Conversation</h3>
            <p className="text-sm text-gray-600">
              Begin chatting with the AI assistant in real-time
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Get Results</h3>
            <p className="text-sm text-gray-600">
              Receive helpful responses and guidance instantly
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 