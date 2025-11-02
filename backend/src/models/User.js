import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    profilePicture: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    description: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    userRole: {
        type: String,
        enum: ['freelancer', 'project_owner', 'open_source_contributor', 'job_seeker', 'hackathon_participant'],
        default: null
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    // This is the AI-generated vector
    profileVector: {
        type: [Number], // Defines it as an array of numbers
        default: undefined
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    currentWorkspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        default: null
    },

}, { timestamps: true })

//password hash middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified('password') || !this.password) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});

//Match the User password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.omitPassword = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};


export const User = mongoose.model("User", userSchema);
export default User;