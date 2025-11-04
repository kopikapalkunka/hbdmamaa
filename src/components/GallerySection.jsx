import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './GallerySection.css';

const GallerySection = () => {
  // Sample gallery data - replace with actual photos
  // Photos should be placed in /public/photos/ directory
  // Use paths like: '/photos/photo1.jpg'
  const galleryItems = [
    { id: 1, caption: "Beautiful memories together", image: '/photos/photo1.jpg' },
    { id: 2, caption: "A moment of joy", image: '/photos/photo2.jpg' },
    { id: 3, caption: "Family love", image: '/photos/photo3.jpg' },
    { id: 4, caption: "Cherished times", image: '/photos/photo4.jpg' },
    { id: 5, caption: "Special moments", image: '/photos/photo5.jpg' },
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

