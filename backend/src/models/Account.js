import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: String,
        required: true,
        enum: ['google', 'github', 'twitter', 'email']
    },
    providerId: {
        type: String,
        required: true
    },
    providerEmail: {
        type: String,
        default: null
    },
    accessToken: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    tokenExpiry: {
        type: Date,
        default: null
    },
    profile: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.accessToken = undefined;
            ret.refreshToken = undefined;
            return ret;
        }
    }
});

// Compound index to ensure one account per provider per user
accountSchema.index({ userId: 1, provider: 1 }, { unique: true });
accountSchema.index({ providerId: 1, provider: 1 }, { unique: true });

export const Account = mongoose.model('Account', accountSchema);
export default Account;