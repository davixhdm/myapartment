import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import Button from '@components/common/Button';

const PropertyFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    status: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== '') {
        activeFilters[key] = filters[key];
      }
    });
    onFilter(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      status: ''
    });
    onFilter({});
  };

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' }
  ];

  const bedroomOptions = [
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search by title, code, or location..."
              className="mb-0"
            />
          </div>
          <Button type="submit" variant="primary"><FiSearch /></Button>
          {(filters.search || filters.type || filters.minPrice || filters.maxPrice || filters.bedrooms) && (
            <Button type="button" variant="outline" onClick={handleReset}><FiX /></Button>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            name="type"
            label="Property Type"
            options={[{ value: '', label: 'All Types' }, ...propertyTypes]}
            value={filters.type}
            onChange={handleChange}
          />
          <Select
            name="bedrooms"
            label="Bedrooms"
            options={[{ value: '', label: 'Any' }, ...bedroomOptions]}
            value={filters.bedrooms}
            onChange={handleChange}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (KES)</label>
            <Input type="number" name="minPrice" value={filters.minPrice} onChange={handleChange} placeholder="Min" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (KES)</label>
            <Input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} placeholder="Max" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyFilters;