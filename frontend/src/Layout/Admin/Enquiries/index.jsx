import React, { Fragment , useState , useEffect} from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Row , Col, Card, CardHeader, Table, Pagination, PaginationItem, PaginationLink, Input, InputGroup, InputGroupText } from "reactstrap";
import { Btn, H3 } from '../../../AbstractElements';
import { Trash2 } from 'react-feather';
import { baseApiURL } from '../../../baseUrl';
import Swal from 'sweetalert2';
import { setAuthenticated } from "../../../redux/authRedux";

const Enquiry = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [enquiries, setEnquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
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
            const response = await axios.get(`${baseApiURL()}/getEnquiries`);
            setTimeout(() => {
                setEnquiries(response.data);
                setLoadingTableData(false);
            }, 1000);
          } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Enquiry Details!',
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


    const handleDelete = async (enquiryId) => {
        try {
            const confirmed = await confirmDelete();
            if(confirmed){
                const response = await axios.post(`${baseApiURL()}/deleteEnquiry/${enquiryId}`);
                setEnquiries((prevEnquiries) => prevEnquiries.filter((enquiry) => enquiry._id !== enquiryId));

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Enquiry has been successfully deleted.',
                    confirmButtonText: 'OK'
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Deleting Enquiry Details!',
                confirmButtonText: 'OK'
            });
        }
    };

    const confirmDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Enquiry!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        return result.isConfirmed;
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setCurrentPage(1);
    };

    const applySearchFilter = (item) => {
        const searchTerm = searchValue.toLowerCase();
        return (
            item.name.toLowerCase().includes(searchTerm) ||
            item.email.toLowerCase().includes(searchTerm)
        );
    };

    return (
        <Fragment>
            <span>&nbsp;</span>
            <Col sm="12">
                <Card>
                    <CardHeader>
                        <H3>Enquiry List</H3>
                    </CardHeader>
                    <br/>
                    <div className="card-block row" style={{paddingLeft: '18px', paddingRight: '18px'}}>
                        <Col sm="12" lg="12" xl="12">
                            <div className='table-responsive'>
                                <Row className='d-flex justify-content-center'>
                                    <Col sm="12" xl="6">
                                        <InputGroup>
                                            <InputGroupText>
                                                <i className="fa fa-search"></i>
                                            </InputGroupText>
                                            <Input
                                                style={{border:'1px solid #343a40'}}
                                                type="text"
                                                name="subname"
                                                placeholder="Search Anything"
                                                onChange={handleSearchChange}
                                                value={searchValue}
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <br/>
                                <Table>
                                    <thead>
                                        <tr className='border-bottom-primary'>
                                            <th scope='col'>Name</th>
                                            <th scope='col'>E-mail</th>
                                            <th scope='col'>Phone Number</th>
                                            <th scope='col'>Message</th>
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
                                        {enquiries.filter(applySearchFilter).length === 0 && !loadingTableData && (
                                            <tr>
                                                <td colSpan="6" className="text-center"><b>No Data Available</b></td>
                                            </tr>
                                        )}
                                        {enquiries.filter(applySearchFilter).slice(indexOfFirstItem, indexOfLastItem).map((item) => (
                                            <tr key={item._id} className={`border-bottom-primary`}>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.phone}</td>
                                                <td>{item.message}</td>
                                                <td>
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
                                    {[...Array(Math.ceil(enquiries.filter(applySearchFilter).length / itemsPerPage))].map((_, i) => (
                                        <PaginationItem key={i} active={i + 1 === currentPage}>
                                        <PaginationLink onClick={() => handlePageChange(i + 1)}>
                                            {i + 1}
                                        </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem disabled={currentPage === Math.ceil(enquiries.filter(applySearchFilter).length / itemsPerPage)}>
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

export default Enquiry;