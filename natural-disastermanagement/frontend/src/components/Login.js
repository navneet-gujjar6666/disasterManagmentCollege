import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isRegister) {
      setRegisterData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (isRegister) {
        if (registerData.password !== registerData.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        
        result = await register({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          role: isAdmin ? 'admin' : 'user'
        });
      } else {
        result = await login(formData.email, formData.password);
      }

      if (result.success) {
        toast.success(isRegister ? 'Registration successful!' : 'Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">🛡️</div>
              <div className="logo-text">
                <h2>National Disaster Management</h2>
                <span className="logo-subtitle">Emergency Response System</span>
              </div>
            </div>
            <div className="login-title">
              <h3>{isRegister ? (isAdmin ? 'Admin Registration' : 'Create Account') : (isAdmin ? 'Admin Access' : 'System Login')}</h3>
              <p>{isRegister ? 'Join the emergency response network' : 'Access the disaster management system'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {isRegister && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <span className="label-icon">👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={registerData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={isRegister ? registerData.email : formData.email}
                onChange={handleInputChange}
                className="form-control"
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={isRegister ? registerData.password : formData.password}
                onChange={handleInputChange}
                className="form-control"
                required
                placeholder="Enter your password"
              />
            </div>

            {isRegister && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <span className="label-icon">🔐</span>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <button 
              type="submit" 
              className={`btn ${isAdmin ? 'btn-primary' : ''} login-btn`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  {isRegister ? 'Creating Account...' : 'Authenticating...'}
                </>
              ) : (
                <>
                  <span className="btn-icon">{isRegister ? '📝' : '🔑'}</span>
                  {isRegister ? 'Create Account' : 'Login to System'}
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="footer-section">
              <p>
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? 'Login here' : 'Register here'}
                </button>
              </p>
            </div>
            
            <div className="footer-section">
              <p>
                {isAdmin ? 'Switch to user mode?' : 'Are you an administrator?'}
                <button
                  type="button"
                  className="toggle-btn admin-toggle"
                  onClick={() => setIsAdmin(!isAdmin)}
                >
                  {isAdmin ? 'User Mode' : 'Admin Mode'}
                </button>
              </p>
            </div>
            
            <div className="security-notice">
              <span className="security-icon">🛡️</span>
              <span>Secure government system - All activities are monitored and logged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
