const userRouter = require('express').Router()
const exampleController = require('../controllers/example.js')

userRouter.post('/query', exampleController.query)
userRouter.post('/create', exampleController.create)

module.exports = userRouter
