import React, { Fragment, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Btn, Image } from '../../../AbstractElements';
import Files from 'react-files';
import axios from "axios";
import Swal from "sweetalert2";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../Config/firebaseconfig';
import { baseApiURL } from '../../../baseUrl';

const ChangeProfilePicture = ({ user }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const deleteFile = () => {
        setFiles([]);
    };

    const onFilesChange = (files) => {
        setFiles(files);
    };

    const onFilesError = () => {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Uploading File!',
            confirmButtonText: 'OK'
        });
    };

    const uploadImageToFirebase = async () => {
        try {
            if (files.length === 0) return;

            setUploading(true);

            const file = files[0];
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `staffPictures/${fileName}`);
            await uploadBytes(storageRef, file);

            const fileDownloadURL = await getDownloadURL(storageRef);

            await axios.post(
                `${baseApiURL()}/changestaffprofilepicture/${user}`,
                { fileDownloadURL },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );

            setUploading(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Profile Picture Updated Successfully',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Uploading Image!',
                confirmButtonText: 'OK'
            });
            setUploading(false);
        }
    };

    return (
        <Fragment>
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <h5>Upload Profile Picture</h5>
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
                                    {files.length > 0 ? (
                                        <div className='files-gallery'>
                                            {files.map((file, index) => (
                                                <div key={index}>
                                                    <Image
                                                        attrImage={{
                                                            className: 'files-gallery-item',
                                                            alt: 'img',
                                                            src: `${file.preview.url}`,
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-center">
                                            <Btn
                                                attrBtn={{
                                                    className: 'mt-2',
                                                    type: 'button',
                                                    color: 'primary',
                                                    disabled: uploading,
                                                    className: "btn btn-air-primary"
                                                }}
                                            >
                                                {uploading ? 'Uploading...' : 'Upload Image'}
                                            </Btn>
                                        </div>
                                    )}
                                </Files>
                                {files.length > 0 && (
                                    <div className="d-flex justify-content-center">
                                        <Btn
                                            attrBtn={{
                                                className: 'mt-2',
                                                color: 'danger',
                                                className: "btn btn-air-danger",
                                                type: 'button',
                                                onClick: deleteFile,
                                            }}
                                        >
                                            Delete
                                        </Btn>
                                        &nbsp;&nbsp;&nbsp;
                                        <Btn
                                            attrBtn={{
                                                className: 'mt-2',
                                                color: 'primary',
                                                className: "btn btn-air-primary",
                                                type: 'button',
                                                onClick: uploadImageToFirebase,
                                            }}
                                        >
                                            Change Picture
                                        </Btn>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default ChangeProfilePicture;


