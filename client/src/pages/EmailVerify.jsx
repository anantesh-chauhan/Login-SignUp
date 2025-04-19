import React, { useContext, useEffect } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {
  axios.defaults.withCredentials =true;
  const navigate =useNavigate();
  const {backendUrl , isLoggedin , userData , getUserData} = useContext(AppContent);

  const inputRefs = React.useRef([]);
  
  const onSubmitHandler= async (e)=>{
     e.preventDefault();

     try{
        const otpArray = inputRefs.current.map( e => e.value);
        
        const otp=otpArray.join('');

        const {data} = await axios.post(backendUrl + '/auth/verify-account', {otp});

        if(data.success){

          toast.success(data.message);
          getUserData();
          navigate('/');
        }
        else{
          console.log('Invalid OTP');
          toast.error('Invalid OTP');
        }
     }
     catch(error){
      toast.error('Error in OTP');
     }
  }


  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key == 'Backspace' && e.target.value == '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e)=>{
    const paste=e.clipboardData.getData('text');
    const pasteArray = paste.split('');

    pasteArray.forEach((char , index)=> {
        if(inputRefs.current[index]){
          inputRefs.current[index].value=char;
        }
    });
  }

  useEffect(()=>{
     isLoggedin && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedin , userData]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6"
        onSubmit={onSubmitHandler}
      >
        <h1 className="text-2xl font-bold text-center text-green-700">Email Verification</h1>
        <p className="text-sm text-center text-gray-600">
          Enter the 6-digit code sent to your email address.
        </p>

        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-10 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
