import React, { useEffect, useState } from 'react';
import { CardBody, Col, Card, CardHeader } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactApexChart from 'react-apexcharts';
import { baseApiURL } from '../../../baseUrl';
import { H5 } from '../../../AbstractElements';

const AttendanceAnalytics = () => {
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [department, setDepartment] = useState();
  const [subjects, setSubjects] = useState([]);
  const [semester, setSemester] = useState();
  const [enrollmentNo, setEnrollmentNo] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [chartData, setChartData] = useState([]);

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
          console.log();
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
    <Card>
      <CardHeader>
        <H5>Attendance Analytics</H5>
      </CardHeader>
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
                    columnWidth: '35%',
                    endingShape: 'rounded',
                  },
                },
                tooltip: {
                  enabled: true,
                  shared: false, 
                  intersect: true,
                  followCursor: true,
                  custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    const subjectName = chartData[dataPointIndex].x;
                    if (seriesIndex === 0) {
                      return `<div class="apexcharts-tooltip-label" style="padding: 8px; font-weight: bold;">Total Lectures (${subjectName}): &nbsp;${series[seriesIndex][dataPointIndex]}</div>`;
                    } else {
                      const totalLectures = chartData[dataPointIndex].total;
                      const lecturesAttended = series[seriesIndex][dataPointIndex];
                      const percentage = totalLectures ? ((lecturesAttended / totalLectures) * 100).toFixed(2) : 0;
                      return `<div class="apexcharts-tooltip-label" style="padding: 8px; font-weight: bold;">Lectures Attended (${subjectName}): &nbsp;${lecturesAttended}</div><div class="apexcharts-tooltip-label" style="padding: 8px; font-weight: bold;">Attendance: &nbsp;${percentage}%</div>`;
                    }
                  },
                },
              }}
              series={[
                { name: 'Total Lectures', data: chartData.map(dataPoint => dataPoint.total) },
                { name: 'Lectures Attended', data: chartData.map(dataPoint => dataPoint.present) },
              ]}
              type="bar"
              height={350}
            />
          </div>
        </Col>
      </CardBody>
    </Card>
  );
};

export default AttendanceAnalytics;