import Link from 'next/link';
import { BookOpen, Gamepad2, Bot, Users, Calendar, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Homework Management',
      description: 'Organized homework by subject and year group with due dates and completion tracking.',
      href: '/homework'
    },
    {
      icon: Gamepad2,
      title: 'Interactive Games',
      description: 'Collection of engaging games including Ping Pong, Geometry Dash, and Polytrack.',
      href: '/games'
    },
    {
      icon: Bot,
      title: 'AI Assistants',
      description: 'Smart AI chatbots to help with various tasks and learning.',
      href: '/ai-assistants'
    },
    {
      icon: Users,
      title: 'User Dashboard',
      description: 'Personal dashboard to track homework progress and manage your account.',
      href: '/dashboard'
    }
  ];

  const founders = [
    {
      name: 'Anay Goenka',
      role: 'Founder & Lead Developer',
      bio: 'Passionate about creating educational technology that makes learning more engaging and accessible.',
      imageUrl: '/images/anay-goenka.jpg',
      linkedinUrl: 'https://linkedin.com/in/anaygoenka',
      githubUrl: 'https://github.com/anaygoenka'
    },
    {
      name: 'Noah Lee',
      role: 'Co-Founder & Designer',
      bio: 'Focused on user experience and creating intuitive interfaces that enhance the learning journey.',
      imageUrl: '/images/noah-lee.jpg',
      linkedinUrl: 'https://linkedin.com/in/noahlee',
      githubUrl: 'https://github.com/noahlee'
    },
    {
      name: 'James Efstathiou',
      role: 'Co-Founder & Content Manager',
      bio: 'Dedicated to curating high-quality educational content and managing the platform\'s resources.',
      imageUrl: '/images/james-efstathiou.jpg',
      linkedinUrl: 'https://linkedin.com/in/jamesefstathiou',
      githubUrl: 'https://github.com/jamesefstathiou'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-primary-600">AnayGoenka.com</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your comprehensive platform for homework management, interactive learning games, 
            and AI-powered educational assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/homework" className="btn-primary text-lg px-8 py-3">
              View Homework
            </Link>
            <Link href="/games" className="btn-secondary text-lg px-8 py-3">
              Play Games
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From homework tracking to interactive learning, we've got you covered.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="card hover:shadow-lg transition-shadow duration-200 group"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">1,200+</div>
            <div className="text-gray-600">Homework Items</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
            <div className="text-gray-600">Games Available</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">5+</div>
            <div className="text-gray-600">AI Assistants</div>
          </div>
        </div>
      </section>

      {/* About the Founders Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            About the Founders
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the team behind AnayGoenka.com, dedicated to revolutionizing educational technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {founders.map((founder) => (
            <div key={founder.name} className="card text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {founder.name}
              </h3>
              <p className="text-primary-600 font-medium mb-3">
                {founder.role}
              </p>
              <p className="text-gray-600 mb-4">
                {founder.bio}
              </p>
              <div className="flex justify-center space-x-4">
                {founder.linkedinUrl && (
                  <a
                    href={founder.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {founder.githubUrl && (
                  <a
                    href={founder.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-primary-600 rounded-2xl text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of students already using our platform.
        </p>
        <Link href="/auth/signin" className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
          Sign Up Now
        </Link>
      </section>
    </div>
  );
} 