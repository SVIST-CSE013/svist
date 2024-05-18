import React, {useState, useEffect} from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import axios from 'axios';
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
  const [department, setDepartment] = useState();

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
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/MaterialCount`, {
          params: { department: department}
        });
        setMaterialCount(response.data.materials);
      } catch (error) {
          console.log();
      }
    };

    fetchData();
  }, [department]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/NoticeCount`, {
          params: {
            type: ['Faculty Notice Panel', 'Student Notice Panel']
          }
        });
        setNoticeCount(response.data.notices);
      } catch (error) {
          console.log();
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/TimetableCount`, {
          params: { department: department }
        });
        setTimetableCount(response.data.timetables);
      } catch (error) {
          console.log();
      }
    };

    fetchData();
  }, [department]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/SubjectCount`, {
          params: { deptname: department }
        });
        setSubjectCount(response.data.subjects);
      } catch (error) {
          console.log();
      }
    };

    fetchData();
  }, [department]);


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
                  <span className='f-light'>Total Subjects</span>
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
