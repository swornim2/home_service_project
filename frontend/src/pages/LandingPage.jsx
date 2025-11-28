import { useNavigate } from 'react-router-dom';
import { Shield, Home, Video, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">HomeBound Care</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')} data-testid="header-login-btn">
              Login
            </Button>
            <Button onClick={() => navigate('/register')} data-testid="header-register-btn">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">COVID-19 Safe Services Available</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Home Services,<br />
            <span className="text-blue-600">Without Leaving Home</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Access professional home inspections, consultations, and renovation planning through secure virtual services. Privacy-first design ensures your data stays protected.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate('/register')} className="text-lg px-8" data-testid="hero-get-started-btn">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/services')} className="text-lg px-8" data-testid="hero-browse-services-btn">
              Browse Services
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy-by-Design Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built from the ground up with your privacy and security in mind
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-blue-300 transition-all" data-testid="feature-card-virtual">
            <CardHeader>
              <Video className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>100% Virtual Services</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete home services remotely via secure video calls. No in-person contact required during restrictions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all" data-testid="feature-card-privacy">
            <CardHeader>
              <Lock className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>End-to-End Encryption</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All sensitive data encrypted with AES-256. Credit card information never stored in plain text.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all" data-testid="feature-card-minimal">
            <CardHeader>
              <Shield className="w-10 h-10 text-green-600 mb-2" />
              <CardTitle>Data Minimization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We only collect what's necessary. Optional fields remain optional. Your data, your choice.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all" data-testid="feature-card-control">
            <CardHeader>
              <CheckCircle className="w-10 h-10 text-orange-600 mb-2" />
              <CardTitle>Full User Control</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Delete your data anytime. No questions asked. GDPR compliant and user-centric design.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* COVID Safety */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-12 h-12 text-orange-600 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">COVID-19 Restriction Monitoring</h3>
                <p className="text-gray-700 mb-4">
                  Our platform monitors current South Australian COVID-19 restrictions and automatically recommends the safest service options. During high-restriction periods, we prioritize virtual services to keep you and service providers safe.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Real-time restriction level notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Automatic virtual service recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Safety protocols for essential in-person visits
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Services Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Services</h2>
          <p className="text-gray-600">Professional home services delivered remotely</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: 'Virtual Home Inspection', price: '$150', desc: 'Complete home assessment via video call' },
            { title: 'Online Renovation Consultation', price: '$200', desc: 'Expert design and planning advice' },
            { title: 'Remote Design Planning', price: '$300', desc: '3D renders and professional layouts' }
          ].map((service, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow" data-testid={`service-preview-${idx}`}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription className="text-2xl font-bold text-blue-600">{service.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button size="lg" onClick={() => navigate('/register')} data-testid="services-cta-btn">
            View All Services
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home className="w-6 h-6" />
            <span className="text-xl font-bold">HomeBound Care</span>
          </div>
          <p className="text-gray-400 mb-2">Privacy-by-Design Home Services Platform</p>
          <p className="text-sm text-gray-500">University of Adelaide • COMP SCI 7412/7612 • 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
