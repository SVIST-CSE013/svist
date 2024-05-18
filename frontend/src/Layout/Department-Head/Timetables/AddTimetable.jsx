import React, { Fragment, useState, useEffect } from 'react';
import { Btn, Image, H5 } from '../../../AbstractElements';
import Files from 'react-files';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../Config/firebaseconfig';
import { baseApiURL } from '../../../baseUrl';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input } from 'reactstrap';

const AddTimetable = ({ onClose }) => {
  const [timetableData, setTimetableData] = useState({
    title: '',
    department: '',
    semester: '',
    file: '',
    date: new Date().toLocaleDateString('en-GB')
  });

  const [department, setDepartment] = useState();
  const [uploadedFile, setUploadedFile] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [loading, setLoading] = useState(false);

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
  }, []);

  useEffect(() => {
    if (timetableData.file) {

      const formData = new FormData();
      Object.entries(timetableData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      axios.post(`${baseApiURL()}/addtimetable`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          setTimetableData({
            title: '',
            department: '',
            semester: '',
            file: ''
          });

          setUploadedFile([]);

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Timetable added successfully.',
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
            text: 'Error Adding Timetable!',
            confirmButtonText: 'OK'
          });
        });
    }
  }, [timetableData.file]);

  const handleSubmit = async (e) => {
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
      const storageRef = ref(storage, `timetable/${fileName}`);
      await uploadBytes(storageRef, file);

      const fileDownloadURL = await getDownloadURL(storageRef);

      setTimetableData((prevData) => ({
        ...prevData,
        file: fileDownloadURL,
      }));

      setUploadedFile([]);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Error Adding Timetable!',
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
          <Row>
            <Col sm='12'>
              <Card>
                <H5>Add Timetable</H5>
                <CardBody>
                  <Form className='theme-form' onSubmit={handleSubmit}>
                    <Row>
                      <Col sm="12" xl="4">
                        <FormGroup>
                          <Label>Timetable Title</Label>
                          <Input className="form-control" type="text" placeholder="Timetable Name" value={timetableData.title} onChange={(e) => setTimetableData({ ...timetableData, title: e.target.value })} required autoFocus />
                        </FormGroup>
                      </Col>
                      <Col sm="12" xl="4">
                        <FormGroup>
                          <Label htmlFor="exampleFormControlSelect9">Choose Department</Label>
                          <Input type="select" className="form-control digits" name="department" value={timetableData.department} onChange={(e) => setTimetableData({ ...timetableData, department: e.target.value })} defaultValue="1" required autoFocus>
                            <option>{'Select'}</option>
                            <option>{department}</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col sm="12" xl="4">
                        <FormGroup>
                          <Label htmlFor="exampleFormControlSelect9">Choose Semester</Label>
                          <Input type="select" name="select" className="form-control digits" value={timetableData.semester} onChange={(e) => setTimetableData({ ...timetableData, semester: e.target.value })} defaultValue="1" required autoFocus>
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
                              accepts={['image/*', '.pdf']}
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

export default AddTimetable
