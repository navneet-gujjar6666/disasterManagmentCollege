// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import api from '../utils/api';
// import './ContributionForm.css';

// const ContributionForm = () => {
//   const [loading, setLoading] = useState(false);
//   const [disasters, setDisasters] = useState([]);
//   const [selectedDisaster, setSelectedDisaster] = useState(null);
//   const [formData, setFormData] = useState({
//     disasterId: '',
//     title: '',
//     description: '',
//     contributionType: 'material',
//     amount: '',
//     location: {
//       type: 'Point',
//       coordinates: [0, 0]
//     },
//     contactInfo: {
//       phone: '',
//       email: '',
//       address: ''
//     },
//     isAnonymous: false
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchDisasters();
//   }, []);

//   const fetchDisasters = async () => {
//     try {
//       const response = await api.get('/disaster');
//       setDisasters(response.data.data);
//     } catch (error) {
//       console.error('Error fetching disasters:', error);
//       toast.error('Failed to load disasters');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: type === 'checkbox' ? checked : value
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value
//       }));
//     }
//   };

//   const handleDisasterSelect = (disasterId) => {
//     setFormData(prev => ({ ...prev, disasterId }));
//     const disaster = disasters.find(d => d._id === disasterId);
//     setSelectedDisaster(disaster);
//   };

//   const validateForm = () => {
//     if (!formData.disasterId) {
//       toast.error('Please select a disaster');
//       return false;
//     }
//     if (!formData.title.trim()) {
//       toast.error('Please enter a title');
//       return false;
//     }
//     if (!formData.description.trim()) {
//       toast.error('Please enter a description');
//       return false;
//     }
//     if (!formData.contributionType) {
//       toast.error('Please select a contribution type');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     setLoading(true);
    
//     try {
//       const response = await api.post('/contribution', formData);
//       toast.success('Contribution created successfully!');
//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Error submitting contribution:', error);
//       toast.error(error.response?.data?.message || 'Failed to create contribution');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       disasterId: '',
//       title: '',
//       description: '',
//       contributionType: 'material',
//       amount: '',
//       location: {
//         type: 'Point',
//         coordinates: [0, 0]
//       },
//       contactInfo: {
//         phone: '',
//         email: '',
//         address: ''
//       },
//       isAnonymous: false
//     });
//     setSelectedDisaster(null);
//   };

//   return (
//     <div className="contribution-container">
//       <div className="header">
//         <h1>🤝 Create Contribution</h1>
//         <p>Create a new contribution for disaster relief</p>
//       </div>

//       {/* Contribution Form */}
//       <div className="card">
//         <h3>📝 Contribution Details</h3>
        
//         <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
//           {/* Disaster Selection */}
//           <div className="form-group">
//             <label className="form-label">🌪️ Select Disaster *</label>
//             <select
//               name="disasterId"
//               value={formData.disasterId}
//               onChange={(e) => handleDisasterSelect(e.target.value)}
//               className="form-select"
//               required
//             >
//                 {/* <option value="Option">Select Disaster...</option>
//                 <option value="Earthquake">Earthquake</option>
//                 <option value="Flood">Flood</option>
//                 <option value="Cyclone">Cyclone / Hurricane / Typhoon</option>
//                 <option value="Tsunami">Tsunami</option>
//                 <option value="Landslide">Landslide</option>
//                 <option value="Drought">Drought</option>
//                 <option value="Fire">Wildfire / Forest Fire</option>
//                 <option value="Industry">Industrial Accident</option>
//                 <option value="Nuclear">Nuclear Disaster</option>
//                 <option value="other">Other</option> */}
//                 <option value="">Select Disaster...</option>
//               {disasters.map(disaster => (
//                 <option key={disaster._id} value={disaster._id}>
//                   {disaster.title} - {disaster.type} ({disaster.severity})
//                 </option>
//               ))}
//             </select>
//             {selectedDisaster && (
//               <div className="disaster-info">
//                 <p><strong>Selected:</strong> {selectedDisaster.title}</p>
//                 <p><strong>Type:</strong> {selectedDisaster.type}</p>
//                 <p><strong>Severity:</strong> {selectedDisaster.severity}</p>
//               </div>
//             )}
//           </div>

//           {/* Basic Information */}
//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">📝 Title *</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 placeholder="Enter contribution title"
//                 required
//               />
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">🏷️ Contribution Type *</label>
//               <select
//                 name="contributionType"
//                 value={formData.contributionType}
//                 onChange={handleInputChange}
//                 className="form-select"
//                 required
//               >
//                 <option value="material">Material</option>
//                 <option value="financial">Financial</option>
//                 <option value="volunteer">Volunteer</option>
//                 <option value="information">Information</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
//           </div>

//           <div className="form-group">
//             <label className="form-label">📄 Description *</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className="form-control"
//               rows="4"
//               placeholder="Describe your contribution..."
//               required
//             ></textarea>
//           </div>

//           {/* Amount for Financial Contributions */}
//           {formData.contributionType === 'financial' && (
//             <div className="form-group">
//               <label className="form-label">💰 Amount</label>
//               <input
//                 type="number"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 placeholder="Enter amount"
//                 min="0"
//                 step="0.01"
//               />
//             </div>
//           )}

//           {/* Contact Information */}
//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">📞 Phone</label>
//               <input
//                 type="tel"
//                 name="contactInfo.phone"
//                 value={formData.contactInfo.phone}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 placeholder="Enter phone number"
//               />
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">📧 Email</label>
//               <input
//                 type="email"
//                 name="contactInfo.email"
//                 value={formData.contactInfo.email}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 placeholder="Enter email address"
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label className="form-label">📍 Address</label>
//             <input
//               type="text"
//               name="contactInfo.address"
//               value={formData.contactInfo.address}
//               onChange={handleInputChange}
//               className="form-control"
//               placeholder="Enter address"
//             />
//           </div>

//           {/* Anonymous Option */}
//           <div className="form-group">
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 name="isAnonymous"
//                 checked={formData.isAnonymous}
//                 onChange={handleInputChange}
//               />
//               <span>🙈 Make this contribution anonymous</span>
//             </label>
//           </div>

//           {/* Action Buttons */}
//           <div className="form-actions">
//             <button
//               type="button"
//               onClick={resetForm}
//               className="btn btn-secondary"
//               disabled={loading}
//             >
//               🔄 Reset Form
//             </button>
            
//             <button
//               type="submit"
//               className="btn"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="loading"></span>
//                   Processing...
//                 </>
//               ) : (
//                 '🚀 Create Contribution'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ContributionForm;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './ContributionForm.css';

const ContributionForm = () => {
  const [loading, setLoading] = useState(false);
  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [formData, setFormData] = useState({
    disasterId: '',
    title: '',
    description: '',
    contributionType: 'material',
    amount: '',
    location: {
      type: 'Point',
      coordinates: [0, 0],
    },
    contactInfo: {
      phone: '',
      email: '',
      address: '',
    },
    isAnonymous: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDisasters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- fetchDisasters: robust parsing and safe set
  const fetchDisasters = async () => {
    try {
      const response = await api.get('/disaster');
      // handle common response shapes
      let payload = null;
      if (response && response.data) {
        payload = response.data.data ?? response.data.disasters ?? response.data;
      } else {
        payload = response;
      }
      // debug log so we can inspect what the backend returns in the browser console
      console.log('fetchDisasters response payload:', payload);
      const arr = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];
      setDisasters(arr);
    } catch (error) {
      console.error('Error fetching disasters:', error);
      setDisasters([]);
      toast.error('Failed to load disasters (see console).');
    }
  };

  // --- input change (supports dotted names like contactInfo.phone)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // --- select handler: accepts either id strings or fallback ids
  const handleDisasterSelect = (disasterId) => {
    // temporary debug log (remove for final demo)
    // console.log('selected disasterId:', disasterId);
    setFormData((prev) => ({ ...prev, disasterId }));
    const disaster = disasters.find((d) => String(d._id || d.id) === String(disasterId));
    setSelectedDisaster(disaster || null);
  };

  const validateForm = () => {
    if (!formData.disasterId) {
      toast.error('Please select a disaster');
      return false;
    }
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return false;
    }
    if (!formData.contributionType) {
      toast.error('Please select a contribution type');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post('/contribution', formData);
      toast.success('Contribution created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting contribution:', error);
      toast.error(error.response?.data?.message || 'Failed to create contribution');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      disasterId: '',
      title: '',
      description: '',
      contributionType: 'material',
      amount: '',
      location: { type: 'Point', coordinates: [0, 0] },
      contactInfo: { phone: '', email: '', address: '' },
      isAnonymous: false,
    });
    setSelectedDisaster(null);
  };

  return (
    <div className="contribution-container">
      <div className="header">
        <h1>🤝 Create Contribution</h1>
        <p>Create a new contribution for disaster relief</p>
      </div>

      <div className="card">
        <h3>📝 Contribution Details</h3>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Disaster Selection */}
          <div className="form-group">
            <label className="form-label">🌪️ Select Disaster *</label>
            <select
              name="disasterId"
              value={formData.disasterId}
              onChange={(e) => handleDisasterSelect(e.target.value)}
              className="form-select debug-outline"
              required
            >
              <option value="">Select Disaster...</option>
              {
              // disasters.map((disaster) => (
              //   <option
              //     key={disaster._id || disaster.id || JSON.stringify(disaster)}
              //     value={disaster._id || disaster.id}
              //   >
              //     {disaster.title || disaster.name || '(no title)'}
              //     {disaster.type ? ` - ${disaster.type}` : ''}
              //     {disaster.severity ? ` (${disaster.severity})` : ''}
              //   </option>
              // ))
              
              disasters.map((disaster, index) => {
                const id = disaster?._id || disaster?.id || String(index);
                const title = disaster?.title || disaster?.name || (typeof disaster === 'string' ? disaster : JSON.stringify(disaster));
                return (
                  <option key={id} value={id}>
                    {title}{disaster?.type ? ` - ${disaster.type}` : ''}{disaster?.severity ? ` (${disaster.severity})` : ''}
                  </option>
                );
              })
            }
            </select>

            {selectedDisaster && (
              <div className="disaster-info">
                <p><strong>Selected:</strong> {selectedDisaster.title}</p>
                <p><strong>Type:</strong> {selectedDisaster.type}</p>
                <p><strong>Severity:</strong> {selectedDisaster.severity}</p>
              </div>
            )}
          </div>

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
                placeholder="Enter contribution title"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">🏷️ Contribution Type *</label>
              <select
                name="contributionType"
                value={formData.contributionType}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="material">Material</option>
                <option value="financial">Financial</option>
                <option value="volunteer">Volunteer</option>
                <option value="information">Information</option>
                <option value="other">Other</option>
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
              placeholder="Describe your contribution..."
              required
            />
          </div>

          {formData.contributionType === 'financial' && (
            <div className="form-group">
              <label className="form-label">💰 Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">📞 Phone</label>
              <input
                type="tel"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">📧 Email</label>
              <input
                type="email"
                name="contactInfo.email"
                value={formData.contactInfo.email}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">📍 Address</label>
            <input
              type="text"
              name="contactInfo.address"
              value={formData.contactInfo.address}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter address"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
              />
              <span>🙈 Make this contribution anonymous</span>
            </label>
          </div>

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
                  Processing...
                </>
              ) : (
                '🚀 Create Contribution'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributionForm;

