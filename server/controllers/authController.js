import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/UserModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE , PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        })
    }

    try {

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        //Send Welcome Email

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Portal',
            text: `Hello ${name},\n\nWelcome to our portal! We are glad to have you on board.\n\nBest regards,\nThe Team `
        }

        // await transporter.sendMail(mailOptions);
        console.log("Welcome mail sent successfully to the new user : ", name, "  ", email);
        return res.status(201).json(
            {
                success: true,
                message: "User Created Successfully",
            }
        )
    }

    catch (error) {
        console.log("Error in register controller : ", error);

        return res.status(500).json({
            success: false,
            message: `Internal Server Error , Registration Failed \nError :->${error.message} `
        })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        })
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {

            return res.status(400).json({
                success: false,
                message: "User Doesn't exists"
            }
            )
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"

            })
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        return res.status(200).json({
            success: true,
            message: "User Logged In Successfully",

        })
    }
    catch (error) {
        console.log("Error in login controller : ", error);

        return res.status(500).json({
            success: false,
            message: `Internal Server Error , Login Failed \nError :->${error.message} `
        })
    }
}


export const logout = async (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.status(200).json({
            success: true,
            message: "User Logged Out Successfully",
        })
    }
    catch (error) {
        console.log("Error in logout controller : ", error);

        return res.status(500).json({
            success: false,
            message: `Internal Server Error , Logout Failed \nError :->${error.message} `
        })
    }
}


export const sendVerifyOtp = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid user ID"
        });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({
                success: false,
                message: "Account already verified"
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        // const otp = "123456"; // Use static OTP for testing

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify Your Account',
            // text: `Hello ${user.name},\n\nYour OTP for account verification is ${otp}, valid for 10 minutes.\n\nBest regards,\nThe Team`,
            html: EMAIL_VERIFY_TEMPLATE
                .replace("{{otp}}", otp)
                .replace("{{email}}", user.email)
        };

        // Uncomment when ready to send emails
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error("Error in sendVerifyOtp controller:", error);

        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error.message}`
        });
    }
};



export const verifyEmail = async (req, res) => {
    const { otp } = req.body;
    const userId = req.user?.id;

    if (!userId || !otp) {
        const missingFields = !userId ? 'userId' : 'otp';
        return res.status(400).json({
            success: false,
            message: `Please fill all the fields , missing ${missingFields}`
        })
    }

    try {

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Doesn't exists"
            })
        }

        if (user.isAccountVerified) {
            {
                return res.status(400).json({
                    success: false,
                    message: "Account already verified"
                })
            }
        }

        if (user.verifyOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            })
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0
        await user.save();  // to save the isAccountVerified in the database

        return res.status(200).json({
            success: true,
            message: "Account Verified Successfully",
        })
    }
    catch (error) {
        console.log("Error in verifyEmail controller:", error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error, verifyEmail Failed. Error: ${error.message}`
        });
    }

}


export const isAuthenticated = async (req, res) => {

    try {
        return res.status(200).json({
            success: true,
            message: "User is authenticated",
        })
    }
    catch (error) {
        console.log("Error in isAuthenticated controller : ", error);

        return res.status(500).json({
            success: false,
            message: `Internal Server Error , isAuthenticated Failed \nError :->${error.message} `
        })
    }
}


export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    

    if (!email) {
        return res.status(500).json({
            success: false,
            message: "email is required to reset password"
        })
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(500).json({
                success: false,
                message: 'User not found'
            })
        }

        // const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otp = "123456"
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save(); // Save OTP and expiry

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset Your Passoord',
            // text: `Hello ${user.name},\n\nYour OTP for password reset is ${otp}, valid for 10 minutes.\n\nBest regards,\nThe Team`
            html: PASSWORD_RESET_TEMPLATE
                .replace("{{otp}}", otp)
                .replace("{{email}}", user.email)
        };

        // await transporter.sendMail(mailOptions); // Send email

        return res.status(200).json({
            success: true,
            message: "Password reser OTP sent successfully"
        });


    }
    catch (error) {
        console.log('error in sendResetOtp controller : ${error}');

        return res.status(500).json({
            stauts: false,
            message: "error in sendResetOtp controller : ${error}"
        })
    }
}

export const verifyResetPasswordOTP = async (req, res) => {
    const { email, otp } = req.body;
  
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }
  
    try {
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User does not exist",
        });
      }
  
      if (user.resetOtp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Wrong OTP",
        });
      }
  
      if (user.resetOtpExpireAt < Date.now()) {
        return res.status(400).json({
          success: false,
          message: "OTP expired",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "OTP verified for password reset",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error in verifying OTP",
      });
    }
  };
  



export const resetPassword = async (req, res) => {

    const { email,newPassword } = req.body;

    if (!email || !newPassword) {

        console.log("All fields are required to reset password");

        return res.status(500).json({
            success: false,
            message: `All fields are required to reset password`
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Doesn't exists"
            })
        }
       
        const hashedPassword = await bcrypt.hash(newPassword , 10) ;

        user.password=hashedPassword ;
        user.resetOtp='';
        user.resetOtpExpireAt=0;
        await user.save();

        return res.status(200).json({
            success:true,
            message:"Password reset success"
        });
    }
    catch (error) {
        console.log(`Error in reset password controller : ${error}`);

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}