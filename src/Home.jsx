import React from 'react';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom'; // Import Link
import { auth } from './firebase';

export default function Home({ user }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Sign-out successful");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
        <div className="flex flex-col items-center space-y-2">
          <img 
            src={user.photoURL || `https://placehold.co/96x96/E2E8F0/4A5568?text=${user.displayName.charAt(0)}`} 
            alt="User profile" 
            className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-md"
          />
          <h2 className="text-2xl font-semibold text-gray-700">Welcome, {user.displayName}!</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        
        {/* This button is now a Link */}
        <Link
          to="/dashboard"
          className="block w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
        >
          View My Flashcards
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full px-4 py-3 font-semibold text-indigo-600 bg-transparent border border-indigo-500 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
