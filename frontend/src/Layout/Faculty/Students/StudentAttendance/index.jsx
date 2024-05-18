import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../../../redux/authRedux";
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, Table, Media, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { H3, H4 } from '../../../../AbstractElements';
import { Edit3 } from 'react-feather';
import { baseApiURL } from '../../../../baseUrl';


const StudentAttendance = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [attendance, setAttendance] = useState({});
    const [department, setDepartment] = useState();
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [selected, setSelected] = useState({
        department: "",
        semester: "",
        subject: "",
        Date: "",
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [markAttendanceDisabled, setMarkAttendanceDisabled] = useState(false);

    useEffect(() => {
        const checkFacultyAuthorization = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/facultyRoutes`, {
                    withCredentials: true,
                });

                const data = response.data;

                if (data.authenticated) {
                    dispatch(setAuthenticated(true));
                    window.history.pushState(null, null, window.location.pathname);
                } else {
                    navigate(`${process.env.PUBLIC_URL}/facultylogin`, { replace: true });
                }

            } catch (error) {
                navigate(`${process.env.PUBLIC_URL}/facultylogin`, { replace: true });
            }
        };

        checkFacultyAuthorization();

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
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (selected.department && selected.semester) {
                try {
                    const response = await axios.post(`${baseApiURL()}/getFilteredSubjectDetails`, { faculty: name, deptname: selected.department, semester: selected.semester });
                    setSubjects(response.data.subject);
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Error Fetching Subject Details!',
                        confirmButtonText: 'OK'
                    });
                }
            }
        };

        fetchData();
    }, [name, selected.department, selected.semester]);


    useEffect(() => {
        const initializeAttendance = async () => {
            const initialAttendance = {};
            students.forEach((student) => {
                initialAttendance[student.enrollmentNo] = null;
            });

            try {
                const response = await axios.post(`${baseApiURL()}/getFilteredStudentAttendanceDetails`, {
                    department: selected.department,
                    semester: selected.semester,
                    subject: selected.subject,
                    date: new Date(selected.Date).toLocaleDateString('en-GB'),
                });

                const existingAttendance = response.data.studentattendance;
                existingAttendance.forEach((attendanceRecord) => {
                    initialAttendance[attendanceRecord.enrollmentNo] = attendanceRecord.attendance;
                });

                setAttendance(initialAttendance);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Existence Attendance!',
                    confirmButtonText: 'OK'
                });
            }
        };

        initializeAttendance();
    }, [students, selected]);


    const handleFetchData = async () => {
        try {
            const response = await axios.post(`${baseApiURL()}/getFilteredStudentDetails`, { department: selected.department, semester: selected.semester });
            setStudents(response.data.student);

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Student Details loaded successfully.',
                confirmButtonText: 'OK'
            })

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Fetching Student Details!',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleAttendanceToggle = async (enrollmentNo, togglerType) => {

        const updatedAttendance = { ...attendance };

        if (updatedAttendance[enrollmentNo] === null && togglerType === 'Present') {
            updatedAttendance[enrollmentNo] = 'Present';
        } else if (updatedAttendance[enrollmentNo] === null && togglerType === 'Absent') {
            updatedAttendance[enrollmentNo] = 'Absent';
        } else {
            if (updatedAttendance[enrollmentNo] === 'Present') {
                updatedAttendance[enrollmentNo] = 'Absent';
            } else if (updatedAttendance[enrollmentNo] === 'Absent') {
                updatedAttendance[enrollmentNo] = 'Present';
            } else {
                updatedAttendance[enrollmentNo] = 'Present';
            }
        }
        setAttendance(updatedAttendance);
        setMarkAttendanceDisabled(true);

        try {
            const selectedStudent = students.find((student) => student.enrollmentNo === enrollmentNo);
            const attendanceData = [
                {
                    enrollmentNo: selectedStudent.enrollmentNo,
                    fullName: selectedStudent.fullName,
                    department: selectedStudent.department,
                    semester: selectedStudent.semester,
                    subject: selected.subject,
                    date: new Date(selected.Date).toLocaleDateString('en-GB'),
                    attendance: updatedAttendance[enrollmentNo],
                },
            ];

            await axios.post(`${baseApiURL()}/StudentAttendance`, {
                attendanceData,
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Attendance Marked successfully.',
                confirmButtonText: 'OK'
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Submitting Student Attendance!',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <Fragment>
            <span>&nbsp;</span>
            <Container fluid={true}>
                <Card>
                    <CardHeader>
                        <H3>Student Attendance</H3>
                    </CardHeader>
                    <Form className="form theme-form">
                        <CardBody>
                            <Row>
                                <Col sm="12" xl="3">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Choose Department</Label>
                                        <Input type="select" className="form-control digits" name="department" defaultValue="1" value={selected.department} onChange={(e) => setSelected({ ...selected, department: e.target.value })}>
                                            <option>{'Select'}</option>
                                            <option>{department}</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col sm="12" xl="3">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Choose Semester</Label>
                                        <Input type="select" name="select" className="form-control digits" defaultValue="1" value={selected.semester} onChange={(e) => setSelected({ ...selected, semester: e.target.value })}>
                                            <option>{'Select'}</option>
                                            <option>{'First Semester'}</option>
                                            <option>{'Second Semester'}</option>
                                            <option>{'Third Semester'}</option>
                                            <option>{'Fourth Semester'}</option>
                                            <option>{'Fifth Semester'}</option>
                                            <option>{'Sixth Semester'}</option>
                                            <option>{'Seventh Semester'}</option>
                                            <option>{'Eighth Semester'}</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col sm="12" xl="3">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Choose Subject</Label>
                                        <Input type="select" className="form-control digits" name="department" defaultValue="1" value={selected.subject} onChange={(e) => setSelected({ ...selected, subject: e.target.value })} disabled={!selected.department || !selected.semester}>
                                            <option>{'Select'}</option>
                                            {subjects.map((subject) => (
                                                <option key={subject.id} value={subject.subname}>
                                                    {subject.subname}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col sm="12" xl="3">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Choose Date</Label>
                                        <Input type='date' value={selected.Date} onChange={(e) => setSelected({ ...selected, Date: e.target.value })} />
                                    </FormGroup>
                                </Col>
                                <Col sm="12" xl="3">
                                    <Button color="primary" className= "btn btn-air-primary" onClick={handleFetchData} disabled={!selected.department || !selected.semester || !selected.subject || !selected.Date || markAttendanceDisabled}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Edit3 size={16} />&nbsp; Mark Student Attendance
                                        </div>
                                    </Button>
                                </Col>
                            </Row>
                            <span>&nbsp;</span>
                            {students && students.length !== 0 && (
                                <Row>
                                    <Col sm="12" xl="12">
                                        &nbsp;&nbsp;
                                        <H4>Mark Student Attendance For {selected.subject} on {new Date(selected.Date).toLocaleDateString('en-GB')}</H4>
                                        &nbsp;
                                        <div className="table-responsive">
                                            <Table className='table-light'>
                                                <thead>
                                                    <tr>
                                                        <th>Student Profile</th>
                                                        <th>Student Enrollment No.</th>
                                                        <th>Student Name</th>
                                                        <th>Department</th>
                                                        <th>Semester</th>
                                                        <th>Present</th>
                                                        <th>Absent</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {students.slice(indexOfFirstItem, indexOfLastItem).map((row) => (
                                                        <tr key={row.enrollmentNo}>
                                                            <td><img src={row.profile} width={50} height={50} style={{ borderRadius: '10px' }} /></td>
                                                            <td>{row.enrollmentNo}</td>
                                                            <td>{row.fullName}</td>
                                                            <td>{row.department}</td>
                                                            <td>{row.semester}</td>
                                                            <td>
                                                                <Media className="text-end icon-state">
                                                                    <Label className="switch-success">
                                                                        <Input
                                                                            type="checkbox" name='attendance'
                                                                            checked={attendance[row.enrollmentNo] === 'Present'}
                                                                            onChange={() => handleAttendanceToggle(row.enrollmentNo, 'Present')}
                                                                        />
                                                                        <span className="switch-success-state"></span>
                                                                    </Label>
                                                                </Media>
                                                            </td>
                                                            <td>
                                                                <Media className="text-end icon-state">
                                                                    <Label className="switch-danger">
                                                                        <Input
                                                                            type="checkbox" name='attendance'
                                                                            checked={attendance[row.enrollmentNo] === 'Absent'}
                                                                            onChange={() => handleAttendanceToggle(row.enrollmentNo, 'Absent')}
                                                                        />
                                                                        <span className="switch-danger-state"></span>
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
                                                {[...Array(Math.ceil(students.length / itemsPerPage))].map((_, i) => (
                                                    <PaginationItem key={i} active={i + 1 === currentPage}>
                                                        <PaginationLink onClick={() => handlePageChange(i + 1)}>
                                                            {i + 1}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                                <PaginationItem disabled={currentPage === Math.ceil(students.length / itemsPerPage)}>
                                                    <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                                                </PaginationItem>
                                            </Pagination>
                                        </div>
                                    </Col>
                                </Row>
                            )}
                        </CardBody>
                    </Form>
                </Card>
            </Container>
        </Fragment>
    );
};

export default StudentAttendance;