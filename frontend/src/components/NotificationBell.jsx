import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API}/notifications`);
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${API}/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API}/notifications/read-all`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-green-500 bg-green-50';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-4 border-red-500 bg-red-50';
      default:
        return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative" data-testid="notification-bell">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs"
              data-testid="notification-badge"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end" data-testid="notification-popover">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              data-testid="mark-all-read-btn"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500" data-testid="no-notifications">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    getNotificationStyle(notification.type)
                  } ${!notification.read ? 'font-semibold' : 'opacity-75'}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  data-testid={`notification-item-${notification.id}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-semibold">{notification.title}</h4>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-700">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
