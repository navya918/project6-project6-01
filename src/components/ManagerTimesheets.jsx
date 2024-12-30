import React, { useEffect, useState } from "react";
import { Table, Container, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Loader from "./loader.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Pagination from './Pagination';

const ManagerTimesheets = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const managerId = "MTL1001";

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/timesheets/list/manager/${managerId}`);
        setSubmissions(data);
        setFilteredSubmissions(data.reverse());
        setCounts({
          total: data.length,
          pending: data.filter((sub) => sub.status === "PENDING").length,
          approved: data.filter((sub) => sub.status === "APPROVED").length,
          rejected: data.filter((sub) => sub.status === "REJECTED").length,
        });
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchSubmissions();
  }, []);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 576 ? 2 : window.innerWidth < 768 ? 3 : 5);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const handleFilter = (status) => {
    setFilteredSubmissions(status === "ALL" ? submissions : submissions.filter((sub) => sub.status === status));
    setCurrentPage(1);
  };

  const handleShow = (id) => { setCurrentId(id); setComments(""); setShowModal(true); };
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
    const { data } = await axios.get(`http://localhost:8080/api/timesheets/list/manager/${managerId}`);
    setSubmissions(data);
    setFilteredSubmissions(data);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastSubmission = currentPage * itemsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(indexOfFirstSubmission, indexOfLastSubmission);
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

  // Function to capitalize the first letter and make the rest lowercase
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Container className="mb-2 text-center relative">
      {loading && <Loader />}
      <h2 className="text-2xl font-bold m-4 inline-block font-serif">Submitted Timesheets</h2>
      <Button onClick={() => setShowCalendar(!showCalendar)} className="ml-2 mb-4 mt-2 float-right font-serif font-semibold">{showCalendar ? "Hide Calendar" : "Show Calendar"}</Button>
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-gradient-to-l from-purple-500 to-blue-500 rounded-lg pb-0 shadow-lg mr-5 h-3/2">
            <Calendar onChange={setDate} value={date} />
            <Button variant="primary" onClick={() => setShowCalendar(false)} className="m-2 p-1 text-white">Close</Button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-between mb-4 text-center space-y-4 sm:space-y-0 sm:space-x-4 font-serif">
        {["TOTAL REQUESTS", "APPROVED", "PENDING", "REJECTED"].map((status, idx) => (
          <div key={status} onClick={() => handleFilter(status === "TOTAL REQUESTS" ? "ALL" : status)} className={`pt-4 rounded shadow flex-1 min-w-[150px] mx-2 cursor-pointer ${status === "TOTAL REQUESTS" ? "bg-blue-100" : status === "APPROVED" ? "bg-green-300" : status === "PENDING" ? "bg-yellow-100" : "bg-red-100"}`}>
            <h2 className="text-lg font-semibold">{capitalizeFirstLetter(status)}</h2> 
            <p className="text-1xl font-bold">{status === "TOTAL REQUESTS" ? counts.total : counts[status.toLowerCase()]}</p>
          </div>
        ))}
      </div>

      {currentSubmissions.length ? (
        <>
          <Table striped bordered hover className="mt-3 text-center text-sm">
            <thead className="bg-gray-200">
              <tr>
                {["Start Date", "End Date", "Employee Name", "Client Name", "Project Name", "Total Hours", "Status", "Actions"].map((col) => (
                  <th key={col}>{col}</th>
                ))}
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
                      <span className={submission.status === "APPROVED" ? "text-green-600" : submission.status === "REJECTED"  ? "text-red-600" : "text-black"}>
                        {submission.status}
                      </span>
                    </td>
                    <td>
                      {submission.status !== "APPROVED" &&
                        submission.status !== "REJECTED" && (
                          <>
                            <Button className="bg-blue-500 text-white font-bold text-xs m-2 p-1" onClick={() => handleApprove(submission.id)}>Accept </Button>
                            <Button className="bg-red-500 text-white font-bold text-xs p-1"onClick={() => handleShow(submission.id)}>Reject</Button>
                          </>
                        )}
                    </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
        </>
      ) : (
        <p>No submissions found.</p>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <p className="font-bold text-lg">Comments</p>
        </Modal.Header>
        <Modal.Body>
          <Form.Control as="textarea" rows={3} value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="write your comments here"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="danger" onClick={handleReject} disabled={loading}> Reject</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManagerTimesheets;