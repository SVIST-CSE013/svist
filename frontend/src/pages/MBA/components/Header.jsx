import React from 'react'
import Logo from "../../../assets/images/logo/svist-logo.png"
import { Link } from 'react-scroll'
import { Link as Link2 } from 'react-router-dom'

function Header() {
    return (
        <div>
            <section className="topbar">
                <div className="container">
                    <div className="col-xl-12">
                        <div className="topbar_text">
                            <p>Welcome To SVIST MBA Department</p>
                        </div>
                    </div>
                </div>
            </section>
            <nav className="navbar navbar-expand-lg main_menu">
                <div className="container">
                    <Link to="/" style={{ cursor: 'pointer' }} className="navbar-brand">
                        <img src={Logo} alt="SVIST" className="img-fluid w-100" style={{ maxWidth: "60px" }} />
                    </Link>
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
                                <Link activeClass="active" to="instructors" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">Instructors</Link>
                            </li>
                            <li className="nav-item">
                                <Link activeClass="active" to="faq" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">FAQ</Link>
                            </li>
                            <li className="nav-item">
                                <Link activeClass="active" to="gallery" style={{ cursor: 'pointer' }} spy={true} smooth={true} duration={500} className="nav-link">Gallery</Link>
                            </li>
                        </ul>
                        <ul className="right_menu d-flex flex-wrap">
                            <li><Link2 to='/department' target='_blank' className='signin'>Login</Link2></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header
