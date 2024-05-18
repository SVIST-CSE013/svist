import React, { Fragment, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { H3, H4, H6 } from '../../../../AbstractElements';
import Swal from 'sweetalert2';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from 'react-to-print';
import { CSVLink } from 'react-csv';
import { setAuthenticated } from "../../../../redux/authRedux";
import { baseApiURL } from '../../../../baseUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileCsv, faEye } from '@fortawesome/free-solid-svg-icons';

const StudentAttendanceReport = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [viewstudentattendance, setViewStudentAttendance] = useState([]);
    const [isAllStudentsSelected, setIsAllStudentsSelected] = useState(false);
    const [totalLectures, setTotalLectures] = useState(0);
    const componentRef = useRef();
    const [selected, setSelected] = useState({
        department: "",
        semester: "",
        studentenrollmentno: "",
        subject: "",
        fromDate: "",
        toDate: "",
    });

    const [viewAttendanceDisabled, setViewAttendanceDisabled] = useState(false);

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

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const csvData = Object.values(viewstudentattendance).reduce((acc, curr) => acc.concat(curr), []).map((row) => ({
        EnrollmentNo: row.enrollmentNo,
        FullName: row.fullName,
        Department: row.department,
        Semester: row.semester,
        Subject: row.subject,
        Date: row.date,
        Attendance: row.attendance,
    }));

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/getDepartment`);
                const departmentsArray = Array.isArray(response.data) ? response.data : [response.data];
                setDepartments(departmentsArray);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Departments!',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${baseApiURL()}/getFilteredStudentDetails`, { department: selected.department, semester: selected.semester });
                setStudents(response.data.student);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Student Details!',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchData();
    }, [selected]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selected.department && selected.semester && selected.studentenrollmentno !== "") {
                    const response = await axios.post(`${baseApiURL()}/getFilteredSubjectDetails`, {
                        deptname: selected.department,
                        semester: selected.semester,
                    });
                    setSubjects(response.data.subject);

                    const selectedSubjectDetails = response.data.subject.find(subject => subject.subname === selected.subject);
                    setTotalLectures(selectedSubjectDetails?.lectures || 0);
                }
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
    }, [selected.department, selected.semester, selected.studentenrollmentno, selected.subject]);


    useEffect(() => {
        setSelected(prevState => ({
            ...prevState,
            toDate: isAllStudentsSelected ? "" : prevState.toDate
        }));
    }, [isAllStudentsSelected]);


    const handleFetchAttendance = async () => {
        try {
            Swal.showLoading();
            let response;

            if (selected.studentenrollmentno === "allStudents") {
                const allStudentsResponse = await axios.post(`${baseApiURL()}/getFilteredStudentDetails`, {
                    department: selected.department,
                    semester: selected.semester,
                });

                const allStudentsAttendance = [];

                for (const student of allStudentsResponse.data.student) {
                    if (selected.fromDate && selected.toDate) {
                        response = await axios.post(`${baseApiURL()}/getFilteredStudentAttendanceDetailsByDateRange`, {
                            department: selected.department,
                            semester: selected.semester,
                            enrollmentNo: student.enrollmentNo,
                            subject: selected.subject,
                            fromDate: new Date(selected.fromDate).toLocaleDateString('en-GB'),
                            toDate: new Date(selected.toDate).toLocaleDateString('en-GB'),
                        });
                    } else if (selected.fromDate) {
                        response = await axios.post(`${baseApiURL()}/getFilteredStudentAttendanceDetailsByDate`, {
                            department: selected.department,
                            semester: selected.semester,
                            enrollmentNo: student.enrollmentNo,
                            subject: selected.subject,
                            date: new Date(selected.fromDate).toLocaleDateString('en-GB'),
                        });
                    }

                    if (response.data.studentattendance.length > 0) {
                        allStudentsAttendance.push(...response.data.studentattendance);
                    }
                }

                allStudentsAttendance.sort((a, b) => a.enrollmentNo - b.enrollmentNo);
                setViewStudentAttendance(allStudentsAttendance);

                if (allStudentsAttendance.length === 0) {
                    Swal.fire({
                        icon: 'info',
                        title: 'No Attendance Found',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Student Attendances Loaded Successfully.',
                        confirmButtonText: 'OK'
                    });
                    setViewAttendanceDisabled(true);
                }

            } else {
                if (selected.fromDate && selected.toDate) {
                    response = await axios.post(`${baseApiURL()}/getFilteredStudentAttendanceDetailsByDateRange`, {
                        department: selected.department,
                        semester: selected.semester,
                        enrollmentNo: selected.studentenrollmentno,
                        subject: selected.subject,
                        fromDate: new Date(selected.fromDate).toLocaleDateString('en-GB'),
                        toDate: new Date(selected.toDate).toLocaleDateString('en-GB'),
                    });
                } else if (selected.fromDate) {
                    response = await axios.post(`${baseApiURL()}/getFilteredStudentAttendanceDetailsByDate`, {
                        department: selected.department,
                        semester: selected.semester,
                        enrollmentNo: selected.studentenrollmentno,
                        subject: selected.subject,
                        date: new Date(selected.fromDate).toLocaleDateString('en-GB'),
                    });
                }

                setViewStudentAttendance(response.data.studentattendance);

                if (response.data.studentattendance.length === 0) {
                    Swal.fire({
                        icon: 'info',
                        title: 'No Attendance Found',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Student Attendance Loaded Successfully.',
                        confirmButtonText: 'OK'
                    });
                    setViewAttendanceDisabled(true);
                }
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Fetching Student Attendance!',
                confirmButtonText: 'OK'
            });
        }
    };

    const calculateAttendancePercentage = () => {
        const totalClasses = totalLectures;
        const presentClasses = viewstudentattendance.filter((item) => item.attendance === 'Present').length;
        const percentage = (presentClasses / totalClasses) * 100;
        return percentage.toFixed(2);
    };

    return (
        <Fragment>
            <span>&nbsp;</span>
            <Container fluid={true}>
                <Card>
                    <CardHeader>
                        <H3>Student Attendance Report</H3>
                    </CardHeader>
                    <Form className="form theme-form">
                        <CardBody>
                            <Row>
                                <Col sm="12" xl="3">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Choose Department</Label>
                                        <Input type="select" className="form-control digits" name="department" defaultValue="1" value={selected.department} onChange={(e) => setSelected({ ...selected, department: e.target.value })}>
                                            <option>{'Select'}</option>
                                            {departments.map((department) => (
                                                <option key={department.id} value={department.deptname}>
                                                    {department.deptname}
                                                </option>
                                            ))}
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
                                        <Label htmlFor="exampleFormControlSelect9">Choose Student</Label>
                                        <Input type="select" name="select" className="form-control digits" defaultValue="1" value={selected.studentenrollmentno} onChange={(e) => { setSelected({ ...selected, studentenrollmentno: e.target.value }); setIsAllStudentsSelected(e.target.value === "allStudents"); }} disabled={!selected.department || !selected.semester}>
                                            <option>{'Select'}</option>
                                            <option value="allStudents">All Students</option>
                                            {students.map((student) => (
                                                <option key={student.id} value={student.enrollmentNo}>
                                                    {student.enrollmentNo}&nbsp;&nbsp;&nbsp;&nbsp;{student.fullName}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col sm="12" xl="3">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">Choose Subject</Label>
                                        <Input type="select" className="form-control digits" name="subject" defaultValue="1" value={selected.subject} onChange={(e) => setSelected({ ...selected, subject: e.target.value })} disabled={!selected.department || !selected.semester || !selected.studentenrollmentno}>
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
                                        <Label htmlFor="exampleFormControlSelect9">From Date</Label>
                                        <Input type='date' value={selected.fromDate} onChange={(e) => setSelected({ ...selected, fromDate: e.target.value })} />
                                    </FormGroup>
                                </Col>
                                <Col sm="12" xl="3">
                                    <FormGroup>
                                        <Label htmlFor="exampleFormControlSelect9">To Date</Label>
                                        <Input type='date' value={selected.toDate} onChange={(e) => setSelected({ ...selected, toDate: e.target.value })} disabled={isAllStudentsSelected} readOnly={isAllStudentsSelected} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col sm="12" xl="3">
                                    <Button className="btn btn-air-primary" color="primary" onClick={handleFetchAttendance} disabled={!selected.department || !selected.semester || !selected.subject || !selected.fromDate || viewAttendanceDisabled}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FontAwesomeIcon icon={faEye} size={16} />&nbsp; View Student Attendance
                                        </div>
                                    </Button>
                                </Col>
                            </Row>
                            <span>&nbsp;</span>
                            <br />
                            {viewstudentattendance && viewstudentattendance.length !== 0 && (
                                <Row>
                                    <Col sm="12" xl="12">
                                        {selected.toDate ? (
                                            <H4>Attendance For {selected.subject} from {new Date(selected.fromDate).toLocaleDateString('en-GB')} to {new Date(selected.toDate).toLocaleDateString('en-GB')}</H4>
                                        ) : (
                                            <H4>Attendance For {selected.subject} on {new Date(selected.fromDate).toLocaleDateString('en-GB')}</H4>
                                        )}
                                        <div className="d-flex justify-content-end">
                                            <Button color="success" onClick={handlePrint}>
                                                <FontAwesomeIcon icon={faFilePdf} />&nbsp;Export to PDF
                                            </Button>
                                            &nbsp;&nbsp;&nbsp;
                                            <CSVLink data={csvData} filename={`Attendance_${selected.subject}_${selected.Date}.csv`} className="btn btn-warning ml-2">
                                                <FontAwesomeIcon icon={faFileCsv} />&nbsp;Export to CSV
                                            </CSVLink>
                                        </div>
                                        <div className="table-responsive" ref={componentRef}>
                                            <div className="mb-3">
                                                <H6>Attendance Percentage: {calculateAttendancePercentage()}%</H6>
                                            </div>
                                            <Table className='table-light'>
                                                <thead>
                                                    <tr>
                                                        <th>Enrollment No.</th>
                                                        <th>Student Name</th>
                                                        <th>Department</th>
                                                        <th>Semester</th>
                                                        <th>Subject</th>
                                                        <th>Date</th>
                                                        <th>Attendance</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {viewstudentattendance.map((row) => (
                                                        <tr key={row.enrollmentNo}>
                                                            <td>{row.enrollmentNo}</td>
                                                            <td>{row.fullName}</td>
                                                            <td>{row.department}</td>
                                                            <td>{row.semester}</td>
                                                            <td>{row.subject}</td>
                                                            <td>{row.date}</td>
                                                            <td>
                                                                {row.attendance === 'Present' ? (
                                                                    <span className="badge badge-light-success" style={{ fontSize: "12px" }}>{row.attendance}</span>
                                                                ) : (
                                                                    <span className="badge badge-light-danger" style={{ fontSize: "12px" }}>{row.attendance}</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
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

export default StudentAttendanceReport;