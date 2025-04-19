import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail ,verifyResetPasswordOTP } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.get('/',(req , res )=>{
    res.send('Auth Router is working properly');
});

// authRouter.get('/login',(req , res )=>{
//     res.send('Login Router is working properly');
// });

authRouter.post('/register', register);



authRouter.post('/login', login);

authRouter.post('/logout', logout);

authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);;

authRouter.post('/verify-account', userAuth, verifyEmail) ;
 
authRouter.get('/is-auth' , userAuth , isAuthenticated) ;

authRouter.post('/send-reset-otp', sendResetOtp) ;

authRouter.post('/verify-reset-password-otp' , verifyResetPasswordOTP) ;

authRouter.post('/reset-password' , resetPassword) ;

// module.exports = authRouter

export default authRouter;