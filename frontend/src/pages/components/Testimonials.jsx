import React, { useState, useEffect } from 'react'
import { ref, getDownloadURL } from 'firebase/storage';
import axios from "axios"
import Swal from 'sweetalert2';
import { storage } from '../../Config/firebaseconfig'
import Slider from 'react-slick';
import { baseApiURL } from '../../baseUrl';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Testimonials() {
  const [testimonialData, setTestimonialData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/gettestimonialdetails`);
        const testimonialDetails = response.data.map(async (item) => {
          const storageRef = ref(storage, item.profileimage);
          const imageUrl = await getDownloadURL(storageRef);
          return {
            name: item.name,
            designation: item.designation,
            description: item.description,
            profileimage: imageUrl
          };
        });

        Promise.all(testimonialDetails).then((testimonials) => {
          setTestimonialData(testimonials);
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Testimonial Details!',
          confirmButtonText: 'OK',
        });
      }
    };

    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <section className="testimonial pt_110 xs_pt_75 pb_115 xs_pb_75" id='testimonials' style={{ backgroundImage: `url(${require('../../images/testimonial_bg.jpg')})` }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-md-9 col-lg-7">
              <div className="section_heading mb_60">
                <h2>What Our Student Saying</h2>
              </div>
            </div>
          </div>
          <div className="row" style={{ display: 'flex', flexDirection: "row" }}>
            <Slider {...settings}>
              {testimonialData.map((testimonial, index) => (
                <div key={index} className="col-xl-6 wow fadeInUp" data-wow-duration="1s">
                  <div className="single_testimonial" style={{ marginRight: '15px' }}>
                    <div className="img">
                      <img src={testimonial.profileimage} alt="testimonial" className="img-fluid w-100" />
                    </div>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.designation}</span>
                    <p className="description">{testimonial.description}</p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Testimonials
