const userRouter = require('express').Router()
const userController = require('../controllers/user.js')

userRouter.post('/enroll', userController.enrollAdmin)
userRouter.post('/login', userController.loginUser)
userRouter.post('/register', userController.registerAdminBMKG)

module.exports = userRouter
