import React, { useState, useEffect } from 'react'
import axios from 'axios'
import New from "../../images/new.gif";
import Logo from "../../assets/images/logo/svist-logo.png"
import { Link } from 'react-scroll'
import { baseApiURL } from '../../baseUrl';
import { Link as Link2 } from 'react-router-dom'


function Header() {
    const [noticeData, setNoticeData] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [lastFetchedTimestamp, setLastFetchedTimestamp] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/getnewnoticedetails`, {
                    params: {
                        lastFetchedTimestamp: lastFetchedTimestamp,
                        type: 'Front-End Notice Panel'
                    },
                });

                setNoticeData((prevNotices) => {
                    const updatedNotices = [...prevNotices, ...response.data];

                    updatedNotices.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                    const latestNotices = updatedNotices.slice(0, 1);

                    if (latestNotices.length > 0) {
                        const latestTimestamp = Math.max(...latestNotices.map((notice) => new Date(notice.timestamp)));
                        setLastFetchedTimestamp(latestTimestamp);
                    }

                    return latestNotices;
                });
            } catch (error) {
                console.log();
            }
        };

        fetchData();
    }, [lastFetchedTimestamp]);

    const isRecentlyUpdated = (timestamp) => {
        const now = new Date();
        const noticeDate = new Date(timestamp);
        const timeDifference = now - noticeDate;
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        const isNew = hoursDifference <= 24;
        const removeBadgeAfterHours = 7 * 24;
        const shouldRemoveBadge = hoursDifference > removeBadgeAfterHours;

        return isNew && !shouldRemoveBadge;
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    

    return (
        <div>
            <section className="topbar">
                <div className="container">
                    <div className="col-xl-12">
                        <div className="topbar_text" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            <div className={`notice-container ${isHovered ? 'paused' : ''}`}>
                                {noticeData.map((notice, index) => (
                                    <div key={index} className="notice-item">
                                        <Link2 to={notice.file} target="_blank">
                                            <p>
                                                {notice.title}&nbsp;
                                                {isRecentlyUpdated(notice.timestamp) && <img className="newbadge-topbar" src={New} />}
                                            </p>
                                        </Link2>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <nav className="navbar navbar-expand-lg main_menu">
                <div className="container">
                    <Link2 to="/" style={{ cursor: 'pointer' }} className="navbar-brand">
                        <img src={Logo} alt="SVIST" className="img-fluid w-100" style={{ maxWidth: "60px" }} />
                    </Link2>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="far fa-bars menu_bar_icon"></i>
                        <i className="far fa-times menu_close_icon"></i>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link activeClass="active" to="home" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link activeClass="active" to="about" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">About Us</Link>
                            </li>
                            <li className="nav-item">
                                <Link activeClass="active" to="courses" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">Courses</Link>
                            </li>
                            <li className="nav-item">
                                <Link activeClass="active" to="testimonials" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">Testimonials</Link>
                            </li>
                            <li className="nav-item">
                                <Link activeClass="active" to="events" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">Events</Link>
                            </li>
                            <li className="nav-item">
                                <Link activeClass="active" to="achievements" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">Achievements</Link>
                            </li>
                            <li className="nav-item">
                                <Link activeClass="active" to="contact" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">Contact</Link>
                            </li>
                        </ul>
                        <ul className="right_menu d-flex flex-wrap">
                            <li><Link2 to='/authlogin' target='_blank' className='signin'>Login</Link2></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header
