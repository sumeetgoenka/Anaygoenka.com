import Link from 'next/link';
import { 
  Info, 
  HelpCircle, 
  Mail, 
  Github, 
  ExternalLink, 
  BookOpen,
  Users,
  Settings
} from 'lucide-react';

export default function MorePage() {
  const resources = [
    {
      title: 'About Us',
      description: 'Learn more about the team behind AnayGoenka.com',
      icon: Info,
      href: '/about',
      color: 'bg-blue-500'
    },
    {
      title: 'Help & Support',
      description: 'Get help with using the platform',
      icon: HelpCircle,
      href: '/help',
      color: 'bg-green-500'
    },
    {
      title: 'Contact Us',
      description: 'Get in touch with our team',
      icon: Mail,
      href: '/contact',
      color: 'bg-purple-500'
    },
    {
      title: 'GitHub Repository',
      description: 'View the source code and contribute',
      icon: Github,
      href: 'https://github.com/anaygoenka/anaygoenka-upgraded',
      color: 'bg-gray-800',
      external: true
    }
  ];

  const quickLinks = [
    {
      title: 'Privacy Policy',
      href: '/privacy',
      icon: Settings
    },
    {
      title: 'Terms of Service',
      href: '/terms',
      icon: BookOpen
    },
    {
      title: 'User Guide',
      href: '/guide',
      icon: Users
    },
    {
      title: 'FAQ',
      href: '/faq',
      icon: HelpCircle
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          More Resources
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Additional resources, support, and information about AnayGoenka.com
        </p>
      </div>

      {/* Main Resources */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <a
              key={resource.title}
              href={resource.href}
              target={resource.external ? '_blank' : undefined}
              rel={resource.external ? 'noopener noreferrer' : undefined}
              className="card group hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${resource.color} text-white`}>
                  <resource.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {resource.title}
                    </h3>
                    {resource.external && (
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {resource.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="card text-center hover:shadow-lg transition-shadow duration-200 group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4 group-hover:bg-primary-200 transition-colors">
                <link.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {link.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Platform Information */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          About the Platform
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Educational Focus</h3>
            <p className="text-sm text-gray-600">
              Designed specifically for students to enhance their learning experience
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
            <p className="text-sm text-gray-600">
              Built by students, for students, with continuous feedback and improvements
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Modern Technology</h3>
            <p className="text-sm text-gray-600">
              Built with the latest web technologies for optimal performance and user experience
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">support@anaygoenka.com</span>
              </div>
              <div className="flex items-center">
                <Github className="h-5 w-5 text-gray-400 mr-3" />
                <a 
                  href="https://github.com/anaygoenka" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  github.com/anaygoenka
                </a>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Support</h3>
            <p className="text-gray-600 mb-4">
              Need help? Check out our FAQ or contact us directly for assistance.
            </p>
            <div className="space-y-2">
              <Link href="/faq" className="block text-primary-600 hover:text-primary-700">
                View FAQ →
              </Link>
              <Link href="/contact" className="block text-primary-600 hover:text-primary-700">
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="text-center py-8 border-t border-gray-200">
        <p className="text-gray-600">
          © 2024 AnayGoenka.com. Built with ❤️ by students for students.
        </p>
      </section>
    </div>
  );
} 