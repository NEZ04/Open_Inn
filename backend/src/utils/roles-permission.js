import { ROLES,Permissions } from "../enum/role-enum.js";

export const rolePermissions = {
    OWNER:[
        Permissions.CREATE_WORKSPACE,
        Permissions.DELETE_WORKSPACE,
        Permissions.EDIT,
        Permissions.MANAGE_WORKSPACE_SETTING,
 
        Permissions.ADD_MEMBER,
        Permissions.CHANGE_MEMBER_ROLE,
        Permissions.REMOVE_MEMBER,
        
        Permissions.CREATE_PROJECT,
        Permissions.DELETE_PROJECT,
        Permissions.EDIT_PROJECT,

        Permissions.CREATE_TASK,
        Permissions.EDIT_TASK,
        Permissions.DELETE_TASK,

        Permissions.VIEW_ONLY
    ],

    ADMIN:[
        Permissions.ADD_MEMBER,
        Permissions.CREATE_PROJECT,
        Permissions.EDIT_PROJECT,
        Permissions.DELETE_PROJECT,
        Permissions.CREATE_TASK,
        Permissions.EDIT_TASK,
        Permissions.DELETE_TASK,
        Permissions.MANAGE_WORKSPACE_SETTING,
        Permissions.VIEW_ONLY
    ],

    MEMBER:[
        Permissions.CREATE_TASK,
        Permissions.EDIT_TASK,
        Permissions.VIEW_ONLY
    ]



    
}