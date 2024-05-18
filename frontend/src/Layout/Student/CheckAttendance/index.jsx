import React, { Fragment, useEffect, useState } from 'react';
import { CardBody, CardHeader, Form, Input, Row, Col, Card, Container, Table, FormGroup, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Breadcrumbs, H4 } from '../../../AbstractElements';
import { baseApiURL } from '../../../baseUrl';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated } from "../../../redux/authRedux";

const CheckAttendance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [department, setDepartment] = useState();
  const [subjects, setSubjects] = useState([]);
  const [semester, setSemester] = useState();
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [rawSelectedDate, setRawSelectedDate] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [loadingTableData, setLoadingTableData] = useState(true);
  const [totalLectures, setTotalLectures] = useState(0);

  useEffect(() => {
    const checkStudentAuthorization = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/studentRoutes`, {
          withCredentials: true,
        });

        const data = response.data;

        if (data.authenticated) {
          dispatch(setAuthenticated(true));
          window.history.pushState(null, null, window.location.pathname);
        } else {
          navigate(`${process.env.PUBLIC_URL}/studentlogin`, { replace: true });
        }

      } catch (error) {
        navigate(`${process.env.PUBLIC_URL}/studentlogin`, { replace: true });
      }
    };

    checkStudentAuthorization();

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
  }, [name, email, department]);

  useEffect(() => {
    const FetchData = async () => {
      try {
        const response = await axios.post(`${baseApiURL()}/getFilteredStudentDetails`, { fullName: name, email: email });
        const firstItem = response.data.student[0];

        setEnrollmentNo(firstItem.enrollmentNo);
        setSemester(firstItem.semester);

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Student Details!',
          confirmButtonText: 'OK'
        });
      }
    };

    if (name && email) {
      FetchData();
    }

  }, [name, email])

  useEffect(() => {
    const FetchData = async () => {
      try {
        const response = await axios.post(`${baseApiURL()}/getFilteredSubjectDetails`, { deptname: department, semester: semester });
        setSubjects(response.data.subject);

        const selectedSubjectDetails = response.data.subject.find(subject => subject.subname === selectedSubject);
        setTotalLectures(selectedSubjectDetails?.lectures || 0);

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Subject Details!',
          confirmButtonText: 'OK'
        });
      }
    };

    if (department && semester) {
      FetchData();
    }

  }, [department, semester, selectedSubject])

  useEffect(() => {
    const FetchData = async () => {
      try {
        const response = await axios.post(`${baseApiURL()}/getFilteredStudentAttendanceDetails`, { enrollmentNo: enrollmentNo, fullName: name, department: department, semester: selectedSemester || semester, subject: selectedSubject || undefined, date: selectedDate || undefined });
        const sortedAttendances = response.data.studentattendance.sort((a, b) => {
          const dateA = a.date.split('/').reverse().join('/');
          const dateB = b.date.split('/').reverse().join('/');
          return new Date(dateB) - new Date(dateA);
        });
        setTimeout(() => {
          setStudentAttendance(sortedAttendances);
          setLoadingTableData(false);
        }, 1000);

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Student Attendance Details!',
          confirmButtonText: 'OK'
        });
      }
    };

    if (name && enrollmentNo && department && (semester || selectedSemester) && (subjects || selectedSubject)) {
      FetchData();
    }

  }, [name, enrollmentNo, department, semester, selectedSemester, selectedSubject, selectedDate, subjects])

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const formattedDate = selectedDate.toLocaleDateString('en-GB');
    setSelectedDate(formattedDate);
    setRawSelectedDate(e.target.value);
  };

  const calculateAttendancePercentage = () => {
    const totalClasses = totalLectures;
    const presentClasses = studentAttendance.filter((item) => item.attendance === 'Present').length;
    const percentage = (presentClasses / totalClasses) * 100;
    return percentage.toFixed(2);
  };


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
                    <Col sm="12" xl="4">
                      <FormGroup>
                        <Input type="select" name="select" className="form-control digits" defaultValue="1" value={selectedSemester} onChange={handleSemesterChange}>
                          <option value="">{'All Semesters'}</option>
                          <option>{'First Semester'}</option>
                          <option>{'Second Semester'}</option>
                          <option>{'Third Semester'}</option>
                          <option>{'Fourth Semester'}</option>
                          <option>{'Fifth Semester'}</option>
                          <option>{'Sixth Semester'}</option>
                          <option>{'Seventh Semester'}</option>
                          <option>{'Eighth Semester'}</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col sm="12" xl="4">
                      <FormGroup>
                        <Input type="select" className="form-control digits" name="subject" defaultValue="1" value={selectedSubject} onChange={handleSubjectChange}>
                          <option value="">{'All Subjects'}</option>
                          {subjects.map((subject) => (
                            <option key={subject.id} value={subject.subname}>
                              {subject.subname}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col sm="12" xl="4">
                      <FormGroup>
                        <Input type='date' className="form-control digits" value={rawSelectedDate} onChange={handleDateChange} />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardHeader>
              <CardBody>
                <Col sm="12" lg="12" xl="12">
                  <H4>Attendance For {name}&nbsp;({enrollmentNo}), {department}</H4>
                  {selectedSemester && selectedSubject && (
                    <p>Attendance Percentage: {calculateAttendancePercentage()}%</p>
                  )}
                  <br />
                  <div className="table-responsive">
                    <Table className='table-light'>
                      <thead>
                        <tr>
                          <th>Semester</th>
                          <th>Subject</th>
                          <th>Date</th>
                          <th>Attendance</th>
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
                        {studentAttendance.length === 0 && !loadingTableData && (
                          <tr>
                            <td colSpan="11" className="text-center"><b>No Data Available</b></td>
                          </tr>
                        )}
                        {
                          studentAttendance.slice(indexOfFirstItem, indexOfLastItem).map((item) => {
                            return (
                              <tr key={item.id}>
                                <td>{item.semester}</td>
                                <td>{item.subject}</td>
                                <td>{item.date}</td>
                                <td>
                                  {item.attendance === 'Present' ? (
                                    <span className="badge badge-light-success" style={{ fontSize: "12px" }}>{item.attendance}</span>
                                  ) : (
                                    <span className="badge badge-light-danger" style={{ fontSize: "12px" }}>{item.attendance}</span>
                                  )}
                                </td>
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
                        {[...Array(Math.ceil(studentAttendance.length / itemsPerPage))].map((_, i) => (
                          <PaginationItem key={i} active={i + 1 === currentPage}>
                            <PaginationLink onClick={() => handlePageChange(i + 1)}>
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem disabled={currentPage === Math.ceil(studentAttendance.length / itemsPerPage)}>
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
export default CheckAttendance;
