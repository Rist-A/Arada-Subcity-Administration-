import React, { useEffect } from 'react';
import { FiCalendar } from 'react-icons/fi';

const HallReservation = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCalendlyClick = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/ristwubrist/new-meeting',
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Hall Reservations</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="mb-6">
          <button
            onClick={handleCalendlyClick}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
          >
            <FiCalendar className="mr-2" />
            Schedule Hall Reservation
          </button>
        </div>
        
        {/* Instructions... */}
      </div>
    </div>
  );
};

export default HallReservation;