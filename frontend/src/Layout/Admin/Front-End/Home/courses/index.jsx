import React, { Fragment , useState, useEffect } from 'react';
import { Plus } from 'react-feather';
import axios from 'axios';
import { Col, Card, CardHeader, Table, Modal, ModalBody } from "reactstrap";
import { Btn, H3 } from '../../../../../AbstractElements';
import { baseApiURL } from '../../../../../baseUrl';
import { Edit } from 'react-feather';
import { Trash2 } from 'react-feather';
import AddCourse from "./AddCourse";
import EditCourse from "./EditCourse";
import Swal from 'sweetalert2';


const Course = () => {
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseData , setCourseData] = useState([]);
    const [loadingTableData, setLoadingTableData] = useState(true);
    const [refreshTable, setRefreshTable] = useState(false);
    const maxCourses = 6;

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${baseApiURL()}/getCoursedetails`);
              setTimeout(() => {
                  setCourseData(response.data);
                  setLoadingTableData(false);
              }, 1000);
          } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Course Details!',
                    confirmButtonText: 'OK'
                });
          }
        };
    
        fetchData();
    }, [refreshTable]);


    const handleDelete = async (courseId) => {
        try {
            const confirmed = await confirmDelete();
            if(confirmed){
                const response = await axios.post(`${baseApiURL()}/deleteCourseDetails/${courseId}`);
                setCourseData((prevCourses) => prevCourses.filter((course) => course._id !== courseId));

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Course has been successfully deleted.',
                    confirmButtonText: 'OK'
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Deleting Course!',
                confirmButtonText: 'OK'
            });
        }
    };

    const confirmDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Course Details!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        return result.isConfirmed;
    };

    const openAddModal = () => {
        if (courseData.length < maxCourses) {
            setAddModal(true);
        }
    };

    const closeAddModal = () => {
        setAddModal(false);
        setRefreshTable(true);
    };

    const openEditModal = (course) => {
        setSelectedCourse(course);
        setEditModal(true);
    };

    const closeEditModal = () => {
        setSelectedCourse(null);
        setRefreshTable(true);
        setEditModal(false);
    };

    useEffect(() => {
        const loadImage = (item) => {
            const img = new Image();
            img.src = item.image;
            img.onload = () => {
                setCourseData((prevCourses) => {
                    return prevCourses.map((course) => {
                        if (course._id === item._id) {
                            return { ...course, imageLoaded: true };
                        }
                        return course;
                    });
                });
            };
        };

        courseData.forEach((item) => {
            if (!item.imageLoaded) {
                loadImage(item);
            }
        });
    }, [courseData]);

    useEffect(() => {
        setRefreshTable(false);
    }, [refreshTable]);

    return (
        <Fragment>
            <span>&nbsp;</span>
            <Col sm="12">
                <Card>
                    <CardHeader>
                        <H3>Course List</H3>
                        <span>&nbsp;</span>
                        <Btn attrBtn={{ color: courseData.length >= maxCourses ? 'primary d-flex align-items-center disabled' : 'primary d-flex align-items-center', onClick: openAddModal, disabled: courseData.length >= maxCourses,}}>
                            <Plus style={{ width: '18px', height: '18px' }} className='me-2' /> Add Course
                        </Btn>
                        <Modal isOpen={addModal} toggle={closeAddModal} size="xl" centered>
                            <ModalBody>
                                <AddCourse onClose={closeAddModal} />
                            </ModalBody>
                        </Modal>
                    </CardHeader>
                    <div className="card-block row">
                        <Col sm="12" lg="12" xl="12">
                            <div className="table-responsive">
                                <Table className='table-light'>
                                    <thead>
                                        <tr>
                                            <th scope="col">Title</th>
                                            <th scope="col">Link</th>
                                            <th scope="col">Thumbnail</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingTableData && (
                                            <tr>
                                                <th colSpan="11" className="text-center">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        )}
                                        {courseData.length === 0 && !loadingTableData && (
                                            <tr>
                                                <td colSpan="11" className="text-center"><b>No Data Available</b></td>
                                            </tr>
                                        )}
                                        {courseData && courseData.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.title}</td>
                                                <td>{item.link}</td>
                                                <td>{item.imageLoaded ? <img src={item.image} width={90} height={70} loading='lazy' alt="Thumbnail" style={{borderRadius: '10px'}}/> : 'Loading...'}</td>
                                                <td>
                                                    <span>
                                                        <Btn attrBtn={{ className: "btn btn-pill btn-air-success btn-success", color: "primary", onClick: () => openEditModal(item) }} >
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Edit size={16} />
                                                            </div>
                                                        </Btn>
                                                    </span>&nbsp;&nbsp;&nbsp;
                                                    <Modal isOpen={editModal} toggle={closeEditModal} size="xl" centered>
                                                        <ModalBody>
                                                            <EditCourse course={selectedCourse} onClose={closeEditModal} />
                                                        </ModalBody>
                                                    </Modal>
                                                    <span>
                                                        <Btn attrBtn={{ className: "btn btn-pill btn-air-secondary btn-secondary", onClick: () => handleDelete(item._id) }} >
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Trash2 size={16} />
                                                            </div>
                                                        </Btn>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </div>
                </Card>
            </Col>
        </Fragment>
    )
}

export default Course;