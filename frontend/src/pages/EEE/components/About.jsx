import React, { useState, useEffect } from 'react'
import { ref, getDownloadURL } from 'firebase/storage';
import axios from "axios"
import Swal from "sweetalert2"
import { storage } from '../../../Config/firebaseconfig';
import { baseApiURL } from '../../../baseUrl';

function About() {
    const [about, setAbout] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/getaboutEEEdetails`);
                const firstItem = response.data[0];

                const storageRef1 = ref(storage, firstItem.image1);
                const imageUrl1 = await getDownloadURL(storageRef1);

                const storageRef2 = ref(storage, firstItem.image2);
                const imageUrl2 = await getDownloadURL(storageRef2);

                setAbout({
                    title: firstItem.title,
                    description: firstItem.description,
                    image1: imageUrl1,
                    image2: imageUrl2
                });

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Data!',
                    confirmButtonText: 'OK',
                });
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <section className="about_us pt_120 xs_pt_80 pb_120 xs_pb_80" id='about' style={{ backgroundImage: `url(${require('../../../images/about_section_bg.jpg')})` }}>
                <div className="container">
                    <div className="row pb-4">
                        <div className="col-xl-6 col-md-9 col-lg-7 m-auto">
                            <div className="section_heading heading_center mb_30">
                                <h2>{about.title}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-between">
                        <div className="col-xl-5 col-md-9 col-lg-6 wow fadeInLeft" data-wow-duration="1s">
                            <div className="about_us_img">
                                <div className="img_1">
                                    <img src={about.image1} alt="about us" className="img-fluid w-100" />
                                </div>
                                <div className="img_2">
                                    <img src={about.image2} alt="about us" className="img-fluid w-100" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 wow fadeInRight" data-wow-duration="1s">
                            <div className="about_us_text">
                                <p>{about.description}</p>
                                <ul className="d-flex flex-wrap">
                                    <li>
                                        <span>
                                            <i className="fas fa-star"></i>
                                        </span>
                                        <h4>Build your career</h4>
                                        <p>Online course quickly from anywhere.</p>
                                    </li>
                                    <li>
                                        <span>
                                            <i className="fas fa-pencil-ruler"></i>
                                        </span>
                                        <h4>Grow your skill</h4>
                                        <p>Online course quickly from anywhere.</p>
                                    </li>
                                    <li>
                                        <span>
                                            <i className="fas fa-star"></i>
                                        </span>
                                        <h4>Build your career</h4>
                                        <p>Online course quickly from anywhere.</p>
                                    </li>
                                    <li>
                                        <span>
                                            <i className="fas fa-pencil-ruler"></i>
                                        </span>
                                        <h4>Grow your skill</h4>
                                        <p>Online course quickly from anywhere.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About
