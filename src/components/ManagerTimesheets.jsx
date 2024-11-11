import React, { useEffect, useState } from "react";
import { Table, Container, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Loader from "./loader.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const ManagerTimesheets = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default value
  const managerId = "MTL1001";

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/timesheets/list/manager/${managerId}`
        );
        setSubmissions(response.data);
        setFilteredSubmissions(response.data.reverse());

        const pendingCount = response.data.filter(
          (sub) => sub.status === "PENDING"
        ).length;
        const approvedCount = response.data.filter(
          (sub) => sub.status === "APPROVED"
        ).length;
        const rejectedCount = response.data.filter(
          (sub) => sub.status === "REJECTED"
        ).length;

        setCounts({
          total: response.data.length,
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
        });
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchSubmissions();
  }, []);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 576) {
        setItemsPerPage(2); // Mobile
      } else if (width < 768) {
        setItemsPerPage(3); // Tablet
      } else {
        setItemsPerPage(5); // Desktop
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Paginated submissions
  const indexOfLastSubmission = currentPage * itemsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(indexOfFirstSubmission, indexOfLastSubmission);
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

  const handleFilter = (status) => {
    console.log(`Filtering by: ${status}`);
    if (status === "ALL") {
      setFilteredSubmissions(submissions);
    } else {
      setFilteredSubmissions(
        submissions.filter((sub) => sub.status === status)
      );
    }
    setCurrentPage(1); // Reset to the first page when filtering
  };

  const handleShow = (id) => {
    setCurrentId(id);
    setComments("");
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/api/timesheets/Approve/${id}/status/APPROVED`
      );
      fetchUpdatedSubmissions();
    } catch (error) {
      console.error("Error approving timesheet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/api/timesheets/reject/${currentId}/status/REJECTED/comments/${comments}`
      );
      fetchUpdatedSubmissions();
      handleClose();
    } catch (error) {
      console.error("Error rejecting timesheet:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdatedSubmissions = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/timesheets/list/manager/${managerId}`
    );
    setSubmissions(response.data);
    setFilteredSubmissions(response.data);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container className="mb-2 text-center relative">
      {loading && <Loader />}
      <h2 className="text-2xl font-bold m-4 inline-block font-serif">
        Submitted Timesheets
      </h2>

      {/* Calendar toggle button */}
      <Button
        onClick={() => setShowCalendar(!showCalendar)}
        className="ml-2 mb-4 mt-2 float-right font-serif font-semibold"
      >
        {showCalendar ? "Hide Calendar" : "Show Calendar"}
      </Button>

      {/* Overlay Calendar Component */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50 ">
          <div className="bg-gradient-to-l from-purple-500 to-blue-500 rounded-lg pb-0 shadow-lg mr-5 h-3/2 ">
            <Calendar onChange={setDate} value={date} />
            <Button
              variant="primary"
              onClick={() => setShowCalendar(false)}
              className="m-2 p-1 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Cards for counts */}
      <div className="flex flex-wrap justify-between mb-4 text-center space-y-4 sm:space-y-0 sm:space-x-4 font-serif">
        <div onClick={() => handleFilter('ALL')} className="bg-blue-100 pt-4 rounded shadow flex-1 min-w-[150px] mx-2 cursor-pointer">
          <h2 className="text-lg font-semibold">Total Requests</h2>
          <p className="text-1xl font-bold">{counts.total}</p>
        </div>
        <div onClick={() => handleFilter('APPROVED')} className="bg-green-300 pt-4 rounded shadow flex-1 min-w-[150px] mx-2 cursor-pointer">
          <h2 className="text-lg font-semibold">Approved</h2>
          <p className="text-1xl font-bold">{counts.approved}</p>
        </div>
        <div onClick={() => handleFilter('PENDING')} className="bg-yellow-100 pt-4 rounded shadow flex-1 min-w-[150px] mx-2 cursor-pointer">
          <h2 className="text-lg font-semibold">Pending</h2>
          <p className="text-1xl font-bold">{counts.pending}</p>
        </div>
        <div onClick={() => handleFilter('REJECTED')} className="bg-red-100 pt-4 rounded shadow flex-1 min-w-[150px] mx-2 cursor-pointer">
          <h2 className="text-lg font-semibold">Rejected</h2>
          <p className="text-1xl font-bold">{counts.rejected}</p>
        </div>
      </div>

      {currentSubmissions.length > 0 ? (
        <>
          <div className="table-responsive">
            <Table striped bordered hover className="mt-3 text-center text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Employee Name</th>
                  <th>Client Name</th>
                  <th>Project Name</th>
                  <th>Total Hours</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.startDate}</td>
                    <td>{submission.endDate}</td>
                    <td>{submission.employeeName}</td>
                    <td>{submission.clientName}</td>
                    <td>{submission.projectName}</td>
                    <td>{submission.totalNumberOfHours}</td>
                    <td>
                      <span
                        className={
                          submission.status === "APPROVED"
                            ? "text-green-600"
                            : submission.status === "REJECTED"
                            ? "text-red-600"
                            : "text-black"
                        }
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td>
                      {submission.status !== "APPROVED" && submission.status !== "REJECTED" && (
                        <>
                          <Button
                            className="bg-blue-500 text-white font-bold text-xs m-2 p-1"
                            onClick={() => handleApprove(submission.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            className="bg-red-500 text-white font-bold text-xs p-1"
                            onClick={() => handleShow(submission.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

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
        <p>No timesheets submitted yet.</p>
      )}

      {/* Modal for comments */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Leave a Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="comments">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </Form.Group>
            {loading && <Loader />}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleReject} disabled={loading}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManagerTimesheets;
