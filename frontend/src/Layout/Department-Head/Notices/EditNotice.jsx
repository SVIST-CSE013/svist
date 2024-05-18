import React, { Fragment , useState , useEffect } from 'react';
import { H5, Btn , Image} from '../../../AbstractElements';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, Form , FormGroup, Label, Input} from 'reactstrap';
import axios from 'axios';
import { baseApiURL } from '../../../baseUrl';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../Config/firebaseconfig';
import Swal from 'sweetalert2';

const EditNotice = ({notice , onClose}) => {
    const [uploadedFile, setUploadedFile] = useState([]);
    const [noticeData, setNoticeData] = useState({
        title: '',
        description: '',
        type: '',
        date: new Date().toLocaleDateString('en-GB'),
        file: '',
    });

    const [loading, setLoading] = useState(false);
    const [isDataChanged, setIsDataChanged] = useState(false);
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


    useEffect(() => {
        const fetchNoticeDetails = async () => {
          try {
            const response = await axios.get(`${baseApiURL()}/getSingleNoticeDetails/${notice._id}`);
            const NoticeDetails = response.data;
    
            setNoticeData(NoticeDetails);
          } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Fetching Notice Details!',
                confirmButtonText: 'OK'
              });
          }
        };
    
        fetchNoticeDetails();
    }, []);


    useEffect(() => {
        if (isDataChanged && noticeData.file) {

          const formData = new FormData();
          Object.entries(noticeData).forEach(([key, value]) => {
            formData.append(key, value);
          });

          setLoading(true);
          Swal.showLoading();

          axios.post(`${baseApiURL()}/editnoticedetails/${notice._id}`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {

              setIsDataChanged(false);
              
              setNoticeData({
                title: '',
                description: '',
                type: '',
                date: '',
                file: '',
              });
    
              setUploadedFile([]);

              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Notice updated successfully.',
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
                text: 'Error Updating Notice!',
                confirmButtonText: 'OK'
              });
            })
            .finally(() => {
              setLoading(false);
            });
        }
    }, [isDataChanged, noticeData, notice, noticeData.file]);


    const handleEditNotice = async (e) => {
        e.preventDefault();
        try {

          if (uploadedFile.length > 0) {
            const file = uploadedFile[0];
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `notice/${fileName}`);
            await uploadBytes(storageRef, file);
    
            const fileDownloadURL = await getDownloadURL(storageRef);

            setNoticeData((prevData) => ({
              ...prevData,
              file: fileDownloadURL,
              date: new Date().toLocaleDateString('en-GB'),
            }));
    
            setUploadedFile([]);
          }

          setIsDataChanged(true); 
        } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Error Updating Notice!',
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
                    <H5>Edit Notice</H5>
                    <CardBody>
                        <Form className='theme-form' onSubmit={handleEditNotice}>
                            <Row>
                                <Col sm="12" xl="7">
                                    <FormGroup>
                                        <Label>Notice Title</Label>
                                        <Input className="form-control" type="text" placeholder="Notice Name" name="Notice Name" value={noticeData.title} onChange={(e) => setNoticeData({...noticeData, title: e.target.value})} required autoFocus/>
                                    </FormGroup>
                                </Col>
                                <Col sm="12" xl="5">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Type of Notice</Label>
                                        <Input type="select" name="select" className="form-control digits" defaultValue="1" value={noticeData.type} onChange={(e) => setNoticeData({...noticeData, type: e.target.value})} required autoFocus>
                                            <option>{'Select'}</option>
                                            <option>{'Student Notice Panel'}</option>
                                            <option>{'Faculty Notice Panel'}</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label>Notice Description</Label>
                                        <textarea className='form-control' name='description' rows='5' placeholder='Notice Description' style={{resize:'none'}} value={noticeData.description} onChange={(e) => setNoticeData({...noticeData, description: e.target.value})} required autoFocus/>
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

export default EditNotice