import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
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
    coverLetter: {
        type: String,
        trim: true
    },
    proposedRate: {
        type: Number,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending'
    }
}, { timestamps: true });

// Indexes for faster queries
applicationSchema.index({ projectId: 1, status: 1 });
applicationSchema.index({ freelancerId: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });

export default mongoose.model('Application', applicationSchema);
