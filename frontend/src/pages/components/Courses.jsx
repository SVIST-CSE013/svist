import React, { useState, useEffect } from 'react'
import { ref, getDownloadURL } from 'firebase/storage';
import axios from "axios"
import Swal from 'sweetalert2';
import { storage } from '../../Config/firebaseconfig'
import { Link } from 'react-router-dom'
import { baseApiURL } from '../../baseUrl';

function Courses() {
    const [courseData, setCourseData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/getcoursedetails`);
                const courseDetails = response.data.map(async (item) => {
                    const storageRef = ref(storage, item.image);
                    const imageUrl = await getDownloadURL(storageRef);
                    return {
                        title: item.title,
                        image: imageUrl,
                        link: item.link
                    };
                });

                Promise.all(courseDetails).then((courses) => {
                    setCourseData(courses);
                });

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Courses!',
                    confirmButtonText: 'OK',
                });
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <section className="courses pt_110 xs_pt_75 pb_120 xs_pb_80" id='courses' style={{ backgroundImage: `url(${require('../../images/courses_bg.jpg')})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-md-9 col-lg-7 m-auto">
                            <div className="section_heading heading_center mb_30">
                                <h2>Our Popular Courses</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {courseData.map((course, index) => (
                            <div key={index} className="col-xl-4 col-md-6 wow fadeInUp" data-wow-duration="1s">
                                <div className="single_courses">
                                    <div className="single_courses_img">
                                        <img src={course.image} alt="courses" className="img-fluid w-100" />
                                    </div>
                                    <div className="single_courses_text">
                                        <Link to={course.link} target="_blank" style={{ cursor: 'pointer' }} className="title">
                                            {course.title}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Courses
