import './App.css'
import './index.css'; // Or App.css depending on your file
import { Routes , Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {


  return (
    <div className='text-4xl'>
        <Routes>
           <Route  path="/" element={<Home/>} />
           <Route  path="/login" element={<Login/>} />
           <Route  path="/email-verify" element={<EmailVerify/>} />
           <Route  path="/reset-password" element={<ResetPassword/>} />
           
        </Routes>
        <ToastContainer />
    </div>
  )
}

export default App
