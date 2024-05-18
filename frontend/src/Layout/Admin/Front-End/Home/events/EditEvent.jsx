import React, { Fragment , useState , useEffect } from 'react';
import { H5, Btn , Image} from '../../../../../AbstractElements';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, Form , FormGroup, Label, Input} from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { baseApiURL } from '../../../../../baseUrl';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../Config/firebaseconfig';

const EditEvent = ({event , onClose}) => {
    const [uploadedFile, setUploadedFile] = useState([]);
    const [eventData, setEventData] = useState({
      title: '',
      description: '',
      date: '',
      file: ''
    });

    const [loading, setLoading] = useState(false);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(true);

    useEffect(() => {
      const fetchEventDetails = async () => {
        try {
          const response = await axios.get(`${baseApiURL()}/getSingleShowEvent/${event._id}`); 
          const EventDetails = response.data;
  
          setEventData(EventDetails);
        } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Error Fetching Event Details!',
              confirmButtonText: 'OK'
            });
        }
      };
  
      fetchEventDetails();
    }, []);
  
    useEffect(() => {
      if (isDataChanged && eventData.file) {
    
        const formData = new FormData();
        Object.entries(eventData).forEach(([key, value]) => {
          formData.append(key, value);
        });

        setLoading(true);
    
        axios.post(`${baseApiURL()}/editShowEvent/${event._id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            setIsDataChanged(false);

            setEventData({
              title: '',
              description: '',
              date: '',
              file: ''
            });
    
            setUploadedFile([]);
    
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Event Details updated successfully.',
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
              text: 'Error Updating Event Details!',
              confirmButtonText: 'OK'
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [isDataChanged, eventData, event, eventData.file]);

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
            const storageRef = ref(storage, `event/${fileName}`);
            await uploadBytes(storageRef, file);
    
            const fileDownloadURL = await getDownloadURL(storageRef);
            const formattedDate = formatDate(eventData.date);
    
            setEventData((prevData) => ({
              ...prevData,
              date: formattedDate,
              file: fileDownloadURL,
            }));
    
            setUploadedFile([]);
          }
          setIsDataChanged(true);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Updating Event Details!',
            confirmButtonText: 'OK'
          });
      }
    };

    const formatDate = (date) => {
      const d = new Date(date);
      const formattedDate = d.toLocaleDateString('en-GB');
      return formattedDate;
    };

  return (
    <Fragment>
      <span>&nbsp;</span>
      {isFormOpen && (
        <Container fluid={true}>
            <Row>
              <Col sm='12'>
                <Card>
                  <H5>Edit Event</H5>
                  <CardBody>
                    <Form className='theme-form' onSubmit={handleEditSubmit}>
                      <Row>
                        <Col sm="12" xl="7">
                          <FormGroup>
                            <Label>Title</Label>
                            <Input className="form-control" type="text" placeholder="Event Title" name="Event Title" value={eventData.title} onChange={(e) => setEventData({ ...eventData, title: e.target.value })} required autoFocus/>
                          </FormGroup>
                        </Col>
                        <Col sm="12" xl="5">
                          <FormGroup>
                            <Label htmlFor="exampleFormControlSelect9">Select Event Date</Label>
                            <Input type="date" name="select" className="form-control digits" defaultValue="1" value={eventData.date} onChange={(e) => setEventData({ ...eventData, date: e.target.value })} required autoFocus/>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <Label>Description</Label>
                            <textarea className='form-control' name='description' rows='3' placeholder='Event Description' style={{ resize: 'none' }} value={eventData.description} onChange={(e) => setEventData({ ...eventData, description: e.target.value })} required autoFocus/>
                          </FormGroup>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col className='d-flex justify-content-center align-items-center'>
                          <FormGroup className='d-flex justify-content-center align-items-center border border-black' style={{ width: '100%', height: '105%', borderRadius: '10px' }}>
                            <img src={eventData.file} width={350} height={250} alt="" />
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
      )}
    </Fragment>
  )
}

export default EditEvent