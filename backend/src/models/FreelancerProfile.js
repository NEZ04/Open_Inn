import mongoose from "mongoose";

const freelancerProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    skills: {
        type: [String],
        required: true,
        default: []
    },
    hourlyRate: {
        type: Number,
        min: 0
    },
    portfolioUrl: {
        type: String,
        trim: true
    },
    githubUrl: {
        type: String,
        trim: true
    },
    linkedinUrl: {
        type: String,
        trim: true
    },
    yearsExperience: {
        type: Number,
        min: 0,
        default: 0
    },
    availability: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'not-available'],
        default: 'full-time'
    },
    openSourceContributions: {
        type: [String],
        default: []
    },
    hackathonWins: {
        type: Number,
        min: 0,
        default: 0
    },
    lookingFor: {
        type: String,
        trim: true
    },
    preferredProjectTypes: {
        type: [String],
        default: []
    }
}, { timestamps: true });

// Index for faster queries
freelancerProfileSchema.index({ userId: 1 });
freelancerProfileSchema.index({ skills: 1 });

export default mongoose.model('FreelancerProfile', freelancerProfileSchema);
