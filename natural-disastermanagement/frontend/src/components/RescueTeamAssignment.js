import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './RescueTeamAssignment.css';

const RescueTeamAssignment = () => {
  const [disasters, setDisasters] = useState([]);
  const [rescueTeams, setRescueTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]); // Store all teams
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [assignedTeams, setAssignedTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    specialization: '',
    availability: '',
    ngoName: ''
  });
  const [activeTab, setActiveTab] = useState('assign'); // assign or manage

  // Fetch disasters and teams on mount
  useEffect(() => {
    fetchDisasters();
    fetchAllRescueTeams();
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters();
  }, [filter, allTeams]);

  const fetchDisasters = async () => {
    try {
      const response = await api.get('/disaster');
      const disastersData = response.data?.data ?? [];
      setDisasters(Array.isArray(disastersData) ? disastersData : []);
    } catch (error) {
      console.error('Error fetching disasters:', error);
      toast.error('Failed to load disasters');
    }
  };

  // Fetch all rescue teams without filters
  const fetchAllRescueTeams = async () => {
    try {
      const response = await api.get('/rescue-team');
      const teamsData = response.data?.data ?? [];
      const teamsArray = Array.isArray(teamsData) ? teamsData : [];
      setAllTeams(teamsArray);
      applyFilters(); // Apply filters immediately after fetching
    } catch (error) {
      console.error('Error fetching rescue teams:', error);
      toast.error('Failed to load rescue teams');
      setAllTeams([]);
    }
  };

  // Apply client-side filters to teams
  const applyFilters = () => {
    let filtered = [...allTeams];

    // Filter by specialization
    if (filter.specialization) {
      filtered = filtered.filter(team => team.specialization === filter.specialization);
    }

    // Filter by availability
    if (filter.availability) {
      filtered = filtered.filter(team => team.availability === filter.availability);
    }

    // Filter by NGO name (case-insensitive search)
    if (filter.ngoName) {
      const searchTerm = filter.ngoName.toLowerCase();
      filtered = filtered.filter(team =>
        team.ngoName?.toLowerCase().includes(searchTerm) ||
        team.name?.toLowerCase().includes(searchTerm)
      );
    }

    setRescueTeams(filtered);
  };

  const loadAssignedTeams = async (disasterId) => {
    try {
      const response = await api.get(`/rescue-team`);
      const teamsData = response.data?.data ?? [];
      const assigned = teamsData.filter(team =>
        team.assignedDisasters?.some(d => d._id === disasterId || d === disasterId)
      );
      setAssignedTeams(assigned);
    } catch (error) {
      console.error('Error loading assigned teams:', error);
    }
  };

  const handleDisasterSelect = (disaster) => {
    setSelectedDisaster(disaster);
    loadAssignedTeams(disaster._id);
  };

  const handleAssignTeam = async () => {
    if (!selectedDisaster || !selectedTeam) {
      toast.error('Please select both a disaster and a team');
      return;
    }

    setLoading(true);
    try {
      await api.post('/rescue-team/assign', {
        teamId: selectedTeam._id,
        disasterId: selectedDisaster._id
      });
      toast.success(`Team "${selectedTeam.name}" assigned to "${selectedDisaster.title}"`);
      setSelectedTeam(null);
      loadAssignedTeams(selectedDisaster._id);
      fetchAllRescueTeams(); // Refresh all teams
    } catch (error) {
      console.error('Error assigning team:', error);
      toast.error(error.response?.data?.message || 'Failed to assign team');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignTeam = async (teamId) => {
    if (!selectedDisaster) return;

    setLoading(true);
    try {
      await api.post('/rescue-team/unassign', {
        teamId,
        disasterId: selectedDisaster._id
      });
      toast.success('Team unassigned successfully');
      loadAssignedTeams(selectedDisaster._id);
      fetchAllRescueTeams(); // Refresh all teams
    } catch (error) {
      console.error('Error unassigning team:', error);
      toast.error('Failed to unassign team');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="rescue-team-container">
      <div className="header">
        <h1>🚑 Rescue Team Assignment</h1>
        <p>Assign rescue teams from NGOs to disaster relief operations</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'assign' ? 'active' : ''}`}
          onClick={() => setActiveTab('assign')}
        >
          📋 Assign Teams
        </button>
        <button
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          👥 Manage Teams
        </button>
      </div>

      {/* Assign Teams Tab */}
      {activeTab === 'assign' && (
        <div className="card">
          <div className="section">
            <h3>🌍 Select Disaster</h3>
            <div className="disaster-grid">
              {disasters.length > 0 ? (
                disasters.map(disaster => (
                  <div
                    key={disaster._id}
                    className={`disaster-card ${selectedDisaster?._id === disaster._id ? 'selected' : ''}`}
                    onClick={() => handleDisasterSelect(disaster)}
                  >
                    <div className="disaster-badge">{disaster.type.toUpperCase()}</div>
                    <h4>{disaster.title}</h4>
                    <p className="severity" style={{
                      color: disaster.severity === 'critical' ? '#dc3545' : disaster.severity === 'high' ? '#fd7e14' : '#28a745'
                    }}>
                      Severity: {disaster.severity}
                    </p>
                    <p className="status">Status: {disaster.status}</p>
                  </div>
                ))
              ) : (
                <p className="no-data">No disasters available</p>
              )}
            </div>
          </div>

          {selectedDisaster && (
            <>
              <div className="section">
                <h3>🏥 Select Rescue Team</h3>
                
                {/* Filters */}
                <div className="filter-group">
                  <input
                    type="text"
                    name="ngoName"
                    placeholder="Search by NGO name..."
                    value={filter.ngoName}
                    onChange={handleFilterChange}
                    className="form-control"
                  />
                  <select
                    name="specialization"
                    value={filter.specialization}
                    onChange={handleFilterChange}
                    className="form-select"
                  >
                    <option value="">All Specializations</option>
                    <option value="medical">🏥 Medical</option>
                    <option value="search_rescue">🔍 Search & Rescue</option>
                    <option value="logistics">📦 Logistics</option>
                    <option value="communication">📡 Communication</option>
                    <option value="heavy_machinery">🏗️ Heavy Machinery</option>
                    <option value="water_rescue">💧 Water Rescue</option>
                    <option value="other">📌 Other</option>
                  </select>
                  <select
                    name="availability"
                    value={filter.availability}
                    onChange={handleFilterChange}
                    className="form-select"
                  >
                    <option value="">All Availability</option>
                    <option value="available">✅ Available</option>
                    <option value="busy">⏳ Busy</option>
                    <option value="unavailable">❌ Unavailable</option>
                  </select>
                </div>

                {/* Teams List */}
                <div className="teams-grid">
                  {rescueTeams.length > 0 ? (
                    rescueTeams.map(team => (
                      <div
                        key={team._id}
                        className={`team-card ${selectedTeam?._id === team._id ? 'selected' : ''}`}
                        onClick={() => setSelectedTeam(team)}
                      >
                        <div className="team-header">
                          <h4>{team.name}</h4>
                          <span className={`availability-badge ${team.availability}`}>
                            {team.availability === 'available' ? '✅' : team.availability === 'busy' ? '⏳' : '❌'} {team.availability}
                          </span>
                        </div>
                        <p className="ngo-name">🏢 {team.ngoName}</p>
                        <p className="specialization">📌 {team.specialization.replace('_', ' ')}</p>
                        <p className="members">👥 {team.memberCount} members</p>
                        <p className="experience">⭐ {team.experience}</p>
                        <div className="contact-info">
                          <p><strong>Contact:</strong> {team.contactPerson}</p>
                          <p><strong>Phone:</strong> {team.contactPhone}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No rescue teams found matching the filters</p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="action-section">
                <button
                  onClick={handleAssignTeam}
                  disabled={!selectedDisaster || !selectedTeam || loading}
                  className="btn btn-primary"
                  title={!selectedTeam ? 'Select a rescue team first' : !selectedDisaster ? 'Select a disaster first' : 'Click to assign'}
                >
                  {loading ? '⏳ Assigning...' : '✅ Assign Team to Disaster'}
                </button>
              </div>

              {/* Assigned Teams */}
              <div className="section">
                <h3>📋 Currently Assigned Teams</h3>
                {assignedTeams.length > 0 ? (
                  <div className="assigned-teams-list">
                    {assignedTeams.map(team => (
                      <div key={team._id} className="assigned-team-item">
                        <div className="team-info">
                          <h5>{team.name}</h5>
                          <p>{team.ngoName}</p>
                          <p className="spec">{team.specialization.replace('_', ' ')}</p>
                        </div>
                        <button
                          onClick={() => handleUnassignTeam(team._id)}
                          disabled={loading}
                          className="btn btn-danger btn-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No teams assigned yet</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Manage Teams Tab */}
      {activeTab === 'manage' && (
        <div className="card">
          <h3>📊 All Rescue Teams Overview</h3>
          <div className="teams-list">
            {rescueTeams.length > 0 ? (
              rescueTeams.map(team => (
                <div key={team._id} className="team-list-item">
                  <div className="team-details">
                    <h4>{team.name}</h4>
                    <p>{team.ngoName} | {team.specialization.replace('_', ' ')}</p>
                    <p className="text-muted">
                      {team.memberCount} members | Exp: {team.experience} | Status: {team.availability}
                    </p>
                    <p className="contact">{team.contactPhone} | {team.contactEmail}</p>
                  </div>
                  <div className="assigned-count">
                    <span className="badge">{team.assignedDisasters?.length || 0} assignments</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No rescue teams available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RescueTeamAssignment;
