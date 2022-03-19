const mongoose=require('mongoose'); 
const bcrypt=require('bcryptjs'); 
const UserSchema= new mongoose.Schema({
    name:{
        type:String, 
        required:true
    }, 
    email:{
        type:String, 
        required:true
    },
    password:{
        type:String, 
        required:true
    }, 
    password2:{
        type:String, 
        required:true
    },
   date:{
        type:Date, 
        default:Date.now
    }
});  

// we are hashing 

UserSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12); 
        this.password2=await bcrypt.hash(this.password,12); 
    }
    next(); 
}) 
//import 
const User=mongoose.model('User',UserSchema); 
module.exports=User; 