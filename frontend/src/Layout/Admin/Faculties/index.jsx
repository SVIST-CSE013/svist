import React, { Fragment , useState, useEffect } from 'react';
import { Plus } from 'react-feather';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Edit , Eye } from 'react-feather';
import { Trash2 } from 'react-feather';
import { Row, Input, InputGroup, InputGroupText, Pagination, PaginationItem, PaginationLink, Col, Card, CardHeader, Table, Modal, ModalBody } from "reactstrap";
import { Btn, H3 } from '../../../AbstractElements';
import { setAuthenticated } from "../../../redux/authRedux";
import { baseApiURL } from '../../../baseUrl';
import AddFaculty from './AddFaculty';
import EditFaculty from "./EditFaculty";
import FacultyDetails from "./FacultyDetails";
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';

const Faculty = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [facultyDetailsModal, setFacultyDetailsModal] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [faculties, setFaculties] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [refreshTable, setRefreshTable] = useState(false);
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
            const response = await axios.get(`${baseApiURL()}/getFacultyDetails`);
            setTimeout(() => {
                setFaculties(response.data);
                setLoadingTableData(false);
            }, 1000);
          } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Faculty Details!',
                    confirmButtonText: 'OK'
                });
          }
        };
    
        fetchData();
    }, [refreshTable]);

    const handleDelete = async (facultyId) => {
        try {
            const confirmed = await confirmDelete();
            if(confirmed){
                const response = await axios.post(`${baseApiURL()}/deleteFacultyDetails/${facultyId}`);

                setFaculties((prevFaculties) => prevFaculties.filter((faculty) => faculty._id !== facultyId));
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Faculty data has been successfully deleted.',
                    confirmButtonText: 'OK'
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Deleting Faculty!',
                confirmButtonText: 'OK'
            });
        }
    };

    const confirmDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this faculty data!',
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

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setCurrentPage(1);
    };

    const applySearchFilter = (item) => {
        const searchTerm = searchValue.toLowerCase();
        const facultyIdString = item.facultyId.toString();
        return (
            (item.fullName && item.fullName.toLowerCase().includes(searchTerm)) ||
            (facultyIdString.includes(searchTerm)) ||
            item.department.toLowerCase().includes(searchTerm)
        );
    };
    

    const openAddModal = () => {
        setAddModal(true);
    };

    const closeAddModal = () => {
        setAddModal(false);
        setRefreshTable(true);
    };

    const openEditModal = (faculty) => {
        setSelectedFaculty(faculty);
        setEditModal(true);
    };

    const closeEditModal = () => {
        setSelectedFaculty(null);
        setEditModal(false);
        setRefreshTable(true);
    };

    const openFacultyDetailsModal = (faculty) => {
        setSelectedFaculty(faculty);
        setFacultyDetailsModal(true);
    };

    const closeFacultyDetailsModal = () => {
        setSelectedFaculty(null);
        setFacultyDetailsModal(false);
    };

    useEffect(() => {
        setRefreshTable(false);
    }, [refreshTable]);

    useEffect(() => {
        const loadImage = (item) => {
            const img = new Image();
            img.src = item.profile;
            img.onload = () => {
                setFaculties((prevFaculties) => {
                    return prevFaculties.map((faculty) => {
                        if (faculty._id === item._id) {
                            return { ...faculty, imageLoaded: true };
                        }
                        return faculty;
                    });
                });
            };
        };

        faculties.forEach((item) => {
            if (!item.imageLoaded) {
                loadImage(item);
            }
        });
    }, [faculties]);

    return (
        <Fragment>
            <span>&nbsp;</span>
            <Col sm="12">
                <Card>
                    <CardHeader>
                        <H3>Faculty List</H3>
                        <span>&nbsp;</span>
                        <Btn attrBtn={{ color: 'primary d-flex align-items-center', className: "btn btn-air-primary", onClick: openAddModal}}>
                            <Plus style={{ width: '18px', height: '18px' }} className='me-2' /> Add New Faculty
                        </Btn>
                        <Modal isOpen={addModal} toggle={closeAddModal} size="xl" centered>
                            <ModalBody>
                                <AddFaculty onClose={closeAddModal} />
                            </ModalBody>
                        </Modal>
                    </CardHeader>
                    <div className={`card-block row ${isMobile ? 'flex-column' : 'flex-row'}`}>
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
                                            <th className='text-center' scope='col'>FacultyId</th>
                                            <th className='text-center' scope='col'>Full Name</th>
                                            <th className='text-center' scope='col'>Department</th>
                                            <th className='text-center' scope='col'>Thumbnail</th>
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
                                        {faculties.filter(applySearchFilter).length === 0 && !loadingTableData && (
                                            <tr>
                                                <td colSpan="6" className="text-center"><b>No Data Available</b></td>
                                            </tr>
                                        )}
                                        {faculties.filter(applySearchFilter).slice(indexOfFirstItem, indexOfLastItem).map((item) => (
                                            <tr key={item.id} className={`border-bottom-primary`}>
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.facultyId}</td>
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.fullName}</td>
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.department}</td>
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.imageLoaded ? <img src={item.profile} width={65} height={65} alt="Thumbnail" style={{ borderRadius: '10px' }} /> : 'Loading...'}</td>
                                                <td className={`${isMobile ? '' : 'text-center align-middle'}`}>
                                                    <span>
                                                        <Btn attrBtn={{ className: "btn btn-pill btn-air-success btn-sm", color: "success", onClick: () => openFacultyDetailsModal(item) }} >
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Eye size={16} />
                                                            </div>
                                                        </Btn>
                                                    </span>&nbsp;&nbsp;&nbsp;
                                                    <Modal isOpen={facultyDetailsModal} toggle={closeFacultyDetailsModal} size="xl" centered>
                                                        <ModalBody>
                                                            <FacultyDetails faculty={selectedFaculty} onClose={closeFacultyDetailsModal} />
                                                        </ModalBody>
                                                    </Modal>
                                                    <span>
                                                        <Btn attrBtn={{ className: "btn btn-pill btn-air-success btn-sm", color: "primary", onClick: () => openEditModal(item) }} >
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Edit size={16} />
                                                            </div>
                                                        </Btn>
                                                    </span>&nbsp;&nbsp;&nbsp;
                                                    <Modal isOpen={editModal} toggle={closeEditModal} size="xl" centered>
                                                        <ModalBody>
                                                            <EditFaculty faculty={selectedFaculty} onClose={closeEditModal} />
                                                        </ModalBody>
                                                    </Modal>
                                                    <span>
                                                        <Btn attrBtn={{ className: "btn btn-pill btn-air-danger btn-sm", onClick: () => handleDelete(item._id) }} >
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
                                        {[...Array(Math.ceil(faculties.filter(applySearchFilter).length / itemsPerPage))].map((_, i) => (
                                            <PaginationItem key={i} active={i + 1 === currentPage}>
                                                <PaginationLink onClick={() => handlePageChange(i + 1)}>
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem disabled={currentPage === Math.ceil(faculties.filter(applySearchFilter).length / itemsPerPage)}>
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

export default Faculty;