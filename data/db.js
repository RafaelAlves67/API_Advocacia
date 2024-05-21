import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const user = process.env.DB_USER 
const password = process.env.DB_PASSWORD 

async function main(){
    await mongoose.connect('mongodb://localhost:27017/TI_Sustentavel')
    console.log("Conectou ao Banco de Dados")
}

try{
    main();
}catch(error){
    console.log("Aconteceu o seguinte erro de servidor => " + error)
}

export default mongoose
