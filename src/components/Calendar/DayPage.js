import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date'); // Extract selected date from query params

  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    service: '',
  });

  useEffect(() => {
    // Fetch appointments for the selected date
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`/api/appointments?date=${date}`);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [date]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/appointments', { ...formData, date });
      // Refresh appointments list after submission
      const response = await axios.get(`/api/appointments?date=${date}`);
      setAppointments(response.data);
      setFormData({ name: '', time: '', service: '' }); // Reset form
    } catch (error) {
      console.error('Error setting appointment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200 dark:bg-neutral-700 p-8">
      <div className="container mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 text-blue-500">
          Back to Calendar
        </button>

        <h1 className="text-3xl font-bold mb-4">
          Appointments for {date}
        </h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Existing Appointments</h2>
          <ul className="bg-white rounded-lg shadow-md p-4">
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <li key={index} className="p-2 border-b last:border-b-0">
                  <strong>{appointment.time}</strong>: {appointment.service} (by {appointment.name})
                </li>
              ))
            ) : (
              <p>No appointments scheduled for this date.</p>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Set an Appointment</h2>
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-4"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              className="p-2 border rounded"
              required
            />
            <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="p-2 border rounded"
                required
            >
                {Array.from({ length: 17 - 9 + 1 }, (_, i) => {
                    const hour = 9 + i;
                    return (
                        <>
                            <option value={`${hour}:00`}>{`${hour}:00`}</option>
                            {hour < 17 && <option value={`${hour}:30`}>{`${hour}:30`}</option>}
                        </>
                    );
                })}
            </select>
            <input
              type="text"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              placeholder="Service Type"
              className="p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default DayPage;
