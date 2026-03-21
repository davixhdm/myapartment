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
  title: yup.string().required('Title is required').max(100),
  propertyCode: yup.string().required('Property code is required').max(20),
  description: yup.string().required('Description is required').max(500),
  basePrice: yup.number().positive().required('Base price is required'),
  numberOfUnits: yup.number().positive().integer().min(1).required('Number of units required'),
  type: yup.string().required('Property type is required'),
  bedrooms: yup.number().min(0).required('Bedrooms required'),
  bathrooms: yup.number().min(0).required('Bathrooms required'),
  area: yup.number().positive().required('Area required'),
  address: yup.object({
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required'),
    state: yup.string(),
    zipCode: yup.string(),
    country: yup.string().default('Kenya')
  })
});

const PropertyForm = ({ initialData, onSubmit, isSubmitting }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      type: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      numberOfUnits: 1,
      address: { country: 'Kenya' }
    }
  });

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' }
  ];

  const numberOfUnits = watch('numberOfUnits');
  const propertyCode = watch('propertyCode');

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Property Title" {...register('title')} error={errors.title?.message} />
        <Input label="Property Code" {...register('propertyCode')} placeholder="e.g., P001" error={errors.propertyCode?.message} />
        <Input label="Base Price (KES)" type="number" {...register('basePrice')} error={errors.basePrice?.message} />
        <Input label="Number of Units" type="number" {...register('numberOfUnits')} error={errors.numberOfUnits?.message} />
        <Select label="Property Type" options={propertyTypes} {...register('type')} error={errors.type?.message} />
        <Input label="Bedrooms" type="number" {...register('bedrooms')} error={errors.bedrooms?.message} />
        <Input label="Bathrooms" type="number" {...register('bathrooms')} error={errors.bathrooms?.message} />
        <Input label="Area (sq m)" type="number" {...register('area')} error={errors.area?.message} />
      </div>

      {propertyCode && numberOfUnits > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Generated Units Preview:</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {Array.from({ length: Math.min(numberOfUnits, 10) }, (_, i) => (
              <div key={i} className="bg-white p-2 rounded text-center text-sm">
                {propertyCode}-{(i + 1).toString().padStart(2, '0')}
              </div>
            ))}
            {numberOfUnits > 10 && <div className="bg-white p-2 rounded text-center text-sm">... and {numberOfUnits - 10} more</div>}
          </div>
        </div>
      )}

      <Textarea label="Description" rows={4} {...register('description')} error={errors.description?.message} />

      <h3 className="text-lg font-medium mt-4 mb-2">Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Street" {...register('address.street')} error={errors.address?.street?.message} />
        <Input label="City" {...register('address.city')} error={errors.address?.city?.message} />
        <Input label="State/Province" {...register('address.state')} />
        <Input label="ZIP Code" {...register('address.zipCode')} />
        <Input label="Country" {...register('address.country')} disabled />
      </div>

      <div className="mt-6">
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update Property' : 'Create Property'}
        </Button>
      </div>
    </FormWrapper>
  );
};

export default PropertyForm;