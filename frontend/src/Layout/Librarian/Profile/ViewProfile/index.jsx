import React, { Fragment, useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Form, FormGroup, Label, Row, Col, Modal, ModalBody, Spinner } from 'reactstrap';
import { H5, H6, P, Btn } from '../../../../AbstractElements';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated } from "../../../../redux/authRedux";
import { Key } from 'react-feather';
import { baseApiURL } from '../../../../baseUrl';
import ChangePwd from '../../../../Auth/ChangePwd';
import Swal from 'sweetalert2';

const ViewProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [userRole, setUserRole] = useState();
  const [userId, setUserId] = useState();
  const [adminData, setAdminData] = useState([]);
  const [pwdmodal, setPwdModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLibraryAdminAuthorization = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/librarianRoutes`, {
          withCredentials: true,
        });

        const data = response.data;

        if (data.authenticated) {
          dispatch(setAuthenticated(true));
          window.history.pushState(null, null, window.location.pathname);
        } else {
          navigate(`${process.env.PUBLIC_URL}/librarianlogin`, { replace: true });
        }

      } catch (error) {
        navigate(`${process.env.PUBLIC_URL}/librarianlogin`, { replace: true });
      }
    };

    checkLibraryAdminAuthorization();

    const handleBackButton = () => {
      window.history.forward();
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };

  }, [dispatch, navigate]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/checkauthentication`, {
          withCredentials: true,
        });

        const data = response.data.user;
        setName(data.name);
        setEmail(data.email);
        setUserRole(data.role);
        setUserId(data.userid);
        setLoading(false);

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching User Details!',
          confirmButtonText: 'OK'
        });
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${baseApiURL()}/getFilteredStaffDetails`, { fullName: name, email: email });
        const firstItem = response.data.staff[0];

        setAdminData({
          StaffID: firstItem.staffId,
          phoneNo: firstItem.phoneNo,
          address: firstItem.address,
          gender: firstItem.gender,
          profile: firstItem.profile,
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Details!',
          confirmButtonText: 'OK'
        });
      }
    };

    if (name && email) {
      fetchData();
    }

  }, [name, email])

  const openPwdModal = () => {
    setPwdModal(true);
  };

  const closePwdModal = () => {
    setPwdModal(false);
  };

  return (
    <Fragment>
      <span>&nbsp;&nbsp;</span>
      <Row>
        <Col sm='12'>
          <Card>
            <CardHeader className='d-flex justify-content-between align-items-center'>
              <H5 attrH5={{ className: 'card-title mb-0' }}>My Profile</H5>
              <Btn attrBtn={{ color: 'primary', className: "btn btn-air-primary", onClick: openPwdModal }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Key size={16} />&nbsp; Change Password
                </div>
              </Btn>
              <Modal isOpen={pwdmodal} toggle={closePwdModal} size="md" centered>
                <ModalBody>
                  {userId && <ChangePwd user={userId} onClose={closePwdModal} />}
                </ModalBody>
              </Modal>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <Spinner color="primary" />
                </div>
              ) : (
                <Form>
                  <Row className='mb-4'>
                    <Col sm='12' className='d-flex justify-content-center align-items-center flex-column'>
                      <img src={adminData.profile} alt='Profile' className='rounded-circle' style={{ width: '180px', height: '180px' }} />
                      <div className='mt-2'>
                        <Link to={`${process.env.PUBLIC_URL}/student/viewprofile`} className='text-dark'>
                          <H5 attrH5={{ className: 'mb-0 text-center' }}>{name}</H5>
                        </Link>
                        <center><P>{userRole}</P></center>
                      </div>
                    </Col>
                  </Row>
                  <span>&nbsp;&nbsp;</span>
                  <Row className='m-5 d-flex justify-content-center align-items-center'>
                    <Col xl='4'>
                      <FormGroup className='mb-3'>
                        <Label className='form-label'><b>User ID</b></Label>
                        <P>{userId}</P>
                      </FormGroup>

                      <FormGroup className='mb-3'>
                        <H6 attrH6={{ className: 'form-label' }}>Staff ID</H6>
                        <P>{adminData.StaffID}</P>
                      </FormGroup>
                    </Col>
                    <Col xl='4'>
                      <FormGroup className='mb-3'>
                        <Label className='form-label'><b>Email Address</b></Label>
                        <P>{email}</P>
                      </FormGroup>

                      <FormGroup className='mb-3'>
                        <Label className='form-label'><b>Phone Number</b></Label>
                        <P>{adminData.phoneNo}</P>
                      </FormGroup>
                    </Col>
                    <Col xl='4'>
                      <FormGroup className='mb-3'>
                        <Label className='form-label'><b>Gender</b></Label>
                        <P>{adminData.gender}</P>
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


