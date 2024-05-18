import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardFooter } from 'reactstrap';
import { H5, Btn, Image } from '../../../AbstractElements';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../Config/firebaseconfig';
import Swal from 'sweetalert2';
import { baseApiURL } from '../../../baseUrl';

const AddBook = ({onClose}) => {
    const [loading, setLoading] = useState(false);
    const [bookData, setBookData] = useState({
        isbnNo: '',
        title: '',
        description: '',
        department: '',
        author: '',
        status: '',
        bookimg: '',
    });

    const [uploadedFile, setUploadedFile] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(true);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/getDepartment`);
                const departmentsArray = Array.isArray(response.data) ? response.data : [response.data];
                setDepartments(departmentsArray);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Departments!',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchDepartments();
    }, []);


    useEffect(() => {
        if (bookData.bookimg) {

          const formData = new FormData();
          Object.entries(bookData).forEach(([key, value]) => {
            formData.append(key, value);
          });

          setLoading(true);
          Swal.showLoading();
    
          axios.post(`${baseApiURL()}/addBookDetails`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {
                setBookData({
                    isbnNo: '',
                    title: '',
                    description: '',
                    department: '',
                    author: '',
                    status: '',
                    bookimg: null,
                });
    
              setUploadedFile([]);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Book added successfully.',
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
                    text: 'Book not added.',
                    confirmButtonText: 'OK'
                });
            })
            .finally(() => {
                setLoading(false);
            });
        }
      }, [bookData.bookimg]);


      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          if (uploadedFile.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'No File Uploaded !',
                    confirmButtonText: 'OK'
                });
            return;
          }
    
          const file = uploadedFile[0];
          const fileName = `${Date.now()}_${file.name}`;
          const storageRef = ref(storage, `libraryPictures/${fileName}`);
          await uploadBytes(storageRef, file);
    
          const fileDownloadURL = await getDownloadURL(storageRef);
    
          setBookData((prevData) => ({
            ...prevData,
            bookimg: fileDownloadURL,
          }));
    
          setUploadedFile([]);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Book Not Added',
                confirmButtonText: 'OK'
            });
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
                    <Card>
                        <H5>Add Book</H5>
                        <Form className="form theme-form" onSubmit={handleSubmit}>
                            <CardBody>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlInput1">Enter Book Name</Label>
                                            <Input className="form-control" type="text" placeholder="Lorem Ipsum" name="BookName" value={bookData.title} onChange={(e) => setBookData({...bookData, title: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Book Description</Label>
                                            <Input className="form-control" type="text" placeholder="Lorem Ipsum" name="BookDescription" value={bookData.description} onChange={(e) => setBookData({...bookData, description: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Choose Department</Label>
                                            <Input type="select" className="form-control digits" name="department" value={bookData.department} onChange={(e) => setBookData({...bookData, department: e.target.value})} defaultValue="1" required autoFocus>
                                                <option>{'Select'}</option>
                                                {departments.map((department) => (
                                                    <option key={department.id} value={department.deptname}>
                                                    {department.deptname}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlInput1">Enter ISBN Number</Label>
                                            <Input className="form-control" type="text" placeholder="Lorem Ipsum" name="ISBNNo" value={bookData.isbnNo} onChange={(e) => setBookData({...bookData, isbnNo: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleInputPassword2">Enter Author Name</Label>
                                            <Input className="form-control" type="text" placeholder="Lorem Ipsum" name="authorName" value={bookData.author} onChange={(e) => setBookData({...bookData, author: e.target.value})} required autoFocus/>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Status</Label>
                                            <Input type="select" name="status" className="form-control digits" defaultValue="1" value={bookData.status} onChange={(e) => setBookData({...bookData, status: e.target.value})} required autoFocus>
                                                <option>{'Select Status'}</option>
                                                <option>{'Available'}</option>
                                                <option>{'Out of Stock'}</option>
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
                                                            <Btn attrBtn={{ className: 'mt-2 btn btn-air-primary', type: 'button', color: 'primary' }}>Upload New Image</Btn>
                                                            <small className="text-muted mt-2">Accepted file types: Images</small>
                                                        </div>
                                                    )}
                                                </Files>
                                                {uploadedFile.length > 0 && (
                                                    <div className="d-flex justify-content-center mt-3">
                                                        <Btn attrBtn={{ className: 'mr-2 btn btn-air-danger', color: 'danger', type: 'button', onClick: deleteFile }}>Delete</Btn>
                                                    </div>
                                                )}
                                            </CardBody>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter className="text-end">
                                <Btn attrBtn={{ color: 'primary', className: 'me-3 btn btn-air-primary' }} type="submit" disabled={loading}>
                                    {loading ? 'Please Wait...' : 'Submit'}
                                </Btn>
                            </CardFooter>
                        </Form>
                    </Card>
                </Container>
            )}
        </Fragment>
    );
};

export default AddBook;