import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Home, Video, DollarSign, Clock, ArrowLeft, Calendar } from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    preferred_date: '',
    duration: 60,
    details: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    try {
      const bookingPayload = {
        service_id: selectedService.id,
        service_type: selectedService.name,
        preferred_date: bookingData.preferred_date,
        duration: parseInt(bookingData.duration),
        details: bookingData.details
      };

      await axios.post(`${API}/bookings`, bookingPayload);
      toast.success('Service request submitted! Check your email for confirmation.');
      setDialogOpen(false);
      setBookingData({ preferred_date: '', duration: 60, details: '' });
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit booking');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading services...</div>;
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
            <Button variant="outline" onClick={() => navigate('/dashboard')} data-testid="back-to-dashboard-btn">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8" data-testid="services-container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional home services delivered safely and remotely during COVID-19 restrictions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-xl transition-all" data-testid={`service-card-${service.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  {service.is_online && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      <Video className="w-3 h-3" />
                      Virtual
                    </span>
                  )}
                </div>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-600">${service.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Flexible duration</span>
                  </div>

                  <Dialog open={dialogOpen && selectedService?.id === service.id} onOpenChange={(open) => {
                    if (!open) setDialogOpen(false);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        onClick={() => handleBookService(service)}
                        data-testid={`book-service-btn-${service.id}`}
                      >
                        Request Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent data-testid="booking-dialog">
                      <DialogHeader>
                        <DialogTitle>Request {service.name}</DialogTitle>
                        <DialogDescription>
                          Fill in your preferred details. An admin will review and confirm your request.
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleSubmitBooking} className="space-y-4" data-testid="booking-form">
                        <div>
                          <Label htmlFor="preferred_date">Preferred Date *</Label>
                          <Input
                            id="preferred_date"
                            type="date"
                            value={bookingData.preferred_date}
                            onChange={(e) => setBookingData({ ...bookingData, preferred_date: e.target.value })}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            data-testid="booking-date-input"
                          />
                        </div>

                        <div>
                          <Label htmlFor="duration">Duration (minutes) *</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={bookingData.duration}
                            onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                            required
                            min="30"
                            step="15"
                            data-testid="booking-duration-input"
                          />
                        </div>

                        <div>
                          <Label htmlFor="details">Additional Details (optional)</Label>
                          <Textarea
                            id="details"
                            placeholder="Any specific requirements or questions..."
                            value={bookingData.details}
                            onChange={(e) => setBookingData({ ...bookingData, details: e.target.value })}
                            rows={3}
                            data-testid="booking-details-textarea"
                          />
                        </div>

                        <div className="privacy-notice text-xs">
                          <strong>Privacy Notice:</strong> Your booking details are encrypted and only shared with the assigned service provider. 
                          You'll receive email confirmation with further instructions.
                        </div>

                        <div className="flex gap-3">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1" data-testid="booking-cancel-btn">
                            Cancel
                          </Button>
                          <Button type="submit" className="flex-1" data-testid="booking-submit-btn">
                            Submit Request
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No services available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
