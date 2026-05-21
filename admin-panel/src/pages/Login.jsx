import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      dispatch(setCredentials(data));
      navigate('/blogs');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Admin Login</h2>
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={submitHandler}>
          <input
            type="email"
            className="input-field"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
