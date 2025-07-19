import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Make sure you export 'db' from firebase.js

const categories = [
  { name: 'Animals', emoji: '🐘', color: 'bg-yellow-400' },
  { name: 'Fruits', emoji: '🍎', color: 'bg-red-400' },
  { name: 'Vegetables', emoji: '🥕', color: 'bg-green-400' },
  { name: 'Colors', emoji: '🎨', color: 'bg-blue-400' },
  { name: 'Daily Items', emoji: '🛋️', color: 'bg-purple-400' },
];

export default function Dashboard({ user }) {
  const [score, setScore] = useState(0);
  const [loadingScore, setLoadingScore] = useState(true);

  // Fetch user's score from Firestore
  useEffect(() => {
    if (user) {
      const fetchScore = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setScore(userDoc.data().score || 0);
        }
        setLoadingScore(false);
      };
      fetchScore();
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 font-sans p-4">
      <div className="w-full max-w-4xl mt-8">
        <header className="text-center mb-10 p-6 bg-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-800">Choose a Category</h1>
            <div className="text-right">
              <span className="text-sm text-gray-500">Total Score</span>
              {loadingScore ? (
                <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse"></div>
              ) : (
                <div className="text-3xl font-bold text-indigo-600">{score}</div>
              )}
            </div>
          </div>
          <p className="text-gray-600 mt-2">Select a deck to start learning with AI-powered flashcards!</p>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/game/${category.name.toLowerCase().replace(' ', '-')}`}
              className={`group flex flex-col justify-between p-6 rounded-xl shadow-lg text-white transition-transform transform hover:-translate-y-2 ${category.color}`}
            >
              <div>
                <div className="text-5xl mb-4">{category.emoji}</div>
                <h2 className="text-2xl font-bold">{category.name}</h2>
              </div>
              <p className="mt-4 font-semibold self-end opacity-0 group-hover:opacity-100 transition-opacity">
                Start Learning &rarr;
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
            <Link 
              to="/" 
              className="px-6 py-2 text-sm font-semibold text-indigo-600 bg-transparent border border-indigo-500 rounded-lg hover:bg-indigo-50"
            >
              &larr; Back to Home
            </Link>
        </div>
      </div>
    </div>
  );
}
