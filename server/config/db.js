// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const mongo_url = process.env.MONGO_URI;

const PORT = process.env.PORT || 8080;



// const fs =require('fs');
// const path=require('path');
// const AsanasModel = require('./Asanas');

// const asanasData = JSON.parse(
//     // fs.readFileSync(path.join('asanasData.json'))
//     fs.readFileSync(path.join(__dirname, './asanasData.json'), 'utf-8')

// );

const db = mongoose.connect(mongo_url)
    .then(async ()=>{
        console.log("Connected to MongoDB");
        // await AsanasModel.deleteMany({});
        // await AsanasModel.insertMany(asanasData);
    })
    .catch((err)=>{
        console.log("Error connecting to MongoDB : ", err);
    })
   
    

export default db ;
