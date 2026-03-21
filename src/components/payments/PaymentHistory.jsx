import React from 'react';
import { formatCurrency, formatDate } from '@utils/formatters';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';

const PaymentHistory = ({ payments }) => {
  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No payment history available.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {payments.map(payment => (
        <Card key={payment._id} className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{payment.property?.title}</p>
            <p className="text-sm text-gray-500">{formatDate(payment.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-blue-600">{formatCurrency(payment.amount)}</p>
            <Badge className={
              payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }>
              {payment.status}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PaymentHistory;