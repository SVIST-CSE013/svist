import React, { Fragment , useState, useEffect} from 'react';
import axios from 'axios';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardFooter } from 'reactstrap';
import { H5, Btn, Image } from '../../../AbstractElements';
import { baseApiURL } from '../../../baseUrl';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../Config/firebaseconfig';
import Swal from 'sweetalert2';

const EditFaculty = ({ faculty, onClose }) => {
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
    const [departments, setDepartments] = useState([]);
    const [isDataChanged, setIsDataChanged] = useState(false);
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
        const fetchFacultyDetails = async () => {
          try {
            const response = await axios.get(`${baseApiURL()}/getSingleFacultyDetails/${faculty._id}`);
            const facultyDetails = response.data;

            setFacultyData(facultyDetails);
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
        if (isDataChanged && facultyData.profile) {

          const formData = new FormData();
          Object.entries(facultyData).forEach(([key, value]) => {
            formData.append(key, value);
          });

          setLoading(true);
          Swal.showLoading();
    
          axios.put(`${baseApiURL()}/editFacultyDetails/${faculty._id}`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {

              setIsDataChanged(false);

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
                profile: null
              });
    
              setUploadedFile([]);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Faculty Updated Successfully.',
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
                    text: 'Error Updating Faculty Details!',
                    confirmButtonText: 'OK'
                });
            })
            .finally(() => {
                setLoading(false);
            });
        }
      }, [isDataChanged, facultyData, faculty, facultyData.profile]);

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

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            if (uploadedFile.length > 0) {

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
            }
      
            setIsDataChanged(true);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Updating Faculty Details!',
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
                        <H5>Edit Faculty</H5>
                        <Form className="form theme-form" onSubmit={handleEditSubmit}>
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
                                            <Input className="form-control" type="text" placeholder="XXXXXXXXX" name="faculty Id" value={facultyData.facultyId} onChange={(e) => setFacultyData({...facultyData, facultyId: e.target.value})} required autoFocus maxLength={8} size={8}/>
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
                                            <Input className="form-control" type="text" placeholder="e.g., 2 years" name="academicexp" value={facultyData.academicexp} onChange={(e) => setFacultyData({...facultyData, academicexp: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Choose Department</Label>
                                            <Input type="select" className="form-control digits" name="department" value={facultyData.department} onChange={(e) => setFacultyData({...facultyData, department: e.target.value})} defaultValue="1" required autoFocus>
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
                                <Row>
                                    <Col className='d-flex justify-content-center align-items-center'>
                                        <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '100%', height: '100%', borderRadius: '10px' }}>
                                            <img src={facultyData.profile} width={150} height={150} style={{borderRadius: '10px'}} alt="Existing Faculty Image Will Load Here" />
                                        </FormGroup>
                                    </Col>
                                    <Col className='d-flex justify-content-center align-items-center'>
                                        <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '100%', height: '100%', borderRadius: '10px' }}>
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
                                                            <Btn attrBtn={{ className: 'btn btn-air-primary mt-2', type: 'button', color: 'primary' }}>Upload New Image</Btn>
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

export default EditFaculty;