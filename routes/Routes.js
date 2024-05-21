import express from 'express'
import { UserController } from '../controllers/UserController.js'
import authorizeRole from '../helpers/authorizeRole.js'
import { authUser } from '../helpers/authUser.js'

const Routes = express.Router()

// rotas publicas
Routes.post('/register', UserController.registerUser)
Routes.post('/login', UserController.loginUser)
Routes.put('/edit', UserController.editUser)

// rotas privadas
Routes.use(authUser)
Routes.get('/users/:id', authorizeRole('admin'), UserController.getUserByID)
Routes.get('/users/:name', authorizeRole('admin'), UserController.getUserByName)
Routes.put('/users/edit', authorizeRole('admin'), UserController.editUser)
Routes.delete('/users/delete', authorizeRole('admin'), UserController.deleteUser)
Routes.get('/users', authorizeRole('admin'), UserController.getUsers)

export default Routes
