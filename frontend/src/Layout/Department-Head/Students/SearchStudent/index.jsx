import React, { Fragment , useEffect, useState } from 'react';
import { CardBody, CardHeader, Form, Input, Row, Col, Card, Container, Table, Pagination, PaginationLink, PaginationItem } from 'reactstrap';
import { Breadcrumbs } from '../../../../AbstractElements';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated } from "../../../../redux/authRedux";
import { baseApiURL } from '../../../../baseUrl';

const SearchStudent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [department, setDepartment] = useState();
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loadingTableData, setLoadingTableData] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [searchValue, setSearchValue] = useState('');

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
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Fetching User Details!',
            confirmButtonText: 'OK'
          });
      }
    };

    fetchUserDetails();
  }, [department]);

  useEffect(() => {
    const FetchData = async () => {
      try {
          const response = await axios.post(`${baseApiURL()}/getFilteredStudentDetails`, { department, semester: selectedSemester || undefined });
          setTimeout(() => {
            setStudents(response.data.student);
            setLoadingTableData(false);
          }, 1000);
        } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Error Fetching Student Details!',
              confirmButtonText: 'OK'
            });
      }
    };

    FetchData();

  }, [department , selectedSemester])

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  const applySearchFilter = (item) => {
      const searchTerm = searchValue.toLowerCase();
      return (
          item.fullName.toLowerCase().includes(searchTerm)
      );
  };

  useEffect(() => {
    const loadImage = (item) => {
      const img = new Image();
      img.src = item.profile;
      img.onload = () => {
        setStudents((prevStudents) => {
          return prevStudents.map((student) => {
            if (student._id === item._id) {
              return { ...student, imageLoaded: true };
            }
            return student;
          });
        });
      };
    };

    students.forEach((item) => {
      if (!item.imageLoaded) {
        loadImage(item);
      }
    });
  }, [students]);

  return (
    <Fragment>
      <Breadcrumbs mainTitle='Students Info' parent='Students' title='Students Info' />
      <Container fluid={true} className='search-page'>
        <Row>
          <Col sm='12'>
            <Card>
              <CardHeader>
                <Form className='theme-form'>
                  <Row>
                     <Col sm="12" xl="7">
                        <div className='input-group flex-nowrap'>
                          <span className='btn btn-primary input-group-text'><i className="fa fa-search"></i></span>
                          <Input className='form-control-plaintext' type='search' placeholder='Search..' onChange={handleSearchChange} value={searchValue}/>
                        </div>
                     </Col>
                     <Col sm="12" xl="5">
                        <Input type="select" name="select" className="form-control digits" defaultValue="1" value={selectedSemester} onChange={handleSemesterChange}>
                          <option value="">All Semesters</option>
                          <option>{'First Semester'}</option>
                          <option>{'Second Semester'}</option>
                          <option>{'Third Semester'}</option>
                          <option>{'Fourth Semester'}</option>
                          <option>{'Fifth Semester'}</option>
                          <option>{'Sixth Semester'}</option>
                          <option>{'Seventh Semester'}</option>
                          <option>{'Eighth Semester'}</option>
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
                                    <th scope="col">Enrollment No.</th>
                                    <th scope="col">Student Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Semester</th>
                                    <th scope="col">Guardian Name</th>
                                    <th scope="col">Phone No.</th>
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
                                {students.filter(applySearchFilter).length === 0 && !loadingTableData && (
                                  <tr>
                                    <td colSpan="11" className="text-center"><b>No Data Available</b></td>
                                  </tr>
                                )}
                                {
                                    students.filter(applySearchFilter).slice(indexOfFirstItem, indexOfLastItem).map((item) => {
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.imageLoaded ? <img src={item.profile} width={65} height={65} alt="Thumbnail" style={{borderRadius: '10px'}}/> : 'Loading...'}</td>
                                                <td>{item.enrollmentNo}</td>
                                                <td>{item.fullName}</td>
                                                <td>{item.email}</td>
                                                <td>{item.semester}</td>
                                                <td>{item.guardianName}</td>
                                                <td>{item.phoneNo}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-center">
                          <Pagination>
                            <PaginationItem disabled={currentPage === 1}>
                              <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                            </PaginationItem>
                            {[...Array(Math.ceil(students.filter(applySearchFilter).length / itemsPerPage))].map((_, i) => (
                              <PaginationItem key={i} active={i + 1 === currentPage}>
                                <PaginationLink onClick={() => handlePageChange(i + 1)}>
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem disabled={currentPage === Math.ceil(students.filter(applySearchFilter).length / itemsPerPage)}>
                              <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                            </PaginationItem>
                          </Pagination>
                        </div>
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
export default SearchStudent;
