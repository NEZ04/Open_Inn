import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matchScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    matchReason: {
        type: String,
        required: true
    },
    matchType: {
        type: String,
        enum: ['ai_generated', 'rule_based_fallback'],
        required: true
    },
    skillsMatched: {
        type: [String],
        default: []
    },
    isViewed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Compound unique index to prevent duplicate matches
matchSchema.index({ projectId: 1, freelancerId: 1 }, { unique: true });

// Indexes for faster queries
matchSchema.index({ matchScore: -1 });
matchSchema.index({ createdAt: -1 });
matchSchema.index({ projectId: 1, matchScore: -1 });
matchSchema.index({ freelancerId: 1, matchScore: -1 });

export default mongoose.model('Match', matchSchema);
