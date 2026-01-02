import express from 'express';

import dotenv from 'dotenv';
dotenv.config({quiet : true});

import mongoose from 'mongoose'



const app = express();

const port = process.env.PORT || 3000; 

const mongoUri = process.env.MONGO_URI;
mongoose.connect(
    mongoUri
    ).then(()=>{console.log("Database connected succesfully");})
     .catch((err)=>{console.log(err);
     });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
