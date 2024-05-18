import React, { Fragment , useState, useEffect } from 'react';
import { Plus } from 'react-feather';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Card, CardHeader, Table, Modal, ModalBody, Pagination, PaginationLink, PaginationItem } from "reactstrap";
import { Btn, H3 } from '../../../AbstractElements';
import AddTimetable from "./AddTimetable";
import EditTimetable from "./EditTimetable";
import axios from 'axios';
import { setAuthenticated } from "../../../redux/authRedux";
import { Link } from 'react-router-dom';
import { Eye } from 'react-feather';
import { Edit } from 'react-feather';
import { Trash2 } from 'react-feather';
import { baseApiURL } from '../../../baseUrl';
import Swal from 'sweetalert2';

const Timetable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedTimetable, setSelectedTimetable] = useState(null);
    const [timetable, setTimetable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [loadingTableData, setLoadingTableData] = useState(true);
    const [refreshTable, setRefreshTable] = useState(false);

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
                const response = await axios.get(`${baseApiURL()}/getTimetableDetails`);
                const sortedTimetables = response.data.sort((a, b) => {
                    const dateA = a.date.split('/').reverse().join('/');
                    const dateB = b.date.split('/').reverse().join('/');
                    return new Date(dateB) - new Date(dateA);
                });
                setTimeout(() => {
                    setTimetable(sortedTimetables);
                    setLoadingTableData(false);
                }, 1000);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Timetable Details!',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchData();
    }, [refreshTable]);

    const handleDelete = async (timetableId) => {
        try {
            const confirmed = await confirmDelete();
            if(confirmed){
                const response = await axios.post(`${baseApiURL()}/deleteTimetableDetails/${timetableId}`);
                setTimetable((prevTimetable) => prevTimetable.filter((timetable) => timetable._id !== timetableId));

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Timetable has been successfully deleted.',
                    confirmButtonText: 'OK'
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Deleting Timetable!',
                confirmButtonText: 'OK'
            });
        }
    };

    const confirmDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Timetable!',
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

    const openEditModal = (timetable) => {
        setSelectedTimetable(timetable);
        setEditModal(true);
    };

    const closeEditModal = () => {
        setSelectedTimetable(null);
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
                        <H3>Timetable Section</H3>
                        <span>&nbsp;</span>
                        <Btn attrBtn={{ color: 'primary d-flex align-items-center', className: "btn btn-air-primary", onClick: openAddModal}}>
                            <Plus style={{ width: '18px', height: '18px' }} className='me-2' /> Add New Timetable
                        </Btn>
                        <Modal isOpen={addModal} toggle={closeAddModal} size="xl" centered>
                            <ModalBody>
                                <AddTimetable onClose={closeAddModal} />
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
                                            <th scope="col">Department</th>
                                            <th scope="col">Semester</th>
                                            <th scope="col">Published</th>
                                            <th scope="col">View File</th>
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
                                        {timetable.length === 0 && !loadingTableData && (
                                            <tr>
                                                <td colSpan="11" className="text-center"><b>No Data Available</b></td>
                                            </tr>
                                        )}
                                        {
                                            timetable.slice(indexOfFirstItem, indexOfLastItem).map((item) => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{item.title}</td>
                                                        <td>{item.department}</td>
                                                        <td>{item.semester}</td>
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
                                                          </span>&nbsp;&nbsp;&nbsp;
                                                          <Modal isOpen={editModal} toggle={closeEditModal} size="xl" centered>
                                                              <ModalBody>
                                                                  <EditTimetable timetable={selectedTimetable} onClose={closeEditModal} />
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
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <div className="d-flex justify-content-center">
                                    <Pagination>
                                        <PaginationItem disabled={currentPage === 1}>
                                            <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                                        </PaginationItem>
                                        {[...Array(Math.ceil(timetable.length / itemsPerPage))].map((_, i) => (
                                            <PaginationItem key={i} active={i + 1 === currentPage}>
                                                <PaginationLink onClick={() => handlePageChange(i + 1)}>
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem disabled={currentPage === Math.ceil(timetable.length / itemsPerPage)}>
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

export default Timetable;


