import mongoose from 'mongoose'
import { stringify } from 'querystring'

const userSchema = new mongoose.userSchema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        
    },
},{timestamps:true});

//model creation

const User = mongoose.model('User',userSchema);

export default User ;