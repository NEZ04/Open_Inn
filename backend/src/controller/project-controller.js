import { createProjectSchema, projectIdSchema, updateProjectSchema } from "../validation/project-validation.js"
import { workspaceIdSchema } from "../validation/workspace-validation.js";
import { createProjectService ,getAllProjectsInWorkspaceService,getProjectByIdAndWorkspaceIdService,getProjectAnalyticsService, updateProjectService, deleteProjectService} from "../services/project-service.js";
import { getMemberRoleInWorkspaceService } from "../services/member-services.js";
import { Permissions } from "../enum/role-enum.js";
import { roleGuard } from "../utils/roleGuard.js";

export const createProjectController = async (req, res) => {
    const body=createProjectSchema.parse(req.body);
    const workspaceId=workspaceIdSchema.parse(req.params.workspaceId);

    const userId=req.user?._id;
    const {rolename}=await getMemberRoleInWorkspaceService(userId,workspaceId);
    roleGuard(rolename,[Permissions.CREATE_PROJECT]);

    const {project}=await createProjectService(userId,workspaceId,body);

    res.status(200).json({message:"Project created successfully",project});
}
 
export const getAllProjectsInWorkspaceController=async(req,res)=>{
    const workspaceId=workspaceIdSchema.parse(req.params.workspaceId);
    const userId=req.user?._id;
    const {rolename}=await getMemberRoleInWorkspaceService(userId,workspaceId);
    roleGuard(rolename,[Permissions.VIEW_ONLY]);

    const pageSize=parseInt(req.query.pageSize)||10
    const pageNumber=parseInt(req.query.pageNumber)||1

    const {projects,totalCount,totalPages,skip}=await getAllProjectsInWorkspaceService(workspaceId,pageSize,pageNumber);

    res.status(200).json({message:"Projects retrieved successfully",projects,
        pagination:{
            totalCount,
            pageSize,
            pageNumber,
            totalPages,
            skip,
            limit:pageSize
        }
    });
}

export const getProjectByIdAndWorkspaceIdController=async(req,res)=>{
    const projectId=projectIdSchema.parse(req.params.id);
    const workspaceId=workspaceIdSchema.parse(req.params.workspaceId);
    const userId=req.user?._id;
    const {rolename}=await getMemberRoleInWorkspaceService(userId,workspaceId);
    roleGuard(rolename,[Permissions.VIEW_ONLY]);

    const {project}=await getProjectByIdAndWorkspaceIdService(workspaceId,projectId);
    return res.status(200).json({message:"Project retrieved successfully",project});

}

export const getProjectAnalyticsController=async(req,res)=>{
    const projectId=projectIdSchema.parse(req.params.id);
    const workspaceId=workspaceIdSchema.parse(req.params.workspaceId);
    const userId=req.user?._id;
    const {rolename}=await getMemberRoleInWorkspaceService(userId,workspaceId)
    roleGuard(rolename,[Permissions.VIEW_ONLY])

    const {analytics}=await getProjectAnalyticsService(workspaceId,projectId); 


    return res.status(200).json({message:"Project analytics retrieved successfully",analytics})
}

/**
 * Update project
 * PUT /project/:id/workspace/:workspaceId/update
 */
export const updateProjectController = async (req, res) => {
    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const updateData = updateProjectSchema.parse(req.body);
    const userId = req.user?._id;

    // Check user has permission to edit projects
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.EDIT_PROJECT]);

    const { project } = await updateProjectService(workspaceId, projectId, updateData);

    res.status(200).json({ message: "Project updated successfully", project });
}

/**
 * Delete project
 * DELETE /project/:id/workspace/:workspaceId
 */
export const deleteProjectController = async (req, res) => {
    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    // Check user has permission to delete projects
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.DELETE_PROJECT]);

    const { project } = await deleteProjectService(workspaceId, projectId);

    res.status(200).json({ message: "Project deleted successfully", project });
}