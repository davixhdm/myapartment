import React from 'react';
import { Link } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import Card from '@components/common/Card';

const NotificationsWidget = ({ notifications = [] }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="text-center py-6">
          <FiBell className="mx-auto text-gray-400 text-4xl mb-2" />
          <p className="text-gray-500">No notifications</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {notifications.slice(0, 3).map((notification, idx) => (
            <li
              key={idx}
              className={`p-3 rounded-lg ${!notification.read ? 'bg-blue-50' : 'bg-gray-50'}`}
            >
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </li>
          ))}
        </ul>
      )}
      {notifications.length > 3 && (
        <Link to="/notifications" className="block text-center text-sm text-blue-600 mt-4 hover:underline">
          View all
        </Link>
      )}
    </Card>
  );
};

export default NotificationsWidget;