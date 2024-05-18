import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardFooter } from 'reactstrap';
import { H5, Btn, Image } from '../../../AbstractElements';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../Config/firebaseconfig';
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';
import { baseApiURL } from '../../../baseUrl';

const AddStudent = ({onClose}) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState({
        fullName: '',
        guardianName: '',
        email: '',
        enrollmentNo: '',
        phoneNo: '',
        address: '',
        department: '',
        semester: '',
        gender: '',
        profile: '',
    });

    const [uploadedFile, setUploadedFile] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(true);

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
                    text: 'Error Fetching Departments!',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchDepartments();
    }, []);


    useEffect(() => {
        if (studentData.profile) {

          const formData = new FormData();
          Object.entries(studentData).forEach(([key, value]) => {
            formData.append(key, value);
          });

          setLoading(true);
          Swal.showLoading();
    
          axios.post(`${baseApiURL()}/addStudentDetails`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {
    
              setStudentData({
                fullName: '',
                guardianName: '',
                email: '',
                enrollmentNo: '',
                phoneNo: '',
                address: '',
                department: '',
                semester: '',
                gender: '',
                profile: null,
              });
    
              setUploadedFile([]);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Student added successfully.',
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
                    text: 'Student not added.',
                    confirmButtonText: 'OK'
                });
            })
            .finally(() => {
                setLoading(false);
            });
        }
      }, [studentData.profile]);


      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          if (uploadedFile.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Profile Picture Not Uploaded !',
                confirmButtonText: 'OK'
            });
            return;
          }
    
          const file = uploadedFile[0];
          const fileName = `${Date.now()}_${file.name}`;
          const storageRef = ref(storage, `studentPictures/${fileName}`);
          await uploadBytes(storageRef, file);
    
          const fileDownloadURL = await getDownloadURL(storageRef);
    
          setStudentData((prevData) => ({
            ...prevData,
            profile: fileDownloadURL,
          }));
    
          setUploadedFile([]);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Student not added.',
                confirmButtonText: 'OK'
            });
        }
      };

    const onFilesChange = (files) => {
        setUploadedFile(files);
    };

    const onFilesError = () => {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Uploading File!',
            confirmButtonText: 'OK'
        });
    };

    const deleteFile = () => {
        setUploadedFile([]);
    };
    return (
        <Fragment>
            <span>&nbsp;</span>
            {isFormOpen && (
                <Container fluid={true}>
                    <Card>
                        <H5>Add Student</H5>
                        <Form className="form theme-form" onSubmit={handleSubmit}>
                            <CardBody>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlInput1">Enter Full Name</Label>
                                            <Input className="form-control" type="text" placeholder="Lorem Ipsum" name="fullName" value={studentData.fullName} onChange={(e) => setStudentData({...studentData, fullName: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlInput1">Enter Guardian Name</Label>
                                            <Input className="form-control" type="text" placeholder="Lorem Ipsum" name="fullName" value={studentData.guardianName} onChange={(e) => setStudentData({...studentData, guardianName: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Email Address</Label>
                                            <Input className="form-control" type="email" placeholder="name@example.com" name="email" value={studentData.email} onChange={(e) => setStudentData({...studentData, email: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Enrollment Number</Label>
                                            <Input className="form-control" type="text" placeholder="241XXXXXXXXX" name="enrollmentNumber" value={studentData.enrollmentNo} onChange={(e) => setStudentData({...studentData, enrollmentNo: e.target.value})} maxLength={11} size={11} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Phone Number</Label>
                                            <Input className="form-control" type="text" placeholder="98XXXXXXXXX" name="phoneNumber" value={studentData.phoneNo} onChange={(e) => setStudentData({...studentData, phoneNo: e.target.value})} maxLength={10} size={10} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Address with Pincode</Label>
                                            <Input className="form-control" type="text" placeholder="Kolkata, 700001" name="bloodGroup" value={studentData.address} onChange={(e) => setStudentData({...studentData, address: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Choose Department</Label>
                                            <Input type="select" className="form-control digits" name="department" value={studentData.department} onChange={(e) => setStudentData({...studentData, department: e.target.value})} defaultValue="1" required autoFocus>
                                                <option>{'Select'}</option>
                                                {departments.map((department) => (
                                                    <option key={department.id} value={department.deptname}>
                                                    {department.deptname}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Choose Semester</Label>
                                            <Input type="select" name="semester" className="form-control digits" defaultValue="1" value={studentData.semester} onChange={(e) => setStudentData({...studentData, semester: e.target.value})} required autoFocus>
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
                                            <Label htmlFor="exampleFormControlSelect9">Choose Gender</Label>
                                            <Input type="select" name="gender" className="form-control digits" defaultValue="1" value={studentData.gender} onChange={(e) => setStudentData({...studentData, gender: e.target.value})} required autoFocus>
                                                <option>{'Select'}</option>
                                                <option>{'Male'}</option>
                                                <option>{'Female'}</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <br />
                                <Col className='d-flex justify-content-center align-items-center'>
                                    <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '60%', height: '70%', borderRadius: '10px' }}>
                                        <CardBody className="fileUploader">
                                            <Files
                                                className='files-dropzone fileContainer'
                                                onChange={onFilesChange}
                                                onError={onFilesError}
                                                accepts={['image/*']}
                                                multiple={false}
                                                maxFileSize={10000000}
                                                minFileSize={0}
                                                clickable
                                            >
                                                {uploadedFile.length > 0 ? (
                                                    <div className='files-gallery'>
                                                        {uploadedFile.map((file, index) => (
                                                            <div key={index}>
                                                                <Image attrImage={{ className: 'files-gallery-item', alt: 'img', src: `${file.preview.url}` }} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="d-flex flex-column align-items-center">
                                                        <Btn attrBtn={{ className: 'mt-2 btn btn-air-primary', type: 'button', color: 'primary' }}>Upload Image</Btn>
                                                        <small className="text-muted mt-2">Accepted file types: Images</small>
                                                    </div>
                                                )}
                                            </Files>
                                            {uploadedFile.length > 0 && (
                                                <div className="d-flex justify-content-center mt-3">
                                                    <Btn attrBtn={{ className: 'btn btn-air-danger mr-2', color: 'danger', type: 'button', onClick: deleteFile }}>Delete</Btn>
                                                </div>
                                            )}
                                        </CardBody>
                                    </FormGroup>
                                </Col>
                            </CardBody>
                            <CardFooter className={`${isMobile ? 'text-center ms-3' : 'text-end'}`}>
                                <Btn attrBtn={{ color: 'primary', className: 'btn btn-air-primary me-3' }} type="submit" disabled={loading}>
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

export default AddStudent;