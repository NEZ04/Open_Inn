import mongoose from "mongoose";
import { ROLES, Permissions } from "../enum/role-enum.js";
import { rolePermissions } from "../utils/roles-permission.js";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: Object.values(ROLES),
        required: true,
        unique: true
    },
    permissions: {
        type: [String],
        enum: Object.values(Permissions),
        required: true,
        default: function () {
            return rolePermissions[this.name];
        }
    },

}, { timestamps: true })

export default mongoose.model('Roles', roleSchema);  