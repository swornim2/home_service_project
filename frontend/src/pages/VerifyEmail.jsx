import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Home } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }
    
    verifyEmail(token);
  }, [searchParams]);
  
  const verifyEmail = async (token) => {
    try {
      const response = await axios.post(`${API}/auth/verify-email`, { token });
      setStatus('success');
      setMessage(response.data.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.detail || 'Verification failed');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-600" />
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'verifying' && (
            <div data-testid="verifying-state">
              <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-600" />
              <p className="text-lg">Verifying your email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div data-testid="success-state">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold text-green-600 mb-2">Email Verified!</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button onClick={() => navigate('/dashboard')} data-testid="go-to-dashboard-btn">
                Go to Dashboard
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div data-testid="error-state">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
              <h3 className="text-xl font-bold text-red-600 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button variant="outline" onClick={() => navigate('/login')} data-testid="back-to-login-btn">
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
