import React, { Fragment, useState, useEffect } from 'react';
import { Col, Card, CardHeader, Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { Btn, H3 } from '../../../AbstractElements';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated } from "../../../redux/authRedux";
import { Link } from 'react-router-dom';
import { FileText } from 'react-feather';
import { baseApiURL } from '../../../baseUrl';

const Timetable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [department, setDepartment] = useState();
    const [timetable, setTimetable] = useState([]);
    const [loadingTableData, setLoadingTableData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);

    useEffect(() => {
        const checkStudentAuthorization = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/studentRoutes`, {
                    withCredentials: true,
                });

                const data = response.data;

                if (data.authenticated) {
                    dispatch(setAuthenticated(true));
                    window.history.pushState(null, null, window.location.pathname);
                } else {
                    navigate(`${process.env.PUBLIC_URL}/studentlogin`, { replace: true });
                }

            } catch (error) {
                navigate(`${process.env.PUBLIC_URL}/studentlogin`, { replace: true });
            }
        };

        checkStudentAuthorization();

        const handleBackButton = () => {
            window.history.forward();
        };

        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };

    }, [dispatch, navigate]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/checkauthentication`, {
                    withCredentials: true,
                });

                const data = response.data.user;
                setDepartment(data.department);

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching User Details!',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchUserDetails();
    }, [department]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${baseApiURL()}/getFilteredTimetable`, {
                    department: department
                });
                const sortedTimetables = response.data.timetable.sort((a, b) => {
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
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    return (
        <Fragment>
            <span>&nbsp;</span>
            <Col sm="12">
                <Card>
                    <CardHeader>
                        <H3>Timetable Section</H3>
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
                                                                        <FileText size={16} />
                                                                    </div>
                                                                </Btn>
                                                            </Link>
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


