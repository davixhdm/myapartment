import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import Button from '@components/common/Button';
import FormWrapper from '@components/common/FormWrapper';

const schema = yup.object({
  name: yup.string().required('Name required'),
  email: yup.string().email().required('Email required'),
  password: yup.string().min(6).when('isEdit', {
    is: false,
    then: (schema) => schema.required('Password required'),
    otherwise: (schema) => schema.notRequired()
  }),
  role: yup.string().required('Role required'),
  isActive: yup.boolean()
});

const AccountForm = ({ initialData, onSubmit, isEdit = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { ...initialData, isEdit }
  });

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' }
  ];

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Input label="Name" {...register('name')} error={errors.name?.message} />
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      {!isEdit && (
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
      )}
      <Select label="Role" options={roleOptions} {...register('role')} error={errors.role?.message} />
      {isEdit && (
        <div className="flex items-center">
          <input type="checkbox" {...register('isActive')} id="isActive" className="mr-2" />
          <label htmlFor="isActive">Active</label>
        </div>
      )}
      <Button type="submit">{isEdit ? 'Update Account' : 'Create Account'}</Button>
    </FormWrapper>
  );
};

export default AccountForm;