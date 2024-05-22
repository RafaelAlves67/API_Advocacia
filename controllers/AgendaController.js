import Agenda from "../models/Agenda.js"

// 

// horários de funcionamento do consutório
const timesOpen = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']
export class AgendaController {


    // MARCAR HORÁRIO
    static async addHorario(req,res){

        try{
            const {time, day, name} = req.body

            // validações
    
            if(!name){
                return res.status(401).json({msg: "Informe seu nome!"})
            }
    
            if(!time){
                return res.status(401).json({msg: "Informe a hora para marcar consulta!"})
            }
    
            if(!day){
                return res.status(401).json({msg: "Informe a dia que deseja marcar a consulta!"})
            }
    
            // datas
            // CALCULAR DATA E NOMES DOS DIAS
                const dateNow = new Date();
                const dataAtualSeparada = day.split("-")
                const dataNova = new Date(dataAtualSeparada[0], dataAtualSeparada[1] - 1, dataAtualSeparada[2])
                const nameDay = dataNova.toLocaleString('pt-BR', { weekday: 'long' });
                const nameDayCorrect = nameDay[0].toUpperCase() + nameDay.slice(1)
                console.log(dateNow,dataNova,day, nameDayCorrect)
    
            // VERIFICAR SE JÁ NÃO PASSOU O DIA QUE ESTÁ MARCANDO
            if (day < dateNow) {
                return res.status(404).json({ msg: "Insira uma data válida!" })
            }
    
            // VERIFICAR SE NÃO É DOMINGO
            if (nameDayCorrect === 'Domingo') {
                return res.status(404).json({ msg: "Não trabalhamos aos domingos!" })
            }
    
            // VERIFICAR HORARIO AOS SABADOS (TRABALHO SO ATE 12:00)
            if (nameDayCorrect === 'Sábado') {
                if (time > timesOpen[3]) {
                    return res.status(404).json({ msg: "Trabalhamos aos sabádos somente até as 12:00 horas!" })
                }
            }
    
            // VERIFICAR SE O HORÁRIO ESTÁ DENTRO DO HORÁRIO DE FUNCIONAMENTO
            const horarioOpen = timesOpen.filter((horario) => horario === time) 
    
            if(horarioOpen.length === 0){
                return res.status(404).json({msg: "Horário de funcionamento fechado! Tente outro horário"})
            }
    
            // VERIFICAR SE JA NÃO EXISTE HORÁRIO MARCADO NESSE DIA
            const horarioExist = await Agenda.findOne({day: day, time: time})
    
            if(horarioExist){
                return res.status(404).json({msg: "O horário desse dia ja está preenchido! Tente outro."});
            }
    
            // CRIANDO HORÁRIO MARCADO
            const newHorario = new Agenda({
                name,
                day,
                time,
            })
    
            newHorario.save()
            return res.status(200).json({msg: "Consulta marcada!", newHorario, statusCode: 200})
        }catch(error){
            console.log("Erro de servidor => " + error)
        }
    
    }

    // FUNÇÃO PARA EDITAR HORARIO E/OU DIA
    static async editDay(req,res){
        try{
            const id = req.params.id 
            const {day, time} = req.body
    
            const horario = await Agenda.findById(id)
    
            if(!horario){
                return res.status(404).json({msg: "Horario não encontrado"})
            }
    
            const newHorario = {day,time}
    
            const horarioExist = await Agenda.findOne({day: day, time: time})
    
            if(horarioExist){
                return res.status(404).json({msg: "Horario já está marcado! Escolha outra data."})
            }
    
            await Agenda.updateOne({_id: id}, newHorario)
    
        }catch(error){
            console.log("Erro de servidor => " + error)
        }
    }

    // CANCELAR HORÁRIO
    static async cancelHorarios(req,res){
        const id = req.params.id 

        const horario = await Agenda.findOne({_id: id})

        if(!horario){
            return res.status(404).json({msg: "Nnehum produto encontrado!"})
        }

        await Agenda.deleteOne({_id: id})

        return res.status(200).json({msg: "Horário cancelado!"})

    }

    // FUNÇÃO PARA LISTAR TODOS HORÁRIOS 
    static async getHorariosAll(req,res){

        try{
            const horarios = await Agenda.find()
    
                if(horarios.length === 0){
                    return res.status(404).json({msg: "Nenhum horario encontrado!"})
                }
    
                return res.status(200).json({horarios})
            
    
        }catch(error){
            console.log("Erro de servidor => " + error)
        }
    }

    // FUNÇÃO PARA LISTAR HORÁRIOS POR STATUS
    static async getHorarioByStatus(req,res){
        try{
            const status = req.params.status 
            
            const horarios = await Agenda.find({status: status})
            console.log(horarios)
            if(horarios.length === 0){
                return res.status(404).json({msg: `Nenhum horário marcado com status ${status}`})
            }

            return res.status(200).json(horarios)
        }catch(error){
            console.log("Erro de servidor => " + error)
        }

    }   

    static async getHorarioByDay(req,res){
        try{
            const day = req.params.day
           
            const horarios = await Agenda.find({day: day})
            console.log(horarios)

            if(horarios.length === 0){
                return res.status(404).json({msg: `Nenhum horário marcado nesse dia ${day}`})                
            }

            return res.status(200).json(horarios)
        }catch(error){
            console.log("Erro de servidor => " + error)
        }


    }
}