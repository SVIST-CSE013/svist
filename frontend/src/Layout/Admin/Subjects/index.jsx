import React, { Fragment, useState, useEffect } from 'react';
import { Plus } from 'react-feather';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Row, Col, Card, CardHeader, Table, Modal, ModalBody, Pagination, PaginationItem, PaginationLink, Input, InputGroup, InputGroupText } from "reactstrap";
import { Btn, H3 } from '../../../AbstractElements';
import { setAuthenticated } from "../../../redux/authRedux";
import { Edit } from 'react-feather';
import { Trash2 } from 'react-feather';
import AddSubject from './AddSubject';
import EditSubject from './EditSubject';
import { baseApiURL } from '../../../baseUrl';
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';

const Subject = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [refreshTable, setRefreshTable] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [loadingTableData, setLoadingTableData] = useState(true);

    useEffect(() => {
        const checkAdminAuthorization = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/adminRoutes`, {
                    withCredentials: true,
                });

                const data = response.data;

                if (data.authenticated) {
                    dispatch(setAuthenticated(true));
                    window.history.pushState(null, null, window.location.pathname);
                } else {
                    navigate(`${process.env.PUBLIC_URL}/adminlogin`, { replace: true });
                }

            } catch (error) {
                navigate(`${process.env.PUBLIC_URL}/adminlogin`, { replace: true });
            }
        };

        checkAdminAuthorization();

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
                const response = await axios.get(`${baseApiURL()}/getSubject`);
                setTimeout(() => {
                    setSubjects(response.data);
                    setLoadingTableData(false);
                }, 1000);

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Subject Details!',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchData();
    }, [refreshTable]);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const handleDelete = async (subjectId) => {
        try {
            const confirmed = await confirmDelete();
            if (confirmed) {
                const response = await axios.post(`${baseApiURL()}/deleteSubject/${subjectId}`);

                setSubjects((prevSubjects) => prevSubjects.filter((subject) => subject._id !== subjectId));
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Subject has been successfully deleted.',
                    confirmButtonText: 'OK'
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Deleting Subject!',
                confirmButtonText: 'OK'
            });
        }
    };

    const confirmDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Subject!',
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

    const openEditModal = (subject) => {
        setSelectedSubject(subject);
        setEditModal(true);
    };

    const closeEditModal = () => {
        setSelectedSubject(null);
        setEditModal(false);
        setRefreshTable(true);
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setCurrentPage(1);
    };

    const applySearchFilter = (item) => {
        const searchTerm = searchValue.toLowerCase();
        return (
            item.subcode.toLowerCase().includes(searchTerm) ||
            item.subname.toLowerCase().includes(searchTerm) ||
            item.deptname.toLowerCase().includes(searchTerm) ||
            item.semester.toLowerCase().includes(searchTerm) ||
            item.faculty.toLowerCase().includes(searchTerm)
        );
    };

    return (
        <Fragment>
            <span>&nbsp;</span>
            <Col sm="12">
                <Card>
                    <CardHeader>
                        <H3>Subject List</H3>
                        <span>&nbsp;</span>
                        <Btn attrBtn={{ color: 'primary d-flex align-items-center', className: "btn btn-air-primary", onClick: openAddModal }}>
                            <Plus style={{ width: '18px', height: '18px' }} className='me-2' /> Add New Subject
                        </Btn>
                        <Modal isOpen={addModal} toggle={closeAddModal} size="xl" centered>
                            <ModalBody>
                                <AddSubject onClose={closeAddModal} />
                            </ModalBody>
                        </Modal>
                    </CardHeader>
                    <br />
                    <div className={`card-block row ${isMobile ? 'flex-column' : 'flex-row'}`} style={{ paddingLeft: '18px', paddingRight: '18px' }}>
                        <Col sm="12" lg="12" xl="12">
                            <br />
                            <Row className={`d-flex ${isMobile ? 'flex-column' : 'justify-content-center'} ${isMobile ? 'm-4' : ''}`}>
                                <Col sm="12" xl={isMobile ? "12" : "6"}>
                                    <InputGroup>
                                        <InputGroupText>
                                            <i className="fa fa-search"></i>
                                        </InputGroupText>
                                        <Input
                                            style={{ border: '1px solid #343a40' }}
                                            type="text"
                                            name="subname"
                                            placeholder="Search Anything"
                                            onChange={handleSearchChange}
                                            value={searchValue}
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <br /><br />
                            <div className={`table-responsive ${isMobile ? 'mb-3' : ''}`}>
                                <Table>
                                    <thead>
                                        <tr className='border-bottom-primary'>
                                            <th className='text-center' scope='col'>Subject Code</th>
                                            <th className='text-center' scope='col'>Subject Name</th>
                                            <th className='text-center' scope='col'>Department</th>
                                            <th className='text-center' scope='col'>Semester</th>
                                            <th className='text-center' scope='col'>Assigned Faculty</th>
                                            <th className='text-center' scope='col'>Lectures</th>
                                            <th className='text-center' scope='col'>Action</th>
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
                                        {subjects.filter(applySearchFilter).length === 0 && !loadingTableData && (
                                            <tr>
                                                <td colSpan="11" className="text-center"><b>No Data Available</b></td>
                                            </tr>
                                        )}
                                        {subjects.filter(applySearchFilter).slice(indexOfFirstItem, indexOfLastItem).map((item) => (
                                            <tr key={item._id} className={`border-bottom-primary`}>
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.subcode}</td>
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.subname}</td>
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.deptname}</td>
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.semester}</td>
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.faculty}</td>
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.lectures}</td>
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
                                                            <EditSubject subject={selectedSubject} onClose={closeEditModal} />
                                                        </ModalBody>
                                                    </Modal>
                                                    <br /><br />
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
                            <div className="d-flex justify-content-center">
                                <Pagination>
                                    <PaginationItem disabled={currentPage === 1}>
                                        <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                                    </PaginationItem>
                                    {[...Array(Math.ceil(subjects.filter(applySearchFilter).length / itemsPerPage))].map((_, i) => (
                                        <PaginationItem key={i} active={i + 1 === currentPage}>
                                            <PaginationLink onClick={() => handlePageChange(i + 1)}>
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem disabled={currentPage === Math.ceil(subjects.filter(applySearchFilter).length / itemsPerPage)}>
                                        <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                                    </PaginationItem>
                                </Pagination>
                            </div>
                        </Col>
                    </div>
                </Card>
            </Col>
        </Fragment>
    )
}

export default Subject;