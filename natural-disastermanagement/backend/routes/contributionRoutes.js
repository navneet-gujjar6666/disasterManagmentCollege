const express = require('express');
const router = express.Router();
const auth = require('../middlware/auth');
const {
    createContribution,
    getContributions,
    getContributionById,
    updateContribution,
    deleteContribution
} = require('../controllers/contributionController');

// Create contribution
router.post('/', auth, createContribution);

// Get all contributions (public route)
router.get('/', getContributions);

// Get contribution by ID (public route)
router.get('/:id', getContributionById);

// Update contribution
router.put('/:id', auth, updateContribution);

// Delete contribution
router.delete('/:id', auth, deleteContribution);



module.exports = router; 