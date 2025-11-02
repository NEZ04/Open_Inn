import mongoose from "mongoose";
import { generateTaskCode } from "../utils/uuid.js";
const TaskSchema = new mongoose.Schema({
    taskCode:{
        type:String,
        unique:true,
        default:generateTaskCode()
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        default:null,
        trim:true 
    },
    workspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Workspace',
        required:true
    },
    status:{
        type:String,
        enum:Object.values(['todo','in-progress','done']),
        default:'todo'
    },
    priority:{
        type:String,
        enum:Object.values(['low','medium','high']),
        default:'medium'
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    dueDate:{
        type:Date,
        default:null
    }
    
 
},{timestamps:true})

export default mongoose.model('Task',TaskSchema);