import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardFooter } from 'reactstrap';
import { H5, Btn } from '../../../AbstractElements';
import { baseApiURL } from '../../../baseUrl';
import Swal from 'sweetalert2';

const AddDepartment = ({ onClose }) => {
  const [faculties, setFaculties] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [departmentData, setDepartmentData] = useState({
    id: '',
    deptname: '',
    hodname: '',
    studentsno: 0,
  });
  const [formErrors, setFormErrors] = useState({
    id: '',
    deptname: '',
    hodname: '',
    studentsno: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getFacultyDetails`);
        setFaculties(response.data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Faculty Details!!',
          confirmButtonText: 'OK'
        });
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    let valid = true;
    const errors = {
      id: '',
      deptname: '',
      hodname: '',
      studentsno: '',
    };

    if (departmentData.id.trim() === '') {
      errors.id = 'Department Id is required';
      valid = false;
    }

    if (departmentData.deptname.trim() === '') {
      errors.deptname = 'Department Name is required';
      valid = false;
    }

    if (departmentData.hodname.trim() === '') {
      errors.hodname = 'Please select a Head of Department (HOD)';
      valid = false;
    }

    if (departmentData.studentsno <= 0) {
      errors.studentsno = 'Number of Students must be greater than 0';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      Swal.showLoading();
      try {
        const response = await axios.post(`${baseApiURL()}/addDepartment`, departmentData);

        setDepartmentData({
          id: '',
          deptname: '',
          hodname: '',
          studentsno: 0,
        });

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Department added successfully.',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            setIsFormOpen(false);
            onClose();
          }
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Adding Department Details!!',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  return (
    <Fragment>
      <span>&nbsp;</span>
      {isFormOpen && (
        <Container fluid={true}>
          <Card>
            <H5>Add Department</H5>
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
                        onChange={(e) => setDepartmentData({ ...departmentData, id: e.target.value })}
                        placeholder="XXXX"
                      />
                      {formErrors.id && <span className="text-danger">{formErrors.id}</span>}
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
                        onChange={(e) => setDepartmentData({ ...departmentData, deptname: e.target.value })}
                        placeholder="XXXX"
                      />
                      {formErrors.deptname && <span className="text-danger">{formErrors.deptname}</span>}
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
                        onChange={(e) => setDepartmentData({ ...departmentData, hodname: e.target.value })}
                        placeholder="XXXXXXXXX" defaultValue="1"
                      >
                        <option>{'Select'}</option>
                        {faculties.map((faculty) => (
                          <option key={faculty.id} value={faculty.fullName}>
                            {faculty.fullName}
                          </option>
                        ))}
                      </Input>
                      {formErrors.hodname && <span className="text-danger">{formErrors.hodname}</span>}
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
                        onChange={(e) => setDepartmentData({ ...departmentData, studentsno: e.target.value })}
                        placeholder="e.g., 60"
                      />
                      {formErrors.studentsno && <span className="text-danger">{formErrors.studentsno}</span>}
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter className="text-end">
                <Btn attrBtn={{ color: 'primary', className: 'btn btn-air-primary m-r-15', type: 'submit' }}>Submit</Btn>
              </CardFooter>
            </Form>
          </Card>
        </Container>
      )}
    </Fragment>
  );
};

export default AddDepartment;

