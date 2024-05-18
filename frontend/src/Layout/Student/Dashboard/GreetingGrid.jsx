import React, {useState, useEffect} from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { H4 } from '../../../AbstractElements';
import SquareGroupUi from './SquareGroupUi';
import { FileText , Mail } from 'react-feather';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { TableCellsIcon } from '@heroicons/react/24/solid';
import { baseApiURL } from '../../../baseUrl';

const GreetingGrid = () => {
  const [subjectCount, setSubjectCount] = useState(0);
  const [materialCount, setMaterialCount] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);
  const [timetableCount, setTimetableCount] = useState(0);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [department, setDepartment] = useState();
  const [semester, setSemester] = useState();

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
  }, [name , email, department]);

  useEffect(() => {
    const FetchData = async () => {
      try {
        const response = await axios.post(`${baseApiURL()}/getFilteredStudentDetails`, { fullName: name, email: email });
        const firstItem = response.data.student[0];

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
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/MaterialCount`, {
          params: { department: department, semester: semester }
        });
        setMaterialCount(response.data.materials);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Counting Materials!',
          confirmButtonText: 'OK'
        });
      }
    };

    fetchData();
  }, [department, semester]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/NoticeCount`, {
          params: { type: 'Student Notice Panel' }
        });
        setNoticeCount(response.data.notices);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Counting Notices!',
            confirmButtonText: 'OK'
          });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/TimetableCount`, {
          params: { department: department , semester: semester }
        });
        setTimetableCount(response.data.timetables);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Counting Timetables!',
            confirmButtonText: 'OK'
          });
      }
    };

    fetchData();
  }, [department , semester]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/SubjectCount`, {
          params: { deptname: department , semester: semester }
        });
        setSubjectCount(response.data.subjects);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Counting Subjects!',
            confirmButtonText: 'OK'
          });
      }
    };

    fetchData();
  }, [department , semester]);


  return (
    <Col xxl='5' xl='8' className='col-ed-6 box-col-7'>
      <Row>
        <Col sm='6'>
          <Card className='course-box'>
            <CardBody>
              <div className='course-widget'>
                <div className='course-icon'>
                  <FileText size={16}/>
                </div>
                <div>
                  <H4 attrH4={{ className: 'mb-0' }}>{subjectCount}</H4>
                  <span className='f-light'>Semester Subjects</span>
                </div>
              </div>
            </CardBody>
            <SquareGroupUi />
          </Card>
        </Col>
        <Col sm='6'>
          <Card className='course-box'>
            <CardBody>
              <div className='course-widget'>
                <div className='course-icon warning'>
                  <DocumentTextIcon size={16}/>
                </div>
                <div>
                  <H4 attrH4={{ className: 'mb-0' }}>{materialCount}</H4>
                  <span className='f-light'>Materials Uploaded</span>
                </div>
              </div>
            </CardBody>
            <SquareGroupUi />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm='6'>
          <Card className='course-box'>
            <CardBody>
              <div className='course-widget'>
                <div className='course-icon primary'>
                  <TableCellsIcon size={16}/>
                </div>
                <div>
                  <H4 attrH4={{ className: 'mb-0' }}>{timetableCount}</H4>
                  <span className='f-light'>Timetable Uploaded</span>
                </div>
              </div>
            </CardBody>
            <SquareGroupUi />
          </Card>
        </Col>
        <Col sm='6'>
          <Card className='course-box'>
            <CardBody>
              <div className='course-widget'>
                <div className='course-icon warning'>
                  <Mail size={16}/>
                </div>
                <div>
                  <H4 attrH4={{ className: 'mb-0' }}>{noticeCount}</H4>
                  <span className='f-light'>Notices Uploaded</span>
                </div>
              </div>
            </CardBody>
            <SquareGroupUi />
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default GreetingGrid;
