import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '@services/propertyService';
import PropertyCard from '@components/properties/PropertyCard';
import PropertyFilters from '@components/properties/PropertyFilters';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import { FiFilter, FiHome } from 'react-icons/fi';
import { formatCurrency } from '@utils/formatters';

const UserBrowseProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await propertyService.getProperties();
      const available = res.data.data.filter(p => p.units?.some(u => u.status === 'available'));
      setProperties(available);
      setFiltered(available);
    } catch (err) {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filteredList = [...properties];
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filteredList = filteredList.filter(p =>
        p.title?.toLowerCase().includes(term) ||
        p.propertyCode?.toLowerCase().includes(term) ||
        p.address?.street?.toLowerCase().includes(term) ||
        p.address?.city?.toLowerCase().includes(term)
      );
    }
    if (filters.type) filteredList = filteredList.filter(p => p.type === filters.type);
    if (filters.minPrice) filteredList = filteredList.filter(p => p.basePrice >= +filters.minPrice);
    if (filters.maxPrice) filteredList = filteredList.filter(p => p.basePrice <= +filters.maxPrice);
    if (filters.bedrooms) filteredList = filteredList.filter(p => p.bedrooms >= +filters.bedrooms);
    filteredList = filteredList.filter(p => p.units?.some(u => u.status === 'available'));
    setFiltered(filteredList);
  };

  const availableUnits = (p) => p.units?.filter(u => u.status === 'available').length || 0;
  const minPrice = (p) => {
    const avail = p.units?.filter(u => u.status === 'available');
    return avail?.length ? Math.min(...avail.map(u => u.price)) : p.basePrice;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProperties} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Browse Available Properties</h1>
        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
          <FiFilter className="mr-2" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>
      {showFilters && <PropertyFilters onFilter={handleFilter} />}
      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <FiHome className="mx-auto text-gray-400 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">No properties match your criteria.</p>
          <div className="mt-6 space-x-2">
            <Button variant="outline" onClick={() => { setFiltered(properties); setShowFilters(false); }}>Clear Filters</Button>
            <Button variant="primary" onClick={fetchProperties}>Refresh</Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Found {filtered.length} propert{filtered.length !== 1 ? 'ies' : 'y'}</p>
            <Badge className="bg-blue-100 text-blue-800">{filtered.reduce((a, p) => a + availableUnits(p), 0)} total units available</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <div key={p._id}>
                <PropertyCard property={p} />
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge className="bg-green-100 text-green-800">{availableUnits(p)} unit{availableUnits(p) !== 1 ? 's' : ''} available</Badge>
                    <Badge className="bg-blue-100 text-blue-800">From {formatCurrency(minPrice(p))}</Badge>
                  </div>
                  <Link to={`/property/${p._id}`}><Button variant="outline" size="sm">View</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserBrowseProperties;