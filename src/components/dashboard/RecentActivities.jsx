import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Card from '@components/common/Card';

const RecentActivities = ({ activities = [] }) => {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
      {activities.length === 0 ? (
        <p className="text-gray-500">No recent activities</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity, idx) => (
            <li key={idx} className="flex items-start space-x-3 border-b pb-2 last:border-0">
              <div className="flex-1">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default RecentActivities;