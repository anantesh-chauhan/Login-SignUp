import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);
  const [showDropdown, setShowDropdown] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/auth/send-verify-otp`, {}, { withCredentials: true });
      if (data.success) {
        navigate('/email-verify');
        toast.success("Verification OTP sent successfully");
      } else {
        toast.error("Verification OTP failed");
      }
    } catch (error) {
      console.error("Error in sendVerificationOtp @Navbar");
      toast.error("Error sending OTP");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
      setUserData({});
      setIsLoggedin(false);
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 fixed top-0 bg-white shadow-md z-50'>
      {/* 🌿 Logo + Subtitle */}
      <div className='flex flex-col items-start'>
        <img src="logo_path.png" alt='logo' className='w-28 sm:w-32 mb-0' />
        <span className="text-xs text-gray-500 italic ml-1">Empower Your Body & Mind 🧘‍♂️</span>
      </div>

      {/* 👤 User Info */}
      {userData && userData.name ? (
        <div className='relative flex items-center gap-4'>
          <div className='hidden sm:flex flex-col text-right'>
            <p className='text-sm font-medium text-gray-800'>Welcome, {userData.name}</p>
            {userData.email && <p className='text-xs text-gray-500'>{userData.email}</p>}
          </div>

          <div
            className='w-10 h-10 flex items-center justify-center bg-green-600 text-white text-lg font-bold rounded-full cursor-pointer'
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {userData.name[0].toUpperCase()}
          </div>

          {showDropdown && (
            <div className='absolute right-0 top-12 bg-white shadow-lg rounded-lg w-44 p-3 z-50'>
              <ul className='space-y-2 text-sm text-gray-600'>
                {!userData.isAccountVerified && (
                  <li
                    className='cursor-pointer hover:text-green-600'
                    onClick={sendVerificationOtp}
                  >
                    📧 Verify Email
                  </li>
                )}
                <li
                  className='cursor-pointer hover:text-green-600'
                  onClick={handleLogout}
                >
                  🚪 Log Out
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100'
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
