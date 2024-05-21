function authorizeRole(role){
    return (req,res,next) => {
        if(req.user.role !== role){
            return res.status(403).json({msg: "Acesso negado! "})
        }

        next();
    }
}

export default authorizeRole