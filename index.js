const express=require('express');  
const expressLayouts = require('express-ejs-layouts'); 
const app=express();  
const flash=require('connect-flash'); 
const session=require('express-session'); 
const PORT=process.env.PORT || 5000;  
const mongoose=require('mongoose');  
const passport=require('passport'); 
//passport config 
require('./config/passport')(passport); 
//connection of mongo config 
const db=require('./config/mongoose').mongoURI;
//const passport = require('./config/passport'); 
mongoose
  .connect(
    db,
    { 
      useNewUrlParser: true ,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
//EJS 
app.use(expressLayouts); 
app.set('view engine','ejs');  
// body Parser 
app.use(express.urlencoded({extended:false}));  

// express session middleware  
app.use(session({
    secret: 'vijay',
    resave: false,
    saveUninitialized: true,
  })) 
   // passport middleware
   app.use(passport.initialize()); 
   app.use(passport.session()); 
  // connect flaSh 
  app.use(flash()); 
  //global variable 
  app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg'); 
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next(); 
})

  //routes 
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users')); 

app.listen(PORT,console.log(`Server Started on Port ${PORT}`)); 