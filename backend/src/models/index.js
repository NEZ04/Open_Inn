/**
 * Global Models Registry
 * Import all models here and export them as named exports
 * Usage: import { User, Workspace, Project, Task, Roles, Member, Account, FreelancerProfile, Match, Application } from './src/models/index.js'
 */

import User from './User.js';
import Account from './Account.js';
import Workspace from './Workspace.js';
import Roles from './Roles.js';
import Member from './Member.js';
import Project from './Projects.js';
import Task from './Task.js';
import ActivityLog from './ActivityLog.js';
import FreelancerProfile from './FreelancerProfile.js';
import Match from './Match.js';
import Application from './Application.js';

// Export all models as named exports
export {
    User,
    Account,
    Workspace,
    Roles,
    Member,
    Project,
    Task,
    ActivityLog,
    FreelancerProfile,
    Match,
    Application
};

// Default export with all models as an object
export default {
    User,
    Account,
    Workspace,
    Roles,
    Member,
    Project,
    Task,
    ActivityLog,
    FreelancerProfile,
    Match,
    Application
};
