import React from 'react'
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import MusicPlayer from '../music/MusicPlayer';

const Home = () => {
  return (
    <div>
        {/* <h1>Home</h1> */}
        <Navbar />
        <Header />
        <MusicPlayer />
    </div>
  )
}

export default Home;
