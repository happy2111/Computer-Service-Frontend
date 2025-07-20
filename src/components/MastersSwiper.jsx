import React, {useEffect, useRef, useState} from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import '../index.css';

// import required modules
import { FreeMode,Mousewheel, Pagination, Autoplay } from 'swiper/modules';



export default function MastersSwiper({masters}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  return (
    <>
      <Swiper
        slidesPerView={
          windowWidth < 640 ? 1 :
          windowWidth < 768 ? 2 :
          windowWidth < 1024 ? 3 :
          windowWidth < 1280 ? 4 : 5
        }
        spaceBetween={50}
        freeMode={true}
        mousewheel={
          {
            sensitivity: 0.5,
            releaseOnEdges: true,
          }
        }
        autoplay={{
          delay: 1200,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay,FreeMode, Pagination, Mousewheel]}
        className="masters-Swiper min-h-105"
      >
        {masters.map((master) => (
          <SwiperSlide className={"select-none "} >
            <TeamMember
              key={master._id }
              image={`https://api.applepark.uz${master.avatar}`}
              name={master.name}
              position={master.position}
              description={master.description}
            />
          </SwiperSlide>

        ))}

      </Swiper>
    </>
  );
}
function TeamMember({image, name, position, description}) {
  return (
    <div className="text-center">
      <img
        src={image}
        alt={name}
        className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
      />
      <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
      <p className="text-blue-600 text-sm">{position}</p>
      <p className="text-gray-600 mt-2 text-sm">{description}</p>
    </div>
  );
}
