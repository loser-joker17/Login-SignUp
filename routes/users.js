//lakshya42arora@gmail.com


const express=require('express'); 
const router=express.Router();  
//const bcrypt=express('bcryptjs'); 
const passport=require('passport');
 //user Model 
 const User= require('../models/user'); 
// getting login page 
router.get('/login',(req,res) =>res.render('login'));  
// getting register page 
router.get('/register',(req,res) =>res.render('register')); 

//after register the account handling
router.post('/register',(req,res) =>{
    //console.log(req.body); 
    // res.send("Hello Vijay !!!"); 
    const { name,email,password, password2 } =req.body;  
    //console.log(req.body);
    // const name=req.body.name; 
    // const email=req.body.email; 
    let errors=[]; 
    //check required field 
    if(!name || !email|| !password || !password2 ) 
    {
        errors.push({msg:'Please fill all the Fields'}); 
    } 
    //check password match 
    if(password!==password2) 
    {
        errors.push({msg: 'Passwords do not match'}); 
    } 
    // check password length 
    if(password.length<6 && password.length>0) 
    {
        errors.push({msg: 'Password should be at least 6 Character'}); 
    } 
    if(errors.length>0) 
    {
           res.render('register',{
               errors, 
               name, 
               email, 
               password, 
               password2
           }); 
    } 
    else 
    {
        //res.send('Pass');  
        //Validation Pass 
        User.findOne({email:email}) 
        .then(user=>{
            if(user){ 
                //user exists 
                errors.push({msg: 'Email is already registerd'}); 
                res.render('register',{
                    errors, 
                    name, 
                    email, 
                    password, 
                    password2
                });  
            } 
            else 
            {
               const newUser= new User(
                { 
                    name,
                    email,
                    password, 
                    password2
                }); 
            //hash password 
            //    bcrypt.genSalt(10,(err,salt)=> 
            //    bcrypt.hash(newUser.password,salt,(err,hash)=>{
            //        if(err) 
            //        throw err; 
            //        //Set the password to hashed; 
            //        newUser.password=hash; 
            //        // save User 
            //        newUser.save() 
            //        .then(user =>{
            //            res.redirect('/users/login'); 
            //        }) 
            //        .catch(err => console.log(err)); 
            //    }))
               console.log(newUser);  
               newUser.save().then(()=>{
                req.flash('success_msg','You are now registered'); 
                res.redirect('/users/login');
               }).catch((err)=>res.status(500).json({error:"failed registered"}))
               //req.flash('success_msg','You are now registered'); 
               //res.redirect('/users/login');
            }
        }).catch(err=>{console.log(err); }); 
    }
}) 

//login handle 
router.post('/login',(req,res,next)=>{
   passport.authenticate('local',{
       successRedirect:'/dashboard', 
       failureRedirect:'/users/login',
       failureFlash:true
   })(req,res,next); 
}); 

// logout Hadndle; 
router.get('/logout',(req,res) => {
   req.logout(); 
   req.flash('success_msg','You are Logged Out'); 
   res.redirect('/');  
   //res.redirect('https://github.com/loser-joker17');
})
module.exports =router; 