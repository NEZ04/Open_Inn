import express from 'express'
import cors from "cors"
import session from "express-session"
import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from './libs/connectDB.js';
import passport from 'passport';
await import('./src/config/passport.js');
import authroutes from './src/routes/auth-route.js';
import userroutes from './src/routes/user-route.js';
import isAuthenticated from './middlewares/isAuthenticatedMiddleware.js';
import workspaceRoute from './src/routes/workspace-route.js';
import memberRoute from './src/routes/member-route.js';
import projectRoute from './src/routes/project-route.js';
import matchmakingRoutes from './src/routes/matchmaking-route.js';
import taskRoute from './src/routes/task-route.js';
import profileRoutes from './src/routes/profile-route.js';
const { errorHandler } = await import('./middlewares/errorHandler.js');


const app = express()

app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
}))

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/', async(req, res, next) => {
    try {
        res.status(200).json({ message: 'API is running' })

    } catch (error) {
        next(error)
    }
})

app.use(`${process.env.BASE_PATH}/auth`,authroutes )
app.use(`${process.env.BASE_PATH}/user`,isAuthenticated,userroutes )
app.use(`${process.env.BASE_PATH}/workspace`,isAuthenticated,workspaceRoute)
app.use(`${process.env.BASE_PATH}/member`,isAuthenticated,memberRoute)
app.use(`${process.env.BASE_PATH}/project`,isAuthenticated,projectRoute)
app.use(`${process.env.BASE_PATH}/task`,isAuthenticated,taskRoute)
app.use(`${process.env.BASE_PATH}/profile`,isAuthenticated,profileRoutes)
app.use(`${process.env.BASE_PATH}/matchmaking`,isAuthenticated,matchmakingRoutes)

app.use(errorHandler)

app.listen(8000, async () => {
    console.log('Server is running on port 8000')
    await connectDB();
})



