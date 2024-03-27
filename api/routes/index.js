const router = require('express').Router()

const userRouter = require('./user.js')
const exampleRouter = require('./example.js')

router.use('/auth', userRouter)
router.use('/example', exampleRouter)

module.exports = router
