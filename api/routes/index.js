const router = require('express').Router()

const userRouter = require('./user.js')
const exampleRouter = require('./example.js')
const certificateRouter = require('./certificate.js')

router.use('/auth', userRouter)
router.use('/example', exampleRouter)
router.use('/certificate', certificateRouter)

module.exports = router
