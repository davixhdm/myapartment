import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useSettings } from '@hooks/useSettings';
import PropertyCard from '@components/properties/PropertyCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { publicApi } from '@services/api';

const LandingPage = () => {
  const { settings } = useSettings();
  const [properties, setProperties] = useState([]);
  const [weather, setWeather] = useState({ temp: 16, condition: 'Sunny' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, weatherRes] = await Promise.all([
          publicApi.get('/properties/public'),
          publicApi.get('/weather')
        ]);
        setProperties(propsRes.data.data);
        setWeather(weatherRes.data.data);
      } catch (error) {
        console.error('Failed to load landing data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to {settings.companyName}
          </h1>
          <p className="text-xl mb-8">Find your perfect home or manage your properties with ease.</p>
          <div className="space-x-4">
            <Link to="/login" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Login
            </Link>
            <Link to="/register" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* Available Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Available Properties</h2>
          {properties.length === 0 ? (
            <p className="text-center text-gray-500">No properties available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact & Weather */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact {settings.companyName}</h2>
              <div className="space-y-4">
                <p className="flex items-center"><FiMail className="mr-2" /> {settings.contactEmail || 'info@myapartment.com'}</p>
                <p className="flex items-center"><FiPhone className="mr-2" /> {settings.contactPhone || '+254 700 123 456'}</p>
                <p className="flex items-center"><FiMapPin className="mr-2" /> {settings.address || '123 Main Street, Nairobi, Kenya'}</p>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">Weather in Nairobi</h2>
              <div className="bg-white rounded-lg shadow p-6 inline-block">
                <p className="text-5xl font-bold">{weather.temp}°C</p>
                <p className="text-xl text-gray-600">{weather.condition}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;