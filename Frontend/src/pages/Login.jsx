import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Activity } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      if (data.role === 'Admin') navigate('/admin');
      else if (data.role === 'Doctor') navigate('/doctor');
      else navigate('/patient');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="glass w-full max-w-md p-10 rounded-2xl animate-[fadeIn_0.4s_ease-out]">
        <div className="text-center mb-8">
          <Activity className="mx-auto text-primary" size={48} />
          <h1 className="text-3xl font-bold text-primary mt-2">MedCare</h1>
          <p className="text-gray-500 mt-1">
            {isLogin ? 'Welcome back to your portal' : 'Create your patient account'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-800">Full Name</label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-4 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full py-3 pl-11 pr-4 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-800">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full py-3 pl-11 pr-4 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-800">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full py-3 pl-11 pr-4 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover active:scale-95 transition-all flex justify-center items-center shadow-lg shadow-primary/30"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-semibold text-primary hover:underline"
          >
            {isLogin ? 'Register now' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
