const Disaster = require('../models/disaster');
const fs = require('fs');
const path = require('path');

// Add a new disaster
const addDisaster = async (req, res) => {
    try {
        const {
            title,
            description,
            type,
            severity,
            location,
            startDate,
            endDate,
            status,
            affectedAreas,
            casualties,
            damageEstimate
        } = req.body;

        // Validate required fields
        if (!title || !description || !type || !severity) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: title, description, type, severity'
            });
        }

        // Process uploaded files
        console.log('Files received:', req.files);
        const files = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                console.log('Processing file:', file.originalname);
                files.push({
                    filename: file.filename,
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    path: file.path
                });
            });
        }
        console.log('Files array:', files);

        // Helper function to safely parse JSON or return as-is
        const safeParse = (data) => {
            if (!data) return undefined;
            if (typeof data === 'string') {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    return data;
                }
            }
            return data;
        };

        // Create new disaster
        const disaster = new Disaster({
            title,
            description,
            type,
            severity,
            location: safeParse(location),
            startDate: startDate || new Date(),
            endDate,
            status: status || 'active',
            affectedAreas: safeParse(affectedAreas) || [],
            casualties: casualties || 0,
            damageEstimate: damageEstimate || 0,
            files
        });

        await disaster.save();

        res.status(201).json({
            success: true,
            message: 'Disaster added successfully',
            data: disaster
        });

    } catch (error) {
        console.error('Error adding disaster:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get all disasters
const getDisasters = async (req, res) => {
    try {
        const {
            type,
            severity,
            status,
            page = 1,
            limit = 10
        } = req.query;

        // Build filter object
        const filter = {};
        if (type) filter.type = type;
        if (severity) filter.severity = severity;
        if (status) filter.status = status;

        // Pagination
        const skip = (page - 1) * limit;

        const disasters = await Disaster.find(filter)
            .sort({ startDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Disaster.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: disasters,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching disasters:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get disaster by ID
const getDisasterById = async (req, res) => {
    try {
        const { id } = req.params;

        const disaster = await Disaster.findById(id);

        if (!disaster) {
            return res.status(404).json({
                success: false,
                message: 'Disaster not found'
            });
        }

        res.status(200).json({
            success: true,
            data: disaster
        });

    } catch (error) {
        console.error('Error fetching disaster:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get distinct disaster types (e.g., earthquake, flood, etc.)
const getDisasterTypes = async (req, res) => {
    try {
        const types = await Disaster.distinct('type');
        res.status(200).json({ success: true, data: types });
    } catch (error) {
        console.error('Error fetching disaster types:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Get disaster by ID (internal function for other controllers)
const getDisasterByIdInternal = async (disasterId) => {
    try {
        const disaster = await Disaster.findById(disasterId);
        return disaster;
    } catch (error) {
        console.error('Error fetching disaster internally:', error);
        throw error;
    }
};

// Update disaster
const updateDisaster = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const disaster = await Disaster.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!disaster) {
            return res.status(404).json({
                success: false,
                message: 'Disaster not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Disaster updated successfully',
            data: disaster
        });

    } catch (error) {
        console.error('Error updating disaster:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete disaster
const deleteDisaster = async (req, res) => {
    try {
        const { id } = req.params;

        const disaster = await Disaster.findById(id);
        if (!disaster) {
            return res.status(404).json({
                success: false,
                message: 'Disaster not found'
            });
        }

        // Delete associated files
        if (disaster.files && disaster.files.length > 0) {
            disaster.files.forEach(file => {
                const filePath = file.path;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        await Disaster.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Disaster deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting disaster:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Download file from disaster
const downloadFile = async (req, res) => {
    try {
        const { disasterId, fileId } = req.params;

        const disaster = await Disaster.findById(disasterId);
        if (!disaster) {
            return res.status(404).json({
                success: false,
                message: 'Disaster not found'
            });
        }

        const file = disaster.files.id(fileId);
        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const filePath = file.path;
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }

        res.download(filePath, file.originalName);

    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete specific file from disaster
const deleteFile = async (req, res) => {
    try {
        const { disasterId, fileId } = req.params;

        const disaster = await Disaster.findById(disasterId);
        if (!disaster) {
            return res.status(404).json({
                success: false,
                message: 'Disaster not found'
            });
        }

        const file = disaster.files.id(fileId);
        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Delete file from filesystem
        const filePath = file.path;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove file from disaster
        disaster.files.pull(fileId);
        await disaster.save();

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    addDisaster,
    getDisasters,
    getDisasterById,
    getDisasterTypes,
    getDisasterByIdInternal,
    updateDisaster,
    deleteDisaster,
    downloadFile,
    deleteFile
};
