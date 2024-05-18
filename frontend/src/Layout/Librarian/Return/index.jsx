import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, CardHeader, Table, Input, InputGroup, InputGroupText, Pagination, PaginationItem, PaginationLink, Media, Label } from "reactstrap";
import Swal from 'sweetalert2';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated } from "../../../redux/authRedux";
import { H3 } from '../../../AbstractElements';
import { baseApiURL } from '../../../baseUrl';

const Book = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [issuedbooks, setIssuedBooks] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [loadingTableData, setLoadingTableData] = useState(true);

    useEffect(() => {
        const checkLibraryAdminAuthorization = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/librarianRoutes`, {
                    withCredentials: true,
                });

                const data = response.data;

                if (data.authenticated) {
                    dispatch(setAuthenticated(true));
                    window.history.pushState(null, null, window.location.pathname);
                } else {
                    navigate(`${process.env.PUBLIC_URL}/librarianlogin`, { replace: true });
                }

            } catch (error) {
                navigate(`${process.env.PUBLIC_URL}/librarianlogin`, { replace: true });
            }
        };

        checkLibraryAdminAuthorization();

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
                const response = await axios.get(`${baseApiURL()}/getIssueBookDetails`);
                setTimeout(() => {
                    setIssuedBooks(response.data);
                    setLoadingTableData(false);
                }, 1000);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Issued Book Details!',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchData();
    }, []);

    const handleReturnToggle = async (bookId) => {
        try {
            const returnDateValue = new Date().toLocaleDateString('en-GB');
            const response = await axios.post(`${baseApiURL()}/updateBookStatus/${bookId}`, { status: 'Returned', returnDate: returnDateValue });
            const updatedBooks = issuedbooks.map(book => {
                if (book._id === bookId) {
                    return { ...book, status: 'Returned', returnDate: returnDateValue };
                }
                return book;
            });
            setIssuedBooks(updatedBooks);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Book Returned Successfully!',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Returning Book!',
                confirmButtonText: 'OK'
            });
        }
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
        return (
            item.isbnNo.toLowerCase().includes(searchTerm) ||
            item.book.toLowerCase().includes(searchTerm) ||
            item.fullName.toLowerCase().includes(searchTerm) ||
            item.semester.toLowerCase().includes(searchTerm) ||
            item.department.toLowerCase().includes(searchTerm)
        );
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const currentDate = new Date();
            const formattedCurrentDate = formatDate(currentDate);
            const updatedBooks = issuedbooks.map(book => {
                if (book.status === 'Issued' && isDueDateExceeded(book.due, formattedCurrentDate)) {
                    handleDelayToggle(book._id);
                    return { ...book, status: 'Delayed' };
                }
                return book;
            });
            setIssuedBooks(updatedBooks);
        }, 120000);

        return () => clearInterval(timer);
    }, [issuedbooks]);

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const isDueDateExceeded = (dueDate, currentDate) => {
        const [dueDay, dueMonth, dueYear] = dueDate.split('/').map(Number);
        const [currentDay, currentMonth, currentYear] = currentDate.split('/').map(Number);

        if (currentYear > dueYear) {
            return true;
        } else if (currentYear === dueYear) {
            if (currentMonth > dueMonth) {
                return true;
            } else if (currentMonth === dueMonth) {
                if (currentDay > dueDay) {
                    return true;
                }
            }
        }
        return false;
    };

    const handleDelayToggle = async (bookId) => {
        try {
            const response = await axios.post(`${baseApiURL()}/updateBookStatus/${bookId}`, { status: 'Delayed' });
        } catch (error) {
            console.log();
        }
    };

    return (
        <Fragment>
            <span>&nbsp;</span>
            <Col sm="12">
                <Card>
                    <CardHeader>
                        <H3>Return List</H3>
                    </CardHeader>
                    <br /><br />
                    <div className="card-block row">
                        <Col sm="12" lg="12" xl="12">
                            <div className='table-responsive'>
                                <Row className='d-flex justify-content-center'>
                                    <Col sm="12" xl="6">
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
                                <Table>
                                    <thead>
                                        <tr className='border-bottom-primary'>
                                            <th scope='col'>ISBN No.</th>
                                            <th scope='col'>Book Name</th>
                                            <th scope='col'>Enrollment No.</th>
                                            <th scope='col'>Student Name</th>
                                            <th scope='col'>Department</th>
                                            <th scope='col'>Semester</th>
                                            <th scope='col'>Due Date</th>
                                            <th scope='col'>Return</th>
                                            <th scope='col'>Status</th>
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
                                        {issuedbooks.filter(applySearchFilter).length === 0 && !loadingTableData && (
                                            <tr>
                                                <td colSpan="11" className="text-center"><b>No Data Available</b></td>
                                            </tr>
                                        )}
                                        {issuedbooks.filter(applySearchFilter).slice(indexOfFirstItem, indexOfLastItem).map((item) => (
                                            <tr key={item.id} className={`border-bottom-primary`}>
                                                <td>{item.isbnNo}</td>
                                                <td>{item.book}</td>
                                                <td>{item.enrollmentNo}</td>
                                                <td>{item.fullName}</td>
                                                <td>{item.department}</td>
                                                <td>{item.semester}</td>
                                                <td>{item.due}</td>
                                                <td>{item.returnDate}</td>
                                                <td>
                                                    {item.status === 'Issued' || item.status === 'Returned' ? (
                                                        <span className="badge badge-light-success" style={{ fontSize: "12px" }}>{item.status}</span>
                                                    ) : (
                                                        <span className="badge badge-light-warning" style={{ fontSize: "12px" }}>{item.status}</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <Media className="text-end icon-state">
                                                        <Label className="switch-success">
                                                            <Input
                                                                type="checkbox"
                                                                name='return'
                                                                checked={item.status === 'Returned'}
                                                                onChange={() => {
                                                                    handleReturnToggle(item._id);
                                                                }}
                                                            />
                                                            <span className="switch-success-state"></span>
                                                        </Label>
                                                    </Media>
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
                                    {[...Array(Math.ceil(issuedbooks.filter(applySearchFilter).length / itemsPerPage))].map((_, i) => (
                                        <PaginationItem key={i} active={i + 1 === currentPage}>
                                            <PaginationLink onClick={() => handlePageChange(i + 1)}>
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem disabled={currentPage === Math.ceil(issuedbooks.filter(applySearchFilter).length / itemsPerPage)}>
                                        <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                                    </PaginationItem>
                                </Pagination>
                            </div>
                        </Col>
                    </div>
                </Card>
            </Col>
        </Fragment>
    );
}

export default Book;