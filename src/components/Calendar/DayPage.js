import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TERipple } from 'tw-elements-react';


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
    <section className="flex items-center justify-center min-h-screen bg-neutral-200 dark:bg-neutral-700 p-4">
      <div className="container max-w-7xl p-16"> {/* Increased max-width and padding */}
        <div className="flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="block rounded-xl shadow-2xl dark:bg-neutral-800 bg-white w-full"> {/* Wider block, increased shadow */}
            <div className="grid lg:grid-cols-2 gap-8"> {/* Changed to grid layout with gap */}
              {/* Left Column: List of Appointments */}
              <div className="px-10 py-8 md:px-8 lg:px-12"> {/* Increased padding */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
                    Appointments for {date}
                  </h2>
                  <button
                    onClick={() => navigate(-1)}
                    className="text-md text-blue-600 hover:underline mt-2"
                  >
                    Back to Calendar
                  </button>
                </div>
                <ul className="bg-neutral-100 rounded-xl shadow-md p-6 space-y-4"> {/* Increased padding and added spacing */}
                  {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <li
                        key={index}
                        className="p-3 border-b last:border-b-0 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 transition" // Added hover effect
                      >
                        <strong className="text-lg">{appointment.time}</strong>: 
                        <span className="ml-2 text-base">{appointment.service}</span>
                        <span className="text-sm text-neutral-500 ml-2">
                          (by {appointment.name})
                        </span>
                      </li>
                    ))
                  ) : (
                    <p className="text-neutral-600 dark:text-neutral-400 text-center text-lg">
                      No appointments scheduled for this date.
                    </p>
                  )}
                </ul>
              </div>

              {/* Right Column: Appointment Form */}
              <div
                className="flex items-center rounded-r-xl"
                style={{
                  background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)',
                }}
              >
                <div className="px-8 py-10 w-full"> {/* Increased padding */}
                  <h3 className="mb-8 text-2xl font-bold text-white text-center">
                    Set an Appointment
                  </h3>
                  <form
                    onSubmit={handleFormSubmit}
                    className="bg-white rounded-xl shadow-2xl p-8 flex flex-col gap-6 text-neutral-700 dark:text-black font-medium " // Increased padding and gap
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="p-3 text-lg border-2 rounded-lg border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="p-3 text-lg border-2 rounded-lg border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    >
                      {Array.from({ length: 17 - 9 + 1 }, (_, i) => {
                        const hour = 9 + i;
                        return (
                          <React.Fragment key={hour}>
                            <option value={`${hour}:00`}>{`${hour}:00`}</option>
                            {hour < 17 && <option value={`${hour}:30`}>{`${hour}:30`}</option>}
                          </React.Fragment>
                        );
                      })}
                    </select>
                    <input
                      type="text"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      placeholder="Service Type"
                      className="p-3 text-lg border-2 rounded-lg border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                    <TERipple rippleColor="light">
                      <button
                        type="submit"
                        className="w-full rounded-lg text-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-6 py-3 uppercase font-bold shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
                      >
                        Submit
                      </button>
                    </TERipple>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DayPage;
