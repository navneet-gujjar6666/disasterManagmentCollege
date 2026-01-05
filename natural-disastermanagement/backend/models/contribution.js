const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    disasterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disaster',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    contributionType: {
        type: String,
        enum: ['financial', 'material', 'volunteer', 'information', 'other'],
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    contactInfo: {
        phone: String,
        email: String,
        address: String
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for better query performance
contributionSchema.index({ disasterId: 1, status: 1 });
contributionSchema.index({ userId: 1 });
contributionSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Contribution', contributionSchema);
