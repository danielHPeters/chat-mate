import * as express from 'express'

const indexRouter = express.Router()

/* GET home page. */
indexRouter.get('/', (req, res) => {
  res.render('index', { title: 'ChatMate' })
})

export default indexRouter
