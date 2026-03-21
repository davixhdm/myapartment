import React from 'react';
import Button from '@components/common/Button';
import { FiDownload } from 'react-icons/fi';

const InvoiceGenerator = ({ transaction }) => {
  const handleDownload = () => {
    alert('Invoice download coming soon');
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload}>
      <FiDownload className="mr-2" /> Invoice
    </Button>
  );
};

export default InvoiceGenerator;