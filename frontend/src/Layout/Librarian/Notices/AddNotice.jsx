import React, { Fragment, useState, useEffect } from 'react';
import { H5, Btn, Image } from '../../../AbstractElements';
import Files from 'react-files';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardFooter } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { baseApiURL } from '../../../baseUrl';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../Config/firebaseconfig';

const AddNotice = ({ onClose }) => {
    const [uploadedFile, setUploadedFile] = useState([]);
    const [noticeData, setNoticeData] = useState({
        title: '',
        description: '',
        type: 'Library-Member Notice Panel',
        date: new Date().toLocaleDateString('en-GB'),
        file: '',
    });

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

    useEffect(() => {
        if (noticeData.file) {

            const formData = new FormData();
            Object.entries(noticeData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            setLoading(true);
            Swal.showLoading();

            axios.post(`${baseApiURL()}/addnoticedetails`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {

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
                        text: 'Notice Published successfully.',
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
                        text: 'Error Publishing Notice',
                        confirmButtonText: 'OK'
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [noticeData.file]);


    const handleAddNotice = async (e) => {
        e.preventDefault();

        try {
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
            const storageRef = ref(storage, `notice/${fileName}`);
            await uploadBytes(storageRef, file);

            const fileDownloadURL = await getDownloadURL(storageRef);

            setNoticeData((prevData) => ({
                ...prevData,
                file: fileDownloadURL,
            }));

            setUploadedFile([]);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Publishing Notice',
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
                                <H5>Add Notice</H5>
                                <Form className='theme-form' onSubmit={handleAddNotice}>
                                    <CardBody>
                                        <Row>
                                            <Col sm="12" xl="7">
                                                <FormGroup>
                                                    <Label>Notice Title</Label>
                                                    <Input className="form-control" type="text" placeholder="Notice Name" name="Notice Name" value={noticeData.title} onChange={(e) => setNoticeData({ ...noticeData, title: e.target.value })} required autoFocus/>
                                                </FormGroup>
                                            </Col>
                                            <Col sm="12" xl="5">
                                                <FormGroup>
                                                    <Label htmlFor="exampleFormControlSelect9">Notice Visible to:</Label>
                                                    <Input type="select" name="select" className="form-control digits" defaultValue="1" disabled>
                                                        <option>{'Library-Member Notice Panel'}</option>
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormGroup>
                                                    <Label>Notice Description</Label>
                                                    <textarea className='form-control' name='description' rows='5' placeholder='Notice Description' style={{ resize: 'none' }} value={noticeData.description} onChange={(e) => setNoticeData({ ...noticeData, description: e.target.value })} required autoFocus/>
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
                                                        accepts={['image/*','.pdf']}
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
                                                                <Btn attrBtn={{ className: 'mt-2 btn btn-air-primary', type: 'button', color: 'primary' }}>Upload File</Btn>
                                                                <small className="text-muted mt-2">Images, Pdfs are acceptable Only</small>
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
                                    </CardBody>
                                    <CardFooter className="text-end">
                                        <Btn attrBtn={{ color: 'primary', className: 'me-3 btn btn-air-primary' }} type="submit" disabled={loading}>
                                            {loading ? 'Please Wait...' : 'Submit'}
                                        </Btn>
                                    </CardFooter>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )}
        </Fragment>
    )
}

export default AddNotice

