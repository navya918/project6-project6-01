import React from 'react';
import { Card, Table, Button, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const TimesheetSubmission = ({ setSubmissions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { submissionData, formData } = location.state || {};

  if (!submissionData) {
    return <div>Loading...</div>;
  }

  const handleSubmitToHome = () => {
    setSubmissions((prev) => [...prev, submissionData]);
    navigate('/employee-home');
  };

  const handleBackToForm = () => {
    navigate('/timesheet-management', { state: { formData } });
  };

  return (
    <Container>
      <TimesheetSubmissionDetail
        submissionData={submissionData}
        handleSubmitToHome={handleSubmitToHome}
        handleBack={handleBackToForm}
      />
    </Container>
  );
};

const TimesheetSubmissionDetail = ({ submissionData, handleSubmitToHome, handleBack }) => {
  const { employeeName, comments, manager, managerName, status, id, emailId, ...displayData } = submissionData;

  return (
    <Card className='m-2 font-serif'>
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
                <td >{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                <td>{key === 'onCallSupport' ? (value === true ? 'Yes' : 'No') : value !== undefined ? value : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={handleBack} variant="primary" className="m-3">Back to Form</Button>
        <Button 
          onClick={handleSubmitToHome} 
          variant="secondary" 
          className="m-2 font-bold text-white transition duration-500 bg-gradient-to-r from-red-500 to-orange-400 shadow-lg hover:bg-right-50 active:scale-95"
        >
          Submit and Return Home
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TimesheetSubmission;
