import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Bell, CheckCircle, TrendingUp, FileText, ShieldCheck, Info, Trash2, CheckCheck } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'investment',
    icon: TrendingUp,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Investment Confirmed',
    message: 'Your ZCZP bond investment of ₹5,000 in Akshaya Patra Foundation was successful.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'certificate',
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-primary',
    title: '80G Certificate Ready',
    message: 'Your 80G tax exemption certificate for Teach For India is now available for download.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 3,
    type: 'kyc',
    icon: ShieldCheck,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'KYC Verification Complete',
    message: 'Your PAN and KYC details have been successfully verified. You can now invest without limits.',
    time: '3 days ago',
    read: true,
  },
  {
    id: 4,
    type: 'info',
    icon: Info,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    title: 'New NGO Added',
    message: 'Green Earth Initiative has launched a new ZCZP bond campaign. Check it out in the marketplace.',
    time: '5 days ago',
    read: true,
  },
  {
    id: 5,
    type: 'investment',
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Impact Milestone Reached',
    message: 'The NGO you invested in — Sanjivani Health Trust — has treated 50,000 patients this quarter!',
    time: '1 week ago',
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('sse_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(n => {
          const original = MOCK_NOTIFICATIONS.find(m => m.id === n.id);
          return { ...n, icon: original ? original.icon : Bell };
        });
      }
    } catch (e) {}
    return MOCK_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('sse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-1">
      <Sidebar unreadNotifications={unreadCount} />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-secondary mb-1">Notifications</h2>
            <p className="text-gray-500 text-sm">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium border border-primary rounded-md px-4 py-2 hover:bg-sky-50 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className="card text-center py-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">No Notifications</h3>
            <p className="text-gray-500 max-w-sm">You're all caught up. New alerts about your investments and certificates will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`card p-4 flex items-start gap-4 transition-all cursor-pointer hover:shadow-md ${
                    !notif.read ? 'border-l-4 border-l-primary bg-sky-50/30' : ''
                  }`}
                  onClick={() => markRead(notif.id)}
                >
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${notif.iconBg}`}>
                    <Icon className={`w-5 h-5 ${notif.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className={`font-semibold text-secondary ${!notif.read ? 'font-bold' : ''}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                    className="text-gray-300 hover:text-red-400 transition-colors shrink-0 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
