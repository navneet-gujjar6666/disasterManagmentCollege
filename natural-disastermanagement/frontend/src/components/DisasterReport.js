import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './DisasterReport.css';

const DisasterReport = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other',
    severity: 'medium',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      coordinates: [0, 0]
    },
    startDate: new Date().toISOString().split('T')[0],
    status: 'monitoring',
    casualties: 0,
    damageEstimate: 0
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a disaster title');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return false;
    }
    if (!formData.location.city.trim()) {
      toast.error('Please enter a city');
      return false;
    }
    if (!formData.location.country.trim()) {
      toast.error('Please enter a country');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/disaster', formData);
      if (response.data?.success) {
        toast.success('Disaster report submitted successfully! Admins will review it.');
        navigate('/disasters');
      }
    } catch (error) {
      console.error('Error submitting disaster report:', error);
      toast.error(error.response?.data?.message || 'Failed to submit disaster report');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'other',
      severity: 'medium',
      location: {
        address: '',
        city: '',
        state: '',
        country: '',
        coordinates: [0, 0]
      },
      startDate: new Date().toISOString().split('T')[0],
      status: 'monitoring',
      casualties: 0,
      damageEstimate: 0
    });
  };

  return (
    <div className="disaster-report-container">
      <div className="header">
        <h1>🚨 Report New Disaster</h1>
        <p>Inform us about a new disaster you've discovered. Your report will be reviewed by our team.</p>
      </div>

      <div className="card">
        <h3>📋 Disaster Information</h3>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">📝 Disaster Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-control"
              placeholder="e.g., Earthquake in Istanbul, Flash Floods in Valley..."
              required
            />
          </div>

          {/* Type and Severity */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🌪️ Disaster Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="form-select"
                required
              >
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

            <div className="form-group">
              <label className="form-label">⚠️ Severity Level *</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">📄 Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-control"
              rows="5"
              placeholder="Describe the disaster, affected areas, initial observations..."
              required
            />
          </div>

          {/* Location Information */}
          <div className="form-section">
            <h4>📍 Location Details</h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter city name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">State/Province</label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter state or province"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Country *</label>
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter country name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter specific address (optional)"
                />
              </div>
            </div>
          </div>

          {/* Date and Impact Information */}
          <div className="form-section">
            <h4>📅 Report Date & Impact</h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">📆 Today's Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="form-control"
                  disabled
                />
                <small className="form-help">Auto-filled with today's date</small>
              </div>

              <div className="form-group">
                <label className="form-label">👥 Estimated Casualties</label>
                <input
                  type="number"
                  name="casualties"
                  value={formData.casualties}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">💰 Estimated Damage (USD)</label>
              <input
                type="number"
                name="damageEstimate"
                value={formData.damageEstimate}
                onChange={handleInputChange}
                className="form-control"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-secondary"
              disabled={loading}
            >
              🔄 Clear Form
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Submitting...' : '✅ Submit Report'}
            </button>
          </div>

          <div className="info-box">
            <p>
              <strong>ℹ️ Note:</strong> Your disaster report will be reviewed by our administrative team before being published. 
              Thank you for helping us keep disaster information up-to-date!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisasterReport;
