import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import Textarea from '@components/common/Textarea';
import Button from '@components/common/Button';
import FormWrapper from '@components/common/FormWrapper';

const schema = yup.object({
  title: yup.string().required('Title required').max(100),
  description: yup.string().required('Description required').max(500),
  category: yup.string().required('Category required'),
  priority: yup.string().required('Priority required'),
  property: yup.string().required('Property required')
});

const MaintenanceForm = ({ initialData, onSubmit, properties = [] }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || { priority: 'medium' }
  });

  const categoryOptions = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'structural', label: 'Structural' },
    { value: 'appliance', label: 'Appliance' },
    { value: 'pest', label: 'Pest Control' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'other', label: 'Other' }
  ];
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'emergency', label: 'Emergency' }
  ];
  const propertyOptions = properties.map(p => ({ value: p._id, label: p.title }));

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Input label="Title" {...register('title')} error={errors.title?.message} />
      <Textarea label="Description" rows={4} {...register('description')} error={errors.description?.message} />
      <Select label="Category" options={categoryOptions} {...register('category')} error={errors.category?.message} />
      <Select label="Priority" options={priorityOptions} {...register('priority')} error={errors.priority?.message} />
      <Select label="Property" options={propertyOptions} {...register('property')} error={errors.property?.message} />
      <Button type="submit">{initialData ? 'Update Request' : 'Submit Request'}</Button>
    </FormWrapper>
  );
};

export default MaintenanceForm;