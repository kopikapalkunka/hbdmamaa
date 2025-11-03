import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './GallerySection.css';

const GallerySection = () => {
  // Sample gallery data - replace with actual photos
  const galleryItems = [
    { id: 1, caption: "Beautiful memories together" },
    { id: 2, caption: "A moment of joy" },
    { id: 3, caption: "Family love" },
    { id: 4, caption: "Cherished times" },
    { id: 5, caption: "Special moments" },
  ];

  return (
    <section className="gallery-section">
      <div className="gallery-background"></div>
      
      <div className="gallery-container">
        <h2 className="gallery-title">Memory Garden</h2>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="gallery-swiper"
        >
          {galleryItems.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="gallery-card">
                <div className="gallery-photo">
                  <svg width="100%" height="300" viewBox="0 0 300 300">
                    <rect width="300" height="300" rx="12" fill="#FAF4EF" stroke="#800000" strokeWidth="2" strokeDasharray="4,4"/>
                    <text x="150" y="150" textAnchor="middle" fill="#800000" fontSize="18" fontFamily="var(--font-primary)">
                      Photo {item.id}
                    </text>
                  </svg>
                </div>
                <p className="gallery-caption">{item.caption}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <button className="view-all-btn">View All Photos</button>
      </div>
    </section>
  );
};

export default GallerySection;

