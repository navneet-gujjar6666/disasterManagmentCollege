import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              National Disaster Management
              <span className="hero-subtitle">Emergency Response System</span>
            </h1>
            <p className="hero-description">
              A comprehensive platform for disaster preparedness, response coordination, 
              and community resilience. Join us in building a safer, more prepared nation.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary hero-btn">
                <span className="btn-icon">🔐</span>
                Access System
              </Link>
              <button className="btn btn-secondary hero-btn">
                <span className="btn-icon">📋</span>
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Emergency Response</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Active Disasters</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Contributions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>System Capabilities</h2>
            <p>Comprehensive disaster management tools for modern emergency response</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌪️</div>
              <h3>Disaster Tracking</h3>
              <p>Real-time monitoring and tracking of active disasters with detailed impact assessments and response coordination.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Community Contributions</h3>
              <p>Enable citizens to contribute resources, volunteer time, and provide critical information during emergencies.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>Comprehensive data visualization and reporting tools for informed decision-making and resource allocation.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Admin Management</h3>
              <p>Advanced administrative tools for disaster creation, contribution management, and system oversight.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Info Section */}
      <section className="emergency-section">
        <div className="container">
          <div className="emergency-content">
            <div className="emergency-text">
              <h2>Emergency Information</h2>
              <p>In case of emergency, please contact the appropriate authorities immediately.</p>
              <div className="emergency-contacts">
                <div className="contact-item">
                  <span className="contact-label">Emergency Services:</span>
                  <span className="contact-number">911</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Disaster Hotline:</span>
                  <span className="contact-number">1-800-DISASTER</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">FEMA:</span>
                  <span className="contact-number">1-800-621-FEMA</span>
                </div>
              </div>
            </div>
            <div className="emergency-alert">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <h3>Current Alert Level</h3>
                <div className="alert-level normal">Normal Operations</div>
                <p>All systems operational. No active emergencies requiring immediate attention.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>National Disaster Management</h4>
              <p>Building resilient communities through technology and collaboration.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/login">System Access</Link></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#emergency">Emergency Info</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Emergency: 911</p>
              <p>Support: support@disaster.gov</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 National Disaster Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
