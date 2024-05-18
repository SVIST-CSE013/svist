import React, { Fragment, useEffect, useState } from 'react';
import { CardBody, CardHeader, Form, Input, Row, Col, Card, Container, Table } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated } from "../../../redux/authRedux";
import { baseApiURL } from '../../../baseUrl';
import Swal from 'sweetalert2';

const UserCredentialGenerator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [togglePassword, setTogglePassword] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [selectedUserId, setSelectedUserId] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [selectedPasswords, setSelectedPasswords] = useState({});
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('Computer Science Engineering');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('Students');
  const [loadingTableData, setLoadingTableData] = useState(true);
  const [departmentDropdownDisabled, setDepartmentDropdownDisabled] = useState(false);

  useEffect(() => {
    const checkAdminAuthorization = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/adminRoutes`, {
          withCredentials: true,
        });

        const data = response.data;

        if (data.authenticated) {
          dispatch(setAuthenticated(true));
          window.history.pushState(null, null, window.location.pathname);
        } else {
          navigate(`${process.env.PUBLIC_URL}/adminlogin`, { replace: true });
        }

      } catch (error) {
        navigate(`${process.env.PUBLIC_URL}/adminlogin`, { replace: true });
      }
    };

    checkAdminAuthorization();

    const handleBackButton = () => {
      window.history.forward();
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };

  }, [dispatch, navigate]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getDepartment`);
        const departmentsArray = Array.isArray(response.data) ? response.data : [response.data];
        setDepartments(departmentsArray);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Departments!',
          confirmButtonText: 'OK'
        });
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let studentResponse, facultyResponse, staffResponse;
        if (selectedRoleFilter === 'Students') {
          studentResponse = await axios.post(`${baseApiURL()}/getFilteredStudentDetails`,{department: selectedDepartment});
        } else if (selectedRoleFilter === 'Faculties') {
          facultyResponse = await axios.post(`${baseApiURL()}/getFilteredFacultyDetails`,{department: selectedDepartment});
        } else {
          staffResponse = await axios.get(`${baseApiURL()}/getStaffDetails`);
          setDepartmentDropdownDisabled(true);
        }
  
        const students = studentResponse ? studentResponse.data.student : [];
        const faculties = facultyResponse ? facultyResponse.data.faculty : [];
        const staffs = staffResponse ? staffResponse.data : [];
  
        const combinedData = [...students, ...faculties, ...staffs];
  
        setTimeout(() => {
          setUsers(combinedData);
          setLoadingTableData(false);
        }, 1000);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: `Error fetching ${selectedRoleFilter} Details`,
          confirmButtonText: 'OK'
        });
      }
    };
  
    fetchData();
  }, [selectedRoleFilter, selectedDepartment]);
  

  const handleRoleChange = (e, userId) => {
    const role = e.target.value;
    setSelectedRoles((prevRoles) => ({ ...prevRoles, [userId]: role }));
  };

  const handlePasswordChange = (e, userId) => {
    const password = e.target.value;
    setSelectedPasswords((prevPasswords) => ({ ...prevPasswords, [userId]: password }));
  };

  const handleUserIdChange = (e, userId) => {
    const userid = e.target.value;
    setSelectedUserId((prevUserIds) => ({ ...prevUserIds, [userId]: userid }));
  };

  const updateUserRole = async (userId, role, profile, name, email, userid, password, department) => {
    if (!userid || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please Assign UserID and Password',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      await axios.post(`${baseApiURL()}/register`, {
        userId,
        role,
        profile,
        name,
        email,
        userid,
        password,
        department
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'User Added Successfully',
        confirmButtonText: 'OK'
      });

    } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Adding User!',
          confirmButtonText: 'OK'
        });
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const applySearchFilter = (item) => {
    const searchTerm = searchValue.toLowerCase();
    return item.fullName.toLowerCase().includes(searchTerm);
  };

  const handleRoleFilterChange = (e) => {
    const selectedRole = e.target.value;
    setSelectedRoleFilter(selectedRole);
    if (selectedRole === 'Staffs') {
      setDepartmentDropdownDisabled(true);
    } else {
      setDepartmentDropdownDisabled(false);
    }
  };

  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    setSelectedDepartment(selectedDepartment);
  };

  const renderRoleOptions = () => {
    if (selectedRoleFilter === 'Students') {
      return (
        <>
          <option value="Student">Student ({selectedDepartment})</option>
          <option value="LibraryMember">LibraryMember</option>
        </>
      );
    } else if (selectedRoleFilter === 'Faculties') {
      return (
        <>
          <option value="Department Admin">Department Admin ({selectedDepartment})</option>
          <option value="Faculty">Faculty ({selectedDepartment})</option>
        </>
      );
    } else {
      return (
        <>
          <option value="Admin">Admin</option>
          <option value="Librarian">Librarian</option>
        </>
      );
    }
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

  return (
    <Fragment>
      <Breadcrumbs mainTitle='Users Credentials Manager' parent='Admin' title='Users Credentials Manager' />
      <Container fluid={true} className='search-page'>
        <Row>
          <Col sm='12'>
            <Card>
              <CardHeader>
                <Form className='theme-form'>
                  <Row className='d-flex justify-content-center'>
                    <Col sm="12" xl={selectedRoleFilter === 'Staffs' ? "7" : "4"}>
                      <div className='input-group flex-nowrap'>
                        <span className='btn btn-primary input-group-text'><i className="fa fa-search"></i></span>
                        <Input className='form-control-plaintext' type='search' placeholder='Search..' onChange={handleSearchChange} value={searchValue} />
                      </div>
                    </Col>
                    <Col sm="12" xl={selectedRoleFilter === 'Staffs' ? "5" : "4"}>
                      <Input
                        type="select"
                        name="selectRoleFilter"
                        className="form-control"
                        onChange={handleRoleFilterChange}
                      >
                        <option value="Students">Students</option>
                        <option value="Faculties">Faculties</option>
                        <option value="Staffs">Staffs</option>
                      </Input>
                    </Col>
                    <Col sm="12" xl="4">
                      {selectedRoleFilter !== 'Staffs' && (
                        <Input
                          type="select"
                          name="selectRoleFilter"
                          className="form-control"
                          onChange={handleDepartmentChange}
                          disabled={departmentDropdownDisabled}
                        >
                          {departments.map((department) => (
                            <option key={department.id} value={department.deptname}>
                              {department.deptname}
                            </option>
                          ))}
                        </Input>
                      )}
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
                          <th scope="col">Password</th>
                          <th scope="col">Actions</th>
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
                            <td colSpan="6" className="text-center"><b>No Data Available</b></td>
                          </tr>
                        )}
                        {users.filter(applySearchFilter).map((item) => {
                          return (
                            <tr key={item.id}>
                              <td>{item.imageLoaded ? <img src={item.profile} width={65} height={65} style={{ borderRadius: '10px' }} alt="Thumbnail" /> : 'Loading...'}</td>
                              <td>{item.fullName}</td>
                              <td>{item.email}</td>
                              <td><Input className="form-control" type="text" value={selectedUserId[item._id] || ''} onChange={(e) => handleUserIdChange(e, item._id)} /></td>
                              <td>
                                <div className='position-relative'>
                                  <Input className="form-control" type={togglePassword ? "text" : "password"} name={`password_${item._id}`} value={selectedPasswords[item._id] || ''} onChange={(e) => handlePasswordChange(e, item._id)} />
                                  <div className="show-hide" onClick={() => setTogglePassword(!togglePassword)}>
                                    <span className={togglePassword ? "" : "show"}></span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <Input
                                  type="select"
                                  name={`selectRole_${item._id}`}
                                  className="form-control digits"
                                  defaultValue="1"
                                  value={selectedRoles[item._id] || ''}
                                  onChange={(e) => {
                                    handleRoleChange(e, item._id);
                                    const { profile, fullName, email } = item;
                                    updateUserRole(item._id, e.target.value, profile, fullName, email, selectedUserId[item._id] || '', selectedPasswords[item._id] || '', selectedDepartment);
                                  }}
                                >
                                  <option value="">Select Role</option>
                                    {renderRoleOptions()}
                                </Input>
                              </td>
                            </tr>
                          );
                        })}
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

export default UserCredentialGenerator;
