import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Table, Nav } from 'react-bootstrap';
import axios from 'axios';
import Pagination from './Pagination';

const EmployeeHomePage = ({ submissions, setSubmissions, employeeId = 'MTL1021' }) => {
  const navigate = useNavigate();
  const [filteredSubmissions, setFilteredSubmissions] = useState(submissions);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 5;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/timesheets/list/${employeeId}`);
        const data = response.data.reverse();
        setSubmissions(data);
        setFilteredSubmissions(data);
        setCounts({
          total: data.length,
          pending: data.filter(sub => sub.status === 'PENDING').length,
          approved: data.filter(sub => sub.status === 'APPROVED').length,
          rejected: data.filter(sub => sub.status === 'REJECTED').length,
        });
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
    fetchSubmissions();
  }, [employeeId, setSubmissions]);

  const handleCreateTimesheet = () => navigate('/timesheet-management');
  const handleEditTimesheet = (submission) => navigate('/timesheet-management', { state: { submission } });

  const handleDeleteTimesheet = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/timesheets/delete/${id}`);
      const updatedSubmissions = filteredSubmissions.filter(sub => sub.id !== id);
      setFilteredSubmissions(updatedSubmissions);
      setSubmissions(updatedSubmissions);
      setCounts({
        total: updatedSubmissions.length,
        pending: updatedSubmissions.filter(sub => sub.status === 'PENDING').length,
        approved: updatedSubmissions.filter(sub => sub.status === 'APPROVED').length,
        rejected: updatedSubmissions.filter(sub => sub.status === 'REJECTED').length,
      });
    } catch (error) {
      console.error("Error deleting timesheet:", error);
    }
  };

  const filterSubmissions = (status) => setFilteredSubmissions(status ? submissions.filter(sub => sub.status === status) : submissions);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredSubmissions.length / submissionsPerPage);
  const currentSubmissions = filteredSubmissions.slice((currentPage - 1) * submissionsPerPage, currentPage * submissionsPerPage);

  return (
    <Container className="mt-5 flex flex-col md:flex-row">
      <Nav className="flex-col mr-4">
        <Button onClick={handleCreateTimesheet} className="bg-gradient-to-r from-purple-500 to-blue-500 mb-3 text-white font-bold rounded-lg shadow-md w-full">Create Timesheet</Button>
        <Nav.Link onClick={() => filterSubmissions()} className="cursor-pointer">
          <h5 className='text-blue-500'>Total Timesheets: {counts.total}</h5>
        </Nav.Link>
        <Nav.Link onClick={() => filterSubmissions('PENDING')} className="cursor-pointer">
          <h5 className='text-gray-500'>Pending Timesheets: {counts.pending}</h5>
        </Nav.Link>
        <Nav.Link onClick={() => filterSubmissions('APPROVED')} className="cursor-pointer">
          <h5 className='text-green-500'>Approved Timesheets: {counts.approved}</h5>
        </Nav.Link>
        <Nav.Link onClick={() => filterSubmissions('REJECTED')} className="cursor-pointer">
          <h5 className='text-red-500'>Rejected Timesheets: {counts.rejected}</h5>
        </Nav.Link>
      </Nav>

      <div className="flex-grow">
        <h2 className="text-center text-2xl font-bold">Submitted Timesheets</h2>
        {currentSubmissions.length > 0 ? (
          <>
            <Table striped bordered hover responsive className="mt-3 text-center text-sm">
              <thead className='bg-gray-200'>
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Client Name</th>
                  <th>Project Name</th>
                  <th>Total Hours per Week</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.startDate}</td>
                    <td>{submission.endDate}</td>
                    <td>{submission.clientName}</td>
                    <td>{submission.projectName}</td>
                    <td>{submission.totalNumberOfHours}</td>
                    <td>
                      <span className={submission.status === "APPROVED" ? "text-green-500" : submission.status === "REJECTED" ? "text-red-500" : "text-black"}>{submission.status} </span>
                    </td>
                    <td>
                      {submission.status !== 'APPROVED' && submission.status !== 'REJECTED' && (
                        <>
                          <Button className="bg-blue-500 text-white font-10 text-sm m-1 p-1" onClick={() => handleEditTimesheet(submission)}>Edit</Button>
                          <Button className="bg-red-500 text-white font-bold text-xs rounded-lg p-1" onClick={() => handleDeleteTimesheet(submission.id)}>Delete</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages}  paginate={paginate}  />
          </>
        ) : <p className="text-center text-xl mt-4">No timesheets submitted yet.</p>}
      </div>
    </Container>
  );
};

export default EmployeeHomePage;