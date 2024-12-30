import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleManagerPage = () => {
    navigate('/manager-home'); // Navigate to the Manager Home Page
  };

  const handleEmployeePage = () => {
    navigate('/employee-home'); // Navigate to the Employee Home Page
  };

  return (
    <Container className="mt-5 text-center px-4 font-serif">
      <h1 className='text-2xl font-bold mb-5 font-serif'>Welcome to the Timesheet Management System</h1>
      <Button className="bg-gradient-to-l from-purple-500 to-blue-500 mb-3 text-white font-bold rounded-lg shadow-md m-3" onClick={handleManagerPage}>Manager Dashboard</Button>
      <Button className="bg-gradient-to-r from-purple-500 to-blue-500 mb-3 text-white font-bold rounded-lg shadow-md m-3" onClick={handleEmployeePage}>Employee Dashboard</Button>
    </Container>
  );
};

export default Home;