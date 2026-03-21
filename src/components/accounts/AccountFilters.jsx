import React, { useState } from 'react';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import Button from '@components/common/Button';
import { FiSearch, FiFilter } from 'react-icons/fi';

const AccountFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({ search: '', role: '', status: '' });
    onFilter({});
  };

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-2">
          <Input
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by name or email..."
            className="flex-1"
          />
          <Button type="submit" variant="primary">
            <FiSearch />
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <FiFilter />
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              name="role"
              label="Role"
              options={roleOptions}
              value={filters.role}
              onChange={handleChange}
            />
            <Select
              name="status"
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={handleChange}
            />
            <div className="flex items-end">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AccountFilters;