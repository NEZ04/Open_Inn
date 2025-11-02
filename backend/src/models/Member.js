import mongoose from "mongoose";
const memberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roles",
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

export default mongoose.model('Member', memberSchema);