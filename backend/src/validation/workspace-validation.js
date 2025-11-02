import {z} from "zod";

export const nameSchema = z.string().trim().min(1,{message:"Name is Required"}).max(255)
export const descriptionSchema = z.string().trim().max(1024).optional()    

export const createWorkSpaceSchema=z.object({
    name: nameSchema,
    description: descriptionSchema
})
export const updateWorkSpaceSchema=z.object({
    name: nameSchema,
    description: descriptionSchema
})

export const workspaceIdSchema=z.string().trim().min(1,{message:"Workspace ID is required"})

export const changeRoleSchema=z.object({
    roleId:z.string().trim().min(1,{message:"Role ID is required"}),
    memberId:z.string().trim().min(1,{message:"Member ID is required"})
})