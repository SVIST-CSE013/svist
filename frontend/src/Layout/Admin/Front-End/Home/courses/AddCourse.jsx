import React, { Fragment, useState } from 'react';
import { H5, Btn, Image } from '../../../../../AbstractElements';
import Files from 'react-files';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form , FormGroup, Label, Input} from 'reactstrap';
import { baseApiURL } from '../../../../../baseUrl';
import Swal from 'sweetalert2';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../Config/firebaseconfig';

const AddCourse = ({onClose}) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseLink, setCourseLink] = useState('');
  const [uploadedFile, setUploadedFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);

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

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      if (uploadedFile.length === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Uploading File!',
            confirmButtonText: 'OK'
          });
        return;
      }

      setLoading(true);
      Swal.showLoading();

      const file = uploadedFile[0];
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `course/${fileName}`);
      await uploadBytes(storageRef, file);

      const fileDownloadURL = await getDownloadURL(storageRef);
      const formData = new FormData();
      formData.append('title', courseTitle);
      formData.append('image', fileDownloadURL);
      formData.append('link', courseLink);

      const response = await axios.post(`${baseApiURL()}/addcoursedetails`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setCourseTitle('');
      setCourseLink('');
      setUploadedFile('');

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Course added successfully.',
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
          text: 'Error Adding Course!',
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
                <H5>Add Course</H5>
                <CardBody>
                  <Form className='theme-form' onSubmit={handleAddCourse}>
                    <Row>
                      <Col sm="12" xl="6">
                        <FormGroup>
                          <Label>Course Title</Label>
                          <Input className="form-control" type="text" placeholder="Course Name" onChange={(e) => setCourseTitle(e.target.value)} required autoFocus/>
                        </FormGroup>
                      </Col>
                      <Col sm="12" xl="6">
                        <FormGroup>
                          <Label>Course Link</Label>
                          <Input type="select" name="course-link" className="form-control digits" defaultValue="1" onChange={(e) => setCourseLink(e.target.value)} required autoFocus>
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
