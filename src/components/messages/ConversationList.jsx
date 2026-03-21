import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@components/ui/Avatar';

const ConversationList = ({ conversations, selectedId, onSelect }) => {
  return (
    <div className="divide-y">
      {conversations.map(conv => {
        const other = conv.recipients.find(r => r.user._id !== conv.sender._id)?.user || conv.sender;
        return (
          <div
            key={conv._id}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition ${selectedId === conv._id ? 'bg-blue-50' : ''}`}
            onClick={() => onSelect(conv)}
          >
            <div className="flex items-start space-x-3">
              <Avatar src={other.profileImage} name={other.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="font-semibold truncate">{other.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(conv.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.content}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {conv.unreadCount}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;