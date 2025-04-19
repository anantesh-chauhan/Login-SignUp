import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';

import {toast} from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const {backendUrl , setIsLoggedin ,getUserData} =useContext(AppContent);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmithandler = async (e)=>{
    e.preventDefault();
    try{
      if(state === 'Sign Up'){
        const {data} = await axios.post(backendUrl + '/auth/register' , {name , email , password});

        if(data.success){
          setIsLoggedin(true);
          getUserData();
          navigate('/');
          toast.success(data.message);
        }else{
          toast.error(data.message);
        }
      }else{
        const { data } = await axios.post(
          backendUrl + '/auth/login',
          { email, password },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,  // Add this line to include credentials (cookies)
          }
        );
        
        if(data.success){
          setIsLoggedin(true);
          getUserData();
          navigate('/');
          toast.success(data.message);
        }else{
          console.log("Error in login");
          toast.error(data.message);
        }
      }
    }
    catch (error) {
      // console.log("Error in login Component");
    
      const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    
      toast.error(errorMessage);
    }
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 px-4 font-sans">
      
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Logo"
        className="absolute top-6 left-6 sm:left-20 w-24 sm:w-28 cursor-pointer drop-shadow-xl hover:scale-105 transition-transform"
      />

      {/* Auth Card */}
      <div className="w-full max-w-md p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-green-200 rounded-3xl shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-green-700 mb-2 tracking-tight">
          {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
          {state === 'Sign Up'
            ? 'Join us and embrace the path of yoga 🌿'
            : 'Login to access your journey 🧘'}
        </p>

        <form onSubmit={onSubmithandler} className="space-y-4">
          {state === 'Sign Up' && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-500 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="text-right">
            <p
              className="text-sm text-green-600 hover:underline cursor-pointer"
              onClick={() => navigate('/reset-password')}
            >
              Forgot Password?
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
          >
            {state === 'Sign Up' ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="text-sm text-gray-600 text-center mt-6">
          {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
            className="ml-1 text-green-700 font-semibold hover:underline transition"
          >
            {state === 'Sign Up' ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
