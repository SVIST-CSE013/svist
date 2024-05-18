import React, { Fragment, useEffect, useState } from 'react';
import { CardBody, CardHeader, Form, Input, Row, Col, Card, Container, Table, Modal, ModalBody } from 'reactstrap';
import { Breadcrumbs, Btn } from '../../../AbstractElements';
import ChangePwd from '../../../Auth/ChangePwd';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated } from "../../../redux/authRedux";
import Swal from 'sweetalert2';
import { Key } from 'react-feather';
import { baseApiURL } from '../../../baseUrl';
import { Trash2 } from 'react-feather';

const ActivatedUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [department, setDepartment] = useState();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('Faculty');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [loadingTableData, setLoadingTableData] = useState(true);

  useEffect(() => {
    const checkDepartmentAdminAuthorization = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/departmentRoutes`, {
          withCredentials: true,
        });

        const data = response.data;

        if (data.authenticated) {
          dispatch(setAuthenticated(true));
          window.history.pushState(null, null, window.location.pathname);
        } else {
          navigate(`${process.env.PUBLIC_URL}/departmentlogin`, { replace: true });
        }

      } catch (error) {
        navigate(`${process.env.PUBLIC_URL}/departmentlogin`, { replace: true });
      }
    };

    checkDepartmentAdminAuthorization();

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
        setDepartment(data.department);

      } catch (error) {
        console.log();
      }
    };

    fetchUserDetails();
  }, [department]);

  useEffect(() => {
    const FetchData = async () => {
      try {
        const response = await axios.post(`${baseApiURL()}/getFilteredAuthenticatedUsers`, { role: selectedRoleFilter, department: department });
        setTimeout(() => {
          setUsers(response.data.user);
          setLoadingTableData(false);
        }, 1000);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching User Details!',
          confirmButtonText: 'OK'
        });
      }
    };

    FetchData();

  }, [selectedRoleFilter, department])

  const handleRoleFilterChange = (e) => {
    const selectedRole = e.target.value;
    setSelectedRoleFilter(selectedRole);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    // setCurrentPage(1); // Reset current page when search criteria change
  };

  const applySearchFilter = (item) => {
    const searchTerm = searchValue.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchTerm)
    );
  };

  const handleDelete = async (userId) => {
    try {
      const confirmed = await confirmDelete();
      if (confirmed) {
        const response = await axios.post(`${baseApiURL()}/deleteUser/${userId}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User has been successfully deleted.',
          confirmButtonText: 'OK'
        });
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Error Deleting User!',
        confirmButtonText: 'OK'
      });
    }
  };

  const confirmDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this User!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    return result.isConfirmed;
  };

  useEffect(() => {
    const loadImage = (item) => {
      const img = new Image();
      img.src = item.profile;
      img.onload = () => {
        setUsers((prevUsers) => {
          return prevUsers.map((user) => {
            if (user._id === item._id) {
              return { ...user, imageLoaded: true };
            }
            return user;
          });
        });
      };
    };

    users.forEach((item) => {
      if (!item.imageLoaded) {
        loadImage(item);
      }
    });
  }, [users]);

  const openChangePasswordModal = (user) => {
    setSelectedUser(user);
    setChangePasswordModal(true);
  };

  const closeChangePasswordModal = () => {
    setSelectedUser(null);
    setChangePasswordModal(false);
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle='Users Info' parent='Admin' title='Users Info' />
      <Container fluid={true} className='search-page'>
        <Row>
          <Col sm='12'>
            <Card>
              <CardHeader>
                <Form className='theme-form'>
                  <Row>
                    <Col sm="12" xl="6">
                      <div className='input-group flex-nowrap'>
                        <span className='btn btn-primary input-group-text'><i className="fa fa-search"></i></span>
                        <Input className='form-control-plaintext' type='search' placeholder='Search..' onChange={handleSearchChange} value={searchValue} />
                      </div>
                    </Col>
                    <Col sm="12" xl="6">
                      <Input type="select" name="select" className="form-control digits" defaultValue="1" onChange={handleRoleFilterChange}>
                        <option>{'Faculty'}</option>
                        <option>{'Student'}</option>
                      </Input>
                    </Col>
                  </Row>
                </Form>
              </CardHeader>
              <CardBody>
                <Col sm="12" lg="12" xl="12">
                  <div className="table-responsive">
                    <Table className='table-light'>
                      <thead>
                        <tr>
                          <th scope="col">Profile</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">User ID</th>
                          <th scope="col">Role</th>
                          <th scope="col">Password</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingTableData && (
                          <tr>
                            <th colSpan="11" className="text-center">
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            </th>
                          </tr>
                        )}
                        {users.filter(applySearchFilter).length === 0 && !loadingTableData && (
                          <tr>
                            <td colSpan="11" className="text-center"><b>No Data Available</b></td>
                          </tr>
                        )}
                        {
                          users.filter(applySearchFilter).slice().map((item) => {
                            return (
                              <tr key={item.id}>
                                <td>{item.imageLoaded ? <img src={item.profile} width={65} height={65} alt="Thumbnail" style={{ borderRadius: '10px' }} /> : 'Loading...'}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.userid}</td>
                                <td>{item.role}</td>
                                <td>
                                  <span>
                                    <Btn attrBtn={{ className: "btn btn-pill btn-air-warning btn-sm", color: "warning", onClick: () => openChangePasswordModal(item) }} >
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Key size={16} />
                                      </div>
                                    </Btn>
                                  </span>&nbsp;&nbsp;&nbsp;
                                  <Modal isOpen={changePasswordModal} toggle={closeChangePasswordModal} size="md" centered>
                                    <ModalBody>
                                      <ChangePwd user={selectedUser?.userid} onClose={closeChangePasswordModal} />
                                    </ModalBody>
                                  </Modal>
                                </td>
                                <td>
                                  <span>
                                    <Btn attrBtn={{ className: "btn btn-pill btn-air-secondary btn-secondary", onClick: () => handleDelete(item._id) }} >
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Trash2 size={16} />
                                      </div>
                                    </Btn>
                                  </span>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};
export default ActivatedUsers;


