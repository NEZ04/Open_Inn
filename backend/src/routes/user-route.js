import  { Router } from "express";
import { getCurrentUserController } from "../controller/user-controller.js";
const userroutes = Router();

userroutes.get("/current",getCurrentUserController);

export default userroutes;