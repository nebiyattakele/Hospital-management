import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Check } from 'lucide-react';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/login');
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch('http://localhost:5000/api/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setAppointments(data);
  };

  const handleUpdate = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status, notes: selectedApp === id ? notes : undefined })
      });
      if (!res.ok) throw new Error('Failed to update');
      fetchAppointments();
      setSelectedApp(null);
      setNotes('');
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
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 glass p-6 rounded-2xl">
          <h1 className="text-2xl font-bold text-primary">Doctor Portal</h1>
          <button onClick={logout} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">Logout</button>
        </header>

        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users size={20}/> My Schedule</h2>
          <div className="flex flex-col gap-4">
            {appointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments found.</p>
            ) : (
              appointments.map(app => (
                <div key={app._id} className="bg-white/60 p-5 rounded-xl border border-gray-100 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg text-slate-800">{app.patientId?.name}</p>
                      <p className="text-sm text-gray-600">{app.patientId?.email}</p>
                      <p className="text-sm font-medium text-primary mt-1">{new Date(app.date).toLocaleDateString()} • {app.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'Booked' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  {app.status === 'Booked' && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {selectedApp === app._id ? (
                        <div className="flex flex-col gap-2">
                          <textarea 
                            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-sm"
                            placeholder="Add medical notes here..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows="2"
                          />
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleUpdate(app._id, 'Completed')}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition flex items-center gap-1"
                            >
                              <Check size={16}/> Mark Completed
                            </button>
                            <button 
                              onClick={() => setSelectedApp(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setSelectedApp(app._id); setNotes(app.notes || ''); }}
                          className="text-sm flex items-center gap-1 text-primary hover:text-primary-hover transition font-medium"
                        >
                          <FileText size={16} /> Add Notes & Complete
                        </button>
                      )}
                    </div>
                  )}

                  {app.status === 'Completed' && app.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 font-medium">Notes:</p>
                      <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg mt-1">{app.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
