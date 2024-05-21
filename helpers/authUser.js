import { configDotenv } from "dotenv"
configDotenv()
const secret = process.env.SECRET
import jwt from 'jsonwebtoken'

export const authUser = (req,res,next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(404).json({msg: "Acesso negado!"})
    }

    jwt.verify(token, secret, (error, user) => {
        if(error){
            return res.status(403).json({msg: "Token inválido!"})
        }

        req.user = user 
        next();
    })
}