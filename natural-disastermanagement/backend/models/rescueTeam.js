const mongoose = require('mongoose');

const rescueTeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    ngoName: {
        type: String,
        required: true,
        trim: true
    },
    specialization: {
        type: String,
        enum: ['medical', 'search_rescue', 'logistics', 'communication', 'heavy_machinery', 'water_rescue', 'other'],
        required: true
    },
    memberCount: {
        type: Number,
        required: true,
        min: 1
    },
    contactPerson: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        },
        city: String,
        state: String,
        country: String
    },
    equipmentList: [{
        name: String,
        quantity: Number,
        description: String
    }],
    availability: {
        type: String,
        enum: ['available', 'busy', 'unavailable'],
        default: 'available'
    },
    assignedDisasters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disaster'
    }],
    trainingCertifications: [String],
    experience: {
        type: String,
        enum: ['beginner', 'intermediate', 'expert'],
        default: 'intermediate'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
rescueTeamSchema.index({ specialization: 1, availability: 1 });
rescueTeamSchema.index({ ngoName: 1 });
rescueTeamSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('RescueTeam', rescueTeamSchema);
