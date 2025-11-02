import { ROLES } from "../enum/role-enum.js";
import Member from "../models/Member.js";
import Roles from "../models/Roles.js";
import Workspace from "../models/Workspace.js";
export const getMemberRoleInWorkspaceService = async (userId, workspaceId) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new Error("Workspace not found");
    }
    const member = await Member.findOne({
        userId, workspaceId
    }).populate('role');
    if (!member) {
        throw new Error("User is not a member of this workspace");
    }
    const rolename = member.role?.name
    return { rolename };
}

export const joinWorkspaceService = async (inviteCode, userId) => {
    const workspace = await Workspace.findOne({ inviteCode })
    if (!workspace) { throw new Error("Invitation code is invalid"); }

    //checking if user is already a member
    const existingMember = await Member.findOne({ userId, workspaceId: workspace._id }).exec();
    if (existingMember) {
        throw new Error("User is already a member of this workspace");
    }

    const role=await Roles.findOne({name:ROLES.MEMBER});
    if(!role){
        throw new Error("Member role not found. Please seed roles first.");
    }
    const member=new Member({
        userId,
        workspaceId:workspace._id,
        role:role._id,
        joinedAt:new Date()
    });
    await member.save();
    return { workspaceId: workspace._id, role: role.name };
}
