import { rolePermissions } from "./roles-permission.js"
export const roleGuard = (role, requiredPermissions) => {
    const permission = rolePermissions[role];
    
    if (!permission) {
        throw new Error(`Invalid role: ${role}. Role not found in permissions.`);
    }
    
    const hasPermission = requiredPermissions.every(rp => permission.includes(rp));
    
    if (!hasPermission) {
        throw new Error("Forbidden: You don't have permission to perform this action.");
    }
}