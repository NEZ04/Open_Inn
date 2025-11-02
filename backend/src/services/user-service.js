import { User } from "../models/User.js"

export const fetchCurrentUser = async(userId) => {
    const user=await User.findById(userId).populate('currentWorkspace').select('-password');
    if(!user){
        throw new Error("User not found");
    }

   return {user};
}