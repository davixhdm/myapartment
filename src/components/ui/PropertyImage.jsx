import React, { useState } from 'react';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop'
];

const PropertyImage = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGES[0]);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const handleError = () => {
    if (fallbackIndex < FALLBACK_IMAGES.length - 1) {
      setImgSrc(FALLBACK_IMAGES[fallbackIndex + 1]);
      setFallbackIndex(fallbackIndex + 1);
    } else {
      setImgSrc(FALLBACK_IMAGES[0]);
    }
  };

  return <img src={imgSrc} alt={alt} className={className} onError={handleError} />;
};

export default PropertyImage;