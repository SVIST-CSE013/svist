import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { H5 } from '../../../AbstractElements';
import DataTable from 'react-data-table-component';
import { baseApiURL } from '../../../baseUrl';
import axios from 'axios';
import Swal from 'sweetalert2';

const MyCourse = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/checkauthentication`, {
          withCredentials: true,
        });

        const data = response.data.user;
        setName(data.name);

      } catch (error) {
          console.log();
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${baseApiURL()}/getFilteredSubjectDetails`, { faculty: name });
        const filteredSubjects = response.data.subject.filter(subject => subject.faculty === name);
        setSubjects(filteredSubjects);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Fetching Subject Details!',
            confirmButtonText: 'OK'
          });
      }
    };

    if (name) {
      fetchData();
    }
  }, [name]);

  const columns = [
    {
      name: 'Subject Code',
      selector: 'subcode',
      sortable: true,
    },
    {
      name: 'Subject Name',
      selector: 'subname',
      sortable: true,
    },
    {
      name: 'Department',
      selector: 'deptname',
      sortable: true,
    },
    {
      name: 'Semester',
      selector: 'semester',
      sortable: true,
    },
  ];

  return (
    <Card className='course-card'>
      <CardHeader className='card-no-border'>
        <div className='header-top'>
          <H5 className='m-0'>Assigned Subjects</H5>
        </div>
      </CardHeader>
      <CardBody className='pt-0'>
        <div className='course-main-card'>
          <DataTable
            columns={columns}
            data={subjects}
            striped
            highlightOnHover
            pagination
            persistTableHead
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default MyCourse;

