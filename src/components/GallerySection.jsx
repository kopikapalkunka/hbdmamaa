import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './GallerySection.css';

const GallerySection = () => {
  // All photos from public/photos/ directory
  // Photos are automatically loaded from the public folder
  const galleryItems = [
    { id: 1, caption: "Your smile brighter than the sun", image: '/photos/m.jpeg' },
    { id: 2, caption: "Cherished times", image: '/photos/m1.jpeg' },
    { id: 3, caption: "Happy Mom ", image: '/photos/m2.jpeg' },
    { id: 4, caption: "Most prettiest woman", image: '/photos/m3.jpeg' },
    { id: 5, caption: "Special moments", image: '/photos/m4.jpeg' },
    { id: 6, caption: "Precious moments", image: '/photos/m5.jpeg' },
    { id: 7, caption: "Love and laughter", image: '/photos/m6.jpeg' },
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
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.caption}
                      onError={(e) => {
                        // Fallback to placeholder if image doesn't exist
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <svg 
                    width="100%" 
                    height="300" 
                    viewBox="0 0 300 300"
                    style={{ display: item.image ? 'none' : 'block' }}
                  >
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

