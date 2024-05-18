import React, {Fragment} from 'react'
import { Container } from 'reactstrap';

function InstructorDetails({ instructor }) {
    if (!instructor) {
        return null;
    }

    const {
        fullName,
        email,
        department,
        phone,
        AcademicExp,
        designation,
        profileimage,
    } = instructor;
    
    return (
        <Fragment>
            <Container fluid={true}>
                <div className="course_instructor">
                    <div className="row">
                        <div className="col-xl-4 col-sm-8 col-md-6 col-lg-5">
                            <div className="course_instructor_img">
                                <img src={profileimage} alt="course" className="img-fluid w-100" style={{borderRadius: '10px'}} />
                            </div>
                        </div>
                        <div className="col-xl-8 col-lg-7">
                            <div className="course_instructor_text">
                                <h3>{fullName}</h3>
                                <h5>{designation}</h5>

                                <p className="about">Hello, This is <b>{fullName}</b>, {designation} of <b>Department of {department}</b> from SVIST with an <b>Academic Experience of {AcademicExp}</b>.</p>

                                <p className="address"><i className="fas fa-phone-alt"></i>{phone}</p>
                                <p className="address"><i className="fas fa-envelope"></i>{email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Fragment>
    )
}

export default InstructorDetails
