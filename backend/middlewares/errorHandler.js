export const errorHandler = (err, req, res, next) => {
    console.error(`Error occurred on path: ${req.path}`, err);

    if(err.name==='ZodError'){ 
        return res.status(400).json({message:'Validation Error',errors:err.errors});
    } 


    res.status(500).json({ message: 'Internal Server Error', error: err.message });
}

