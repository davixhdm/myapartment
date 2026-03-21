import { ROLES } from './constants';

export const canViewProperty = (user, property) => {
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  if (user.role === ROLES.LANDLORD && property.landlord?._id === user._id) return true;
  if (user.role === ROLES.TENANT && property.currentTenant?._id === user._id) return true;
  return false;
};

export const canEditProperty = (user, property) => {
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  if (user.role === ROLES.LANDLORD && property.landlord?._id === user._id) return true;
  return false;
};

export const canDeleteProperty = (user, property) => {
  return user?.role === ROLES.ADMIN;
};

export const canViewTransaction = (user, transaction) => {
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  if (user.role === ROLES.LANDLORD && transaction.landlord?._id === user._id) return true;
  if (user.role === ROLES.TENANT && transaction.tenant?._id === user._id) return true;
  return false;
};