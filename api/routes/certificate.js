const userRouter = require('express').Router()
const exampleController = require('../controllers/certificate.js')

userRouter.post('/', exampleController.create)

module.exports = userRouter
