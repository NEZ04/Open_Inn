import { Router } from "express";
import passport from "passport";
import dotenv from "dotenv";
import { googleLoginCallback, registerUserController,loginUserController, logoutUserController } from "../controller/auth-controller.js";

dotenv.config();

const failedURL = `${process.env.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;
const authroutes = Router();

authroutes.post('/register',registerUserController)
authroutes.post('/login',loginUserController)

authroutes.post('/logout',logoutUserController)

authroutes.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

authroutes.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: failedURL
    }),
    googleLoginCallback
)





export default authroutes;