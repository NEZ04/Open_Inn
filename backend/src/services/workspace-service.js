import mongoose from "mongoose";
import User from "../models/User.js";
import Roles from "../models/Roles.js";
import { ROLES } from "../enum/role-enum.js";
import Workspace from "../models/Workspace.js";
import Member from "../models/Member.js";
import Task from "../models/Task.js";
import Project from "../models/Projects.js";
export const createWorkspaceService = async ({ name, description }, userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const ownerRole = await Roles.findOne({ name: ROLES.OWNER });
    if (!ownerRole) {
        throw new Error("Owner role not found. Please seed roles first.");
    }

    const workspace = new Workspace({
        name,
        description,
        owner: user._id,
    });
    await workspace.save();

    const member = new Member({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date()
    });
    await member.save();

    user.currentWorkspace = workspace._id;
    await user.save();

    return { workspace };
}

export const getAllWorkspaceUserIsMemberService = async (userId) => {
    const memberships = await Member.find({ userId }).populate('workspaceId').select("-password").exec();
    const workspace = memberships.map((membership) => membership.workspaceId);
    return { workspace };

}

export const getWorkspaceByIdService = async (workspaceId) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new Error("Workspace not found");
    }
    const members = await Member.find({ workspaceId })
        .populate("role")

    const createWorkspaceWithMembers = { ...workspace.toObject(), members };

    return { createWorkspaceWithMembers };
}

export const getWorkASpaceMembersService = async (workspaceId) => {
    const members = await Member.find({ workspaceId }).populate("userId", "name profilePicture email")
        .populate("role", "name")

    const roles = await Roles.find({}, { name: 1, _id: 1 }).select("-permissions").lean();
    return { members, roles };
}

export const getWorkspaceAnalyticsService = async (workspaceId) => {
    const currentDate = new Date();
    const totalTasks = await Task.countDocuments({ workspaceId })
    const overDueTasks = await Task.countDocuments({
        workspaceId,
        dueData: { $lt: currentDate },
        status: { $ne: 'done' }
    })
    const completedTasks = await Task.countDocuments({
        workspaceId,
        status: 'done'
    })
    const analytics = {
        totalTasks,
        overDueTasks,
        completedTasks
    }
    return { analytics };
}


export const changeMemberRoleService = async (workspaceId, memberId, roleId) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new Error("Workspace not found");

    }
    const role = await Roles.findById(roleId);
    if (!role) {
        throw new Error("Role not found");
    }
    const member = await Member.findOne({ userId: memberId, workspaceId });
    if (!member) {
        throw new Error("Member not founded in the workspace");

    }
    member.role = role;
    await member.save();
    return { member };
}

export const updateWorkspaceByIdService = async (workspaceId, name, description) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new Error("Workspace not found");
    }
    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;

    await workspace.save();

    return { workspace };

}

export const deleteWorkspaceByIdService = async (workspaceId, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const currentworkspace = await Workspace.findById(workspaceId).session(session);
        if (!currentworkspace) {
            throw new Error("Workspace not found");
        }

        //check if the user owns the workspace
        if (currentworkspace.owner.toString() !== userId.toString()) {
            throw new Error("Only workspace owner can delete the workspace");
        }
        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new Error("User not found");
        }
        await Project.deleteMany({ workspace: workspaceId }).session(session);
        await Task.deleteMany({ workspace: workspaceId }).session(session);
        await Member.deleteMany({ workspaceId }).session(session);


        //update the user's current workspace if it is the one being deleted
        if (user?.currentWorkspace === workspaceId) {
            const memberWorkspace = await Member.findOne({ userId }).session(session);
            //update the user's current workspace
            user.currentWorkspace = memberWorkspace ? memberWorkspace.workspaceId : null;
        }
        await user.save({ session });
        await currentworkspace.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();
        return { currentworkspace: user.currentWorkspace };

         
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
 
    }

}