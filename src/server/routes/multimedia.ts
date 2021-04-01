import * as express from 'express'

const multimediaRouter = express.Router()

/* GET home page. */
multimediaRouter.get('/', (req, res) => {
  res.render('multimedia', { title: 'Video Chat' })
})

export default multimediaRouter
