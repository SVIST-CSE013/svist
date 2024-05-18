import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardFooter } from 'reactstrap';
import { H5, Btn } from '../../../AbstractElements';
import Calendar from 'react-calendar';
import Swal from 'sweetalert2';
import { baseApiURL } from '../../../baseUrl';

const AddIssue = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [issueData, setIssueData] = useState({
        isbnNo: '',
        enrollmentNo: '',
        department: '',
        semester: '',
        issueDate: '',
        dueDate: '',
        status: 'Issued',
    });

    const [departments, setDepartments] = useState([]);
    const [students, setStudents] = useState([]);
    const [bookName, setBookName] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(true);

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
            const authResponse = await axios.post(`${baseApiURL()}/getFilteredAuthenticatedUsers`, { role: 'LibraryMember' });

            const detailsPromises = authResponse.data.user.map(async (libraryMember) => {
              const detailsResponse = await axios.post(`${baseApiURL()}/getFilteredStudentDetails`, { fullName: libraryMember.name, email: libraryMember.email, department: issueData.department, semester: issueData.semester });
              return detailsResponse.data.student[0];
            });

            const details = await Promise.all(detailsPromises);

            const libraryMembersWithDetails = authResponse.data.user.map((libraryMember, index) => ({
              ...libraryMember,
              details: details[index],
            }));

            setStudents(libraryMembersWithDetails);
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
    }, [issueData.department, issueData.semester]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (issueData.enrollmentNo) {
                    const response = await axios.post(`${baseApiURL()}/getFilteredStudentDetailsByEnrollmentNo`, { enrollmentNo: issueData.enrollmentNo });
                    const studentDetails = response.data.student[0];

                    if (studentDetails && 'enrollmentNo' in studentDetails) {
                        setStudentName(studentDetails.fullName || '');
                        setStudentEmail(studentDetails.email || '');
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'No Students Found For the Given Enrollment No.',
                            confirmButtonText: 'OK'
                        });
                    }
                }

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
    }, [issueData.enrollmentNo]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${baseApiURL()}/getFilteredBookDetails`, { isbnNo: issueData.isbnNo });
                const bookDetails = response.data.book[0];

                setBookName(bookDetails?.title || '');

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Book Details!',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchData();
    }, [issueData.isbnNo]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        Swal.showLoading();

        try {
            const response = await axios.post(`${baseApiURL()}/addIssueBookDetails`, {
                isbnNo: issueData.isbnNo,
                book: bookName,
                fullName: studentName,
                enrollmentNo: issueData.enrollmentNo,
                email: studentEmail,
                department: issueData.department,
                semester: issueData.semester,
                issued: new Date(issueData.issueDate).toLocaleDateString('en-GB'),
                due: new Date(issueData.dueDate).toLocaleDateString('en-GB'),
                status: issueData.status,
            });

            setIssueData({
                isbnNo: '',
                enrollmentNo: '',
                department: '',
                semester: '',
                issueDate: '',
                dueDate: '',
                status: 'Issued',
            });

            setStudentName('');
            setStudentEmail('');

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Book Issued successfully.',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    setIsFormOpen(false);
                    onClose();
                }
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error Issuing Book!',
                confirmButtonText: 'OK'
            });
        } finally{
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <span>&nbsp;</span>
            {isFormOpen && (
                <Container fluid={true}>
                    <Card>
                        <H5>Issue Book</H5>
                        <Form className="form theme-form" onSubmit={handleSubmit}>
                            <CardBody>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Enter ISBN Number</Label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="ISBNNo."
                                                value={issueData.isbnNo}
                                                onChange={(e) => setIssueData({ ...issueData, isbnNo: e.target.value })}
                                                placeholder='Lorem Ipsum' required autoFocus
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Book Name</Label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="Book Name"
                                                value={bookName}
                                                placeholder='Lorem Ipsum'
                                                readOnly required autoFocus
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Choose Department</Label>
                                            <Input
                                                type="select"
                                                className="form-control"
                                                name="department"
                                                value={issueData.department}
                                                onChange={(e) => setIssueData({ ...issueData, department: e.target.value })}
                                                defaultValue="1" required autoFocus
                                            >
                                                <option>{'Select'}</option>
                                                {departments.map((department) => (
                                                    <option key={department.id} value={department.deptname}>
                                                        {department.deptname}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Choose Semester</Label>
                                            <Input
                                                type="select"
                                                name="semester"
                                                className="form-control"
                                                defaultValue="1"
                                                value={issueData.semester}
                                                onChange={(e) => setIssueData({ ...issueData, semester: e.target.value })}
                                                required autoFocus
                                            >
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
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Choose Enrollment Number</Label>
                                            <Input
                                                type="select"
                                                name="enrollmentNo"
                                                className="form-control"
                                                defaultValue="1"
                                                value={issueData.enrollmentNo}
                                                onChange={(e) => setIssueData({ ...issueData, enrollmentNo: e.target.value })}
                                                required autoFocus
                                            >
                                                <option>{'Select'}</option>
                                                {students
                                                    .filter((student) => student.details && 'enrollmentNo' in student.details)
                                                    .map((student) => (
                                                        <option key={student.details.id} value={student.details.enrollmentNo}>
                                                            {student.details.enrollmentNo}
                                                        </option>
                                                    ))}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Student Name</Label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="fullName"
                                                value={studentName}
                                                placeholder='Lorem Ipsum'
                                                readOnly required autoFocus
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Student Email</Label>
                                            <Input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={studentEmail}
                                                placeholder='name@mail.com'
                                                readOnly required autoFocus
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Issued Date</Label>
                                            <Calendar
                                                onChange={(date) => setIssueData({ ...issueData, issueDate: date })}
                                                value={issueData.issueDate}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" xl="4">
                                        <FormGroup>
                                            <Label htmlFor="exampleFormControlSelect9">Due Date</Label>
                                            <Calendar
                                                onChange={(date) => setIssueData({ ...issueData, dueDate: date })}
                                                value={issueData.dueDate}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter className="text-end">
                                <Btn attrBtn={{ color: 'primary', className: 'me-3 btn btn-air-primary' }} type="submit" disabled={loading}>
                                    {loading ? 'Please Wait...' : 'Submit'}
                                </Btn>
                            </CardFooter>
                        </Form>
                    </Card>
                </Container>
            )}
        </Fragment>
    );
};

export default AddIssue;
