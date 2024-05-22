function authorizeRole(role){
    return (req,res,next) => {
        if(req.user.role !== role){
            return res.status(403).json({msg: "Sem permissão! "})
        }

        next();
    }
}

export default authorizeRole