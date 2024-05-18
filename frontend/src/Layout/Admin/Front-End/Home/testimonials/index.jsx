import React, { Fragment , useState, useEffect } from 'react';
import { Plus } from 'react-feather';
import axios from 'axios';
import { Col, Card, CardHeader, Table, Modal, ModalBody } from "reactstrap";
import { Btn, H3 } from '../../../../../AbstractElements';
import { baseApiURL } from '../../../../../baseUrl';
import { Edit } from 'react-feather';
import { Trash2 } from 'react-feather';
import AddTestimonial from "./AddTestimonial";
import EditTestimonial from "./EditTestimonial";
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';


const Testimonial = () => {
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [testimonialData , setTestimonialData] = useState([]);
    const [loadingTableData, setLoadingTableData] = useState(true);
    const [refreshTable, setRefreshTable] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${baseApiURL()}/gettestimonialdetails`);
            setTimeout(() => {
                setTestimonialData(response.data);
                setLoadingTableData(false);
            }, 1000);
          } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Testimonial Details!',
                    confirmButtonText: 'OK'
                });
          }
        };
    
        fetchData();
    }, [refreshTable]);

    const handleDelete = async (testimonialId) => {
        try {
            const confirmed = await confirmDelete();
            if(confirmed){
                const response = await axios.post(`${baseApiURL()}/deleteTestimonialDetails/${testimonialId}`);
                setTestimonialData((prevTestimonials) => prevTestimonials.filter((testimonial) => testimonial._id !== testimonialId));

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Testimonial has been successfully deleted.',
                    confirmButtonText: 'OK'
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Deleting Testimonial Item!',
                confirmButtonText: 'OK'
            });
        }
    };

    const confirmDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Item Data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        return result.isConfirmed;
    };

    const openAddModal = () => {
        setAddModal(true);
    };

    const closeAddModal = () => {
        setAddModal(false);
        setRefreshTable(true);
    };

    const openEditModal = (testimonial) => {
        setSelectedTestimonial(testimonial);
        setEditModal(true);
    };

    const closeEditModal = () => {
        setSelectedTestimonial(null);
        setRefreshTable(true);
        setEditModal(false);
    };

    useEffect(() => {
        setRefreshTable(false);
    }, [refreshTable]);

    useEffect(() => {
        const loadImage = (item) => {
            const img = new Image();
            img.src = item.profileimage;
            img.onload = () => {
                setTestimonialData((prevTestimonials) => {
                    return prevTestimonials.map((testimonial) => {
                        if (testimonial._id === item._id) {
                            return { ...testimonial, imageLoaded: true };
                        }
                        return testimonial;
                    });
                });
            };
        };

        testimonialData.forEach((item) => {
            if (!item.imageLoaded) {
                loadImage(item);
            }
        });
    }, [testimonialData]);

    return (
        <Fragment>
            <span>&nbsp;</span>
            <Col sm="12">
                <Card>
                    <CardHeader>
                        <H3>Testimonials List</H3>
                        <span>&nbsp;</span>
                        <Btn attrBtn={{ color: 'primary d-flex align-items-center', onClick: openAddModal}}>
                            <Plus style={{ width: '18px', height: '18px' }} className='me-2' /> Add New Testimonial
                        </Btn>
                        <Modal isOpen={addModal} toggle={closeAddModal} size="xl" centered>
                            <ModalBody>
                                <AddTestimonial onClose={closeAddModal} />
                            </ModalBody>
                        </Modal>
                    </CardHeader>
                    <div className="card-block row">
                        <Col sm="12" lg="12" xl="12">
                            <div className="table-responsive">
                                <Table className='table-light'>
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Designation</th>
                                            <th scope="col">Description</th>
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
                                        {testimonialData.length === 0 && !loadingTableData && (
                                            <tr>
                                                <td colSpan="11" className="text-center"><b>No Data Available</b></td>
                                            </tr>
                                        )}
                                        {testimonialData && testimonialData.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td>{item.designation}</td>
                                                <td>{item.description}</td>
                                                <td>{item.imageLoaded ? <img src={item.profileimage} width={90} height={70} alt="Thumbnail" style={{borderRadius: '10px'}}/> : 'Loading...'}</td>
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
                                                            <EditTestimonial testimonial={selectedTestimonial} onClose={closeEditModal} />
                                                        </ModalBody>
                                                    </Modal>
                                                    <br />
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
            <Toaster position="bottom-center" />
        </Fragment>
    )
}

export default Testimonial;