import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";

const Slider = ({ slides }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="w-full relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={16} // gap between images
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="w-full h-44 md:h-64 "
        breakpoints={{
          0: { slidesPerView: 1 },       // mobile
          640: { slidesPerView: 2 },     // tablet
          1024: { slidesPerView: 3 },    // desktop
        }}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={slide}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      
    </div>
  );
};

export default Slider;
