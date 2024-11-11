import React, { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ManagerHomePage from './components/ManagerHomePage';
import ManagerTimesheets from './components/ManagerTimesheets'
import EmployeeHomePage from './components/EmployeeHomePage';
import TimesheetManagement from './components/TimesheetManagement';
import TimesheetSubmission from './components/TimesheetSubmission';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [submissions, setSubmissions] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manager-home" element={<ManagerHomePage />} />
        <Route path="/manager-timesheets" element={<ManagerTimesheets />} />
        <Route path="/employee-home" element={<EmployeeHomePage submissions={submissions} setSubmissions={setSubmissions} />} />
        <Route path="/timesheet-management" element={<TimesheetManagement setSubmissions={setSubmissions} />} />
        <Route path="/timesheet-submission" element={<TimesheetSubmission setSubmissions={setSubmissions} />} />
      </Routes>
    </Router>
  );
};
export default App;
