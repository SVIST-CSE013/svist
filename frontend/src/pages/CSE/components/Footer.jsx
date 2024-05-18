import React, { useState, useEffect } from 'react'
import { ref, getDownloadURL } from 'firebase/storage';
import axios from "axios"
import Swal from "sweetalert2"
import { Link } from 'react-scroll';
import { storage } from '../../../Config/firebaseconfig'
import { baseApiURL } from '../../../baseUrl';


function Footer() {
    const [footerData, setFooterData] = useState([]);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/getfooterdetails`);
                const firstItem = response.data[0];

                const storageRef = ref(storage, firstItem.logo);
                const imageUrl = await getDownloadURL(storageRef);

                setFooterData({
                    title: firstItem.title,
                    sociallink1: firstItem.sociallink1,
                    sociallink2: firstItem.sociallink2,
                    sociallink3: firstItem.sociallink3,
                    address: firstItem.address,
                    phonenumber: firstItem.phonenumber,
                    email: firstItem.email,
                    logo: imageUrl
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Footer Details!',
                    confirmButtonText: 'OK',
                });
            }
        };

        fetchData();
    }, []);


    return (
        <div>
            <section className="footer-1" style={{ backgroundImage: `url(${require('../../../images/footer_bg.png')})` }}>
                <div className="footer_overlay pt_120 xs_pt_80">
                    <div className="container">
                        <div className="row justify-content-between">
                            <div className="col-xl-3 col-md-8 col-lg-7">
                                <div className="footer_content">
                                    <a href="index.html" className="footer_logo">
                                        <img src={footerData.logo} alt="EduFax" className="img-fluid w-100" />
                                    </a>
                                    <p className="footer_description">{footerData.title}</p>
                                    <ul className="social_link d-flex flex-wrap">
                                        <li><a href={footerData.sociallink1}><i className="fab fa-facebook-f"></i></a></li>
                                        <li><a href={footerData.sociallink2}><i className="fab fa-linkedin-in"></i></a></li>
                                        <li><a href={footerData.sociallink3}><i className="fab fa-twitter"></i></a></li>
                                        <li><a href="#"><i className="fab fa-pinterest-p"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-2 col-md-6 col-lg-5">
                                <div className="footer_content">
                                    <h3>Explore links</h3>
                                    <ul className="footer_link">
                                        <li><Link activeClass="active" to="home" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">Home</Link></li>
                                        <li><Link activeClass="active" to="about" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">About</Link></li>
                                        <li><Link activeClass="active" to="instructors" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">Instructors</Link></li>
                                        <li><Link activeClass="active" to="faq" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">FAQ</Link></li>
                                        <li><Link activeClass="active" to="gallery" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">Gallery</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6 col-lg-5 order-lg-4">
                                <div className="footer_content footer_location">
                                    <h3>Get in touch</h3>
                                    <p>
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span>{footerData.address}</span>
                                    </p>
                                    <p>
                                        <i className="fas fa-phone-alt"></i>
                                        <span>{footerData.phonenumber}</span>
                                    </p>
                                    <p>
                                        <i className="fas fa-envelope"></i>
                                        <span>{footerData.email}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="footer_bottom flex justify-content-center">
                                    <p>SVIST © {currentYear}, All Rights Reserved </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="scroll_btn"><i className="far fa-long-arrow-up"></i></div>
        </div>
    )
}

export default Footer
