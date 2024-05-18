import React, { Fragment, useEffect, useState } from 'react';
import { CardBody, Row, Col, Card, Container } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated } from "../../../redux/authRedux";
import ReactApexChart from 'react-apexcharts';
import { baseApiURL } from '../../../baseUrl';

const CheckAttendance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [department, setDepartment] = useState();
  const [subjects, setSubjects] = useState([]);
  const [semester, setSemester] = useState();
  const [enrollmentNo, setEnrollmentNo] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [chartData, setChartData] = useState([]);

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
  }, [name, email]);

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

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Subject Details!',
          confirmButtonText: 'OK'
        });
      }
    };

    if (department, subjects) {
      FetchData();
    }

  }, [department, subjects])

  useEffect(() => {
    const FetchData = async () => {
      try {
        const response = await axios.post(`${baseApiURL()}/getFilteredStudentAttendanceDetails`, { enrollmentNo: enrollmentNo, fullName: name, department: department, semester: semester });
        setStudentAttendance(response.data.studentattendance);

        const subjectAttendanceMap = {};
        const presentAttendanceMap = {};

        response.data.studentattendance.forEach((item) => {
          const subject = item.subject;
          if (!subjectAttendanceMap[subject]) {
            subjectAttendanceMap[subject] = 1;
          } else {
            subjectAttendanceMap[subject]++;
          }

          if (item.attendance === 'Present') {
            if (!presentAttendanceMap[subject]) {
              presentAttendanceMap[subject] = 1;
            } else {
              presentAttendanceMap[subject]++;
            }
          }
        });

        const chartData = Object.keys(subjectAttendanceMap).map((subject) => ({
          x: subject,
          total: subjectAttendanceMap[subject],
          present: presentAttendanceMap[subject] || 0,
        }));


        setChartData(chartData);

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Student Attendance Details!',
          confirmButtonText: 'OK'
        });
      }
    };

    if (name && enrollmentNo && department && semester && subjects) {
      FetchData();
    }

  }, [name, enrollmentNo, department, semester])


  return (
    <Fragment>
      <Breadcrumbs mainTitle='Students Info' parent='Students' title='Students Info' />
      <Container fluid={true} className='search-page'>
        <Row>
          <Col sm='12'>
            <Card>
              <CardBody>
                <Col sm="12" lg="12" xl="12">
                  <div>
                    <ReactApexChart
                      options={{
                        xaxis: {
                          categories: chartData.map(dataPoint => dataPoint.x),
                        },
                        chart: {
                          id: 'attendance-chart',
                        },
                        plotOptions: {
                          bar: {
                            horizontal: false,
                            columnWidth: '40%',
                            endingShape: 'rounded',
                          },
                        },
                      }}
                      series={[
                        { name: 'Total Lectures', data: chartData.map(dataPoint => dataPoint.total) },
                        { name: 'Present Lectures', data: chartData.map(dataPoint => dataPoint.present) },
                      ]}
                      type="bar"
                      height={350}
                    />
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