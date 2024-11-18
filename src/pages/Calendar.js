import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic data
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);

  const [selectedService, setSelectedService] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedHour, setSelectedHour] = useState('');

  // Fetch data from backend
  useEffect(() => {
    // Pobierz dane usług i pracowników
    const fetchData = async () => {
      const servicesResponse = await axios.get('/api/services/');
      const employeesResponse = await axios.get('/api/employees/');
      setServices(servicesResponse.data);
      setEmployees(employeesResponse.data);
    };

    fetchData();
  }, []);

  const handleDayClick = async ({ start }) => {
    setSelectedDate(start);

    // Pobierz dostępne godziny dla wybranego dnia
    const hoursResponse = await axios.get(`/api/availability/?date=${start.toISOString()}`);
    setAvailableHours(hoursResponse.data);

    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      title: `${selectedService} z ${selectedEmployee}`,
      start: new Date(selectedDate.setHours(parseInt(selectedHour))),
      end: new Date(selectedDate.setHours(parseInt(selectedHour) + 1)),
    };

    // Dodaj nowe wydarzenie do kalendarza
    setEvents([...events, newEvent]);

    // Wyślij dane na backend
    await axios.post('/api/appointments/', {
      service: selectedService,
      employee: selectedEmployee,
      date: selectedDate,
      hour: selectedHour,
    });

    // Zamknij modal
    setIsModalOpen(false);
  };

  return (
    <div className="p-10 bg-neutral-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Zarządzaj wizytami</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '75vh' }}
          selectable
          onSelectSlot={handleDayClick}
          messages={{
            today: 'Dzisiaj',
            previous: 'Poprzedni',
            next: 'Następny',
            month: 'Miesiąc',
          }}
        />
      </div>

      {/* Modal for appointment form */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center>
        <h2 className="text-xl font-bold mb-4">Dodaj wizytę na {moment(selectedDate).format('LL')}</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rodzaj masażu</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Wybierz rodzaj masażu</option>
              {services.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Pracownik</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Wybierz pracownika</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Godzina</label>
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Wybierz godzinę</option>
              {availableHours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}:00
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Dodaj wizytę
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CalendarPage;
