import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const PropertyGallery = ({ images = [] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const placeholderImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';

  const galleryImages = Array.isArray(images) && images.length > 0 
    ? images 
    : [{ url: placeholderImage, isPrimary: true }];

  return (
    <div className="space-y-4">
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        navigation
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        spaceBetween={10}
        className="h-96 rounded-lg overflow-hidden"
      >
        {galleryImages.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.url || placeholderImage}
              alt={`Property ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = placeholderImage; }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {galleryImages.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          spaceBetween={10}
          slidesPerView={4}
          watchSlidesProgress
          className="h-24"
        >
          {galleryImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image.url || placeholderImage}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded-lg cursor-pointer"
                onError={(e) => { e.target.src = placeholderImage; }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default PropertyGallery;