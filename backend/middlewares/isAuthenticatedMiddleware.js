const isAuthenticated = (req,res,next)=>{
    if(!req.user || !req.user._id){
        throw new Error("Unauthorized - Please Login First" );
    }
    next();
}

export default isAuthenticated;