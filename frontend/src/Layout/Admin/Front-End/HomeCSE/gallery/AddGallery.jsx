import React, { Fragment, useState } from 'react';
import { H5, Btn, Image } from '../../../../../AbstractElements';
import Files from 'react-files';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, CardBody, Form , FormGroup, Label, Input} from 'reactstrap';
import { baseApiURL } from '../../../../../baseUrl';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../Config/firebaseconfig';

const Addgallery = ({ onClose }) => {
  const [imageName, setImageName] = useState('');
  const [imageAlttext, setImageALtText] = useState('');
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

  const handleAddgallery = async (e) => {
    e.preventDefault();
    try {
      Swal.showLoading();
      setLoading(true);

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
      const storageRef = ref(storage, `gallery/${fileName}`);
      await uploadBytes(storageRef, file);
      const fileDownloadURL = await getDownloadURL(storageRef);

      const formData = new FormData();
      formData.append('name', imageName);
      formData.append('alttext', imageAlttext);
      formData.append('image', fileDownloadURL);

      const response = await axios.post(`${baseApiURL()}/addcsegallery`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setImageName('');
      setImageALtText('');
      setUploadedFile('');

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Image added successfully.',
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
          text: 'Error Adding Image!',
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
                <H5>Add Gallery</H5>
                <CardBody>
                  <Form className='theme-form' onSubmit={handleAddgallery}>
                    <Row>
                      <Col sm="12" xl="6">
                        <FormGroup>
                          <Label>Image Name</Label>
                          <Input className="form-control" type="text" placeholder="Image Name" onChange={(e) => setImageName(e.target.value)} required autoFocus/>
                        </FormGroup>
                      </Col>
                      <Col sm="12" xl="6">
                        <FormGroup>
                          <Label>Image Alttext</Label>
                          <Input className="form-control" type="text" placeholder="Image Alttext" onChange={(e) => setImageALtText(e.target.value)} required autoFocus/>
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                    <Row>
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
      )}
    </Fragment>
  )
}

export default Addgallery
