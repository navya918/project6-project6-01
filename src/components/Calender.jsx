import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Calendar } from 'react-calendar'; // Make sure to install and import the Calendar component

export const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="relative">
      <Button 
        onClick={() => setShowCalendar(!showCalendar)} 
        className="ml-5 mb-4 absolute top-5 right-5 font-serif font-semibold"
      >
        {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
      </Button>
      
      {/* Overlay Calendar Component */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-l from-purple-500 to-blue-500 rounded-lg p-5 shadow-lg">
            <Calendar
              onChange={setDate}
              value={date}
            />
            <Button 
              variant='primary' 
              onClick={() => setShowCalendar(false)} 
              className="mt-4 p-2 bg-blue-600 text-white rounded"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
