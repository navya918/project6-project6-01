import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ManagerHomePage = () => {
  const navigate = useNavigate();

  const handleAccessTimesheets = () => {
    navigate('/manager-timesheets'); // Navigates to the timesheet management page for managers
  };

  return (
    <Container className="mt-5 text-center">
      <h1 className='font-serif'>Welcome Manager</h1>
      <Button className="m-3" onClick={handleAccessTimesheets}>
        View Submitted Timesheets
      </Button>
    </Container>
  );
};

export default ManagerHomePage;
