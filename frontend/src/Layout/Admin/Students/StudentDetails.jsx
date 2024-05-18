import React, { Fragment, useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Form, FormGroup, Label, Row, Col, Spinner, Button } from 'reactstrap';
import { H5, P } from '../../../AbstractElements';
import axios from 'axios';
import { X } from 'react-feather';
import { baseApiURL } from '../../../baseUrl';
import Swal from 'sweetalert2';

const ViewProfile = ({ student , onClose }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getSingleStudentDetails/${student._id}`);
        const StudentDetails = response.data;

        setStudentData(StudentDetails);
        setLoading(false);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Fetching Student Details!',
            confirmButtonText: 'OK'
          });
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <Card>
            <CardHeader className='d-flex justify-content-between align-items-center'>
              <H5 attrH5={{ className: 'card-title mb-0' }}>Student Details</H5>
              <Button color="transparent" onClick={handleClose}><X /></Button>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-center">
                  <Spinner color="primary" />
                </div>
              ) : (
                <Form>
                  <Row className='mb-4'>
                    <Col sm='12' className='d-flex justify-content-center align-items-center flex-column'>
                      <img src={studentData.profile} alt='Profile' className='rounded-circle' style={{ width: '180px', height: '180px' }} />
                      <div className='mt-2'>
                        <H5 attrH5={{ className: 'mb-0 text-center' }}>{studentData.fullName}</H5>
                      </div>
                    </Col>
                  </Row>
                  <br />
                  <Row className='m-5 d-flex justify-content-center align-items-center'>
                    <Col xl='3'>
                      <FormGroup className='mb-3'>
                        <Label className='form-label'><b>Enrollment No.</b></Label>
                        <P>{studentData.enrollmentNo}</P>
                      </FormGroup>
                      <FormGroup className='mb-3'>
                        <Label className='form-label'><b>Guardian Name</b></Label>
                        <P>{studentData.guardianName}</P>
                      </FormGroup>
                    </Col>
                    <Col xl='3'>
                      <FormGroup className='mb-3'>
                        <Label className='form-label'><b>Email Address</b></Label>
                        <P>{studentData.email}</P>
                      </FormGroup>
                      <FormGroup className='mb-3'>
                        <Label className='form-label'><b>Phone Number</b></Label>
                        <P>{studentData.phoneNo}</P>
                      </FormGroup>
                    </Col>
                    <Col xl='3'>
                      <FormGroup className='mb-3'>
                        <Label className='form-label'><b>Department</b></Label>
                        <P>{studentData.department}</P>
                      </FormGroup>
                      <FormGroup className='mb-3'>
                        <Label className='form-label'><b>Address</b></Label>
                        <P>{studentData.address}</P>
                      </FormGroup>
                    </Col>
                    <Col xl='3'>
                      <FormGroup className='mb-3'>
                        <Label className='form-label'><b>Semester</b></Label>
                        <P>{studentData.semester}</P>
                      </FormGroup>
                      <FormGroup className='mb-3'>
                        <Label className='form-label'><b>Gender</b></Label>
                        <P>{studentData.gender}</P>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default ViewProfile;

