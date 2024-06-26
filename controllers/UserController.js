import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

configDotenv()
const secret = process.env.SECRET 


export class UserController {

    // FUNÇÃO PARA CRIAR USUÁRIO NORMAL
    static async registerUser(req,res){
        const {name, cpf, password, confirmPassword, phone} = req.body 

        // validações
        if(!name){
            return res.status(401).json({msg: "O campo de nome é obrigatório!"})
        }

        
        if(!cpf){
            return res.status(401).json({msg: "O campo de cpf é obrigatório!"})
        }

        
        if(!password){
            return res.status(401).json({msg: "O campo de senha é obrigatório!"})
        }

        if(!confirmPassword){
            return res.status(401).json({msg: "O campo de confirmação de senha é obrigatório!"})
        }

        if(password !== confirmPassword){
            return res.status(401).json({msg: "As senhas devem ser iguais para confirmação!"})
        }

        if(!phone){
            return res.status(401).json({msg: "O campo de telefone é obrigatório!"})
        }

        if(phone.length !== 11){
            return res.status(401).json({msg: "Insira um número de telefone válido!"})
        }

        const phoneExist = await User.findOne({phone: phone})
        const userExist = await User.findOne({email: email})
        
        if(userExist){
            return res.status(401).json({msg: "Email já existente!"})
        }

        if(phoneExist){
            return res.status(401).json({msg: "Telefone já cadastrado!"})
        }


        const salt = 12
        const hashPassword = await bcrypt.hash(password, salt)

        try{
            const newUser = new User({name, cpf, password: hashPassword, phone})
            newUser.save()
            return res.status(200).json({msg: "Usuário criado! Você será redirecionado para página de Login"})
        }catch(error){
            console.log("Erro de servidor ao criar usuario")
            return res.status(500).json("Erro de servidor interno")
        }

    }

    // FUNÇÃO PARA CRIAR ADMIN
    static async registerAdmin(req,res){

        try{
            const {name, cpf, password, confirmPassword, phone} = req.body;

             // validações
        if(!name){
            return res.status(401).json({msg: "O campo de nome é obrigatório!"})
        }

        
        if(!cpf){
            return res.status(401).json({msg: "O campo de cpf é obrigatório!"})
        }

        
        if(!password){
            return res.status(401).json({msg: "O campo de senha é obrigatório!"})
        }

        if(!confirmPassword){
            return res.status(401).json({msg: "O campo de confirmação de senha é obrigatório!"})
        }

        if(password !== confirmPassword){
            return res.status(401).json({msg: "As senhas devem ser iguais para confirmação!"})
        }

        if(!phone){
            return res.status(401).json({msg: "Insira o número de celular"})
        }

        if(phone.length !== 11){
            return res.status(401).json({msg: "Insira um número de telefone válido!"})
        }

        const phoneExist = await User.findOne({phone: phone})
        const userExist = await User.findOne({cpf: cpf})
        
        if(userExist){
            return res.status(401).json({msg: "Cpf já está cadastrado!"})
        }

        if(phoneExist){
            return res.status(401).json({msg: "Telefone já cadastrado!"})
        }


        const salt = 12
        const hashPassword = await bcrypt.hash(password, salt)

            const newAdmin = new User({name, cpf, password: hashPassword, phone, role: 'admin'})
            newAdmin.save()
            res.status(201).json({msg: "Admin registrado com sucesso!"})
        }catch(error){
            console.log("Erro de servidor => " + error)
        }
    }

    // FUNÇÃO PARA LOGAR USUÁRIO
    static async loginUser(req,res){
        const {cpf, password} = req.body

        // validações
        if(!cpf){
            return res.status(401).json({msg: "Preencha o campo de cpf para fazer login!"})
        }

                
        if(!password){
            return res.status(401).json({msg: "Preencha o campo de senha para fazer login!"})
        }

        const user = await User.findOne({cpf: cpf})

        if(!user){
            return res.status(404).json({msg: "Usuário não encontrado!"})
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(checkPassword){
            const token = jwt.sign({id: user.id, role: user.role}, secret)

            return res.status(200).json({msg: "Bem-vindo!", token, user})
        }else{
            return res.status(401).json({msg: "Senha incorreta!"})
        }

    }

    // FUNÇÃO PARA EDITAR USUÁRIO
    static async editUser(req, res) {
        const userEdited = req.body;
        const id = req.params.id;
    
        try {
            const user = await User.findOne({ _id: id });
    
            if (!user) {
                return res.status(404).json({ msg: "Usuário não encontrado!" });
            }

            if(user.cpf === userEdited.cpf){
                await User.updateOne({ _id: id }, userEdited);
                const newUser = await User.findOne({ _id: id });
                return res.status(200).json({ msg: "Usuário alterado", newUser });
            }
    
            const cpfExist = await User.findOne({ email: userEdited.cpf });
    
            if (cpfExist) {
                return res.status(403).json({ msg: "CPF já está cadastrado! Tente outro." });
            }
        } catch (error) {
            console.log("Aconteceu o seguinte erro: ==> " + error);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }

    // FUNÇÃO PARA LISTAR TODOS USUÁRIOS
    static async getUsers(req,res){

        try{
            const Users = await User.find()

            if(Users.length === 0){
                return res.status(400).json({msg: "Nenhum usuário encontrado!"})
            }
    
            return res.status(200).json(Users)
        }catch(error){
            console.log("Erro de servidor => " + error)
        }
    }

    // FUNÇÃO PARA DELETAR USUÁRIO
    static async deleteUser(req,res){

        try{
            const id = await req.params.id; 

            const userExist = await User.findById(id)
    
            if(!userExist){
                return res.status(404).json({msg: "Usuário não encontrado!"})
            }
    
            await User.deleteOne({_id: id})
            return res.status(200).json({msg: "Usuário excluído"})
        }catch(error){
            console.log("Erro de servidor => " + error)
        }
    }

    // FUNÇÃO PARA FILTRAR USUÁRIO PELO ID
    static async getUserByID(req,res){
        try{
            const id = req.params.id

            const userExist = await User.find({_id: id})

            if(!userExist){
                return res.status(404).json({msg: "Usuário não encontrado"})
            }
    
            return res.status(200).json(userExist)
        }catch(error){
            console.log("Erro de servidor => " + error)
        }
    }

   
    

    // FUNÇÃO PARA FILTRAR USUÁRIO PELO NOME
    static async getUserByName(req,res){

        try{
            const name = req.params.name

            const Users = User.find()
    
            const searchUser = (await Users).filter((user) => user.name.toLowerCase().includes(name.toLowerCase()))
    
            if(searchUser.length === 0){
                return res.status(404).json({msg: "Nenhum usuário encontrado!"})
            }
    
            return res.status(200).json(searchUser)
        }catch(error){
            console.log("Erro de servidor => " + error)
        }
    }

    static async postEmail(req, res) {
        const { email, message } = req.body;

        // Configuração do Nodemailer
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: 'Mensagem do Formulário',
            text: message
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.send('Erro ao enviar email');
            } else {
                console.log('Email enviado: ' + info.response);
                res.send('Email enviado com sucesso');
            }
        });
    }


}