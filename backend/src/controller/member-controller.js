import { z } from "zod";
import { joinWorkspaceService } from "../services/member-services.js";

export const joinWorkspaceController = async (req, res) => {
    const inviteCode = z.string().parse(req.params.inviteCode);
    const userId=req.user?._id;

    const {workspaceId,role}=await joinWorkspaceService(inviteCode,userId);
    res.status(200).json({message:"Joined workspace successfully",workspaceId,role});
}