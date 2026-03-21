import React from 'react';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import { formatCurrency, formatDate } from '@utils/formatters';

const PaymentCard = ({ payment }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800'
  };
  return (
    <Card className="hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">Transaction ID</p>
          <p className="font-mono text-sm">{payment.transactionId}</p>
        </div>
        <Badge className={statusColors[payment.status]}>{payment.status}</Badge>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-blue-600">{formatCurrency(payment.amount)}</p>
        <p className="text-sm text-gray-600 mt-1">{payment.property?.title}</p>
      </div>
      <div className="mt-3 flex justify-between text-sm text-gray-500">
        <span>Due: {formatDate(payment.dueDate)}</span>
        {payment.paidDate && <span>Paid: {formatDate(payment.paidDate)}</span>}
      </div>
    </Card>
  );
};

export default PaymentCard;