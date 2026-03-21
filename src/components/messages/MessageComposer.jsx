import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import Input from '@components/common/Input';
import Button from '@components/common/Button';

const MessageComposer = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4 border-t">
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1"
      />
      <Button type="submit" variant="primary" size="sm" disabled={disabled || !message.trim()}>
        <FiSend />
      </Button>
    </form>
  );
};

export default MessageComposer;