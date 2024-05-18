import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { Modal, ModalBody } from 'reactstrap';
import axios from "axios";
import Swal from "sweetalert2"
import { storage } from '../../../Config/firebaseconfig';
import Slider from 'react-slick';
import InstructorDetails from './InstructorDetails';
import { baseApiURL } from '../../../baseUrl';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Instructors() {
    const [instructorData, setInstructorData] = useState([]);
    const [instructorModal, setInstructorModal] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${baseApiURL()}/getFilteredFacultyDetails`, { department: 'Civil Engineering' });
                const instructorDetails = response.data.faculty.map(async (item) => {
                    const storageRef = ref(storage, item.profile);
                    const imageUrl = await getDownloadURL(storageRef);
                    return {
                        fullName: item.fullName,
                        email: item.email,
                        department: item.department,
                        phone: item.phoneNo,
                        AcademicExp: item.academicexp,
                        designation: item.designation,
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
                    text: 'Error Fetching Instructors!',
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

    const openInstructorModal = (instructor) => {
        setSelectedInstructor(instructor);
        setInstructorModal(true);
    };

    const closeInstructorModal = () => {
        setSelectedInstructor(null);
        setInstructorModal(false);
    };

    return (
        <div>
            <section className="instructor" id='instructors' style={{ backgroundImage: `url(${require('../../../images/instructor_bg.jpg')})` }}>
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
                            {instructorData.length <= 2 ? (
                                instructorData.map((instructor, index) => (
                                    <div key={index} className="col-xl-4 wow fadeInUp" data-wow-duration="1s">
                                        <div className="single_instructor" style={{ marginRight: '22px' }}>
                                            <span className="single_instructor_img" onClick={() => openInstructorModal(instructor)} style={{ cursor: 'pointer' }}>
                                                <img src={instructor.profileimage} alt="instructor" className="img-fluid w-100" style={{ borderRadius: '10px' }} />
                                                <Modal isOpen={instructorModal} toggle={closeInstructorModal} size="xl" centered>
                                                    <ModalBody>
                                                        <InstructorDetails instructor={selectedInstructor} onClose={closeInstructorModal} />
                                                    </ModalBody>
                                                </Modal>
                                            </span>
                                            <div className="instructor_text">
                                                <p>{instructor.fullName}</p>
                                                <p>{instructor.designation}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Slider {...settings}>
                                    {instructorData.map((instructor, index) => (
                                        <div key={index} className="col-xl-6 wow fadeInUp" data-wow-duration="1s">
                                            <div className="single_instructor" style={{ marginRight: '22px' }}>
                                                <span className="single_instructor_img" onClick={() => openInstructorModal(instructor)} style={{ cursor: 'pointer' }}>
                                                    <img src={instructor.profileimage} alt="instructor" className="img-fluid w-100" style={{ borderRadius: '10px' }} />
                                                    <Modal isOpen={instructorModal} toggle={closeInstructorModal} size="xl" centered>
                                                        <ModalBody>
                                                            <InstructorDetails instructor={selectedInstructor} onClose={closeInstructorModal} />
                                                        </ModalBody>
                                                    </Modal>
                                                </span>
                                                <div className="instructor_text">
                                                    <p>{instructor.fullName}</p>
                                                    <p>{instructor.designation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Instructors;


