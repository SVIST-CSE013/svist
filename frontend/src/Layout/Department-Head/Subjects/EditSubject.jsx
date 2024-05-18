import React, { Fragment, useState, useEffect  } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardFooter } from 'reactstrap';
import { H5, Btn } from '../../../AbstractElements';
import { baseApiURL } from '../../../baseUrl';
import Swal from 'sweetalert2';

const EditSubject = ({subject , onClose}) => {
    const [faculties, setFaculties] = useState([]);
    const [department, setDepartment] = useState();
    const [isFormOpen, setIsFormOpen] = useState(true);
    const [isDataChanged, setIsDataChanged] = useState(false);
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
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/checkauthentication`, {
                    withCredentials: true,
                });

                const data = response.data.user;
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
    }, [department]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.post(`${baseApiURL()}/getFilteredFacultyDetails`,{department: department});
            setFaculties(response.data.faculty);
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
    }, [department]);

    useEffect(() => {
        const fetchSubjectDetails = async () => {
          try {
            const response = await axios.get(`${baseApiURL()}/getSingleSubjectDetails/${subject._id}`);
            const SubjectDetails = response.data;
    
            setSubjectData(SubjectDetails);
          } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Subject Details!',
                    confirmButtonText: 'OK'
                });
          }
        };
    
        fetchSubjectDetails();
    }, []);

    useEffect(() => {
        if (isDataChanged) {
    
          const formData = new FormData();
          Object.entries(subjectData).forEach(([key, value]) => {
            formData.append(key, value);
          });

          setLoading(true);
          Swal.showLoading();
    
          axios.put(`${baseApiURL()}/editSubject/${subject._id}`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {

              setIsDataChanged(false);
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
                    text: 'Subject updated successfully.',
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
                    text: 'Error Updating Subject!',
                    confirmButtonText: 'OK'
                });
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }, [isDataChanged, subjectData, subject]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsDataChanged(true);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Updating Subject!',
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
                    <H5>Edit Subject</H5>
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
                                                <option>{department}</option>
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

export default EditSubject;