import React, { useState, useEffect } from 'react'
import axios from "axios"
import Swal from 'sweetalert2';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Header from './components/Header'
import About from './components/About'
import Instructors from './components/Instructors'
import Footer from "./components/Footer"
import FAQ from "./components/FAQ"
import Gallery from "./components/Gallery"
import { baseApiURL } from '../../baseUrl';

SwiperCore.use([Navigation, Pagination, Autoplay]);

function Index() {
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getbannerCEdetails`);
        setBannerData(response.data);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Fetching Banners!',
            confirmButtonText: 'OK',
          });
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Header Section */}
      <Header />
      <section className="banner" id='home' style={{ position: 'relative' }}>
        <Swiper autoplay={{ delay: 5000 }}>
          {bannerData.map((item) => (
            <SwiperSlide key={item.id} style={{ backgroundImage: `url(${item.backgroundImage})`, backgroundSize: 'cover' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}></div>
              <div className="container">
                <div className="row justify-content-between">
                  <div className="col-xxl-5 col-md-10 col-lg-6 wow fadeInLeft" data-wow-duration="1s">
                    <div className="banner_text">
                      <h1>{item.title}</h1>
                      <h5 style={{ color: "white" }}>{item.description}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* About Section */}
      <About />

      {/* Instructor Section */}
      <Instructors />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* Gallery Section */}
      <Gallery />

      {/* Footer Section */}
      <Footer />
    </div>
  )
}

export default Index
