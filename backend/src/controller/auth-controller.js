import dotenv from 'dotenv';
import { registerSchema } from '../validation/auth-validation.js';
dotenv.config();
import { registerUserService } from '../services/auth-service.js';
import passport from 'passport';
export const googleLoginCallback = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.redirect(`${process.env.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&error=not_authenticated`);
        }

        const workspace = req.user?.currentWorkspace; //here user gives the object of user model

        if (!workspace) {
            return res.redirect(`${process.env.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&error=no_workspace`);
        }
        
        return res.redirect(`${process.env.FRONTEND_ORIGIN}/workspace/${workspace}`);
    } catch (error) {
        console.error('Google login callback error:', error);
        return res.redirect(`${process.env.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&error=server_error`);
    }
}

export const registerUserController=async(req,res)=>{
    const body=registerSchema.parse(req.body);

    await registerUserService(body);

    return res.status(201).json({message:"User registered successfully"})

}

export const loginUserController=async(req,res,next)=>{
    passport.authenticate('local',(err,user,info)=>{
        if(err){
            return res.status(500).json({message:"Internal Server Error",error:err.message});
        }
        if(!user){
            return res.status(401).json({message: info?.message || "Invalid credentials"});
        }
        req.logIn(user,(loginErr)=>{
            if(loginErr){
                return res.status(500).json({message:"Login failed",error:loginErr.message});
            }
            return res.status(200).json({message:"Login successful",user});
        });
    })(req,res,next);
}

export const logoutUserController=async(req,res)=>{
    req.logout((err)=>{
        if(err){
            return res.status(500).json({message:"Logout failed",error:err.message});
        }
        req.session = null;
        return res.status(200).json({message:"Logout successful"});
    });
}

