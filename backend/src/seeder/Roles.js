import mongoose from "mongoose"
import dotenv from "dotenv";
import Roles from "../models/Roles.js";
import { rolePermissions } from "../utils/roles-permission.js";
import { connectDB } from "../../libs/connectDB.js";

dotenv.config();
const seedRoles = async () => {
    console.log("Seeding roles...");
    let session;
    try {
        await connectDB();
        session = await mongoose.startSession();
        session.startTransaction();

        console.log("Clearing existing roles...");
        await Roles.deleteMany({}, { session });

        for (const roleName in rolePermissions) {
            const permissions = rolePermissions[roleName];

            const existingRole = await Roles.findOne({ name: roleName }).session(session);
            if (!existingRole) {
                const newRole = new Roles({
                    name: roleName,
                    permissions
                });
                await newRole.save({ session });
                console.log(`Role ${roleName} created with permissions: ${permissions}`);
            } else {
                console.log(`Role ${roleName} already exists. Skipping creation.`);
            }
        }

        await session.commitTransaction();
        console.log("Transaction committed");
    } catch (error) {
        console.error("Error seeding roles:", error);
        throw error;
    } finally {
        if (session) {
            await session.endSession().catch(() => { });
            console.log("Session ended");
        }
    }
};

seedRoles();
export default seedRoles;
