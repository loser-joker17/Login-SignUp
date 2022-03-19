
const localStrategy=require('passport-local').Strategy; 
const mongoose =require('mongoose'); // for email,password is match or not; 
const bcrypt=require('bcryptjs'); 

const User= require('../models/user'); 

module.exports=function(passport){
    passport.use(
        new localStrategy({usernameField: 'email'},(email,password,done) =>{
            //Match User 
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message: 'That Email is not registered'}); 
                } 
                // if user is match then match Password 
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) 
                    throw err; 
                    if(isMatch) 
                    {
                        return done(null,user);
                    }
                    else 
                    {
                        return done(null,false,{message: 'Password incorrect'}); 
                    }
                });
                
            }) 
            .catch(err => console.log(err)); 
        })
    ); 
    passport.serializeUser((user, done)=>{
        done(null, user.id);
      });
    
      passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user)=> {
          done(err, user);
        });
      });
}