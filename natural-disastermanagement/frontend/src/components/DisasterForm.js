import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './DisasterForm.css';

const DisasterForm = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'earthquake',
    severity: 'medium',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      coordinates: [0, 0]
    },
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active',
    casualties: 0,
    damageEstimate: 0,
    commonNeeds: []
  });

  const navigate = useNavigate();
  const location = useLocation();
  const disasterId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('id') || '';
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name === 'commonNeeds') {
      const needs = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        commonNeeds: needs
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // If an id is present in query (?id=...), load disaster for editing and enable delete button
  useEffect(() => {
    const loadExisting = async () => {
      if (!disasterId) return;
      try {
        const { data } = await api.get(`/disaster/${disasterId}`);
        const d = data?.data;
        if (!d) return;
        setFormData({
          title: d.title || '',
          description: d.description || '',
          type: d.type || 'earthquake',
          severity: d.severity || 'medium',
          location: {
            address: d.location?.address || '',
            city: d.location?.city || '',
            state: d.location?.state || '',
            country: d.location?.country || '',
            coordinates: Array.isArray(d.location?.coordinates) ? d.location.coordinates : [0, 0]
          },
          startDate: d.startDate ? new Date(d.startDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          endDate: d.endDate ? new Date(d.endDate).toISOString().slice(0, 10) : '',
          status: d.status || 'active',
          casualties: d.casualties || 0,
          damageEstimate: d.damageEstimate || 0,
          commonNeeds: Array.isArray(d.commonNeeds) ? d.commonNeeds : []
        });
      } catch (error) {
        console.error('Failed to load disaster', error);
        // non-blocking
      }
    };
    loadExisting();
  }, [disasterId]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log('Files selected:', selectedFiles);
    setFiles(selectedFiles);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
      const formDataToSend = new FormData();
      
      // Add form data
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('severity', formData.severity);
      formDataToSend.append('location', JSON.stringify(formData.location));
      formDataToSend.append('startDate', formData.startDate);
      if (formData.endDate) {
        formDataToSend.append('endDate', formData.endDate);
      }
      formDataToSend.append('status', formData.status);
      formDataToSend.append('casualties', formData.casualties.toString());
      formDataToSend.append('damageEstimate', formData.damageEstimate.toString());
      formDataToSend.append('commonNeeds', JSON.stringify(formData.commonNeeds));

      // Add files
      console.log('Files to upload:', files);
      files.forEach(file => {
        console.log('Appending file:', file.name, file.type, file.size);
        formDataToSend.append('files', file);
      });

      console.log('Sending request to:', '/disaster/addDisaster');
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
      
      const response = await api.post('/disaster/addDisaster', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      toast.success('Disaster created successfully!');
      navigate('/disasters');
      
    } catch (error) {
      console.error('Error creating disaster:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      toast.error(error.response?.data?.message || 'Failed to create disaster');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'earthquake',
      severity: 'medium',
      location: {
        address: '',
        city: '',
        state: '',
        country: '',
        coordinates: [0, 0]
      },
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'active',
      casualties: 0,
      damageEstimate: 0,
      commonNeeds: []
    });
    setFiles([]);
    setUploadProgress(0);
  };

  const handleDeleteDisaster = async (disasterId) => {
    const confirmed = window.confirm('Are you sure you want to delete this disaster? This will remove all its attachments.');
    if (!confirmed) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/disaster/${disasterId}`);
      toast.success('Disaster deleted');
      navigate('/disasters');
    } catch (error) {
      console.error('Error deleting disaster:', error);
      toast.error(error.response?.data?.message || 'Failed to delete disaster');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="disaster-form-container">
      <div className="header">
        <h1>🌪️ Create Disaster</h1>
        <p>Add a new disaster to the system with relevant information and attachments</p>
      </div>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="card">
          <h4>📤 Uploading Files...</h4>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p>{uploadProgress}% Complete</p>
        </div>
      )}

      {/* Disaster Form */}
      <div className="card">
        <h3>📝 Disaster Information</h3>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Basic Information */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">📝 Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter disaster title"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">🏷️ Type *</label>
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">⚠️ Severity *</label>
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
            
            <div className="form-group">
              <label className="form-label">📊 Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
                <option value="monitoring">Monitoring</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">📄 Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-control"
              rows="4"
              placeholder="Describe the disaster..."
              required
            ></textarea>
          </div>

          {/* Location Information */}
          <div className="form-section">
            <h4>📍 Location Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">🏠 Address</label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter address"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">🏙️ City</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">🏛️ State/Province</label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter state/province"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">🌍 Country *</label>
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter country"
                  required
                />
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="form-section">
            <h4>📅 Date Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">📅 Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">📅 End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          {/* Impact Information */}
          <div className="form-section">
            <h4>📊 Impact Assessment</h4>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">👥 Casualties</label>
                <input
                  type="number"
                  name="casualties"
                  value={formData.casualties}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Number of casualties"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">💰 Damage Estimate ($)</label>
                <input
                  type="number"
                  name="damageEstimate"
                  value={formData.damageEstimate}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Estimated damage in USD"
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </div>

          {/* Common Needs */}
          <div className="form-section">
            <h4>🆘 Common Needs</h4>
            <div className="form-group">
              <label className="form-label">Select common needs (hold Ctrl/Cmd to select multiple)</label>
              <select
                name="commonNeeds"
                multiple
                value={formData.commonNeeds}
                onChange={handleInputChange}
                className="form-select"
                size="4"
              >
                <option value="food">Food</option>
                <option value="water">Water</option>
                <option value="shelter">Shelter</option>
                <option value="medical">Medical</option>
                <option value="clothing">Clothing</option>
                <option value="transportation">Transportation</option>
                <option value="communication">Communication</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div className="form-section">
            <h4>📎 Attachments</h4>
            <div className="form-group">
              <label className="form-label">Upload relevant files (images, documents, etc.)</label>
              <div 
                className={`file-upload ${files.length > 0 ? 'has-files' : ''}`} 
                onClick={() => {
                  console.log('File upload area clicked');
                  document.getElementById('file-input').click();
                }}
              >
                <input
                  id="file-input"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="file-input"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <p>📁 Click to select files or drag and drop</p>
                <p className="file-hint">Supported: Images, PDF, DOC, TXT (Max 5 files)</p>
                {files.length > 0 && (
                  <p className="files-selected">✅ {files.length} file(s) selected</p>
                )}
                <button 
                  type="button" 
                  onClick={() => document.getElementById('file-input').click()}
                  style={{ marginTop: '10px', padding: '5px 10px', fontSize: '0.8rem' }}
                >
                  🔍 Test File Selection
                </button>
              </div>
              
              {files.length > 0 && (
                <div className="file-list">
                  {files.map((file, index) => (
                    <div key={index} className="file-item">
                      <span>{file.name}</span>
                      <button type="button" onClick={() => removeFile(index)}>
                        ❌ Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              🔄 Reset Form
            </button>
            
            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  Creating Disaster...
                </>
              ) : (
                '🚀 Create Disaster'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone (Delete) - optional: shown when navigating with an existing disaster context */}
      {disasterId && (
        <div className="card">
          <h3>⚠️ Danger Zone</h3>
          <button
            className="btn btn-secondary"
            disabled={deleteLoading}
            onClick={() => handleDeleteDisaster(disasterId)}
          >
            {deleteLoading ? 'Deleting...' : '🗑️ Delete This Disaster'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DisasterForm;
