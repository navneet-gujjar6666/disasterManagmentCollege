const RescueTeam = require('../models/rescueTeam');
const Disaster = require('../models/disaster');

// Create a new rescue team
const createRescueTeam = async (req, res) => {
    try {
        const {
            name,
            ngoName,
            specialization,
            memberCount,
            contactPerson,
            contactPhone,
            contactEmail,
            location,
            equipmentList,
            trainingCertifications,
            experience
        } = req.body;

        // Validate required fields
        if (!name || !ngoName || !specialization || !memberCount || !contactPerson || !contactPhone || !contactEmail) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create new rescue team
        const rescueTeam = new RescueTeam({
            name,
            ngoName,
            specialization,
            memberCount,
            contactPerson,
            contactPhone,
            contactEmail,
            location: location || { type: 'Point', coordinates: [0, 0] },
            equipmentList: equipmentList || [],
            trainingCertifications: trainingCertifications || [],
            experience: experience || 'intermediate'
        });

        await rescueTeam.save();

        res.status(201).json({
            success: true,
            message: 'Rescue team created successfully',
            data: rescueTeam
        });

    } catch (error) {
        console.error('Error creating rescue team:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get all rescue teams
const getRescueTeams = async (req, res) => {
    try {
        const {
            specialization,
            availability,
            ngoName,
            page = 1,
            limit = 10
        } = req.query;

        // Build filter
        const filter = {};
        if (specialization) filter.specialization = specialization;
        if (availability) filter.availability = availability;
        if (ngoName) filter.ngoName = new RegExp(ngoName, 'i'); // case-insensitive search

        const skip = (page - 1) * limit;

        const rescueTeams = await RescueTeam.find(filter)
            .populate('assignedDisasters', 'title type severity')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await RescueTeam.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: rescueTeams,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching rescue teams:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get rescue team by ID
const getRescueTeamById = async (req, res) => {
    try {
        const { id } = req.params;

        const rescueTeam = await RescueTeam.findById(id)
            .populate('assignedDisasters', 'title type severity location');

        if (!rescueTeam) {
            return res.status(404).json({
                success: false,
                message: 'Rescue team not found'
            });
        }

        res.status(200).json({
            success: true,
            data: rescueTeam
        });

    } catch (error) {
        console.error('Error fetching rescue team:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Assign rescue team to disaster
const assignRescueTeamToDisaster = async (req, res) => {
    try {
        const { teamId, disasterId } = req.body;

        if (!teamId || !disasterId) {
            return res.status(400).json({
                success: false,
                message: 'Missing teamId or disasterId'
            });
        }

        // Check if rescue team exists
        const rescueTeam = await RescueTeam.findById(teamId);
        if (!rescueTeam) {
            return res.status(404).json({
                success: false,
                message: 'Rescue team not found'
            });
        }

        // Check if disaster exists
        const disaster = await Disaster.findById(disasterId);
        if (!disaster) {
            return res.status(404).json({
                success: false,
                message: 'Disaster not found'
            });
        }

        // Check if team is already assigned
        if (rescueTeam.assignedDisasters.includes(disasterId)) {
            return res.status(400).json({
                success: false,
                message: 'Rescue team already assigned to this disaster'
            });
        }

        // Assign team to disaster
        rescueTeam.assignedDisasters.push(disasterId);
        await rescueTeam.save();

        res.status(200).json({
            success: true,
            message: 'Rescue team assigned to disaster successfully',
            data: rescueTeam
        });

    } catch (error) {
        console.error('Error assigning rescue team:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Unassign rescue team from disaster
const unassignRescueTeamFromDisaster = async (req, res) => {
    try {
        const { teamId, disasterId } = req.body;

        if (!teamId || !disasterId) {
            return res.status(400).json({
                success: false,
                message: 'Missing teamId or disasterId'
            });
        }

        const rescueTeam = await RescueTeam.findById(teamId);
        if (!rescueTeam) {
            return res.status(404).json({
                success: false,
                message: 'Rescue team not found'
            });
        }

        // Remove disaster from assigned list
        rescueTeam.assignedDisasters = rescueTeam.assignedDisasters.filter(
            id => id.toString() !== disasterId
        );
        await rescueTeam.save();

        res.status(200).json({
            success: true,
            message: 'Rescue team unassigned from disaster successfully',
            data: rescueTeam
        });

    } catch (error) {
        console.error('Error unassigning rescue team:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update rescue team
const updateRescueTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const rescueTeam = await RescueTeam.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('assignedDisasters', 'title type severity');

        if (!rescueTeam) {
            return res.status(404).json({
                success: false,
                message: 'Rescue team not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Rescue team updated successfully',
            data: rescueTeam
        });

    } catch (error) {
        console.error('Error updating rescue team:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete rescue team
const deleteRescueTeam = async (req, res) => {
    try {
        const { id } = req.params;

        const rescueTeam = await RescueTeam.findByIdAndDelete(id);

        if (!rescueTeam) {
            return res.status(404).json({
                success: false,
                message: 'Rescue team not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Rescue team deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting rescue team:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get teams available for a specific disaster (by specialization)
const getAvailableTeamsForDisaster = async (req, res) => {
    try {
        const { disasterId, specialization } = req.query;

        if (!disasterId) {
            return res.status(400).json({
                success: false,
                message: 'Missing disasterId parameter'
            });
        }

        // Build filter
        const filter = { availability: 'available' };
        if (specialization) filter.specialization = specialization;

        const teams = await RescueTeam.find(filter)
            .populate('assignedDisasters', 'title type')
            .sort({ experience: -1, memberCount: -1 });

        res.status(200).json({
            success: true,
            data: teams
        });

    } catch (error) {
        console.error('Error fetching available teams:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    createRescueTeam,
    getRescueTeams,
    getRescueTeamById,
    assignRescueTeamToDisaster,
    unassignRescueTeamFromDisaster,
    updateRescueTeam,
    deleteRescueTeam,
    getAvailableTeamsForDisaster
};
