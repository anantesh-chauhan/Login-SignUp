// no changes to import section
import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/auth/send-reset-otp`, { email });
      if (data.success) {
        toast.success('Reset OTP send');
        setIsEmailSent(true);
      } else {
        toast.error('Failed to send Reset OTP');
      }
    } catch (error) {
      toast.error('Error in OTP send');
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    const otpValue = otpArray.join('');

    if (otpValue.length !== 6) {
      toast.error('Enter a valid 6-digit OTP');
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/auth/verify-reset-password-otp`, {
        email,
        otp: otpValue
      });

      if (data.success) {
        toast.success('OTP verified');
        setOtp(otpValue);
        setIsOtpSubmitted(true);
      } else {
        toast.error('Invalid OTP');
      }
    } catch (err) {
      toast.error('Wrong OTP');
    }
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${backendUrl}/auth/reset-password`, {
        email,
        newPassword
      });

      if (data.success) {
        toast.success('Password changed success');
        navigate('/login');
      } else {
        toast.error('Invalid OTP or expired link');
      }
    } catch (err) {
      toast.error('Error changing password');
    }
  };

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!isEmailSent && (
        <form
          className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6"
          onSubmit={onSubmitEmail}
        >
          <h1 className="text-2xl font-bold text-center text-green-700">🛡️ Reset Password</h1>
          <p className="text-sm text-center text-gray-600">📧 Enter your registered email address</p>
          <input
            type="email"
            placeholder="📧 Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            🔄 Send Reset OTP
          </button>
        </form>
      )}

      {isEmailSent && !isOtpSubmitted && (
        <form
          className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6"
          onSubmit={onSubmitOtp}
        >
          <h1 className="text-2xl font-bold text-center text-green-700">🛡️ Email Verification</h1>
          <p className="text-sm text-center text-gray-600">✅ Enter the 6-digit code sent to your email</p>
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-10 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            ✅ Verify OTP
          </button>
        </form>
      )}

      {isEmailSent && isOtpSubmitted && (
        <form
          className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6"
          onSubmit={onSubmitNewPassword}
        >
          <h1 className="text-2xl font-bold text-center text-green-700">🆕 Enter New Password</h1>
          <input
            type="password"
            placeholder="🔐 Enter your new password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            🔒 Change Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
