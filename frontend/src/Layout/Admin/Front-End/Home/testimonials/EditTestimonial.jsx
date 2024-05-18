import React, { Fragment , useState , useEffect } from 'react';
import { H5, Btn , Image} from '../../../../../AbstractElements';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, Form , FormGroup, Label, Input} from 'reactstrap';
import axios from 'axios';
import { baseApiURL } from '../../../../../baseUrl';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../Config/firebaseconfig';
import Swal from 'sweetalert2';

const EditTestimonial = ({testimonial , onClose}) => {
    const [uploadedFile, setUploadedFile] = useState([]);
    const [testimonialData, setTestimonialData] = useState({
        name: '',
        designation: '',
        description: '',
        profileimage: ''
    });

    const [loading, setLoading] = useState(false);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(true);

    useEffect(() => {
      const fetchTestimonialDetails = async () => {
        try {
          const response = await axios.get(`${baseApiURL()}/getSingleTestimonialDetails/${testimonial._id}`); 
          const TestimonialDetails = response.data;
  
          setTestimonialData(TestimonialDetails);
        } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Error Fetching Achievement Details!',
              confirmButtonText: 'OK'
            });
        }
      };
  
      fetchTestimonialDetails();
    }, []);
  
    useEffect(() => {
      if (isDataChanged && testimonialData.profileimage) {
    
        const formData = new FormData();
        Object.entries(testimonialData).forEach(([key, value]) => {
          formData.append(key, value);
        });

        setLoading(true);
    
        axios.post(`${baseApiURL()}/editTestimonialDetails/${testimonial._id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            setIsDataChanged(false);

            setTestimonialData({
              name: '',
              designation: '',
              description: '',
              profileimage: ''
            });
    
            setUploadedFile([]);
    
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Achievement Details updated successfully.',
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
              text: 'Error Updating Achievement Details!',
              confirmButtonText: 'OK'
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [isDataChanged, testimonialData, testimonial, testimonialData.profileimage]);

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
            const storageRef = ref(storage, `testimonial/${fileName}`);
            await uploadBytes(storageRef, file);
    
            const fileDownloadURL = await getDownloadURL(storageRef);
    
            setTestimonialData((prevData) => ({
              ...prevData,
              profileimage: fileDownloadURL,
            }));
    
            setUploadedFile([]);
          }
          setIsDataChanged(true);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Updating Achievement Details!',
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
                    <H5>Edit Testimonial</H5>
                    <CardBody>
                        <Form className='theme-form' onSubmit={handleEditSubmit}>
                            <Row>
                                <Col sm="12" xl="7">
                                    <FormGroup>
                                        <Label>Testimonial Name</Label>
                                        <Input className="form-control" type="text" placeholder="Testimonial Name" name="Testimonial Name" value={testimonialData.name} onChange={(e) => setTestimonialData({...testimonialData, name: e.target.value})} required autoFocus/>
                                    </FormGroup>
                                </Col>
                                <Col sm="12" xl="5">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Testimonial Designation</Label>
                                        <Input type="select" name="select" className="form-control digits" defaultValue="1" value={testimonialData.designation} onChange={(e) => setTestimonialData({...testimonialData, designation: e.target.value})} required autoFocus>
                                            <option>{'Select'}</option>
                                            <option>{'Student'}</option>
                                            <option>{'Faculty'}</option>
                                            <option>{'Staff'}</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label>Testimonial Description</Label>
                                        <textarea className='form-control' name='description' rows='3' placeholder='Testimonial Description' style={{resize:'none'}} value={testimonialData.description} onChange={(e) => setTestimonialData({...testimonialData, description: e.target.value})} required autoFocus/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                              <Col className='d-flex justify-content-center align-items-center'>
                                <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '100%', height: '100%', borderRadius: '10px' }}>
                                  <img src={testimonialData.profileimage} width={150} height={150} style={{ borderRadius: '10px' }} alt="Existing Student Image Will Load Here" />
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

export default EditTestimonial