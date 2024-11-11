import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Table, Nav } from 'react-bootstrap';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';


const EmployeeHomePage = ({ submissions, setSubmissions }) => {
  const navigate = useNavigate();
  const [filteredSubmissions, setFilteredSubmissions] = useState(submissions);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 5; // Set number of submissions per page

  const handleCreateTimesheet = () => {
    navigate('/timesheet-management');
  };

  const handleEditTimesheet = (submission) => {
    navigate('/timesheet-management', { state: { submission } });
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/timesheets/list/MTL1015');
        setSubmissions(response.data.reverse());
        setFilteredSubmissions(response.data);
        calculateCounts(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchSubmissions();
  }, [setSubmissions]);

  const calculateCounts = (data) => {
    const pendingCount = data.filter(sub => sub.status === 'PENDING').length;
    const approvedCount = data.filter(sub => sub.status === 'APPROVED').length;
    const rejectedCount = data.filter(sub => sub.status === 'REJECTED').length;

    setCounts({
      total: data.length,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount
    });
  };

  const handleDeleteTimesheet = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/timesheets/delete/${id}`);
      const updatedSubmissions = filteredSubmissions.filter((submission) => submission.id !== id);
      setFilteredSubmissions(updatedSubmissions);
      setSubmissions(updatedSubmissions);
      calculateCounts(updatedSubmissions);
    } catch (error) {
      console.error("Error deleting timesheet:", error);
    }
  };

  const filterSubmissions = (status) => {
    if (status) {
      setFilteredSubmissions(submissions.filter(sub => sub.status === status));
    } else {
      setFilteredSubmissions(submissions);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredSubmissions.length / submissionsPerPage);
  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = filteredSubmissions.slice(indexOfFirstSubmission, indexOfLastSubmission);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-5 flex flex-col md:flex-row">
      {/* Side Navbar */}
      <Nav className="flex-col mr-4">
        <Button
          onClick={handleCreateTimesheet}
          className="bg-gradient-to-r from-purple-500 to-blue-500 mb-3 text-white font-bold rounded-lg shadow-md w-full"
        >
          Create Timesheet
        </Button>
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

      {/* Main Content */}
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
                    <td className='text-center'>{submission.startDate}</td>
                    <td>{submission.endDate}</td>
                    <td>{submission.clientName}</td>
                    <td>{submission.projectName}</td>
                    <td>{submission.totalNumberOfHours}</td>
                    <td>
                      <span className={submission.status === "APPROVED" ? "text-green-500" : submission.status === "REJECTED" ? "text-red-500" : "text-black"}>
                        {submission.status}
                      </span>
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

            {/* Pagination Controls */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstSubmission + 1}</span> to <span className="font-medium">{Math.min(indexOfLastSubmission, counts.total)}</span> of <span className="font-medium">{counts.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          index + 1 === currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-xl mt-4">No timesheets submitted yet.</p>
        )}
      </div>
    </Container>
  );
};

export default EmployeeHomePage;
