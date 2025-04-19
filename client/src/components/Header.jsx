import React, { useContext } from 'react';
import { AppContent } from '../context/AppContext';

const Header = () => {
  const { userData } = useContext(AppContent);

  return (
    <div className="mt-24 flex flex-col items-center text-center px-4">
      {/* 👤 Profile Picture */}
      <img
        src="path_to_profile_image.jpg" // Replace with dynamic source later
        alt="Profile"
        className="w-36 h-36 rounded-full mb-6 shadow-lg border-4 border-green-600"
      />

      {/* 👋 Greeting */}
      <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2 mb-2">
        👋 Hey {userData ? userData.name : '🧑‍💻 Developer!'}
      </h1>

      {/* 📧 Email */}
      {userData?.email && (
        <p className="text-sm text-gray-600 mb-4">
          📧 {userData.email}
        </p>
      )}

      {/* 💬 Message */}
      <p className="text-gray-700 max-w-lg mb-4">
        🎯 Welcome to your personalized yoga journey. Stay consistent, stay calm, and breathe deeply. You're doing great!
      </p>

      {/* 🧘 Motivation Quote */}
      <div className="bg-green-100 text-green-800 text-sm italic px-4 py-2 rounded-lg shadow-sm max-w-md">
        🧘‍♀️ “Yoga is the journey of the self, through the self, to the self.” – The Bhagavad Gita
      </div>
    </div>
  );
};

export default Header;
