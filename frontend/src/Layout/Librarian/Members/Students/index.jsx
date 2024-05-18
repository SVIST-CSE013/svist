import React, { Fragment , useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Trash2 } from 'react-feather';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated } from "../../../../redux/authRedux";
import { Row, Col, Card, CardHeader, Table, Input, InputGroup, InputGroupText , Pagination, PaginationItem, PaginationLink} from "reactstrap";
import { Btn, H3 } from '../../../../AbstractElements';
import { baseApiURL } from '../../../../baseUrl';

const Student = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [libraryMembers, setLibraryMembers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [loadingTableData, setLoadingTableData] = useState(true);
    const [refreshTable, setRefreshTable] = useState(false);

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
            const authResponse = await axios.post(`${baseApiURL()}/getFilteredAuthenticatedUsers`, { role: 'LibraryMember' });
            const detailsPromises = authResponse.data.user.map(async (libraryMember) => {
              const detailsResponse = await axios.post(`${baseApiURL()}/getFilteredStudentDetails`, { fullName: libraryMember.name, email: libraryMember.email });
              return detailsResponse.data.student[0];
            });

            const details = await Promise.all(detailsPromises);

            const libraryMembersWithDetails = authResponse.data.user.map((libraryMember, index) => ({
              ...libraryMember,
              details: details[index],
            }));

            setTimeout(() => {
                setLibraryMembers(libraryMembersWithDetails);
                setLoadingTableData(false);
            }, 1000);
            
          } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Library Member Details!',
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

    const handleDelete = async (studentId) => {
        try {
            const confirmed = await confirmDelete();
            if(confirmed){
                const response = await axios.post(`${baseApiURL()}/deleteStudentDetails/${studentId}`);
                setLibraryMembers((prevStudents) => prevStudents.filter((student) => student._id !== studentId));
                
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Library Member has been successfully deleted.',
                    confirmButtonText: 'OK'
                });
            }
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Deleting Student!',
                confirmButtonText: 'OK'
            });
        }
    };

    const confirmDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover it!',
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

    const filteredLibraryMembers = libraryMembers.filter((member) =>
        member.details.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
        member.details.department.toLowerCase().includes(searchValue.toLowerCase()) ||
        member.details.semester.toLowerCase().includes(searchValue.toLowerCase()) ||
        (String(member.details.enrollmentNo).toLowerCase().includes(searchValue.toLowerCase()))
    );

    useEffect(() => {
        const loadImage = (item) => {
            const img = new Image();
            img.src = item.profile;
            img.onload = () => {
                setLibraryMembers((prevLibraryMembers) => {
                    return prevLibraryMembers.map((LibraryMember) => {
                        if (LibraryMember._id === item._id) {
                            return { ...LibraryMember, imageLoaded: true };
                        }
                        return LibraryMember;
                    });
                });
            };
        };

        libraryMembers.forEach((item) => {
            if (!item.imageLoaded) {
                loadImage(item);
            }
        });
    }, [libraryMembers]);

    useEffect(() => {
        setRefreshTable(false);
    }, [refreshTable]);

    return (
        <Fragment>
            <span>&nbsp;</span>
            <Col sm="12">
                <Card>
                    <CardHeader>
                        <H3>Student Member List</H3>
                    </CardHeader>
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
                                <br/><br/>
                                <Table>
                                    <thead>
                                        <tr className='border-bottom-primary'>
                                            <th scope='col'>Profile</th>
                                            <th scope='col'>Enrollment No.</th>
                                            <th scope='col'>Full Name</th>
                                            <th scope='col'>Email</th>
                                            <th scope='col'>Phone No.</th>
                                            <th scope='col'>Department</th>
                                            <th scope='col'>Semester</th>
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
                                        {filteredLibraryMembers.length === 0 && !loadingTableData && (
                                            <tr>
                                                <td colSpan="11" className="text-center"><b>No Data Available</b></td>
                                            </tr>
                                        )}
                                        {filteredLibraryMembers.slice(indexOfFirstItem, indexOfLastItem).map((item) => (
                                        <tr key={item.id} className={`border-bottom-primary`}>
                                            <td>{item.imageLoaded ? <img src={item.profile} width={65} height={65} alt="Thumbnail" style={{borderRadius: '10px'}}/> : 'Loading...'}</td>
                                            <td>{item.details.enrollmentNo}</td>
                                            <td>{item.details.fullName}</td>
                                            <td>{item.details.email}</td>
                                            <td>{item.details.phoneNo}</td>
                                            <td>{item.details.department}</td>
                                            <td>{item.details.semester}</td>
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
                                    {[...Array(Math.ceil(filteredLibraryMembers.length / itemsPerPage))].map((_, i) => (
                                        <PaginationItem key={i} active={i + 1 === currentPage}>
                                        <PaginationLink onClick={() => handlePageChange(i + 1)}>
                                            {i + 1}
                                        </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem disabled={currentPage === Math.ceil(filteredLibraryMembers.length / itemsPerPage)}>
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

export default Student;
