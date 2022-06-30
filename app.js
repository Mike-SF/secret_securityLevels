//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const { stringify } = require('querystring')
const { log } = require('console')

const app = express()

const uri =
  'mongodb+srv://j4c_mongo:P4NfKwH2@database1.lz9t5.mongodb.net/userDB?retryWrites=true&w=majority'

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(uri)

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
})

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password'],
})

const User = new mongoose.model('User', userSchema)

app.get('/', (req, res) => {
  res.render('home')
})

//login route
app
  .route('/login')

  .get((req, res) => {
    res.render('login')
  })

  .post((req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ email: username }, (err, foundUser) => {
      if (err) {
        console.log(err)
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render('secrets')
          }
        }
      }
    })
  })

//register route
app
  .route('/register')

  .get((req, res) => {
    res.render('register')
  })

  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    })

    newUser.save((err) => {
      if (err) {
        console.log(err)
      } else {
        res.render('secrets')
      }
    })
  })

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
