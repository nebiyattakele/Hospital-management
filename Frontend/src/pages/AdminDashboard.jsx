import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', specialty: '', contactNumber: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/doctors', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      alert('Doctor created successfully!');
      setFormData({ name: '', email: '', password: '', specialty: '', contactNumber: '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-8 flex justify-center items-center">
      <div className="w-full max-w-md glass p-8 rounded-2xl animate-[fadeIn_0.4s_ease-out]">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2"><Shield size={24}/> Admin Portal</h1>
          <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
        </header>

        <h2 className="text-lg font-semibold mb-4 text-slate-800">Register New Doctor</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Dr. Full Name" required
            className="w-full p-3 rounded-xl border border-gray-200 bg-white/60 focus:ring-2 focus:ring-primary outline-none"
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-3 rounded-xl border border-gray-200 bg-white/60 focus:ring-2 focus:ring-primary outline-none"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Temporary Password" required
            className="w-full p-3 rounded-xl border border-gray-200 bg-white/60 focus:ring-2 focus:ring-primary outline-none"
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <input 
            type="text" placeholder="Specialty (e.g. Cardiology)" required
            className="w-full p-3 rounded-xl border border-gray-200 bg-white/60 focus:ring-2 focus:ring-primary outline-none"
            value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})}
          />
          <input 
            type="text" placeholder="Contact Number" required
            className="w-full p-3 rounded-xl border border-gray-200 bg-white/60 focus:ring-2 focus:ring-primary outline-none"
            value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})}
          />
          
          <button 
            type="submit" disabled={loading}
            className="mt-2 w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? 'Creating...' : <><Plus size={20}/> Create Doctor</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
