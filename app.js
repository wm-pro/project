const express = require('express')
const app = express()
const session = require('express-session')
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: false
}))
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
const router = require('./router.js')
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(router)
app.use('/node_modules', express.static('./node_modules'))
app.listen(80, () => {
    console.log('http://127.0.0.1:80');

})