import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, XCircle, Clock, CheckCircle } from 'lucide-react';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [booking, setBooking] = useState({ doctorId: '', date: '', time: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/login');
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    const res = await fetch('http://localhost:5000/api/doctors');
    const data = await res.json();
    setDoctors(data);
  };

  const fetchAppointments = async () => {
    const res = await fetch('http://localhost:5000/api/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setAppointments(data);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(booking)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      alert('Appointment booked successfully!');
      fetchAppointments();
      setBooking({ doctorId: '', date: '', time: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to cancel');
      fetchAppointments();
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 glass p-6 rounded-2xl">
          <h1 className="text-2xl font-bold text-primary">Patient Dashboard</h1>
          <button onClick={logout} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">Logout</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Section */}
          <div className="lg:col-span-1 glass p-6 rounded-2xl h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar size={20}/> Book Appointment</h2>
            <form onSubmit={handleBook} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-600 font-medium">Select Doctor</label>
                <select 
                  className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-primary outline-none"
                  value={booking.doctorId}
                  onChange={e => setBooking({...booking, doctorId: e.target.value})}
                  required
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>Dr. {doc.name} - {doc.specialty}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Date</label>
                <input 
                  type="date" 
                  className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-primary outline-none"
                  value={booking.date}
                  onChange={e => setBooking({...booking, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Time</label>
                <input 
                  type="time" 
                  className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-primary outline-none"
                  value={booking.time}
                  onChange={e => setBooking({...booking, time: e.target.value})}
                  required
                />
              </div>
              <button className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition mt-2 shadow-lg shadow-primary/20">
                Confirm Booking
              </button>
            </form>
          </div>

          {/* Appointments List */}
          <div className="lg:col-span-2 glass p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock size={20}/> My Appointments</h2>
            <div className="flex flex-col gap-4">
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No appointments found.</p>
              ) : (
                appointments.map(app => (
                  <div key={app._id} className="bg-white/60 p-4 rounded-xl border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                    <div>
                      <p className="font-semibold text-lg text-slate-800">Dr. {app.doctorId?.name} <span className="text-sm text-primary font-normal bg-blue-50 px-2 py-1 rounded-full">{app.doctorId?.specialty}</span></p>
                      <p className="text-sm text-gray-600 mt-1">{new Date(app.date).toLocaleDateString()} at {app.time}</p>
                      {app.notes && <p className="text-sm mt-2 text-gray-700 bg-gray-50 p-2 rounded">Notes: {app.notes}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'Booked' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {app.status}
                      </span>
                      {app.status === 'Booked' && (
                        <button onClick={() => handleCancel(app._id)} className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700 transition">
                          <XCircle size={14} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
