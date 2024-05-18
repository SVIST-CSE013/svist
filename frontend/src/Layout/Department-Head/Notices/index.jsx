import React, { Fragment , useState, useEffect } from 'react';
import { Plus } from 'react-feather';
import { Col, Card, CardHeader, Table, Modal, ModalBody, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { Btn, H3 } from '../../../AbstractElements';
import { baseApiURL } from '../../../baseUrl';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated } from "../../../redux/authRedux";
import { Eye } from 'react-feather';
import { Edit } from 'react-feather';
import { Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import AddNotice from './AddNotice';
import EditNotice from "./EditNotice";
import Swal from 'sweetalert2';

const Notice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [notices, setNotices] = useState([]);
    const [refreshTable, setRefreshTable] = useState(false);
    const [loadingTableData, setLoadingTableData] = useState(true);

    useEffect(() => {
        const checkDepartmentAdminAuthorization = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/departmentRoutes`, {
                    withCredentials: true,
                });

                const data = response.data;

                if (data.authenticated) {
                    dispatch(setAuthenticated(true));
                    window.history.pushState(null, null, window.location.pathname);
                } else {
                    navigate(`${process.env.PUBLIC_URL}/departmentlogin`, { replace: true });
                }

            } catch (error) {
                navigate(`${process.env.PUBLIC_URL}/departmentlogin`, { replace: true });
            }
        };

        checkDepartmentAdminAuthorization();

        const handleBackButton = () => {
            window.history.forward();
        };

        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };

    }, [dispatch, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${baseApiURL()}/getFilteredNotice`, {
                    type: ['Faculty Notice Panel', 'Student Notice Panel']
                });
                const sortedNotices = response.data.notice.sort((a, b) => {
                    const dateA = a.date.split('/').reverse().join('/');
                    const dateB = b.date.split('/').reverse().join('/');
                    return new Date(dateB) - new Date(dateA);
                });
                setTimeout(() => {
                    setNotices(sortedNotices);
                    setLoadingTableData(false);
                }, 1000);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Notices!',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchData();
    }, [refreshTable]);

    const handleDelete = async (noticeId) => {
        try {
            const confirmed = await confirmDelete();
            if(confirmed){
                const response = await axios.post(`${baseApiURL()}/deletenoticedetails/${noticeId}`);
                setNotices((prevNotices) => prevNotices.filter((notice) => notice._id !== noticeId));

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Notice has been successfully deleted.',
                    confirmButtonText: 'OK'
                });
            }
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Deleting Notice!',
                confirmButtonText: 'OK'
            });
        }
    };

    const confirmDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Notice!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        return result.isConfirmed;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const openAddModal = () => {
        setAddModal(true);
    };

    const closeAddModal = () => {
        setAddModal(false);
        setRefreshTable(true);
    };

    const openEditModal = (notice) => {
        setSelectedNotice(notice);
        setEditModal(true);
    };

    const closeEditModal = () => {
        setSelectedNotice(null);
        setEditModal(false);
        setRefreshTable(true);
    };

    useEffect(() => {
        setRefreshTable(false);
    }, [refreshTable]);

    return (
        <Fragment>
            <span>&nbsp;</span>
            <Col sm="12">
                <Card>
                    <CardHeader>
                        <H3>Notice List</H3>
                        <span>&nbsp;</span>
                        <Btn attrBtn={{ color: 'primary d-flex align-items-center', className: "btn btn-air-primary", onClick: openAddModal}}>
                            <Plus style={{ width: '18px', height: '18px' }} className='me-2' /> Add New
                        </Btn>
                        <Modal isOpen={addModal} toggle={closeAddModal} size="xl" centered>
                            <ModalBody>
                                <AddNotice onClose={closeAddModal} />
                            </ModalBody>
                        </Modal>
                    </CardHeader>
                    <div className="card-block row">
                        <Col sm="12" lg="12" xl="12">
                            <div className='table-responsive'>
                                <Table>
                                    <thead>
                                        <tr className='border-bottom-primary'>
                                            <th scope='col'>Title</th>
                                            <th scope='col'>Description</th>
                                            <th scope='col'>Notice Visible To</th>
                                            <th scope='col'>Date</th>
                                            <th scope='col'>View File</th>
                                            <th scope='col'>Action</th>
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
                                        {notices.length === 0 && !loadingTableData && (
                                            <tr>
                                                <td colSpan="6" className="text-center"><b>No Data Available</b></td>
                                            </tr>
                                        )}
                                        {notices.slice(indexOfFirstItem, indexOfLastItem).map((item) => (
                                        <tr key={item.id} className={`border-bottom-primary`}>
                                            <td>{item.title}</td>
                                            <td>{item.description}</td>
                                            <td>{item.type}</td>
                                            <td>{item.date}</td>
                                            <td>
                                                <Link to={item.file} target='_blank'>
                                                    <Btn attrBtn={{ className: "btn btn-pill btn-air-success btn-sm", color: "success" }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Eye size={16} />
                                                        </div>
                                                    </Btn>
                                                </Link>
                                            </td>
                                            <td>
                                                <span>
                                                    <Btn attrBtn={{ className: "btn btn-pill btn-air-success btn-success", color: "primary", onClick: () => openEditModal(item) }} >
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Edit size={16} />
                                                        </div>
                                                    </Btn>
                                                </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <Modal isOpen={editModal} toggle={closeEditModal} size="xl" centered>
                                                        <ModalBody>
                                                            <EditNotice notice={selectedNotice} onClose={closeEditModal} />
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
                                <div className="d-flex justify-content-center">
                                    <Pagination>
                                        <PaginationItem disabled={currentPage === 1}>
                                            <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                                        </PaginationItem>
                                        {[...Array(Math.ceil(notices.length / itemsPerPage))].map((_, i) => (
                                            <PaginationItem key={i} active={i + 1 === currentPage}>
                                                <PaginationLink onClick={() => handlePageChange(i + 1)}>
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem disabled={currentPage === Math.ceil(notices.length / itemsPerPage)}>
                                            <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                                        </PaginationItem>
                                    </Pagination>
                                </div>
                            </div>
                        </Col>
                    </div>
                </Card>
            </Col>
        </Fragment>
    )
}

export default Notice;