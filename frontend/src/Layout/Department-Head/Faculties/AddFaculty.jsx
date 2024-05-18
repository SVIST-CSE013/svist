import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardFooter } from 'reactstrap';
import { H5, Btn, Image } from '../../../AbstractElements';
import { baseApiURL } from '../../../baseUrl';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../Config/firebaseconfig';
import Swal from 'sweetalert2';

const AddFaculty = ({onClose}) => {
    const [loading, setLoading] = useState(false);
    const [facultyData, setFacultyData] = useState({
        fullName: '',
        email: '',
        facultyId: '',
        designation: '',
        phoneNo: '',
        address: '',
        academicexp: '',
        department: '',
        gender: '',
        profile: '',
    });

    const [uploadedFile, setUploadedFile] = useState([]);
    const [department, setDepartment] = useState();
    const [isFormOpen, setIsFormOpen] = useState(true);

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
        if (facultyData.profile) {

          const formData = new FormData();
          Object.entries(facultyData).forEach(([key, value]) => {
            formData.append(key, value);
          });

          setLoading(true);
          Swal.showLoading();
    
          axios.post(`${baseApiURL()}/addFacultyDetails`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {

              setFacultyData({
                fullName: '',
                email: '',
                facultyId: '',
                designation: '',
                phoneNo: '',
                address: '',
                academicexp: '',
                department: '',
                gender: '',
                profile: null,
              });
    
              setUploadedFile([]);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Faculty added successfully.',
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
                    text: 'Faculty not added.',
                    confirmButtonText: 'OK'
                });
            })
            .finally(() => {
                setLoading(false);
            });
        }
      }, [facultyData.profile]);


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
          const storageRef = ref(storage, `facultyPictures/${fileName}`);
          await uploadBytes(storageRef, file);
    
          const fileDownloadURL = await getDownloadURL(storageRef);
    
          setFacultyData((prevData) => ({
            ...prevData,
            profile: fileDownloadURL,
          }));
    
          setUploadedFile([]);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Faculty not added.',
                confirmButtonText: 'OK'
            });
        }
      };

    const onFilesChange = (files) => {
        setUploadedFile(files);
    };

    const onFilesError = (error, file) => {
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
                        <H5>Add Faculty</H5>
                        <Form className="form theme-form" onSubmit={handleSubmit}>
                            <CardBody>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlInput1">Enter Full Name</Label>
                                            <Input className="form-control" type="text" placeholder="Lorem Ipsum" name="fullName" value={facultyData.fullName} onChange={(e) => setFacultyData({...facultyData, fullName: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Email Address</Label>
                                            <Input className="form-control" type="email" placeholder="name@example.com" name="email" value={facultyData.email} onChange={(e) => setFacultyData({...facultyData, email: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Faculty Id</Label>
                                            <Input className="form-control" type="text" placeholder="XXXXXXXXX" name="facultyId" value={facultyData.facultyId} onChange={(e) => setFacultyData({...facultyData, facultyId: e.target.value})} required autoFocus maxLength={8} size={8}/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Designation</Label>
                                            <Input className="form-control" type="text" placeholder="XXXXXXXXX" name="designation" value={facultyData.designation} onChange={(e) => setFacultyData({...facultyData, designation: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Phone Number</Label>
                                            <Input className="form-control" type="text" placeholder="98XXXXXXXXX" name="phoneNumber" value={facultyData.phoneNo} onChange={(e) => setFacultyData({...facultyData, phoneNo: e.target.value})} required autoFocus maxLength={10} size={10}/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Address with Pincode</Label>
                                            <Input className="form-control" type="text" placeholder="Kolkata, 700001" name="address" value={facultyData.address} onChange={(e) => setFacultyData({...facultyData, address: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Academic Experience</Label>
                                            <Input className="form-control" type="text" placeholder="e.g., 2 years" name="academic experience" value={facultyData.academicexp} onChange={(e) => setFacultyData({...facultyData, academicexp: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Choose Department</Label>
                                            <Input type="select" className="form-control digits" name="department" value={facultyData.department} onChange={(e) => setFacultyData({...facultyData, department: e.target.value})} defaultValue="1" required autoFocus>
                                                <option>{'Select'}</option>
                                                <option>{department}</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Choose Gender</Label>
                                            <Input type="select" name="gender" className="form-control digits" defaultValue="1" value={facultyData.gender} onChange={(e) => setFacultyData({...facultyData, gender: e.target.value})} required autoFocus>
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
                                                        <Btn attrBtn={{ className: 'btn btn-air-primary mt-2', type: 'button', color: 'primary' }}>Upload Image</Btn>
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
                            <CardFooter className="text-end">
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

export default AddFaculty;