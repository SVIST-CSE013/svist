import React, { Fragment, useState } from 'react';
import { H5, Btn, Image } from '../../../../../AbstractElements';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { baseApiURL } from '../../../../../baseUrl';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../Config/firebaseconfig';

const AddBanner = ({onClose}) => {
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDescription, setBannerDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const handleAddBanner = async (e) => {
    e.preventDefault();
    try {

      Swal.showLoading();
      setLoading(true);

      if (uploadedFile.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Uploading File!',
          confirmButtonText: 'OK'
        });
        return;
      }

      const file = uploadedFile[0];
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `banner/${fileName}`);
      await uploadBytes(storageRef, file);

      const fileDownloadURL = await getDownloadURL(storageRef);
      const formData = new FormData();
      formData.append('title', bannerTitle);
      formData.append('description', bannerDescription);
      formData.append('backgroundImage', fileDownloadURL);

      const response = await axios.post(`${baseApiURL()}/addbannerdetails`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setBannerTitle('');
      setBannerDescription('');
      setUploadedFile('');

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Banner added successfully.',
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
          text: 'Error Adding Banner!',
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
                <H5>Add Banner</H5>
                <CardBody>
                  <Form className='theme-form' onSubmit={handleAddBanner}>
                    <Row>
                      <Col sm="12">
                        <FormGroup>
                          <Label>Banner Title</Label>
                          <Input
                            className="form-control"
                            type="text"
                            placeholder="Banner Title"
                            onChange={(e) => setBannerTitle(e.target.value)}
                            required autoFocus
                          />
                        </FormGroup>
                      </Col>
                      <Col sm="12">
                        <FormGroup>
                          <Label>Banner Description</Label>
                          <textarea
                            className='form-control'
                            rows={3}
                            placeholder='Banner Description'
                            style={{ resize: 'none' }}
                            onChange={(e) => setBannerDescription(e.target.value)}
                            required autoFocus
                          />
                        </FormGroup>
                      </Col>
                    </Row>
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
                                <Btn attrBtn={{ className: 'mt-2', type: 'button', color: 'primary' }}>Upload Image</Btn>
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
  );
};

export default AddBanner;


