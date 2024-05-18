import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardFooter } from 'reactstrap';
import { H5, Btn } from '../../../AbstractElements';
import Swal from 'sweetalert2';
import { baseApiURL } from '../../../baseUrl';

const AddSubject = ({onClose}) => {
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [subjectData, setSubjectData] = useState({
        subcode: '',
        subname: '',
        deptname: '',
        semester: '',
        faculty: '',
        lectures: '',
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
                text: 'Error Fetching Faculty Details!',
                confirmButtonText: 'OK'
            });
        }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchDepartments = async () => {
        try {
            const response = await axios.get(`${baseApiURL()}/getDepartment`);
            const departmentsArray = Array.isArray(response.data) ? response.data : [response.data];
            setDepartments(departmentsArray);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Fetching Department Details!',
                confirmButtonText: 'OK'
            });
        }
        };

        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          setLoading(true);
          Swal.showLoading();
          const response = await axios.post(`${baseApiURL()}/addSubject`, subjectData);
          
          setSubjectData({
            subcode: '',
            subname: '',
            deptname: '',
            semester: '',
            faculty: '',
            lectures: '',
          });
    
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Subject added successfully.',
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
                text: 'Error Adding Subject!',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Fragment>
            <span>&nbsp;</span>
            {isFormOpen && (
            <Container fluid={true}>
                <Card>
                    <H5>Add Subject</H5>
                    <Form className="form theme-form" onSubmit={handleSubmit}>
                        <CardBody>
                            <Row>
                                <Col sm="12" xl="4">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlInput1">Enter Subject Code</Label>
                                        <Input className="form-control" type="text" name='subcode' placeholder="XXXX" value={subjectData.subcode} onChange={(e) => setSubjectData({...subjectData, subcode: e.target.value})} required autoFocus/>
                                    </FormGroup>
                                </Col>
                                <Col sm="12" xl="4">
                                    <FormGroup>
                                        <Label htmlFor="exampleInputPassword2">Enter Subject Name</Label>
                                        <Input className="form-control" type="text" placeholder="XXXXXXXXX" value={subjectData.subname} onChange={(e) => setSubjectData({...subjectData, subname: e.target.value})} required autoFocus/>
                                    </FormGroup>
                                </Col>
                                <Col sm="12" xl="4">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Choose Department</Label>
                                            <Input type="select" className="form-control digits" name="department" value={subjectData.deptname} onChange={(e) => setSubjectData({...subjectData, deptname: e.target.value})} defaultValue="1" required autoFocus>
                                                <option>{'Select'}</option>
                                                {departments.map((department) => (
                                                    <option key={department.id} value={department.deptname}>
                                                        {department.deptname}
                                                    </option>
                                                ))}
                                            </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12" xl="4">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Choose Semester</Label>
                                        <Input type="select" name="semester" className="form-control digits" defaultValue="1" value={subjectData.semester} onChange={(e) => setSubjectData({...subjectData, semester: e.target.value})} required autoFocus>
                                            <option>{'Select'}</option>
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
                                        <Label htmlFor="exampleFormControlSelect9">Assign Faculty</Label>
                                            <Input type="select" className="form-control digits" name="faculty" value={subjectData.faculty} onChange={(e) => setSubjectData({...subjectData, faculty: e.target.value})} defaultValue="1" required autoFocus>
                                                <option>{'Select'}</option>
                                                {faculties.map((faculty) => (
                                                    <option key={faculty.id} value={faculty.fullName}>
                                                        {faculty.fullName}
                                                    </option>
                                                ))}
                                            </Input>
                                    </FormGroup>
                                </Col>
                                <Col sm="12" xl="4">
                                    <FormGroup>
                                        <Label htmlFor="exampleInputPassword2">Enter Total No. of Lectures</Label>
                                        <Input className="form-control" type="number" placeholder="XX" value={subjectData.lectures} onChange={(e) => setSubjectData({...subjectData, lectures: e.target.value})} required autoFocus maxLength={3} size={3} max={150} min={5}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter className="text-end">
                            <Btn attrBtn={{ color: "primary", className: "btn btn-air-primary m-r-15", type: "submit" }} disabled={loading}>
                                {loading ? 'Please Wait...' : 'Submit'}
                            </Btn>
                        </CardFooter>
                    </Form>
                </Card>
            </Container>
            )}
        </Fragment>
    );
};

export default AddSubject;