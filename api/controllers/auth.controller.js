import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'

//async because itreads mongo db data 
export const signup = async (req,res)=>{
    
    const {username,email,password} = req.body;
    if(!username || !email || !password || username === '' || email === '' || password === ''){
        res.status(400).json({
            message:"All fields are required"
        })
    }

    const hashedPassword =  bcryptjs.hashSync(password,10);

    const newUser = new User({
        username,
        email,
        password : hashedPassword
    });
    try{
        await newUser.save();
        res.json({
            message:"signed up successfully"
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }

   
};