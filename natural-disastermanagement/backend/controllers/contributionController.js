const Contribution = require('../models/contribution');
const Disaster = require('../models/disaster');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Helper function to safely parse JSON or return object as-is
const safeJsonParse = (data) => {
    if (!data) return undefined;
    if (typeof data === 'object') return data; // already an object
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.warn('JSON parse failed, returning raw string:', data);
            return data;
        }
    }
    return data;
};

// Create a new contribution with file uploads
// Following the flowchart: Create Contribution -> Data from Postman -> Get Disaster -> Get User ID -> Create Contribution -> Add Relation -> Return Response
const createContribution = async (req, res) => {
    try {
        // Step 1: Extract data from request (Data from Postman)
        const {
            disasterId,
            title,
            description,
            contributionType,
            amount,
            location,
            contactInfo,
            isAnonymous
        } = req.body;

        // Validate required fields
        if (!disasterId || !title || !description || !contributionType) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: disasterId, title, description, contributionType'
            });
        }

        // Step 2: Get Disaster (by id)
        const disaster = await Disaster.findById(disasterId);
        if (!disaster) {
            return res.status(404).json({
                success: false,
                message: 'Disaster not found'
            });
        }

        // Step 3: Get User ID (from token)
        const userId = req.user.id; // From auth middleware
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }



        // Step 4: Create Contribution (with contribution data and user id)
        const contribution = new Contribution({
            userId,
            disasterId,
            title,
            description,
            contributionType,
            amount: amount || 0,
            location: safeJsonParse(location),
            contactInfo: safeJsonParse(contactInfo),
            isAnonymous: isAnonymous === 'true'
        });

        await contribution.save();

        // Step 5: Add Contribution Relation in Disaster
        disaster.contributions.push(contribution._id);
        await disaster.save();

        // Step 6: Return Response
        res.status(201).json({
            success: true,
            message: 'Contribution created successfully and linked to disaster',
            data: {
                contribution,
                disasterId: disaster._id,
                disasterTitle: disaster.title
            }
        });

    } catch (error) {
        console.error('Error creating contribution:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get all contributions (with optional filtering)
const getContributions = async (req, res) => {
    try {
        const {
            disasterId,
            userId,
            status,
            contributionType,
            page = 1,
            limit = 10
        } = req.query;

        // Build filter object with validation to avoid invalid ObjectId casting
        const filter = {};
        if (disasterId && disasterId !== 'undefined' && mongoose.Types.ObjectId.isValid(disasterId)) {
            filter.disasterId = disasterId;
        } else if (disasterId && disasterId !== 'undefined') {
            console.warn('Ignored invalid disasterId filter:', disasterId);
        }

        if (userId && userId !== 'undefined' && mongoose.Types.ObjectId.isValid(userId)) {
            filter.userId = userId;
        } else if (userId && userId !== 'undefined') {
            console.warn('Ignored invalid userId filter:', userId);
        }

        if (status) filter.status = status;
        if (contributionType) filter.contributionType = contributionType;

        // Pagination
        const skip = (page - 1) * limit;

        const contributions = await Contribution.find(filter)
            .populate('userId', 'name email')
            .populate('disasterId', 'title type location')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Contribution.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: contributions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching contributions:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get contribution by ID
const getContributionById = async (req, res) => {
    try {
        const { id } = req.params;

        const contribution = await Contribution.findById(id)
            .populate('userId', 'name email')
            .populate('disasterId', 'title type location');

        if (!contribution) {
            return res.status(404).json({
                success: false,
                message: 'Contribution not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contribution
        });

    } catch (error) {
        console.error('Error fetching contribution:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update contribution
const updateContribution = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if contribution exists and user owns it
        const contribution = await Contribution.findById(id);
        if (!contribution) {
            return res.status(404).json({
                success: false,
                message: 'Contribution not found'
            });
        }

        if (contribution.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this contribution'
            });
        }



        const updatedContribution = await Contribution.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('userId', 'name email')
         .populate('disasterId', 'title type location');

        res.status(200).json({
            success: true,
            message: 'Contribution updated successfully',
            data: updatedContribution
        });

    } catch (error) {
        console.error('Error updating contribution:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete contribution
const deleteContribution = async (req, res) => {
    try {
        const { id } = req.params;

        const contribution = await Contribution.findById(id);
        if (!contribution) {
            return res.status(404).json({
                success: false,
                message: 'Contribution not found'
            });
        }

        if (contribution.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this contribution'
            });
        }



        await Contribution.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Contribution deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting contribution:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};



module.exports = {
    createContribution,
    getContributions,
    getContributionById,
    updateContribution,
    deleteContribution
}; 