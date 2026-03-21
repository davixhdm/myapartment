import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { FiLogIn, FiUserPlus, FiLogOut, FiMenu } from 'react-icons/fi';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            MyApartment
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <FiLogIn /><span>Login</span>
                </Link>
                <Link to="/register" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <FiUserPlus /><span>Register</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <FiLogOut /><span>Logout</span>
                </button>
              </div>
            )}
          </nav>

          <button className="md:hidden text-gray-700">
            <FiMenu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;