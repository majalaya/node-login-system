const express = require('express')
const session = require('express-session')
const es6Renderer = require('express-es6-template-engine')
const database = require('./config')

const app = express()
const port = 3000

// express settings
app.engine('html', es6Renderer)
app.set('views', 'views')
app.set('view engine', 'html')
app.use('/static', express.static('static'))
app.use(express.json())
app.use(session({
   secret: 'mysecret',
   resave: false,
   saveUninitialized: true
 }))

 

// render login page
app.get('/login', (req, res) => {
   if (!req.session.user) { //check session exists
      res.render('login')
   }else{
      res.redirect('/')
   }
})


// render signup page
app.get('/signup', (req, res) => {
   if (!req.session.user) { //check session exists
      res.render('signup')
   }else{
      res.redirect('/')
   }
})


// render dashboard page
app.get('/', (req, res, next) => {
   if (!req.session.user) { //check session exists
      res.redirect('login')
   }else{
      res.render('dashboard', {locals: {name: req.session.user.name}})
   }
})



// login proccess
app.post('/login', (req, res) => {
   if(typeof req.body.email == 'undefined'){
      res.send(JSON.stringify({
         status: "error",
         message: "Email is required"
      }))
   }else if(typeof req.body.password == 'undefined'){
      res.send(JSON.stringify({
         status: "error",
         message: "Password is required"
      }))
   }else{
      var query = `SELECT * from user WHERE email = '${req.body.email}' AND password = '${req.body.password}' LIMIT 1`
      database.query(query, function(sqlError, result){
         if(sqlError){
            res.send(JSON.stringify({
               status: "error",
               message: sqlError
            }))
         }else{
            if(result.length == 0){
               res.send(JSON.stringify({
                  status: "error",
                  message: "Email or password invalid"
               }))
            }else{
               //login success
               req.session.user = result[0]
               req.session.save()
               res.send(JSON.stringify({
                  status: "success",
                  message: "MANTAP"
               }))
            }
         }
      })
   }
})




// signup proccess
app.post('/signup', (req, res) => {
   if(typeof req.body.name == 'undefined'){
      res.send(JSON.stringify({
         status: "error",
         message: "Full name is required"
      }))
   }else if(typeof req.body.email == 'undefined'){
      res.send(JSON.stringify({
         status: "error",
         message: "Email is required"
      }))
   }else if(typeof req.body.password == 'undefined'){
      res.send(JSON.stringify({
         status: "error",
         message: "Password is required"
      }))
   }else{
      //check email exists
      var query = `SELECT * from user WHERE email = '${req.body.email}' LIMIT 1`
      database.query(query, function(sqlError, result){
         if(sqlError){
            res.send(JSON.stringify({
               status: "error",
               message: sqlError
            }))
         }else{
            if(result.length == 1){
               res.send(JSON.stringify({
                  status: "error",
                  message: "Email already exists"
               }))
            }else{
               //insert to database
               var query = `INSERT INTO user (name, email, password) VALUES ('${req.body.name}', '${req.body.email}', '${req.body.password}')`
               database.query(query, function(sqlError, result){
                  if(sqlError){
                     res.send(JSON.stringify({
                        status: "error",
                        message: sqlError
                     }))
                  }else{
                     //signup success
                     res.send(JSON.stringify({
                        status: "success",
                        message: "Signup successfully"
                     }))
                  }
               })
            }
         }
      })
   }
})


//logout proccess
app.get('/logout', (req, res) => {
   req.session.user = null
   req.session.save()
   res.redirect('login')
})


// start nodejs server
app.listen(port, () => {
   console.log("app running on port", port)
})
