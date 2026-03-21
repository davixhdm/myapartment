import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import Button from '@components/common/Button';
import FormWrapper from '@components/common/FormWrapper';

const schema = yup.object({
  amount: yup.number().positive().required('Amount required'),
  paymentMethod: yup.string().required('Payment method required'),
  phone: yup.string().when('paymentMethod', {
    is: 'mpesa',
    then: (schema) => schema.required('Phone required for M-Pesa').matches(/^[0-9]{10,12}$/, 'Invalid phone'),
    otherwise: (schema) => schema.notRequired()
  })
});

const PaymentForm = ({ onSubmit, amount }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { amount: amount || '' }
  });
  const paymentMethod = watch('paymentMethod');

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Input label="Amount (KES)" type="number" {...register('amount')} error={errors.amount?.message} disabled={!!amount} />
      <Select
        label="Payment Method"
        options={[
          { value: 'mpesa', label: 'M-Pesa' },
          { value: 'bank_transfer', label: 'Bank Transfer' },
          { value: 'credit_card', label: 'Credit Card' }
        ]}
        {...register('paymentMethod')}
        error={errors.paymentMethod?.message}
      />
      {paymentMethod === 'mpesa' && (
        <Input label="M-Pesa Phone Number" placeholder="07XXXXXXXX" {...register('phone')} error={errors.phone?.message} />
      )}
      <Button type="submit">Proceed to Payment</Button>
    </FormWrapper>
  );
};

export default PaymentForm;