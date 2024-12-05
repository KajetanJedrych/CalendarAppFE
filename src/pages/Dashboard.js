import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const localizer = momentLocalizer(moment);
const API_URL = "http://127.0.0.1:8000/api/calendar"

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/users/current_user', {
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

  // Fetch appointments for a specific month
  const fetchMonthAppointments = async (date) => {
    try {
      const token = localStorage.getItem('token');
      const firstDayOfMonth = moment(date).startOf('month').format('YYYY-MM-DD');
      const lastDayOfMonth = moment(date).endOf('month').format('YYYY-MM-DD');
      console.log('first day :', firstDayOfMonth);
      console.log('last day:', lastDayOfMonth);
      const response = await axios.get(`${API_URL}/appointments?date=${firstDayOfMonth}&end_date=${lastDayOfMonth}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Filter appointments for the current user
      const userAppointments = response.data.filter(
        appointment => appointment.user === currentUser?.id
      );

      // Transform appointments to calendar events
      const calendarEvents = userAppointments.map(appointment => ({
        title: `${appointment.service_name} - ${appointment.employee_name}`,
        start: new Date(`${appointment.date}T${appointment.time}`),
        end: moment(`${appointment.date}T${appointment.time}`).add(60, 'minutes').toDate(), // Assuming 1-hour duration
        id: appointment.id
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Fetch appointments when month changes
  const handleNavigate = (date) => {
    if (currentUser) {
      fetchMonthAppointments(date);
    }
  };

  const handleDayClick = (slotInfo) => {
    const selectedDate = moment(slotInfo.start).format('YYYY-MM-DD');
    navigate(`/day?date=${encodeURIComponent(selectedDate)}`);
  };

  // Initial load of current month's appointments
  useEffect(() => {
    if (currentUser) {
      fetchMonthAppointments(new Date());
    }
  }, [currentUser]);

  return (
    <section className="min-h-screen bg-neutral-200 dark:bg-neutral-700 p-8">
      <div className="container mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-200">
            Witaj, {currentUser ? currentUser.username : 'Użytkowniku'}!
          </h1>
          <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-300">
            Miło Cię widzieć w naszym studio masażu. Poniżej znajdziesz swój kalendarz wizyt.
          </p>
        </header>

        <div className="flex flex-col items-center justify-center">
          <img
            src="https://cdn.pixabay.com/photo/2020/11/29/07/06/aroma-5786653_640.png"
            alt="Studio masażu"
            className="mb-8 w-48 h-auto"
          />

          <div className="w-full h-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              Twój kalendarz wizyt
            </h2>

            <div className="bg-neutral-100 p-4 rounded-lg">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '60vh', width: '100%' }}
                views={['month']}
                selectable
                onSelectSlot={handleDayClick}
                onSelectEvent={handleDayClick}
                onNavigate={handleNavigate}
                messages={{
                  today: 'Dzisiaj',
                  previous: 'Poprzedni',
                  next: 'Następny',
                  month: 'Miesiąc',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientDashboard;