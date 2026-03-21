import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@hooks/useAuth';
import messageService from '@services/messageService';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import LoadingSpinner from '@components/common/LoadingSpinner';

const MessageThread = ({ conversation }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await messageService.getConversationMessages(conversation.conversationId);
      setMessages(res.data.data);
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      setLoading(false);
    }
  }, [conversation.conversationId]);
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);
  const handleSend = async (content) => {
    try {
      const recipientIds = conversation.recipients
        .map(r => r.user._id)
        .filter(id => id !== user._id);
      const res = await messageService.sendMessage({
        conversationId: conversation.conversationId,
        recipientIds,
        content
      });
      setMessages(prev => [...prev, res.data.data]);
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };
  if (loading) return <LoadingSpinner />;
  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h3 className="font-semibold">
          {conversation.recipients.find(r => r.user._id !== user._id)?.user.name || 'Conversation'}
        </h3>
      </div>
      <MessageList messages={messages} currentUserId={user._id} />
      <MessageComposer onSend={handleSend} />
    </div>
  );
};

export default MessageThread;