import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardFooter } from 'reactstrap';
import { H5, Btn } from '../../../AbstractElements';
import { baseApiURL } from '../../../baseUrl';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

const EditDepartment = ({department, onClose}) => {
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [departmentData, setDepartmentData] = useState({
    id: '',
    deptname: '',
    hodname: '',
    studentsno: 0,
  });

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getFacultyDetails`);
        const facultyDetails = response.data;

        setFaculties(facultyDetails);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Fetching Faculty Details!',
            confirmButtonText: 'OK'
          });
      }
    };

    fetchFacultyDetails();
  }, []);

  useEffect(() => {
    const fetchDepartmentDetails = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getSingleDepartmentDetails/${department._id}`);
        const DepartmentDetails = response.data;

        setDepartmentData(DepartmentDetails);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Fetching Department Details!',
            confirmButtonText: 'OK'
          });
      }
    };

    fetchDepartmentDetails();
  }, []);

  useEffect(() => {
    if (isDataChanged) {

      const formData = new FormData();
      Object.entries(departmentData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      setLoading(true);
      Swal.showLoading();

      axios.put(`${baseApiURL()}/editDepartment/${department._id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          setIsDataChanged(false);

          setDepartmentData({
            id: '',
            deptname: '',
            hodname: '',
            studentsno: 0,
          });

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Department Details updated successfully.',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              setIsFormOpen(false);
              onClose();
            }
          }); 
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Updating Department Details!',
            confirmButtonText: 'OK'
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isDataChanged, departmentData, department]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsDataChanged(true);
    } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Updating Department Details!',
          confirmButtonText: 'OK'
        });
    }
  };

  return (
    <Fragment>
      <span>&nbsp;</span>
      {isFormOpen && (
        <Container fluid={true}>
          <Card>
            <H5>Edit Department</H5>
            <Form className="form theme-form" onSubmit={handleSubmit}>
              <CardBody>
                <Row>
                  <Col sm="12" xl="4">
                    <FormGroup>
                      <Label htmlFor="exampleFormControlInput1">Enter Department Id</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="id"
                        value={departmentData.id}
                        onChange={(e) => setDepartmentData({...departmentData, id: e.target.value})}
                        placeholder="XXXX"
                        required autoFocus maxLength={5} size={5} 
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="12" xl="4">
                    <FormGroup>
                      <Label htmlFor="exampleFormControlInput1">Enter Department Name</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="deptname"
                        value={departmentData.deptname}
                        onChange={(e) => setDepartmentData({...departmentData, deptname: e.target.value})}
                        placeholder="XXXX"
                        required autoFocus
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="12" xl="4">
                    <FormGroup>
                      <Label htmlFor="exampleInputPassword2">Choose Head of Department (HOD)</Label>
                      <Input
                        className="form-control"
                        type="select"
                        name="hodname"
                        value={departmentData.hodname}
                        onChange={(e) => setDepartmentData({...departmentData, hodname: e.target.value})}
                        placeholder="XXXXXXXXX" defaultValue="1" required autoFocus
                      >
                        <option>{'Select'}</option>
                            {faculties.map((faculty) => (
                                <option key={faculty.id} value={faculty.fullName}>
                                    {faculty.fullName}
                                </option>
                            ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm="12" xl="6">
                    <FormGroup>
                      <Label htmlFor="exampleInputPassword2">Enter No. of Students</Label>
                      <Input
                        className="form-control"
                        type="number"
                        name="studentsno"
                        value={departmentData.studentsno}
                        onChange={(e) => setDepartmentData({...departmentData, studentsno: e.target.value})}
                        placeholder="e.g., 60" required autoFocus maxLength={3} size={3}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter className="text-end">
                <Btn attrBtn={{ color: 'primary', className: ' btn btn-air-primary me-3' }} type="submit" disabled={loading}>
                  {loading ? 'Please Wait...' : 'Submit'}
                </Btn>
              </CardFooter>
            </Form>
          </Card>
        </Container>
      )}
      <Toaster position="bottom-center" />
    </Fragment>
  );
};

export default EditDepartment;

