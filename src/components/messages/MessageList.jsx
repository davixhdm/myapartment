import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, currentUserId }) => {
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(msg => (
        <MessageBubble key={msg._id} message={msg} isOwn={msg.sender._id === currentUserId} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;