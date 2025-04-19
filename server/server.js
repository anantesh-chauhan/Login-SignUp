import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import db from './config/db.js';

import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';


const app= express();
const PORT= process.env.PORT || 4000;
// db();

const allowedOrigins =['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins , credentials:true}));
 

app.get('/', (req , res) => {
    res.send('Api is running properly');
});



app.use('/auth', authRouter);

app.use('/user',userRouter) ; 



app.listen(PORT , ()=>{
    console.log(`Server is runnig on Port : ${PORT}`);
});



