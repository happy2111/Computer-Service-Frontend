import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/zoom';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../index.css';

// import required modules
import { Zoom, Navigation, Pagination } from 'swiper/modules';
import {X} from "lucide-react";

export default function DeviceFilesSwiper({isOpen, onClose, data, setData}) {
  return (
    <>
      <div className={"z-35  fixed top-2 left-2"}>
        <button
          className="bg-red-400 duration-100 hover:bg-red-500 active:bg-red-500 text-white font-bold p-2 my-3 rounded"
          onClick={() => {
            onClose();
            setData(null);
          }}

          type="button"
        >
          <X className="w-5 h-5 " />
        </button>
      </div>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        zoom={true}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[Zoom, Navigation, Pagination]}
        className="mySwiper"
      >
        {
          data.map((file) =>
          {
            console.log(file);
            return(
            <SwiperSlide>
              <div className="swiper-zoom-container">
                {file.startsWith("/uploads/devices/images") ? (
                  <img
                    src={`http://localhost:5000${file}`}
                    alt="device image"
                  />
                ) : (
                  <video
                    className="w-full"
                    controls
                  >
                    <source src={`http://localhost:5000${file}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}

              </div>
            </SwiperSlide>
          )})
        }
      </Swiper>
    </>
  );
}
