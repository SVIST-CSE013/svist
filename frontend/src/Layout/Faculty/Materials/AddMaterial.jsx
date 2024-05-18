import React, { Fragment , useState , useEffect } from 'react';
import { H5, Btn , Image} from '../../../AbstractElements';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, Form , FormGroup, Label, Input} from 'reactstrap';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../Config/firebaseconfig';
import Swal from 'sweetalert2';
import { baseApiURL } from '../../../baseUrl';

const AddMaterial = ({onClose}) => {
    const [name , setName] = useState();
    const [uploadedFile, setUploadedFile] = useState([]);
    const [department, setDepartment] = useState();
    const [subjects, setSubjects] = useState([]);
    const [materialData, setMaterialData] = useState({
        title: '',
        department: '',
        semester: '',
        subject: '',
        description: '',
        file: '',
        faculty: '',
        date: new Date().toLocaleDateString('en-GB'),
    });

    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/checkauthentication`, {
                    withCredentials: true,
                });

                const data = response.data.user;
                setName(data.name);
                setDepartment(data.department);
                setMaterialData(prevData => ({ ...prevData, faculty: data.name }));

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
    }, [name , department]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (materialData.department && materialData.semester) {
                    const response = await axios.post(`${baseApiURL()}/getFilteredSubjectDetails`, { deptname: materialData.department, semester: materialData.semester, faculty: name });
                    setSubjects(response.data.subject);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Subject Details!',
                    confirmButtonText: 'OK'
                });
            }
        };
    
        fetchData();
    }, [materialData.department, materialData.semester, name]);
    

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

    useEffect(() => {
        if (materialData.file) {

          const formData = new FormData();
          Object.entries(materialData).forEach(([key, value]) => {
            formData.append(key, value);
          });

          axios.post(`${baseApiURL()}/addmaterial`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {

              setMaterialData({
                title: '',
                department: '',
                semester: '',
                subject: '',
                description: '',
                file: '',
              });
    
              setUploadedFile([]);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Material published successfully.',
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
                    text: 'Error Publishing Material!',
                    confirmButtonText: 'OK'
                });
            });
        }
    }, [materialData.file]);


    const handleAddMaterial = async (e) => {
        e.preventDefault();
    
        try {
          setLoading(true);
          Swal.showLoading();

          if (uploadedFile.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'No File Uploaded!',
                confirmButtonText: 'OK'
            });
            return;
          }
    
          const file = uploadedFile[0];
          const fileName = `${Date.now()}_${file.name}`;
          const storageRef = ref(storage, `material/${fileName}`);
          await uploadBytes(storageRef, file);
    
          const fileDownloadURL = await getDownloadURL(storageRef);
    
          setMaterialData((prevData) => ({
            ...prevData,
            file: fileDownloadURL
          }));
    
          setUploadedFile([]);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Publishing Material!',
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
            <Row>
                <Col sm='12'>
                    <Card>
                    <H5>Add Material</H5>
                    <CardBody>
                        <Form className='theme-form' onSubmit={handleAddMaterial}>
                            <Row>
                                <Col sm="12" xl="6">
                                    <FormGroup>
                                        <Label>Material Title</Label>
                                        <Input className="form-control" type="text" placeholder="Material Name" name="Material Name" value={materialData.title} onChange={(e) => setMaterialData({...materialData, title: e.target.value})} required autoFocus/>
                                    </FormGroup>
                                </Col>
                                <Col sm="12" xl="6">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Choose Department</Label>
                                        <Input type="select" className="form-control digits" name="department" defaultValue="1" value={materialData.department} onChange={(e) => setMaterialData({ ...materialData, department: e.target.value })} required autoFocus>
                                            <option>{'Select'}</option>
                                            <option>{department}</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12" xl="6">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Choose Semester</Label>
                                        <Input type="select" name="select" className="form-control digits" defaultValue="1" value={materialData.semester} onChange={(e) => setMaterialData({ ...materialData, semester: e.target.value })} required autoFocus>
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
                                <Col sm="12" xl="6">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Choose Subject</Label>
                                            <Input type="select" className="form-control digits" name="subject" defaultValue="1" value={materialData.subject} onChange={(e) => setMaterialData({ ...materialData, subject: e.target.value })} disabled={!materialData.department || !materialData.semester} required autoFocus>
                                            <option>{'Select'}</option>
                                                {subjects.map((subject) => (
                                                    <option key={subject.id} value={subject.subname}>
                                                        {subject.subname}
                                                    </option>
                                                ))}
                                            </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label>Material Description</Label>
                                        <textarea className='form-control' name='description' rows='5' placeholder='Material Description' style={{resize:'none'}} value={materialData.description} onChange={(e) => setMaterialData({...materialData, description: e.target.value})} required autoFocus/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col className='d-flex justify-content-center align-items-center'>
                                    <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '60%', height: '100%', borderRadius: '10px' }}>
                                        <CardBody className="fileUploader">
                                            <Files
                                                className='files-dropzone fileContainer'
                                                onChange={onFilesChange}
                                                onError={onFilesError}
                                                accepts={['image/*','.pdf']}
                                                multiple={false}
                                                maxFileSize={10000000}
                                                minFileSize={0}
                                                clickable
                                            >
                                            {uploadedFile.length > 0 ? (
                                                <div className='files-gallery'>
                                                    {uploadedFile.map((file, index) => (
                                                        <div key={index}>
                                                            {file.type.startsWith('image/') ? (
                                                                <Image attrImage={{ className: 'files-gallery-item', alt: 'img', src: `${file.preview.url}` }} />
                                                            ) : (
                                                                <div className='files-gallery-item'>
                                                                    <span>{file.name}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="d-flex flex-column align-items-center">
                                                    <Btn attrBtn={{ className: 'btn btn-air-primary mt-2', type: 'button', color: 'primary' }}>Upload File</Btn>
                                                        <small className="text-muted mt-2">Images, Pdfs are acceptable Only</small>
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
                            <br />
                            <Row>
                                <Col>
                                    <div className='text-end'>
                                        <Btn attrBtn={{ color: 'primary', className: 'btn btn-air-primary me-3' }} type="submit" disabled={loading}>
                                            {loading ? 'Please Wait...' : 'Submit'}
                                        </Btn>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
      )}
    </Fragment>
  )
}

export default AddMaterial


