import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardFooter } from 'reactstrap';
import { H5, Btn, Image } from '../../../AbstractElements';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../Config/firebaseconfig';
import { baseApiURL } from '../../../baseUrl';
import Swal from 'sweetalert2';

const AddStaff = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [staffData, setStaffData] = useState({
        fullName: '',
        email: '',
        staffId: '',
        phoneNo: '',
        address: '',
        gender: '',
        profile: '',
    });

    const [uploadedFile, setUploadedFile] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(true);


    useEffect(() => {
        if (staffData.profile) {

          const formData = new FormData();
          Object.entries(staffData).forEach(([key, value]) => {
            formData.append(key, value);
          });
    
          axios.post(`${baseApiURL()}/addStaffDetails`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {
    
              setStaffData({
                fullName: '',
                email: '',
                staffId: '',
                phoneNo: '',
                address: '',
                gender: '',
                profile: '',
              });
    
              setUploadedFile([]);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Staff added successfully.',
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
                    text: 'Staff not added.',
                    confirmButtonText: 'OK'
                });
            });
        }
      }, [staffData.profile]);


      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          setLoading(true);
          Swal.showLoading();
          
          if (uploadedFile.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Profile Not Uploaded',
                    confirmButtonText: 'OK'
                });
            return;
          }
    
          const file = uploadedFile[0];
          const fileName = `${Date.now()}_${file.name}`;
          const storageRef = ref(storage, `staffPictures/${fileName}`);
          await uploadBytes(storageRef, file);
    
          const fileDownloadURL = await getDownloadURL(storageRef);
    
          setStaffData((prevData) => ({
            ...prevData,
            profile: fileDownloadURL,
          }));
    
          setUploadedFile([]);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Staff not added.',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
      };

    const onFilesChange = (files) => {
        setUploadedFile(files);
    };

    const onFilesError = () => {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Uploading File',
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
                        <H5>Add Staff</H5>
                        <Form className="form theme-form" onSubmit={handleSubmit}>
                            <CardBody>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlInput1">Enter Full Name</Label>
                                            <Input className="form-control" type="text" placeholder="Lorem Ipsum" name="fullName" value={staffData.fullName} onChange={(e) => setStaffData({...staffData, fullName: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Email Address</Label>
                                            <Input className="form-control" type="email" placeholder="name@example.com" name="email" value={staffData.email} onChange={(e) => setStaffData({...staffData, email: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Staff Id</Label>
                                            <Input className="form-control" type="text" placeholder="XXXXXXXXX" name="staffId" value={staffData.staffId} onChange={(e) => setStaffData({...staffData, staffId: e.target.value})} required autoFocus maxLength={8} size={8}/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Phone Number</Label>
                                            <Input className="form-control" type="text" placeholder="98XXXXXXXXX" name="phoneNumber" value={staffData.phoneNo} onChange={(e) => setStaffData({...staffData, phoneNo: e.target.value})} required autoFocus maxLength={10} size={10}/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Address with Pincode</Label>
                                            <Input className="form-control" type="text" placeholder="Kolkata, 700001" name="address" value={staffData.address} onChange={(e) => setStaffData({...staffData, address: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Choose Gender</Label>
                                            <Input type="select" name="gender" className="form-control digits" defaultValue="1" value={staffData.gender} onChange={(e) => setStaffData({...staffData, gender: e.target.value})} required autoFocus>
                                                <option>{'Select'}</option>
                                                <option>{'Male'}</option>
                                                <option>{'Female'}</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <br />
                                <div className='d-flex justify-content-center'>
                                    <Row className='d-flex justify-content-center align-items-center border border-black' style={{ width: '60%', borderRadius: '10px' }}>
                                        <Col sm="12" xl="6">
                                            <FormGroup>
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
                                    </Row>
                                </div>
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

export default AddStaff;