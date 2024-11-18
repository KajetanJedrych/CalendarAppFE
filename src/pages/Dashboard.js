import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const ClientDashboard = () => {
  const navigate = useNavigate();

  // Przykładowe wydarzenia
  const events = [
    {
      title: 'Masaż relaksacyjny',
      start: new Date(),
      end: new Date(moment().add(1, 'hours').toDate()),
    },
    {
      title: 'Masaż sportowy',
      start: new Date(moment().add(1, 'days').toDate()),
      end: new Date(moment().add(1, 'days').add(1, 'hours').toDate()),
    },
  ];

  return (
    <section className="min-h-screen bg-neutral-200 dark:bg-neutral-700 p-8">
      <div className="container mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-200">
            Witaj, Jan Kowalski!
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

          <div className="w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              Twój kalendarz wizyt
            </h2>

            <div className="bg-neutral-100 p-4 rounded-lg">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '40vh', width: '100%' }}
                views={['month']}
                onSelectEvent={() => navigate('/calendar')}
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
