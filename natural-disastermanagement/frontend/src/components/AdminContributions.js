import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AdminContributions = () => {
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/contribution');
        setContributions(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        console.error('Failed to fetch contributions', e);
        setError(e.response?.data?.message || 'Failed to load contributions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="card"><p>Loading contributions...</p></div>;
  }

  if (error) {
    return <div className="card"><p style={{ color: '#dc3545' }}>{error}</p></div>;
  }

  return (
    <div className="disaster-list-container">
      <div className="header">
        <h1>🛡️ Admin: Contributions</h1>
        <p>Review all user contributions</p>
      </div>

      <div className="card">
        {contributions.length === 0 ? (
          <p>No contributions found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #eee' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #eee' }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #eee' }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #eee' }}>User</th>
                  <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #eee' }}>Disaster</th>
                  <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #eee' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #eee' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c) => (
                  <tr key={c._id}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f5f5f5' }}>{c.title}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f5f5f5' }}>{c.contributionType}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f5f5f5' }}>{c.amount || 0}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f5f5f5' }}>{c.userId?.name || '-'}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f5f5f5' }}>{c.disasterId?.title || '-'}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f5f5f5' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f5f5f5' }}>{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContributions;


