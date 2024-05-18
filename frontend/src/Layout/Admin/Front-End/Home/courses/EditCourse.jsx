import React, { Fragment, useState, useEffect } from 'react';
import { H5, Btn, Image } from '../../../../../AbstractElements';
import Files from 'react-files';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, CardBody, Form , FormGroup, Label, Input} from 'reactstrap';
import { baseApiURL } from '../../../../../baseUrl';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../Config/firebaseconfig';

const AddCourse = ({course , onClose}) => {
    const [uploadedFile, setUploadedFile] = useState([]);
    const [courseData, setCourseData] = useState({
      title: '',
      image: '',
      link: ''
    });

    const [loading, setLoading] = useState(false);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(true);

    useEffect(() => {
      const fetchCourseDetails = async () => {
        try {
          const response = await axios.get(`${baseApiURL()}/getSingleCourseDetails/${course._id}`); 
          const CourseDetails = response.data;
  
          setCourseData(CourseDetails);
        } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Error Fetching Course Details!',
              confirmButtonText: 'OK'
            });
        }
      };
  
      fetchCourseDetails();
    }, []);
  
    useEffect(() => {
      if (isDataChanged && courseData.image) {
    
        const formData = new FormData();
        Object.entries(courseData).forEach(([key, value]) => {
          formData.append(key, value);
        });

        setLoading(true);

        axios.post(`${baseApiURL()}/editCourseDetails/${course._id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            setIsDataChanged(false);
            setCourseData({
              title: '',
              image: '',
              link: ''
            });
    
            setUploadedFile([]);
    
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Course Details updated successfully.',
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
              text: 'Error Updating Course Details!',
              confirmButtonText: 'OK'
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [isDataChanged, courseData, course, courseData.image]);

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
          Swal.showLoading();
          if (uploadedFile.length > 0) {
  
            const file = uploadedFile[0];
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `course/${fileName}`);
            await uploadBytes(storageRef, file);
    
            const fileDownloadURL = await getDownloadURL(storageRef);

            setCourseData((prevData) => ({
              ...prevData,
              image: fileDownloadURL,
            }));
    
            setUploadedFile([]);
          }
          setIsDataChanged(true);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Updating Course Details!',
            confirmButtonText: 'OK'
          });
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
                <H5>Edit Course</H5>
                <CardBody>
                  <Form className='theme-form' onSubmit={handleEditSubmit}>
                    <Row>
                      <Col sm="12" xl="6">
                        <FormGroup>
                          <Label>Course Title</Label>
                          <Input className="form-control" type="text" placeholder="Course Name" value={courseData.title} onChange={(e) => setCourseData({ ...courseData, title: e.target.value })} required autoFocus/>
                        </FormGroup>
                      </Col>
                      <Col sm="12" xl="6">
                        <FormGroup>
                          <Label>Course Link</Label>
                          <Input type="select" name="course-link" className="form-control digits" defaultValue="1" value={courseData.link} onChange={(e) => setCourseData({ ...courseData, link: e.target.value })} required autoFocus>
                            <option>{'Select'}</option>
                            <option>{'/Computer-Science-Engineering(CSE)'}</option>
                            <option>{'/Electronics-Communication-Engineering(ECE)'}</option>
                            <option>{'/Electronics-Electrical-Engineering(EEE)'}</option>
                            <option>{'/Civil-Engineering(CE)'}</option>
                            <option>{'/Mechanical-Engineering(ME)'}</option>
                            <option>{'/Master-of-Business-Administration(MBA)'}</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col className='d-flex justify-content-center align-items-center'>
                        <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '100%', height: '105%', borderRadius: '10px' }}>
                          <img src={courseData.image} width={350} height={250} loading='lazy' style={{borderRadius: "10px"}} alt="" />
                        </FormGroup>
                      </Col>
                      <Col className='d-flex justify-content-center align-items-center'>
                        <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '100%', height: '105%', borderRadius: '10px' }}>
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
                                      <Image attrImage={{ className: 'files-gallery-item', alt: 'img', src: `${file.preview.url}` }}/>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="d-flex flex-column align-items-center">
                                  <Btn attrBtn={{ className: 'mt-2', type: 'button', color: 'primary' }}>Upload New Image</Btn>
                                  <small className="text-muted mt-2">Accepted file types: Images</small>
                                </div>
                              )}
                            </Files>
                            {uploadedFile.length > 0 && (
                              <div className="d-flex justify-content-center mt-3">
                                <Btn attrBtn={{ className: 'mr-2', color: 'danger', type: 'button', onClick: deleteFile }}>Delete</Btn>
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
                          <Btn attrBtn={{ color: 'primary', className: 'me-3' }} type="submit" disabled={loading}>
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

export default AddCourse
