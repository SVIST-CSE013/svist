import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import errorimg from "../images/404.jpg";

const Error404 = () => {
    return (
        <Fragment>
            <section className="error_page">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-md-8 m-auto wow fadeInUp" data-wow-duration="1s">
                            <div className="error_text">
                                <div className="error_img">
                                    <img src={errorimg} alt="error" className="img-fluid w-100"/>
                                </div>
                                <h2>Oops! Page not found.</h2>
                                <p>The page you are looking for might have been removed had its name changed or is temporarily
                                    unavailable.</p>
                                <Link className='common_btn' to="/">Back To Home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default Error404;