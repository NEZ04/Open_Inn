/**
 * Global Models Registry
 * Import all models here and export them as named exports
 * Usage: import { User, Workspace, Project, Task, Roles, Member, Account } from './src/models/index.js'
 */

import User from './User.js';
import Workspace from './Workspace.js';
import Project from './Projects.js';
import Task from './Task.js';
import Roles from './Roles.js';
import Member from './Member.js';
import Account from './Account.js';

// Export all models as named exports
export {
    User,
    Workspace,
    Project,
    Task,
    Roles,
    Member,
    Account
};

// Default export with all models as an object
export default {
    User,
    Workspace,
    Project,
    Task,
    Roles,
    Member,
    Account
};
