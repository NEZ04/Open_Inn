import Account from "../models/Account.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Workspace from "../models/Workspace.js";
import Roles from "../models/Roles.js";
import { ROLES } from "../enum/role-enum.js";
import Member from "../models/Member.js";
export const loginOrRegisterUser = async (
    {
        provider,
        displayName,
        providerId,
        picture,
        email,
        accessToken,
        refreshToken
    }
) => {
    const session = await mongoose.startSession();
    // const { providerId, provider, displayName, email, picture } = options;
    try {
        session.startTransaction();
        console.log("Session Started");
        let user = await User.findOne({ email }).session(session);

        if (!user) {
            user = new User({
                name: displayName,
                email,
                profilePicture: picture || null,
            })
            await user.save({ session });

            //create account
            const account = new Account({
                userId: user._id,
                provider,
                providerId,
                accessToken,
                refreshToken: refreshToken || null,
                providerEmail: email
            })
            await account.save({ session });

            //create new Workspace for user
            const newWorkspace = new Workspace({
                name: "My Workspace",
                description: `Workspace created for user ${user.name}`,
                owner: user._id,

            })
            await newWorkspace.save({ session });
            const ownerRole = await Roles.findOne({ name: ROLES.OWNER }).session(session);
            if (!ownerRole) {
                throw new Error("Owner role not found. Please seed roles first.");
            }
            const member = new Member({
                userId: user._id,
                workspaceId: newWorkspace._id,
                role: ownerRole._id,
                joindedAt: new Date()
            })
            await member.save({ session });
            user.currentWorkspace = newWorkspace._id;
            await user.save({ session })
        } else {
            throw new Error("User already exists. Please login instead.");
        }

        await session.commitTransaction();
        console.log("Transaction Committed");
        return { user };
    } catch (error) {
        await session.abortTransaction();
        console.error("Error occurred during login or registration:", error);
        throw error; // Re-throw to passport
    } finally {
        await session.endSession();
        console.log("Session Ended");
    }

}

export const registerUserService = async ({ email, name, password }) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        console.log("Session Started");
        let user = await User.findOne({ email }).session(session);
        if (user) {
            throw new Error("User already exists with this email");
        }
        user = new User({
            name: name,
            email,
            password: password,
        })
        await user.save({ session });

        const acc = new Account({
            userId: user._id,
            provider: "email",
            providerId: email,

        })
        await acc.save({ session });
        const newWorkspace = new Workspace({
            name: "My Workspace",
            description: `Workspace created for user ${user.name}`,
            owner: user._id,

        })
        await newWorkspace.save({ session });
        const ownerRole = await Roles.findOne({ name: ROLES.OWNER }).session(session);
        if (!ownerRole) {
            throw new Error("Owner role not found. Please seed roles first.");
        }

        const member = new Member({
            userId: user._id,
            workspaceId: newWorkspace._id,
            role: ownerRole._id,
            joindedAt: new Date()
        })
        await member.save({ session });
        user.currentWorkspace = newWorkspace._id;
        await user.save({ session })
        await session.commitTransaction();
        console.log("Transaction Committed");
        return { userId: user._id, workspaceId: newWorkspace._id };
    } catch (error) {
        await session.abortTransaction();
        console.error("Error occurred during registration:", error);
        throw error;
    } finally {
        await session.endSession();
        console.log("Session Ended");
    }
}

export const verifyUserService=async(email,password,provider='email')=>{

    const acc=await Account.findOne({provider,providerId:email});
    if(!acc){
        return null; // Return null instead of string for consistency
    }
    const user=await User.findById(acc.userId).select('+password'); // Add .select('+password') to include the password field
    if(!user){
        return null; // Return null instead of string for consistency
    }
    const isMatch=await user.matchPassword(password);
    if(!isMatch){
        return null; // Return null instead of string for consistency
    }

    return user.omitPassword();    
}