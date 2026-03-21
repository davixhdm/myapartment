import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@hooks/useAuth';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import Button from '@components/common/Button';
import FormWrapper from '@components/common/FormWrapper';
import Card from '@components/common/Card';
import { formatCurrency } from '@utils/formatters';

const schema = yup.object({
  personalInfo: yup.object({
    fullName: yup.string().required('Full name required'),
    email: yup.string().email().required('Email required'),
    phone: yup.string().required('Phone required'),
    currentAddress: yup.string().required('Current address required'),
    employmentStatus: yup.string().required('Employment status required'),
    employer: yup.string().when('employmentStatus', {
      is: (val) => ['employed', 'self-employed'].includes(val),
      then: (schema) => schema.required('Employer required'),
      otherwise: (schema) => schema.notRequired()
    }),
    monthlyIncome: yup.number().positive().required('Monthly income required')
  }),
  emergencyContact: yup.object({
    name: yup.string().required('Emergency contact name required'),
    relationship: yup.string().required('Relationship required'),
    phone: yup.string().required('Emergency phone required')
  })
});

const ApplicationForm = ({ onSubmit, selectedUnit }) => {
  const { user } = useAuth();
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      personalInfo: {
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        currentAddress: '',
        employmentStatus: '',
        employer: '',
        monthlyIncome: ''
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    }
  });

  useEffect(() => {
    if (user) {
      setValue('personalInfo.fullName', user.name || '');
      setValue('personalInfo.email', user.email || '');
      setValue('personalInfo.phone', user.phone || '');
    }
  }, [user, setValue]);

  const employmentStatus = watch('personalInfo.employmentStatus');

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      {selectedUnit && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-2">Selected Unit</h3>
          <p className="text-sm">Unit {selectedUnit.unitNumber}</p>
          <p className="text-sm">{selectedUnit.bedrooms} bed • {selectedUnit.bathrooms} bath • {selectedUnit.area} m²</p>
          <p className="text-lg font-bold text-blue-600 mt-1">{formatCurrency(selectedUnit.price)}/month</p>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="space-y-4">
          <Input
            label="Full Name"
            {...register('personalInfo.fullName')}
            error={errors.personalInfo?.fullName?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register('personalInfo.email')}
            error={errors.personalInfo?.email?.message}
          />
          <Input
            label="Phone"
            {...register('personalInfo.phone')}
            error={errors.personalInfo?.phone?.message}
          />
          <Input
            label="Current Address"
            {...register('personalInfo.currentAddress')}
            error={errors.personalInfo?.currentAddress?.message}
          />
          <Select
            label="Employment Status"
            options={[
              { value: '', label: 'Select...' },
              { value: 'employed', label: 'Employed' },
              { value: 'self-employed', label: 'Self-Employed' },
              { value: 'unemployed', label: 'Unemployed' },
              { value: 'student', label: 'Student' },
              { value: 'retired', label: 'Retired' }
            ]}
            {...register('personalInfo.employmentStatus')}
            error={errors.personalInfo?.employmentStatus?.message}
          />
          {(employmentStatus === 'employed' || employmentStatus === 'self-employed') && (
            <>
              <Input
                label="Employer/Business Name"
                {...register('personalInfo.employer')}
                error={errors.personalInfo?.employer?.message}
              />
              <Input
                label="Monthly Income (KES)"
                type="number"
                {...register('personalInfo.monthlyIncome')}
                error={errors.personalInfo?.monthlyIncome?.message}
              />
            </>
          )}
        </div>
      </Card>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
        <div className="space-y-4">
          <Input
            label="Full Name"
            {...register('emergencyContact.name')}
            error={errors.emergencyContact?.name?.message}
          />
          <Input
            label="Relationship"
            {...register('emergencyContact.relationship')}
            error={errors.emergencyContact?.relationship?.message}
          />
          <Input
            label="Phone"
            {...register('emergencyContact.phone')}
            error={errors.emergencyContact?.phone?.message}
          />
        </div>
      </Card>

      <div className="mt-6">
        <Button type="submit" size="lg" className="w-full">
          Submit Application
        </Button>
      </div>
    </FormWrapper>
  );
};

export default ApplicationForm;