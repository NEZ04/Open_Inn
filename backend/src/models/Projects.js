import mongoose from "mongoose";
import { required } from "zod/mini";
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    emoji: {
        type: String,
        required: false,
        trim: true,
        default: '📊 '
    },
    description: {
        type: String,
        required: true,
    },
    profileVector: {
        type: [Number], // Array of numbers
        default: undefined
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace'
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requiredSkills: {
        type: [String],
        default: []
    },
    techStack: [{
        type: String,
        lowercase: true
    }],
    budgetMin: {
        type: Number,
        min: 0
    },
    budgetMax: {
        type: Number,
        min: 0
    },
    timeline: {
        type: String,
        trim: true
    },
    projectType: {
        type: String,
        enum: ['freelance_gig', 'open_source', 'startup', 'hackathon', 'full_time_job'],
        default: 'freelance_gig'
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'completed', 'cancelled'],
        default: 'open'
    },
    deadline: {
        type: Date
    }

}, { timestamps: true })

export default mongoose.model('Project', projectSchema);