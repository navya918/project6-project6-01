import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form, Card, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TimesheetSubmission from './TimesheetSubmission';

export default function TimesheetManagement({ setSubmissions }) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    numberOfHours: '',
    extraHours: '',
    clientName: '',
    projectName: '',
    taskType: '',
    workLocation: '',
    reportingManager: '',
    onCallSupport: '',
    taskDescription: ''
  });
  const [submissionData, setSubmissionData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      if (location.state.submission) {
        setFormData(location.state.submission);
        setIsEditing(true);
      } else if (location.state.formData) {
        setFormData(location.state.formData);
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setErrors(null); // Clear errors when the employee updates input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'startDate', 'endDate', 'clientName',
      'projectName', 'taskType', 'workLocation',
      'reportingManager', 'onCallSupport'
    ];

    // Check if all required fields are non-empty
    const isValid = requiredFields.every(field => {
      const value = String(formData[field]); // Ensure value is treated as a string
      return value.trim() !== ''; // Check if the trimmed string is not empty
    });

    // Check numeric fields for validity
    const numberFields = ['numberOfHours'];
    const areNumbersValid = numberFields.every(field => {
      const value = formData[field];
      return (value !== '' && !isNaN(value) && value >= 0);
    });

    // Check date validity
    const isDateValid = new Date(formData.startDate) <= new Date(formData.endDate);

    // Display error if any validation fails
    if (!isValid || !areNumbersValid || !isDateValid) {
      let errorMessage = 'Please fill all required fields correctly.';
      if (!isDateValid) {
        errorMessage += ' Ensure that the start date is before the end date.';
      }
      setErrors(errorMessage);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/timesheets', {
        ...formData,
        employeeId: "MTL1015",
        managerId: "MTL1001",
        employeeName: "Anitha",
        SubmissionDate: new Date().toISOString()
      });
      navigate('/timesheet-submission', { state: { submissionData: response.data, formData } });
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      setErrors('A timesheet for the selected dates has already been submitted. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  // If submissionData exists, render TimesheetSubmission
  if (submissionData) {
    return (
      <TimesheetSubmission
        submissionData={submissionData}
        handleBack={() => setSubmissionData(null)}
        setSubmissions={setSubmissions}
      />
    );
  }

  return (
    <Container>
      <Card className="m-4 font-serif">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">{isEditing ? 'Edit Timesheet' : 'Submit Timesheet'}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
            <Col md={6}>
            <Form.Group controlId="formStartDate">
           <Form.Label>Start Date<span className="text-red-500">*</span></Form.Label>
             <div className="relative">
               <input
                type="date"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleChange}
                placeholder='dd/mm/yy'
                className="block w-full p-2 border rounded  focus:outline-none focus:ring focus:ring-blue-500"  style={{ color: formData.startDate === "" ? 'grey' : 'black' }}
               />
             </div>
            </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group controlId="formEndDate">
            <Form.Label>End Date<span className="text-red-500">*</span></Form.Label>
              <div className="relative">
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500" style={{ color: formData.endDate === "" ? 'grey' : 'black' }} />
              </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formHours">
                  <Form.Label>Number of Hours<span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="numberOfHours"
                    min="0"
                    step="0.5"
                    value={formData.numberOfHours}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formExtraHours">
                  <Form.Label>Extra Hours</Form.Label>
                  <Form.Control
                    type="number"
                    name="extraHours"
                    min="0"
                    step="0.5"
                    value={formData.extraHours}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formClient">
                  <Form.Label>Client Name<span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formProject">
                  <Form.Label>Project Name<span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formTaskType">
                  <Form.Label>Task Type<span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    as="select"
                    name="taskType"
                    value={formData.taskType}
                    onChange={handleChange}
                    style={{ color: formData.taskType === "" ? 'grey' : 'black' }} // Set color based on value
                  >
                    <option value="" style={{ color: 'grey' }}>Select task type</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="testing">Testing</option>
                    <option value="documentation">Documentation</option>
                    <option value="research">Research</option>
                    <option value="administration">Administration</option>
                    <option value="training">Training</option>
                    <option value="support">Support</option>
                    <option value="consulting">Consulting</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="meeting">Meeting</option>
                    <option value="other">Other</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formLocation">
                  <Form.Label>Work Location<span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    as="select"
                    name="workLocation"
                    value={formData.workLocation}
                    onChange={handleChange}
                    style={{ color: formData.taskType === "" ? 'grey' : 'black' }}
                  >
                    <option value="" style={{ color: 'grey' }}>Select work location</option>
                    <option value="office">Office</option>
                    <option value="home">Home</option>
                    <option value="client">Client Site</option>
                    <option value="co-working Space">Co-working Space</option>
                    <option value="field">Field</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-Site">On-Site</option>
                    <option value="temporary Location">Temporary Location</option>
                    <option value="mobile">Mobile</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formManager">
                  <Form.Label>Reporting Manager<span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="reportingManager"
                    value={formData.reportingManager}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formOnCallSupport">
                  <Form.Label>On-Call Support<span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    as="select"
                    name="onCallSupport"
                    value={formData.onCallSupport}
                    onChange={handleChange}
                    style={{ color: formData.taskType === "" ? 'grey' : 'black' }}
                  >
                    <option value="" style={{ color: 'grey' }}>Select on-call status</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="formDescription">
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="taskDescription"
                    value={formData.taskDescription}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            {errors && <div className="text-red-500 mb-3">{errors}</div>}
            <Button
              disabled={loading}
              type="submit"
              variant={isEditing ? "warning" : "primary"}
            >
              {isEditing ? 'Update Timesheet' : 'Submit Timesheet'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
