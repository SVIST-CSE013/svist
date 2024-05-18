import React, { Fragment , useState, useEffect } from 'react';
import { Btn, Image } from '../../../../../AbstractElements';
import Files from 'react-files';
import { baseApiURL } from '../../../../../baseUrl';
import { Container, Row, Col, Card, CardBody, Form , FormGroup, Label, Input} from 'reactstrap';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../Config/firebaseconfig';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

const AddAbout = () => {
  const [uploadedFile, setUploadedFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aboutData, setAboutData] = useState({
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    const fetchAboutDetails = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getaboutdetails`); 
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

  const handleAddAbout = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      Swal.showLoading();

      if (uploadedFile.length > 0) {
        const file = uploadedFile[0];
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `about/${fileName}`);
        await uploadBytes(storageRef, file);

        const fileDownloadURL = await getDownloadURL(storageRef);

        setAboutData(prevData => ({
          ...prevData,
          image: fileDownloadURL,
        }));
      }

      const formData = new FormData();
      formData.append("title", aboutData.title);
      formData.append("description", aboutData.description);
      formData.append("image", aboutData.image);

      await axios.post(`${baseApiURL()}/addaboutdetails`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setUploadedFile([]);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'About Details added successfully.',
        confirmButtonText: 'OK'
      });

    } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Adding About Details!',
          confirmButtonText: 'OK'
        });
    } finally {
      setLoading(false);
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
                          <img src={aboutData.image} width={350} height={250} alt="" loading="lazy" style={{borderRadius: '10px'}}/>
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
      <Toaster position="bottom-center" />
    </Fragment>
  )
}

export default AddAbout;

