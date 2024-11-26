import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TERipple } from 'tw-elements-react';


const MASSAGE_SERVICES = [
  { id: 1, name: 'Swedish Massage', duration: 60 },
  { id: 2, name: 'Deep Tissue Massage', duration: 60 },
  { id: 3, name: 'Sports Massage', duration: 90 },
  { id: 4, name: 'Relaxation Massage', duration: 45 }
];

const DayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date');

  const [appointments, setAppointments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    service: '',
    employee: '',
    time: '',
    notes: ''
  });
  // Fetch current user

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/current-user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        navigate('/login');
      }
    };

    fetchCurrentUser();
  }, [navigate]);


  // Fetch employees

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/employees', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

    // Fetch appointments for the specific date
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/appointments?date=${date}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    if (date) {
      fetchAppointments();
    }
  }, [date]);

  // Check availability of time slots
  useEffect(() => {
    const checkAvailability = async () => {
      if (formData.employee && formData.service) {
        try {
          const token = localStorage.getItem('token');
          const selectedService = MASSAGE_SERVICES.find(s => s.id === parseInt(formData.service));
          const response = await axios.get('/api/available-slots', {
            params: {
              date,
              employee_id: formData.employee,
              service_id: formData.service
            },
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setAvailableTimeSlots(response.data);
        } catch (error) {
          console.error('Error checking availability:', error);
        }
      }
    };

    checkAvailability();
  }, [formData.employee, formData.service, date]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/appointments', {
        service: formData.service,
        employee: formData.employee,
        date,
        time: formData.time,
        notes: formData.notes
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh appointments
      const response = await axios.get(`/api/appointments?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAppointments(response.data);
      
      // Reset form
      setFormData({ time: '', service: '', employee: '', notes: '' });
    } catch (error) {
      console.error('Error setting appointment:', error);
      alert('Failed to create appointment. Please try again.');
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-neutral-200 dark:bg-neutral-700 p-4">
      <div className="container max-w-7xl p-16">
        <div className="flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="block rounded-xl shadow-2xl dark:bg-neutral-800 bg-white w-full">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column: List of Appointments */}
              <div className="px-10 py-8 md:px-8 lg:px-12">
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
                <ul className="bg-neutral-100 rounded-xl shadow-md p-6 space-y-4">
                  {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <li
                        key={index}
                        className="p-3 border-b last:border-b-0 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 transition"
                      >
                        <strong className="text-lg">{appointment.time}</strong>:
                        <span className="ml-2 text-base">{appointment.service}</span>
                        <span className="text-sm text-neutral-500 ml-2">
                          (by {appointment.userName})
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
                <div className="px-8 py-10 w-full">
                  <h3 className="mb-8 text-2xl font-bold text-white text-center">
                    Set an Appointment
                  </h3>
                  {currentUser && (
                    <form
                      onSubmit={handleFormSubmit}
                      className="bg-white rounded-xl shadow-2xl p-8 flex flex-col gap-6 text-neutral-700 dark:text-black font-medium"
                    >
                      <div className="text-lg border-2 rounded-lg border-neutral-300 p-3">
                        Booking as: {currentUser.name}
                      </div>

                      <select
                        name="employee"
                        value={formData.employee}
                        onChange={handleInputChange}
                        className="p-3 text-lg border-2 rounded-lg border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                      >
                        <option value="">Select Massage Therapist</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name}
                          </option>
                        ))}
                      </select>

                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="p-3 text-lg border-2 rounded-lg border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                      >
                        <option value="">Select Service</option>
                        {MASSAGE_SERVICES.map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name} ({service.duration} min)
                          </option>
                        ))}
                      </select>

                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="p-3 text-lg border-2 rounded-lg border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                        disabled={!availableTimeSlots.length}
                      >
                        <option value="">
                          {availableTimeSlots.length ? 'Select Time' : 'Select worker and service first'}
                        </option>
                        {availableTimeSlots.map(slot => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>

                      <TERipple rippleColor="light">
                        <button
                          type="submit"
                          className="w-full rounded-lg text-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-6 py-3 uppercase font-bold shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                          Submit
                        </button>
                      </TERipple>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DayPage;
