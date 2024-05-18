import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import errorimg from "../images/403.jpg";

const Error403 = () => {
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
                                <h2>Restricted Access !</h2>
                                <p>The Page you are trying to visit has restricted access.</p>
                                <Link className='common_btn' to="/">Back To Home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default Error403;