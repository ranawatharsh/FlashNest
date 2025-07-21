import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

// Hardcoded API keys for debugging
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;


// --- Helper Components ---
const Loader = ({ text }) => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
    <p className="text-lg text-gray-600">{text}</p>
  </div>
);

const OptionButton = ({ text, onClick, isSelected, isCorrect, isRevealed }) => {
  const getButtonClass = () => {
    if (isRevealed) {
      if (isCorrect) return 'bg-green-500 hover:bg-green-600 border-green-600 text-white';
      if (isSelected) return 'bg-red-500 hover:bg-red-600 border-red-600 text-white';
    }
    if (isSelected) return 'bg-indigo-600 border-indigo-700 text-white';
    return 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700';
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left font-semibold rounded-lg border-2 shadow-sm transition-all duration-300 ${getButtonClass()}`}
      disabled={isRevealed}
    >
      {text}
    </button>
  );
};


// --- Main Game Component ---
export default function FlashcardGame() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = auth.currentUser?.uid;

  // Fetch score from Firestore
  useEffect(() => {
    if (!userId) return;
    const fetchScore = async () => {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setScore(userDoc.data().score || 0);
      } else {
        await setDoc(userDocRef, { score: 0 });
      }
    };
    fetchScore();
  }, [userId]);

  // Generate flashcard deck with AI
  const generateDeck = useCallback(async () => {
    setGenerating(true);
    const prompt = `Create a JSON array of 15 flashcards for the category "${category}". Each object must have these exact keys: "item" (string), "options" (an array of 4 strings, one of which must be the correct answer), and "correctAnswer" (a string that exactly matches one of the options).`;
    
    try {
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { 
            contents: chatHistory,
            generationConfig: { responseMimeType: "application/json" }
        };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`Gemini API request failed with status ${response.status}`);
        const result = await response.json();
        const generatedText = result.candidates[0].content.parts[0].text;
        const generatedDeck = JSON.parse(generatedText);
        setDeck(generatedDeck);
    } catch (err) {
        console.error("--- DECK GENERATION FAILED ---", err);
        setError(`Deck Generation Error: ${err.message}`);
    } finally {
        setGenerating(false); setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    generateDeck();
  }, [generateDeck]);

  // Generate image for the current card using Unsplash
  useEffect(() => {
    if (deck.length > 0 && currentCardIndex < deck.length) {
      const currentItem = deck[currentCardIndex].correctAnswer; 
      const fetchImage = async () => {
        setImageLoading(true);
        const apiUrl = `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(currentItem)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`;
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error(`Unsplash API request failed`);
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            setImageSrc(data.results[0].urls.regular);
          } else {
            setImageSrc(`https://placehold.co/600x400/E2E8F0/4A5568?text=${encodeURIComponent(currentItem)}`);
          }
        } catch (err) {
          console.error("--- IMAGE FETCH FAILED ---", err);
          setError(`Image Fetch Error: ${err.message}`);
        } finally {
          setImageLoading(false);
        }
      };
      fetchImage();
    }
  }, [deck, currentCardIndex]);

  const handleAnswer = (option) => {
    if (isRevealed) return;
    setSelectedAnswer(option);
    setIsRevealed(true);

    if (option === deck[currentCardIndex].correctAnswer) {
      const newScore = score + 10;
      setScore(newScore);
      if (userId) {
        const userDocRef = doc(db, 'users', userId);
        updateDoc(userDocRef, { score: newScore });
      }
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < deck.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setSelectedAnswer(null);
      setIsRevealed(false);
    } else {
      alert(`Deck finished! Your final score is ${score}.`);
      navigate('/dashboard');
    }
  };

  const playAudio = () => {
    if ('speechSynthesis' in window && deck.length > 0) {
      const utterance = new SpeechSynthesisUtterance(deck[currentCardIndex].item);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };

  if (error) {
    return <div className="text-center p-8 text-red-500 font-semibold">{error}</div>;
  }
  if (loading || generating) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100"><Loader text="Generating your flashcard deck..." /></div>;
  }
  if (deck.length === 0) {
    return <div className="text-center p-8">Failed to generate deck. Please check the console and try again.</div>;
  }

  const currentCard = deck[currentCardIndex];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl">
        <header className="flex justify-between items-center mb-6">
          <Link to="/dashboard" className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg">&larr; Back to Categories</Link>
          <div className="text-2xl font-bold text-white bg-indigo-500 px-4 py-2 rounded-lg shadow-md">Score: {score}</div>
        </header>

        <main className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="aspect-video bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
            {imageLoading ? <Loader text="Finding image..." /> : <img src={imageSrc} alt={currentCard.item} className="w-full h-full object-cover rounded-lg" />}
          </div>
          
          <button onClick={playAudio} className="flex items-center justify-center gap-2 mx-auto mb-6 text-indigo-600 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 8.464a5 5 0 000 7.072m2.829-9.9a9 9 0 000 12.728M12 12h.01" /></svg>
            Play Audio
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCard.options.map((option) => (
              <OptionButton key={option} text={option} onClick={() => handleAnswer(option)} isSelected={selectedAnswer === option} isCorrect={option === currentCard.correctAnswer} isRevealed={isRevealed} />
            ))}
          </div>

          {isRevealed && (
            <button onClick={handleNextCard} className="w-full mt-6 py-3 font-bold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700">
              {currentCardIndex < deck.length - 1 ? 'Next Card' : 'Finish Game'}
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
