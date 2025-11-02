import { changeRoleSchema, createWorkSpaceSchema, updateWorkSpaceSchema, workspaceIdSchema } from "../validation/workspace-validation.js"
import { createWorkspaceService, getAllWorkspaceUserIsMemberService, getWorkspaceByIdService, getWorkASpaceMembersService,getWorkspaceAnalyticsService,changeMemberRoleService,updateWorkspaceByIdService,deleteWorkspaceByIdService } from "../services/workspace-service.js";
import { getMemberRoleInWorkspaceService } from "../services/member-services.js";
import { Permissions } from "../enum/role-enum.js";
import { roleGuard } from "../utils/roleGuard.js";
export const createWorkspaceController = async (req, res) => {
    const body = createWorkSpaceSchema.parse(req.body);


    const userId = req.user?._id;

    const { workspace } = await createWorkspaceService(body, userId);
    return res.status(201).json({ message: "Workspace created successfully", workspace });
}

export const getAllWorkspaceUserIsMemberController = async (req, res) => {
    const userId = req.user?._id;
    const { workspace } = await getAllWorkspaceUserIsMemberService(userId);
    return res.status(200).json({ workspace });
}

export const getWorkspaceByIdController = async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    await getMemberRoleInWorkspaceService(userId, workspaceId);
    const { createWorkspaceWithMembers } = await getWorkspaceByIdService(workspaceId);
    return res.status(200).json({ createWorkspaceWithMembers })
}

export const getWorkspaceMembersController = async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.VIEW_ONLY]);
    const { members, roles } = await getWorkASpaceMembersService(workspaceId);

    res.status(200).json({ message: "Workspace Member Retrieved Successfullly", members, roles });
}

export const getWorkspaceAnalyticsController = async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.VIEW_ONLY]);
    const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

    res.status(200).json({ message: "Workspace Analytics Retrieved Successfully", analytics });
}

export const changeWorkspaceMemberRoleController=async(req,res)=>{
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const {memberId,roleId}=changeRoleSchema.parse(req.body);
    const userId = req.user?._id;
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.CHANGE_MEMBER_ROLE]);

    const {member}=await changeMemberRoleService(workspaceId,memberId,roleId);

    res.status(200).json({message:"Member role changed successfully",member});

}

export const updateWorkspaceIdByController=async(req,res)=>{
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const {name,description}=updateWorkSpaceSchema.parse(req.body);

    const userId= req.user?._id;
    const {rolename}=await getMemberRoleInWorkspaceService(userId,workspaceId);
    roleGuard(rolename,[Permissions.EDIT]);
    
    const {workspace}=await updateWorkspaceByIdService(workspaceId,name,description);

    res.status(200).json({message:"Workspace updated successfully",workspace});
}

export const  deleteWorkspaceByIdController=async(req,res)=>{
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId= req.user?._id;
    const {rolename}=await getMemberRoleInWorkspaceService(userId,workspaceId);
    roleGuard(rolename,[Permissions.DELETE_WORKSPACE]);
    const {currentworkspace}=await deleteWorkspaceByIdService(workspaceId,userId);

    res.status(200).json({message:"Workspace deleted successfully",currentworkspace});
}