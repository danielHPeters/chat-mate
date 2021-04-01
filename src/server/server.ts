import * as createError from 'http-errors'
import * as express from 'express'
import * as path from 'path'
import * as  cookieParser from 'cookie-parser'
import * as logger from 'morgan'
import ChatServer from './chat/ChatServer'
import indexRouter from './routes'
import usersRouter from './routes/users'
import multimediaRouter from './routes/multimedia'

const port = parseInt((process.env.PORT || '3000'))
const app = express()
app.set('port', port)

// view engine setup
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/multimedia', multimediaRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)))

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const http = require('http').Server(app)
const io = require('socket.io')(http)
const chat = new ChatServer(io)

chat.init()
http.listen(port, () => console.log(`listening on *:${port}`))
