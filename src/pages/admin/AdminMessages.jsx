import React, { useState, useEffect } from 'react';
import messageService from '@services/messageService';
import ConversationList from '@components/messages/ConversationList';
import MessageThread from '@components/messages/MessageThread';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';

const AdminMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await messageService.getConversations();
      setConversations(res.data.data);
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchConversations} />;

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg shadow overflow-hidden">
      <div className="w-1/3 border-r">
        <ConversationList
          conversations={conversations}
          selectedId={selected?._id}
          onSelect={setSelected}
        />
      </div>
      <div className="flex-1">
        {selected ? (
          <MessageThread conversation={selected} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;