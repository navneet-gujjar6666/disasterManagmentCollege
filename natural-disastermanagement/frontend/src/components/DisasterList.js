import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './DisasterList.css';

const DisasterList = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: '',
    severity: '',
    status: ''
  });

  const UPLOADS_HOST = 'http://localhost:5000';

  const buildFileUrl = (file) => {
    if (!file) return '';
    // Prefer server-provided relative path rooted at /uploads
    let rawPath = file.path || '';
    // Replace any number of backslashes with forward slashes (Windows paths)
    const normalized = String(rawPath).replace(/\\+/g, '/');
    // Extract the part from /uploads onward if present
    const lower = normalized.toLowerCase();
    const at = lower.indexOf('/uploads/');
    const relative = at >= 0 ? normalized.substring(at) : `/uploads/${file.filename || ''}`;
    // Ensure absolute URL and safely encode spaces/characters
    const absolute = `${UPLOADS_HOST}${relative}`;
    return encodeURI(absolute);
  };

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      const response = await api.get('/disaster');
      setDisasters(response.data.data);
    } catch (error) {
      console.error('Error fetching disasters:', error);
      toast.error('Failed to load disasters');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredDisasters = disasters.filter(disaster => {
    if (filter.type && disaster.type !== filter.type) return false;
    if (filter.severity && disaster.severity !== filter.severity) return false;
    if (filter.status && disaster.status !== filter.status) return false;
    return true;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#dc3545';
      case 'resolved': return '#28a745';
      case 'monitoring': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  // Delete functionality moved to Create Disaster module (DisasterForm)

  if (loading) {
    return (
      <div className="disaster-list-container">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="disaster-list-container">
      <div className="header">
        <h1>🌪️ Disaster List</h1>
        <p>View and manage active disasters in the system</p>
      </div>

      {/* Filters */}
      <div className="card">
        <h3>🔍 Filters</h3>
        <div className="filters">
          <div className="filter-group">
            <label className="form-label">Type</label>
            <select
              name="type"
              value={filter.type}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Types</option>
              <option value="earthquake">Earthquake</option>
              <option value="flood">Flood</option>
              <option value="hurricane">Hurricane</option>
              <option value="tornado">Tornado</option>
              <option value="wildfire">Wildfire</option>
              <option value="tsunami">Tsunami</option>
              <option value="volcanic_eruption">Volcanic Eruption</option>
              <option value="drought">Drought</option>
              <option value="landslide">Landslide</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Severity</label>
            <select
              name="severity"
              value={filter.severity}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="monitoring">Monitoring</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disaster List */}
      <div className="card">
        <div className="disaster-header">
          <h3>📋 Disasters ({filteredDisasters.length})</h3>
          <div className="disaster-actions-header">
            <Link to="/contribute" className="btn">
              🤝 Contribute
            </Link>
          </div>
        </div>

        {filteredDisasters.length > 0 ? (
          <div className="disasters-grid">
            {filteredDisasters.map(disaster => (
              <div key={disaster._id} className="disaster-card">
                <div className="disaster-header-card">
                  <h4>{disaster.title}</h4>
                  <div className="disaster-badges">
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(disaster.severity) }}
                    >
                      {disaster.severity}
                    </span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(disaster.status) }}
                    >
                      {disaster.status}
                    </span>
                  </div>
                </div>

                <div className="disaster-type">
                  <span className="type-icon">
                    {disaster.type === 'earthquake' && '🌋'}
                    {disaster.type === 'flood' && '🌊'}
                    {disaster.type === 'hurricane' && '🌀'}
                    {disaster.type === 'tornado' && '🌪️'}
                    {disaster.type === 'wildfire' && '🔥'}
                    {disaster.type === 'tsunami' && '🌊'}
                    {disaster.type === 'volcanic_eruption' && '🌋'}
                    {disaster.type === 'drought' && '☀️'}
                    {disaster.type === 'landslide' && '🏔️'}
                    {disaster.type === 'other' && '⚠️'}
                  </span>
                  <span className="type-text">{disaster.type.replace('_', ' ')}</span>
                </div>

                <p className="disaster-description">{disaster.description}</p>

                <div className="disaster-details">
                  <div className="detail-item">
                    <span className="detail-label">📍 Location:</span>
                    <span className="detail-value">
                      {disaster.location?.city && `${disaster.location.city}, `}
                      {disaster.location?.state && `${disaster.location.state}, `}
                      {disaster.location?.country || 'Unknown'}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">📅 Start Date:</span>
                    <span className="detail-value">
                      {new Date(disaster.startDate).toLocaleDateString()}
                    </span>
                  </div>

                  {disaster.endDate && (
                    <div className="detail-item">
                      <span className="detail-label">📅 End Date:</span>
                      <span className="detail-value">
                        {new Date(disaster.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="detail-item">
                    <span className="detail-label">👥 Casualties:</span>
                    <span className="detail-value">{disaster.casualties || 0}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">💰 Damage Estimate:</span>
                    <span className="detail-value">
                      ${disaster.damageEstimate?.toLocaleString() || 0}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">🤝 Contributions:</span>
                    <span className="detail-value">
                      {disaster.contributions?.length || 0}
                    </span>
                  </div>
                </div>

                {Array.isArray(disaster.files) && disaster.files.length > 0 && (
                  <div className="disaster-attachments">
                    <h5>📎 Attachments</h5>
                    <div className="attachments-grid">
                      {disaster.files.map((file) => {
                        const url = buildFileUrl(file);
                        const isImage = (file.mimetype || '').startsWith('image/');
                        return (
                          <div key={file._id || file.filename} className="attachment-item">
                            {isImage ? (
                              <a href={url} target="_blank" rel="noreferrer">
                                <img src={url} alt={file.originalName || file.filename} className="attachment-thumb" />
                              </a>
                            ) : (
                              <div className="attachment-generic">
                                <span className="attachment-icon">📄</span>
                                <span className="attachment-name" title={file.originalName || file.filename}>
                                  {(file.originalName || file.filename)}
                                </span>
                              </div>
                            )}
                            <a className="attachment-link" href={url} target="_blank" rel="noreferrer">Download</a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="disaster-actions">
                  <Link 
                    to={`/contribute?disasterId=${disaster._id}`} 
                    className="btn btn-primary"
                  >
                    🤝 Contribute
                  </Link>
                  <Link 
                    to={`/disaster/create?id=${disaster._id}`} 
                    className="btn btn-secondary"
                  >
                    📊 View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-disasters">
            <p>No disasters found matching the current filters.</p>
            <button 
              onClick={() => setFilter({ type: '', severity: '', status: '' })}
              className="btn"
            >
              🔄 Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterList;
