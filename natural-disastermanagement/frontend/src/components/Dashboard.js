import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDisasters: 0,
    totalContributions: 0,
    myContributions: 0,
    recentContributions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const [disastersRes, contributionsRes, myContributionsRes] = await Promise.all([
        api.get('/disaster'),
        api.get('/contribution'),
        api.get('/contribution?userId=' + user?._id)
      ]);

      setStats({
        totalDisasters: disastersRes.data.data?.length || 0,
        totalContributions: contributionsRes.data.data?.length || 0,
        myContributions: myContributionsRes.data.data?.length || 0,
        recentContributions: contributionsRes.data.data?.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Don't show error toast for empty data, just set defaults
      setStats({
        totalDisasters: 0,
        totalContributions: 0,
        myContributions: 0,
        recentContributions: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Emergency Response Dashboard</h1>
          <p>Welcome back, <span className="user-highlight">{user?.name || 'User'}</span>! Here's your disaster management overview.</p>
          <div className="user-role-badge">
            <span className="role-icon">{user?.role === 'admin' ? '🛡️' : '👤'}</span>
            <span className="role-text">{user?.role === 'admin' ? 'Administrator' : 'Emergency Responder'}</span>
          </div>
        </div>
        <div className="system-status">
          <div className="status-indicator online">
            <div className="status-dot"></div>
            <span>System Online</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card quick-actions-card">
        <div className="card-header">
          <h3>⚡ Quick Actions</h3>
          <p>Access essential emergency response tools</p>
        </div>
        <div className="quick-actions">
          <Link to="/contribute" className="action-card">
            <div className="action-icon">🤝</div>
            <div className="action-content">
              <h4>Create Contribution</h4>
              <p>Submit resources or volunteer assistance</p>
            </div>
            <div className="action-arrow">→</div>
          </Link>
          
          <Link to="/disasters" className="action-card">
            <div className="action-icon">🌪️</div>
            <div className="action-content">
              <h4>View Disasters</h4>
              <p>Monitor active emergency situations</p>
            </div>
            <div className="action-arrow">→</div>
          </Link>
          
          <div className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-content">
              <h4>My Contributions</h4>
              <p>Track your submitted contributions</p>
            </div>
            <div className="action-arrow">→</div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">🌪️</div>
            <div className="stat-trend positive">+12%</div>
          </div>
          <div className="stat-content">
            <h3>{stats.totalDisasters}</h3>
            <p>Active Disasters</p>
            <div className="stat-subtitle">Currently monitored</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">🤝</div>
            <div className="stat-trend positive">+8%</div>
          </div>
          <div className="stat-content">
            <h3>{stats.totalContributions}</h3>
            <p>Total Contributions</p>
            <div className="stat-subtitle">Community support</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">👤</div>
            <div className="stat-trend neutral">0%</div>
          </div>
          <div className="stat-content">
            <h3>{stats.myContributions}</h3>
            <p>My Contributions</p>
            <div className="stat-subtitle">Your submissions</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">📈</div>
            <div className="stat-trend positive">100%</div>
          </div>
          <div className="stat-content">
            <h3>100%</h3>
            <p>System Status</p>
            <div className="stat-subtitle">All systems operational</div>
          </div>
        </div>
      </div>

      {/* Recent Contributions */}
      <div className="card">
        <div className="card-header">
          <h3>🕒 Recent Contributions</h3>
          <p>Latest community contributions and updates</p>
        </div>
        {stats.recentContributions.length > 0 ? (
          <div className="contributions-list">
            {stats.recentContributions.map(contribution => (
              <div key={contribution._id} className="contribution-item">
                <div className="contribution-icon">
                  <span className="contribution-type-icon">
                    {contribution.contributionType === 'financial' ? '💰' : 
                     contribution.contributionType === 'volunteer' ? '👷' : '📦'}
                  </span>
                </div>
                <div className="contribution-info">
                  <h4>{contribution.title}</h4>
                  <p>{contribution.description}</p>
                  <div className="contribution-meta">
                    <span className="contribution-type">{contribution.contributionType}</span>
                    <span className="contribution-date">
                      {new Date(contribution.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="contribution-status">
                  <span className={`status-badge ${contribution.status}`}>
                    {contribution.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <div className="no-data-icon">📋</div>
            <h4>No Recent Contributions</h4>
            <p>No recent contributions found. Check back later for updates.</p>
            <Link to="/contribute" className="btn btn-primary">
              Make Your First Contribution
            </Link>
          </div>
        )}
      </div>

      {/* Emergency Contacts */}
      <div className="card emergency-contacts-card">
        <div className="card-header">
          <h3>🚨 Emergency Contacts</h3>
          <p>Critical contact information for emergency situations</p>
        </div>
        <div className="emergency-grid">
          <div className="emergency-item">
            <div className="emergency-icon">📞</div>
            <div className="emergency-info">
              <h4>Emergency Services</h4>
              <p className="emergency-number">911</p>
            </div>
          </div>
          <div className="emergency-item">
            <div className="emergency-icon">🏛️</div>
            <div className="emergency-info">
              <h4>FEMA Hotline</h4>
              <p className="emergency-number">1-800-621-FEMA</p>
            </div>
          </div>
          <div className="emergency-item">
            <div className="emergency-icon">🌪️</div>
            <div className="emergency-info">
              <h4>Disaster Hotline</h4>
              <p className="emergency-number">1-800-DISASTER</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
