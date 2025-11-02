import Projects from "../models/Projects.js"
import Task from "../models/Task.js";

export const createProjectService = async (userId, workspaceId, { emoji, name, description }) => {
    const project = new Projects({
        emoji,
        name,
        description,
        workspace: workspaceId,
        createdBy: userId
    })

    await project.save();
    return { project };

}

export const getAllProjectsInWorkspaceService = async (workspaceId, pageSize, pageNumber) => {
    const totalCount = await Projects.countDocuments({ workspace: workspaceId });

    const skip = (pageNumber - 1) * pageSize;

    const projects = await Projects.find({ workspace: workspaceId }).skip(skip).limit(pageSize).populate("createdBy", "_id name email profilePicture").sort({ createdAt: -1 })

    const totalPages = Math.ceil(totalCount / pageSize);

    return { projects, totalCount, totalPages, skip };
}

export const getProjectByIdAndWorkspaceIdService = async (workspaceId, projectId) => {
    const project = await Projects.findOne({
        _id: projectId,
        workspace: workspaceId
    }).select("_id emoji name description")

    if (!project) {
        return { error: { message: "Project not found" } }
    }
    return { project };
}

export const getProjectAnalyticsService = async (workspaceId, projectId) => {
    const project = await Projects.findById(projectId)

    if (!project || !project.workspace.toString() !== workspaceId) {
        throw new Error("Project not found or does not belong to this workspace")
    }


    const currentDate = new Date();
    const taskAnalytics = await Task.aggregate([
        {
            $match: {
                workspaceId: workspaceId,
                projectId: projectId
            }
        },
        {
            $facets: {
                totalTasks: [{ $count: "count" }],
                overDueTasks: [
                    {
                        $match: {
                            dueDate: { $lt: currentDate },
                            status: {
                                $ne: 'done'
                            }
                        }
                    },
                    {
                        $count: "count",
                    }
                ],

                completedTasks: [
                    {
                        $match: { status: 'done' },

                    },
                    { $count: "count " }
                ]


            }

        }
    ])


    const _analytics = taskAnalytics[0];
    const analytics = {
        totalTasks: _analytics.totalTasks[0]?.count || 0,
        overDueTasks: _analytics.overDueTasks[0]?.count || 0,
        completedTasks: _analytics.completedTasks[0]?.count || 0
    }
    return { analytics };


}