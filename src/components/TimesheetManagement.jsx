import React, { useState, useEffect } from "react";
import { Button, Row, Col, Form, Card, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const FormField = ({ label, name, value, onChange, type = "text", required = false, options = [] }) => (
  <Col md={6}>
    <Form.Group controlId={`form${name}`}>
      <Form.Label>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Form.Label>
      {type === "select" ? (
        <Form.Control as="select" name={name} value={value} onChange={onChange}>
          <option value="" style={{ color: "grey" }}>
            Select {label.toLowerCase()}
          </option>
          {options.map((opt, index) => (
            <option key={index} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Form.Control>
      ) : (
        <Form.Control
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </Form.Group>
  </Col>
);

const TimesheetManagement = ({ setSubmissions }) => {
  const [formData, setFormData] = useState({
    employeeId: "MTL1021",managerId: "MTL1001",employeeName: "Anitha", startDate: "", endDate: "", numberOfHours: "", extraHours: "",
    clientName: "", projectName: "", taskType: "", workLocation: "",
    reportingManager: "", onCallSupport: "", taskDescription: ""
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.submission) {
      setFormData(location.state.submission);
      setIsEditing(true);
    } else if (location.state?.formData) {
      setFormData(location.state.formData);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors(null); // Clear errors when input is updated
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // List of required fields
    const requiredFields = [
      "startDate", "endDate", "clientName", "projectName", 
      "taskType", "workLocation", "reportingManager", "onCallSupport"
    ];

    // Validation to check if all required fields are filled correctly
    const isValid = requiredFields.every((field) => {
      const fieldValue = formData[field];
      if (field === "numberOfHours" || field === "extraHours") {
        // For numeric fields, check if they are valid numbers
        return !isNaN(fieldValue) && fieldValue !== "";
      }
      // For string fields, use trim to ensure there is no empty or whitespace only value
      return typeof fieldValue === 'string' ? fieldValue.trim() !== "" : fieldValue != null;
    });

    // Additional validation to check if the start date is before or equal to the end date
    if (!isValid || new Date(formData.startDate) > new Date(formData.endDate)) {
      setErrors("Please fill all required fields correctly.");
      return;
    }

    setLoading(true);

    // Navigate to TimesheetSubmission.jsx without submitting to database yet
    navigate("/timesheet-submission", { state: { formData } });
  };

  // Options for dropdowns
  const taskTypes = ["development", "design", "testing", "documentation", "research", "administration", "training", "support", "consulting", "maintenance", "meeting", "other"];
  const workLocations = ["office", "home", "client", "co-working Space", "field", "hybrid", "on-Site", "temporary Location", "mobile"];
  const onCallOptions = [{ value: "true", label: "Yes" }, { value: "false", label: "No" }];

  return (
    <Container>
      <Card className="m-4 font-serif">
        <Card.Header>
          <Card.Title className="text-lg font-semibold">{isEditing ? "Edit Timesheet" : "Submit Timesheet"}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <FormField label="Start Date" name="startDate" value={formData.startDate} onChange={handleChange} type="date" required />
              <FormField label="End Date" name="endDate" value={formData.endDate} onChange={handleChange} type="date" required />
            </Row>
            <Row className="mb-3">
              <FormField label="Number of Hours" name="numberOfHours" value={formData.numberOfHours} onChange={handleChange} type="number" required />
              <FormField label="Extra Hours" name="extraHours" value={formData.extraHours} onChange={handleChange} type="number" />
            </Row>
            <Row className="mb-3">
              <FormField label="Client Name" name="clientName" value={formData.clientName} onChange={handleChange} required />
              <FormField label="Project Name" name="projectName" value={formData.projectName} onChange={handleChange} required />
            </Row>
            <Row className="mb-3">
              <FormField label="Task Type" name="taskType" value={formData.taskType} onChange={handleChange} type="select" options={taskTypes.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))} required />
              <FormField label="Work Location" name="workLocation" value={formData.workLocation} onChange={handleChange} type="select" options={workLocations.map(location => ({ value: location, label: location.charAt(0).toUpperCase() + location.slice(1) }))} required />
            </Row>
            <Row className="mb-3">
              <FormField label="Reporting Manager" name="reportingManager" value={formData.reportingManager} onChange={handleChange} required />
              <FormField label="On-Call Support" name="onCallSupport" value={formData.onCallSupport} onChange={handleChange} type="select" options={onCallOptions} required />
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="formDescription">
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control as="textarea" name="taskDescription" value={formData.taskDescription} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            {errors && <div className="text-red-500 mb-3">{errors}</div>}
            <Button disabled={loading} type="submit" variant={isEditing ? "warning" : "primary"}>
              {isEditing ? "Update Timesheet" : "Submit Timesheet"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TimesheetManagement;