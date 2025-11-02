import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
import GitHubStrategy from 'passport-github2';
import TwitterStrategy from 'passport-twitter';
import LocalStrategy from 'passport-local';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import ProviderEnums from '../enum/provider-enum.js';
import { loginOrRegisterUser, verifyUserService } from '../services/auth-service.js';

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

//Local Strategy

passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    session:true
}, async(email,password,done)=>{
    try {
        const user=await verifyUserService(email,password);

        if(!user){
            return done(null,false,{message:"Invalid email or password"})
        }
        return done(null,user);
    } catch (error) {
        return done(error);
    }
}
))

//Google Strategy

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL;

console.log('[passport] Google OAuth Config:', {
    clientID: googleClientId ? 'SET' : 'MISSING',
    clientSecret: googleClientSecret ? 'SET' : 'MISSING',
    callbackURL: googleCallbackUrl
});

if (googleClientId && googleClientSecret && googleCallbackUrl) {
    passport.use(new GoogleStrategy.Strategy({
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackUrl,
        scope:['profile','email'],
        passReqToCallback:true
    },async(req,accessToken,refreshToken,profile,done)=>{
    try {
        const {email,sub:googleId,picture}=profile._json;
        console.log("Profile:", profile); 
        console.log("GoogleId",googleId)
        if(!googleId){
            throw new Error("Google ID not found in profile");
        }
        const {user}=await loginOrRegisterUser({
            provider:ProviderEnums.GOOGLE,
            displayName:profile.displayName,
            providerId:googleId,
            picture:picture,
            email:email,
            accessToken:accessToken,
            refreshToken:refreshToken
        })
        done(null,user);

    } catch (error) {
        console.error("Error in Google Strategy:", error);
        done(error, null);
        }
    }
    ))
} else {
    console.warn('[passport] Google OAuth strategy not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_CALLBACK_URL to enable it.');
}