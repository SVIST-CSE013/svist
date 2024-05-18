import React, { Fragment, useState, useEffect } from 'react';
import { Btn, Image } from '../../../../../AbstractElements';
import { Container, Row, Col, Card, CardBody, Form , FormGroup, Label, Input} from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { baseApiURL } from '../../../../../baseUrl';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../Config/firebaseconfig';
import Files from 'react-files';

const AddFooterDetails = () => {
    const [uploadedFile, setUploadedFile] = useState([]);
    const [footerData, setFooterData] = useState({
        title: '',
        sociallink1: '',
        sociallink2: '',
        sociallink3: '',
        address: '',
        phonenumber: '',
        email: '',
        logo: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFooterDetails = async () => {
          try {
            const response = await axios.get(`${baseApiURL()}/getfooterdetails`); 
            const FooterDetails = response.data[0];

            if (!FooterDetails.title) {
              FooterDetails.title = '';
            }
    
            setFooterData(FooterDetails);
          } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Fetching Footer Details!',
                confirmButtonText: 'OK'
              });
          }
        };
    
        fetchFooterDetails();
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

    useEffect(() => {
        if (footerData.logo) {

          const formData = new FormData();
          Object.entries(footerData).forEach(([key, value]) => {
            formData.append(key, value);
          });

          axios.post(`${baseApiURL()}/addfooterdetails`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {
    
              setUploadedFile([]); 
            })
            .catch(error => {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Adding Footer Details!',
                confirmButtonText: 'OK'
              });
            });
        }
    }, [footerData.logo]);


    const handleAddFooter = async (e) => {
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
          const storageRef = ref(storage, `logo/${fileName}`);
          await uploadBytes(storageRef, file);
    
          const fileDownloadURL = await getDownloadURL(storageRef);
    
          setFooterData((prevData) => ({
            ...prevData,
            logo: fileDownloadURL,
          }));
          
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Footer Details added successfully.',
            confirmButtonText: 'OK'
          });
          
          setUploadedFile([]);
  
        } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Error Deleting Event!',
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
                <Form className='theme-form' onSubmit={handleAddFooter}>
                    <Row>
                        <Col xl="4">
                            <FormGroup>
                                <Label>Footer Title</Label>
                                <Input className="form-control" type="text" placeholder="Footer Title" value={footerData.title} onChange={(e) => setFooterData({...footerData, title: e.target.value})} required autoFocus/>
                            </FormGroup>
                        </Col>
                        <Col xl="4">
                            <FormGroup>
                                <Label>Address</Label>
                                <Input className="form-control" type="text" placeholder="Address" value={footerData.address} onChange={(e) => setFooterData({...footerData, address: e.target.value})} required autoFocus/>
                            </FormGroup>
                        </Col>
                        <Col xl="4">
                            <FormGroup>
                                <Label>E-mail Address</Label>
                                <Input className="form-control" type="email" placeholder="E-mail Address" value={footerData.email} onChange={(e) => setFooterData({...footerData, email: e.target.value})} required autoFocus/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl="4">
                            <FormGroup>
                                <Label>Phone Number</Label>
                                <Input className="form-control" type="number" placeholder="Phone Number" value={footerData.phonenumber} onChange={(e) => setFooterData({...footerData, phonenumber: e.target.value})} required autoFocus maxLength={10} size={10}/>
                            </FormGroup>
                        </Col>
                        <Col xl="4">
                            <FormGroup>
                                <Label>Facebook Link</Label>
                                <Input className="form-control" type="text" placeholder="Facebook Link" value={footerData.sociallink1} onChange={(e) => setFooterData({...footerData, sociallink1: e.target.value})} required autoFocus/>
                            </FormGroup>
                        </Col>
                        <Col xl="4">
                            <FormGroup>
                                <Label>LinkedIn Link</Label>
                                <Input className="form-control" type="text" placeholder="LinkedIn Link" value={footerData.sociallink2} onChange={(e) => setFooterData({...footerData, sociallink2: e.target.value})} required autoFocus/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col className='d-flex justify-content-center align-items-center'> 
                            <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '100%', height:'105%', borderRadius: '10px' }}>
                                <img src={footerData.logo} width={100} height={100} alt="" />
                            </FormGroup>
                        </Col>
                        <Col className='d-flex justify-content-center align-items-center'> 
                            <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '100%', height:'105%', borderRadius: '10px' }}>
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
    </Fragment>
  )
}

export default AddFooterDetails
