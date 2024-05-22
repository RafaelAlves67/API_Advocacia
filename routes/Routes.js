import express from 'express'
import { UserController } from '../controllers/UserController.js'
import authorizeRole from '../helpers/authorizeRole.js'
import { authUser } from '../helpers/authUser.js'
import { AgendaController } from '../controllers/AgendaController.js'

const Routes = express.Router()

// rotas publicas
Routes.post('/register', UserController.registerUser)
Routes.post('/login', UserController.loginUser)
Routes.put('/edit', UserController.editUser)

// rota para criar usuário admin
Routes.post('/adm', UserController.registerAdmin)

// rotas privadas
Routes.use(authUser)

// rotas de admin
// usuário
Routes.get('/userId/:id', authorizeRole('admin'), UserController.getUserByID)
Routes.get('/users/:name', authorizeRole('admin'), UserController.getUserByName)
Routes.put('/users/edit', authorizeRole('admin'), UserController.editUser)
Routes.delete('/users/delete', authorizeRole('admin'), UserController.deleteUser)
Routes.get('/users', authorizeRole('admin'), UserController.getUsers)
// agenda
Routes.get('/horarios', authorizeRole('admin'), AgendaController.getHorariosAll)
Routes.get('/searchStatus/:status', authorizeRole('admin'), AgendaController.getHorarioByStatus)
Routes.get('/searchDay/:day', authorizeRole('admin'), AgendaController.getHorarioByDay)


// rotas de user 
Routes.post('/agenda/add', AgendaController.addHorario)
Routes.put('/agenda/add', AgendaController.editDay)
Routes.delete('/agenda/add', AgendaController.cancelHorarios)


export default Routes
