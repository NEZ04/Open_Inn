import { fetchCurrentUser } from "../services/user-service.js";

export const getCurrentUserController = async (req, res) => {
    const {user}=await fetchCurrentUser(req.user.id);
    return res.status(200).json({message:"Current user fetched successfully",user});
};