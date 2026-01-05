const express = require('express');
const router = express.Router();
const rescueTeamController = require('../controllers/rescueTeamController');
const authenticateToken = require('../middlware/auth');

// Create a new rescue team (admin only)
router.post('/', authenticateToken, rescueTeamController.createRescueTeam);

// Get all rescue teams
router.get('/', rescueTeamController.getRescueTeams);

// Get available teams for a disaster (MUST be before /:id)
router.get('/available', rescueTeamController.getAvailableTeamsForDisaster);

// Get rescue team by ID
router.get('/:id', rescueTeamController.getRescueTeamById);

// Assign rescue team to disaster (admin only)
router.post('/assign', authenticateToken, rescueTeamController.assignRescueTeamToDisaster);

// Unassign rescue team from disaster (admin only)
router.post('/unassign', authenticateToken, rescueTeamController.unassignRescueTeamFromDisaster);

// Update rescue team (admin only)
router.put('/:id', authenticateToken, rescueTeamController.updateRescueTeam);

// Delete rescue team (admin only)
router.delete('/:id', authenticateToken, rescueTeamController.deleteRescueTeam);

module.exports = router;
