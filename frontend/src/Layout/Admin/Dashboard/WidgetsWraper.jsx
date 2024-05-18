import React, { useState ,useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import axios from 'axios';
import { Card, CardBody } from 'reactstrap';
import { H4 } from '../../../AbstractElements';
import { Users } from 'react-feather';
import { AcademicCapIcon } from '@heroicons/react/24/solid';
import { BuildingLibraryIcon } from '@heroicons/react/24/solid';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/solid';
import { EnvelopeOpenIcon } from '@heroicons/react/24/solid';
import { baseApiURL } from '../../../baseUrl';
import toast, { Toaster } from 'react-hot-toast';

const WidgetsWrapper = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/StudentCount`);
        setStudentCount(response.data.students);
      } catch (error) {
        console.error('Error Counting Students', error);
        toast.error('Error Counting Students');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/FacultyCount`);
        setFacultyCount(response.data.faculties);
      } catch (error) {
        console.error('Error Counting Faculties', error);
        toast.error('Error Counting Faculties');
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/DepartmentCount`);
        setDepartmentCount(response.data.departments);
      } catch (error) {
        console.error('Error Counting departments', error);
        toast.error('Error Counting departments');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/SubjectCount`);
        setSubjectCount(response.data.subjects);
      } catch (error) {
        console.error('Error Counting Subjects', error);
        toast.error('Error Counting Subjects');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/NoticeCount`);
        setNoticeCount(response.data.notices);
      } catch (error) {
        console.error('Error Counting notices', error);
        toast.error('Error Counting notices');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/EnquiryCount`);
        setEnquiryCount(response.data.enquiries);
      } catch (error) {
        console.error('Error Counting enquiries', error);
        toast.error('Error Counting enquiries');
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Col xxl='auto' xl='3' sm='6' className='box-col-6'>
        <Row>
          <Col xl='12'>
            <Card className='widget-1'>
              <CardBody>
                <div className='widget-content'>
                  <div className={`widget-round`}>
                    <div className='bg-round'>
                      <AcademicCapIcon/>
                    </div>
                  </div>
                  <div>
                    <H4>{studentCount}</H4>
                    <span className='f-light'>Total Students</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl='12'>
            <Card className='widget-1'>
              <CardBody>
                <div className='widget-content'>
                  <div className={`widget-round`}>
                    <div className='bg-round'>
                      <Users/>
                    </div>
                  </div>
                  <div>
                    <H4>{facultyCount}</H4>
                    <span className='f-light'>Total Faculties</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xxl='auto' xl='3' sm='6' className='box-col-6'>
        <Row>
          <Col xl='12'>
            <Card className='widget-1'>
              <CardBody>
                <div className='widget-content'>
                  <div className={`widget-round`}>
                    <div className='bg-round'>
                      <BuildingLibraryIcon/>
                    </div>
                  </div>
                  <div>
                    <H4>{departmentCount}</H4>
                    <span className='f-light'>Total Departments</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl='12'>
            <Card className='widget-1'>
              <CardBody>
                <div className='widget-content'>
                  <div className={`widget-round`}>
                    <div className='bg-round'>
                      <DocumentTextIcon/>
                    </div>
                  </div>
                  <div>
                    <H4>{subjectCount}</H4>
                    <span className='f-light'>Total Subjects</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xxl='auto' xl='3' sm='6' className='box-col-6'>
        <Row>
          <Col xl='12'>
            <Card className='widget-1'>
              <CardBody>
                <div className='widget-content'>
                  <div className={`widget-round`}>
                    <div className='bg-round'>
                      <ClipboardDocumentListIcon/>
                    </div>
                  </div>
                  <div>
                    <H4>{noticeCount}</H4>
                    <span className='f-light'>Total Notices</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl='12'>
            <Card className='widget-1'>
              <CardBody>
                <div className='widget-content'>
                  <div className={`widget-round`}>
                    <div className='bg-round'>
                      <EnvelopeOpenIcon/>
                    </div>
                  </div>
                  <div>
                    <H4>{enquiryCount}</H4>
                    <span className='f-light'>Total Enquiries</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
      <Toaster position="bottom-center" />
    </>
  );
};

export default WidgetsWrapper;
