import React, { Fragment , useState, useEffect } from 'react';
import { Btn, Image } from '../../../../../AbstractElements';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, Form , FormGroup, Label, Input} from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { baseApiURL } from '../../../../../baseUrl';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../Config/firebaseconfig';

const AddAbout = () => {
  const [uploadedFile1, setUploadedFile1] = useState(null);
  const [uploadedFile2, setUploadedFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aboutData, setAboutData] = useState({
    title: '',
    description: '',
    image1: '',
    image2: ''
  });

  useEffect(() => {
    const fetchAboutDetails = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getaboutcsedetails`); 
        const AboutDetails = response.data[0];

        if (!AboutDetails.title) {
          AboutDetails.title = '';
        }

        setAboutData(AboutDetails);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Fetching About Details!',
            confirmButtonText: 'OK'
          });
      }
    };

    fetchAboutDetails();
  }, []);

  const onFilesChange1 = (files) => {
    setUploadedFile1(files[0]);
  };

  const onFilesChange2 = (files) => {
    setUploadedFile2(files[0]);
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
    setUploadedFile1(null);
    setUploadedFile2(null);
  };

  const handleAddAbout = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      Swal.showLoading();

      const uploadFile = async (file) => {
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `about/${fileName}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      };

      let url1 = aboutData.image1;
      let url2 = aboutData.image2;

      if (uploadedFile1) {
        url1 = await uploadFile(uploadedFile1);
      }

      if (uploadedFile2) {
        url2 = await uploadFile(uploadedFile2);
      }

      setAboutData((prevData) => ({
        ...prevData,
        image1: url1,
        image2: url2,
      }));

      setUploadedFile1(null);
      setUploadedFile2(null);

      const formData = new FormData();
      formData.append('title', aboutData.title);
      formData.append('description', aboutData.description);
      formData.append('image1', url1);
      formData.append('image2', url2);

      axios.post(`${baseApiURL()}/addaboutcsedetails`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'About Details added successfully.',
            confirmButtonText: 'OK'
          });
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Adding About Details!',
            confirmButtonText: 'OK'
          });
        })
        .finally(() => {
          setLoading(false);
        });

    } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Adding About Details!',
          confirmButtonText: 'OK'
        });
    }
  };

  return (
    <Fragment>
      <span>&nbsp;</span>
      <Container fluid={true}>
        <Row>
          <Col sm='12'>
            <Card>
              <CardBody>
                <Form className='theme-form' onSubmit={handleAddAbout}>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Title</Label>
                                <Input className="form-control" type="text" placeholder="Title" value={aboutData.title} onChange={(e) => setAboutData({...aboutData, title: e.target.value})} required autoFocus/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <FormGroup>
                                <Label>Description</Label>
                                <textarea className='form-control' name='description' rows='3' placeholder='Description' style={{resize:'none'}} value={aboutData.description} onChange={(e) => setAboutData({...aboutData, description: e.target.value})} required autoFocus/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col className='d-flex justify-content-center align-items-center'>
                        <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '100%', height: '105%', borderRadius: '10px' }}>
                          {aboutData.image1 && <img src={aboutData.image1} width={350} height={250} alt="" />}
                        </FormGroup>
                      </Col>
                      <Col className='d-flex justify-content-center align-items-center'>
                        <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '100%', height: '105%', borderRadius: '10px' }}>
                          <CardBody className="fileUploader">
                            <Files
                              className='files-dropzone fileContainer'
                              onChange={onFilesChange1}
                              onError={onFilesError}
                              accepts={['image/*']}
                              multiple={false}
                              maxFileSize={10000000}
                              minFileSize={0}
                              clickable
                            >
                              {uploadedFile1 ? (
                                <div className='files-gallery'>
                                  <Image attrImage={{ className: 'files-gallery-item', alt: 'img', src: `${uploadedFile1.preview.url}` }} />
                                </div>
                              ) : (
                                <div className="d-flex flex-column align-items-center">
                                  <Btn attrBtn={{ className: 'mt-2', type: 'button', color: 'primary' }}>Upload Image 1</Btn>
                                  <small className="text-muted mt-2">Accepted file types: Images</small>
                                </div>
                              )}
                            </Files>
                            {uploadedFile1 && (
                              <div className="d-flex justify-content-center mt-3">
                                <Btn attrBtn={{ className: 'mr-2', color: 'danger', type: 'button', onClick: deleteFile }}>Delete</Btn>
                              </div>
                            )}
                          </CardBody>
                        </FormGroup>
                      </Col>
                    </Row>
                    <br /><br />
                    <Row>
                      <Col className='d-flex justify-content-center align-items-center'>
                        <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '100%', height: '105%', borderRadius: '10px' }}>
                          {aboutData.image2 && <img src={aboutData.image2} width={350} height={250} alt="" />}
                        </FormGroup>
                      </Col>
                      <Col className='d-flex justify-content-center align-items-center'>
                        <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '100%', height: '105%', borderRadius: '10px' }}>
                          <CardBody className="fileUploader">
                            <Files
                              className='files-dropzone fileContainer'
                              onChange={onFilesChange2}
                              onError={onFilesError}
                              accepts={['image/*']}
                              multiple={false}
                              maxFileSize={10000000}
                              minFileSize={0}
                              clickable
                            >
                              {uploadedFile2 ? (
                                <div className='files-gallery'>
                                  <Image attrImage={{ className: 'files-gallery-item', alt: 'img', src: `${uploadedFile2.preview.url}` }} />
                                </div>
                              ) : (
                                <div className="d-flex flex-column align-items-center">
                                  <Btn attrBtn={{ className: 'mt-2', type: 'button', color: 'primary' }}>Upload Image 2</Btn>
                                  <small className="text-muted mt-2">Accepted file types: Images</small>
                                </div>
                              )}
                            </Files>
                            {uploadedFile2 && (
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
    </Fragment>
  )
}

export default AddAbout;

