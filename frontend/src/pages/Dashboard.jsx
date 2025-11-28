import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Home, LogOut, AlertTriangle, Trash2, Package, User, Calendar, Download } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [covidRestrictions, setCovidRestrictions] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, restrictionsRes, suggestionsRes] = await Promise.all([
        axios.get(`${API}/bookings`),
        axios.get(`${API}/covid/restrictions`),
        axios.get(`${API}/services/suggestions`)
      ]);
      
      setBookings(bookingsRes.data);
      setCovidRestrictions(restrictionsRes.data);
      setSuggestions(suggestionsRes.data.suggestions);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${API}/user/delete`);
      logout();
      navigate('/');
      toast.success('Account and all data deleted permanently');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const downloadQRCode = async (bookingId) => {
    try {
      const response = await axios.get(`${API}/bookings/${bookingId}/qr`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `booking-${bookingId}-qr.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('QR code downloaded!');
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getRestrictionColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      default: return 'bg-green-500';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">HomeBound Care</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:inline" data-testid="user-welcome-text">
              Welcome, {user?.name}
            </span>
            {user?.role === 'admin' && (
              <Button variant="outline" onClick={() => navigate('/admin')} data-testid="admin-dashboard-link">
                Admin Panel
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/services')} data-testid="browse-services-btn">
              Browse Services
            </Button>
            <NotificationBell />
            <Button variant="ghost" onClick={handleLogout} data-testid="logout-btn">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8" data-testid="dashboard-container">
        {/* COVID Alert */}
        {covidRestrictions && (
          <Card className="mb-6 border-l-4 border-orange-500" data-testid="covid-alert-card">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-orange-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">Current COVID-19 Restrictions</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getRestrictionColor(covidRestrictions.level)}`}>
                      {covidRestrictions.level.toUpperCase()} LEVEL
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{covidRestrictions.message}</p>
                  <div className="grid sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <strong>Density:</strong> {covidRestrictions.density_limits}
                    </div>
                    <div>
                      <strong>Masks:</strong> {covidRestrictions.mask_required ? 'Required' : 'Optional'}
                    </div>
                    <div>
                      <strong>Quarantine:</strong> {covidRestrictions.quarantine_required ? 'Required' : 'Not Required'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Info & Suggestions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="user-profile-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Name:</strong> {user?.name}</div>
              <div><strong>Email:</strong> {user?.email}</div>
              <div><strong>Role:</strong> {user?.role}</div>
              {user?.vax_status !== null && (
                <div><strong>Vaccinated:</strong> {user?.vax_status ? 'Yes' : 'No'}</div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2" data-testid="suggestions-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Recommended Services
              </CardTitle>
              <CardDescription>Based on current restrictions and your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" onClick={() => navigate('/services')} data-testid="view-all-services-btn">
                View All Services
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bookings */}
        <Card data-testid="bookings-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              My Bookings ({bookings.length})
            </CardTitle>
            <CardDescription>Track your service requests</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500" data-testid="no-bookings-message">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No bookings yet. Browse services to get started!</p>
                <Button className="mt-4" onClick={() => navigate('/services')} data-testid="get-started-booking-btn">
                  Get Started
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`booking-item-${booking.id}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{booking.service_type}</h4>
                        <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`} data-testid={`booking-status-${booking.id}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-2 text-sm text-gray-700">
                      <div><strong>Date:</strong> {new Date(booking.preferred_date).toLocaleDateString()}</div>
                      <div><strong>Duration:</strong> {booking.duration} min</div>
                      <div><strong>Cost:</strong> ${booking.cost}</div>
                    </div>
                    {booking.details && (
                      <p className="text-sm text-gray-600 mt-2">{booking.details}</p>
                    )}
                    {booking.status === 'accepted' && (
                      <div className="mt-3 pt-3 border-t">
                        <Button 
                          size="sm" 
                          onClick={() => downloadQRCode(booking.id)}
                          className="flex items-center gap-2"
                          data-testid={`download-qr-${booking.id}`}
                        >
                          <Download className="w-4 h-4" />
                          Download QR Receipt
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Controls */}
        <Card className="mt-8 border-red-200" data-testid="privacy-controls-card">
          <CardHeader>
            <CardTitle className="text-red-700">Privacy & Data Controls</CardTitle>
            <CardDescription>
              You have full control over your data. Per GDPR and Privacy-by-Design principles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2" data-testid="delete-account-trigger-btn">
                  <Trash2 className="w-4 h-4" />
                  Delete My Account & All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers, including:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Profile information</li>
                      <li>All bookings and history</li>
                      <li>Encrypted credit card data</li>
                      <li>Vaccination status</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-testid="delete-cancel-btn">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700" data-testid="delete-confirm-btn">
                    Yes, Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
