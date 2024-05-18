import React, { useState, useEffect } from 'react'
import { ref, getDownloadURL } from 'firebase/storage';
import axios from "axios"
import Swal from 'sweetalert2';
import { storage } from '../../Config/firebaseconfig'
import Slider from 'react-slick';
import { baseApiURL } from '../../baseUrl';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


function Instructors() {
  const [instructorData, setInstructorData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getinstructordetails`);
        const instructorDetails = response.data.map(async (item) => {
          const storageRef = ref(storage, item.profileimage);
          const imageUrl = await getDownloadURL(storageRef);
          return {
            name: item.name,
            designation: item.designation,
            sociallink1: item.sociallink1,
            sociallink2: item.sociallink2,
            sociallink3: item.sociallink3,
            profileimage: imageUrl
          };
        });

        Promise.all(instructorDetails).then((instructors) => {
          setInstructorData(instructors);
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Instructor Details!',
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
    slidesToShow: 3,
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
      <section className="instructor" id='instructors' style={{ backgroundImage: `url(${require('../../images/instructor_bg.jpg')})` }}>
        <div className="instructor_overlay  pt_110 xs_pt_75 pb_80 xs_pb_40">
          <div className="container">
            <div className="row">
              <div className="col-xl-6 col-md-9 col-lg-7 m-auto">
                <div className="section_heading heading_center mb_35 xs_mb_30">
                  <h2>Our Expert Instructor</h2>
                </div>
              </div>
            </div>
            <div className="row" style={{ display: 'flex', flexDirection: "row" }}>
              <Slider {...settings}>
                {instructorData.map((instructor, index) => (
                  <div key={index} className="col-xl-6 wow fadeInUp" data-wow-duration="1s">
                    <div className="single_instructor" style={{ marginRight: '22px' }}>
                      <a href="instructor_details.html" className="single_instructor_img">
                        <img src={instructor.profileimage} alt="instructor" className="img-fluid w-100" />
                      </a>
                      <div className="instructor_text">
                        <a href="instructor_details.html">{instructor.name}</a>
                        <p>{instructor.designation}</p>
                      </div>
                      <ul>
                        <li><a className="facebook" href={instructor.sociallink1}><i className="fab fa-facebook-f"></i></a></li>
                        <li><a className="linkedin" href={instructor.sociallink2}><i className="fab fa-linkedin-in"></i></a></li>
                        <li><a className="twitter" href={instructor.sociallink3}><i className="fab fa-twitter"></i></a></li>
                      </ul>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Instructors
