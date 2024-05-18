import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, CardHeader, Table, Pagination, PaginationItem, PaginationLink, Input, InputGroup, InputGroupText } from "reactstrap";
import { H3 } from '../../../AbstractElements';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated } from "../../../redux/authRedux";
import { baseApiURL } from '../../../baseUrl';
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';

const Subject = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [department, setDepartment] = useState();
    const [semester, setSemester] = useState();
    const [subjects, setSubjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [searchValue, setSearchValue] = useState('');
    const [loadingTableData, setLoadingTableData] = useState(true);

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
                setName(data.name);
                setEmail(data.email);
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
    }, [name, email, department]);

    useEffect(() => {
        const FetchData = async () => {
            try {
                const response = await axios.post(`${baseApiURL()}/getFilteredStudentDetails`, { fullName: name, email: email });
                const firstItem = response.data.student[0];
                setSemester(firstItem.semester);

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Student Details!',
                    confirmButtonText: 'OK'
                });
            }
        };

        if (name && email) {
            FetchData();
        }

    }, [name, email])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${baseApiURL()}/getFilteredSubjectDetails`, { deptname: department, semester: semester });
                setTimeout(() => {
                    setSubjects(response.data.subject);
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
    }, [department , semester]);


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
                                            <th className='text-center' scope='col'>Semester</th>
                                            <th className='text-center' scope='col'>Assigned Faculty</th>
                                            <th className='text-center' scope='col'>Assigned Lectures</th>
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
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.semester}</td>
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.faculty}</td>
                                                <td className={`${isMobile ? 'text-center' : 'text-center align-middle'}`}>{item.lectures}</td>
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