import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, PieChart, User, Bell, Trophy } from 'lucide-react';

export default function Sidebar({ unreadNotifications = 2 }) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Impact Marketplace', icon: LayoutGrid },
    { path: '/portfolio', label: 'My Portfolio', icon: PieChart },
    { path: '/rank', label: 'My Rank', icon: Trophy },
    { path: '/account', label: 'Account & PAN', icon: User },
    { path: '/notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
  ];

  return (
    <div className="w-64 bg-white border-r border-border h-[calc(100vh-4rem)] sticky top-16 hidden md:block">
      <div className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? 'bg-sky-50 dark:bg-sky-900/30 text-primary font-medium'
                  : 'text-secondary hover:bg-gray-100 dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                {item.label}
              </div>
              {item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
