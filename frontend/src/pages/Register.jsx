import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Home, Shield, AlertTriangle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showVaxConsent, setShowVaxConsent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    mobile: '',
    citizenship: '',
    language: 'English',
    role: 'client',
    trade: '',
    vax_status: false,
    credit_card: '',
    consent_vax: false,
    consent_data: true
  });
  const [loading, setLoading] = useState(false);

  const handleVaxClick = () => {
    setShowVaxConsent(true);
  };

  const handleVaxConsent = (accepted) => {
    setFormData({ ...formData, consent_vax: accepted, vax_status: accepted ? formData.vax_status : false });
    setShowVaxConsent(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null
      };
      
      const response = await axios.post(`${API}/auth/register`, submitData);
      login(response.data.access_token, response.data.user);
      toast.success('Registration successful! Welcome to HomeBound Care.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Home className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">HomeBound Care</h1>
          </div>
          <p className="text-gray-600">Create your privacy-protected account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>All fields marked with * are required. Others are optional.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="register-name-input"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    data-testid="register-email-input"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    data-testid="register-password-input"
                  />
                </div>

                <div>
                  <Label htmlFor="age">Age (optional)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    data-testid="register-age-input"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mobile">Mobile (optional)</Label>
                  <Input
                    id="mobile"
                    placeholder="+61 400 000 000"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    data-testid="register-mobile-input"
                  />
                </div>

                <div>
                  <Label htmlFor="citizenship">Citizenship (optional)</Label>
                  <Input
                    id="citizenship"
                    placeholder="Australian"
                    value={formData.citizenship}
                    onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                    data-testid="register-citizenship-input"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select value={formData.language} onValueChange={(val) => setFormData({ ...formData, language: val })}>
                    <SelectTrigger data-testid="register-language-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Mandarin">Mandarin</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="role">Account Type</Label>
                  <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                    <SelectTrigger data-testid="register-role-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client (Request Services)</SelectItem>
                      <SelectItem value="provider">Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.role === 'provider' && (
                <div>
                  <Label htmlFor="trade">Trade/Profession *</Label>
                  <Input
                    id="trade"
                    placeholder="Home Inspector, Renovation Expert, etc."
                    value={formData.trade}
                    onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                    required={formData.role === 'provider'}
                    data-testid="register-trade-input"
                  />
                </div>
              )}

              {/* Privacy-sensitive fields */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Optional Privacy-Sensitive Information</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      The following fields are completely optional and require your explicit consent to collect.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vax_status"
                    checked={formData.vax_status}
                    onCheckedChange={handleVaxClick}
                    disabled={!formData.consent_vax}
                    data-testid="register-vax-checkbox"
                  />
                  <Label htmlFor="vax_status" className="text-sm cursor-pointer">
                    I am vaccinated (helps determine service eligibility during restrictions)
                  </Label>
                </div>

                <div>
                  <Label htmlFor="credit_card" className="text-sm">Credit Card (optional, encrypted)</Label>
                  <Input
                    id="credit_card"
                    placeholder="For future payment convenience"
                    value={formData.credit_card}
                    onChange={(e) => setFormData({ ...formData, credit_card: e.target.value })}
                    data-testid="register-credit-card-input"
                  />
                  <p className="text-xs text-gray-500 mt-1">Encrypted with AES-256. Never stored in plain text.</p>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="privacy-notice">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                <strong>Privacy Notice:</strong> We collect minimal data necessary for service delivery. 
                You can delete all your data anytime from your dashboard. We never sell your information.
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent_data"
                  checked={formData.consent_data}
                  onCheckedChange={(checked) => setFormData({ ...formData, consent_data: checked })}
                  required
                  data-testid="register-consent-checkbox"
                />
                <Label htmlFor="consent_data" className="text-sm cursor-pointer">
                  I agree to the collection and processing of my data as described *
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !formData.consent_data} data-testid="register-submit-btn">
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-blue-600 hover:underline font-medium" data-testid="register-login-link">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={() => navigate('/')} data-testid="back-to-home-btn">
            Back to Home
          </Button>
        </div>
      </div>

      {/* Vaccination Consent Dialog */}
      <AlertDialog open={showVaxConsent} onOpenChange={setShowVaxConsent}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vaccination Status Consent</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                We request your vaccination status to help determine which services are available to you based on current COVID-19 restrictions.
              </p>
              <p className="font-semibold">
                This information is:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Completely optional</li>
                <li>Encrypted and stored securely</li>
                <li>Only used for service eligibility</li>
                <li>Can be removed at any time</li>
              </ul>
              <p>
                Do you consent to sharing this information?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleVaxConsent(false)} data-testid="vax-consent-decline-btn">
              No, Skip This
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleVaxConsent(true)} data-testid="vax-consent-accept-btn">
              Yes, I Consent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Register;
