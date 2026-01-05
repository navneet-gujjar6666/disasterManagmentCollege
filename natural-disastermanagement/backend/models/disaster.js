const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['earthquake', 'flood', 'hurricane', 'tornado', 'wildfire', 'tsunami', 'volcanic_eruption', 'drought', 'landslide', 'other'],
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
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
        address: String,
        city: String,
        state: String,
        country: String
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'monitoring'],
        default: 'active'
    },
    affectedAreas: [{
        name: String,
        coordinates: {
            type: [Number],
            default: [0, 0]
        },
        population: Number,
        damageLevel: {
            type: String,
            enum: ['minimal', 'moderate', 'severe', 'devastating']
        }
    }],
    casualties: {
        type: Number,
        default: 0
    },
    damageEstimate: {
        type: Number,
        default: 0
    },
    media: [{
        url: String,
        type: {
            type: String,
            enum: ['image', 'video', 'document']
        },
        description: String
    }],
    files: [{
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    commonNeeds: [{
        type: String,
        enum: ['food', 'water', 'shelter', 'medical', 'clothing', 'transportation', 'communication', 'other']
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    contributions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contribution'
    }]
}, {
    timestamps: true
});

// Index for better query performance
disasterSchema.index({ type: 1, status: 1 });
disasterSchema.index({ severity: 1 });
disasterSchema.index({ location: '2dsphere' });
disasterSchema.index({ startDate: -1 });

module.exports = mongoose.model('Disaster', disasterSchema);