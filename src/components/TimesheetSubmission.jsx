import React, { useState } from 'react';
import { Card, Table, Button, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const TimesheetSubmission = ({ setSubmissions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState("");
  const { formData } = location.state || {};

  // Function to handle timesheet submission
  const handleSubmitToHome = async () => {
    try {
      const newFormData = {
        ...formData,
        SubmissionDate: new Date().toISOString(),
      };

      const response = await axios.post("http://localhost:8080/api/timesheets", newFormData);
      console.log(response.data);

      // Add the new submission to the list of submissions
      setSubmissions((prev) => [...prev, response.data]);
      navigate('/employee-home'); // Navigate to employee home page

    } catch (error) {
      console.log("Error submitting timesheet:", error);
      setErrors(error.response?.data || 'Error occurred');
      console.log("Error response data:", error.response?.data);
    }
  };

  // Function to handle going back to the form
  const handleBackToForm = () => {
    navigate('/timesheet-management', { state: { formData } });
  };

  // Destructure submissionData and prepare for rendering
  const { emailId, totalNumberOfHours, comments, managerName, status, id, ...displayData } = formData;

  return (
    <Container>
      <Card className="m-2 font-serif">
        <Card.Header>
          <Card.Title>Submitted Timesheet Data</Card.Title>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(displayData).map(([key, value]) => (
                <tr key={key}>
                  <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                  <td>{key === 'onCallSupport' ? (value === 'true' || value === true ? 'Yes' : 'No') : value !== undefined ? value : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="text-red-600">{errors}</p>
          <Button onClick={handleBackToForm} variant="primary" className="m-3">Back to Form</Button>
          <Button 
            onClick={handleSubmitToHome} 
            variant="secondary" 
            className="m-2 font-bold text-white transition duration-500 bg-gradient-to-r from-red-500 to-orange-400 shadow-lg hover:bg-right-50 active:scale-95"
          >
            Submit and Return Home
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TimesheetSubmission;