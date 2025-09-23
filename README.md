FlashNest 🎨🦉🔢
FlashNest is an interactive and fun web application that uses AI to generate educational flashcards for kids. It's designed to make learning foundational concepts like numbers, animals, and colors an engaging adventure!

🚀 About The Project
Traditional learning can sometimes be static and unengaging for young children. FlashNest tackles this by leveraging the power of Google's Gemini AI to create a limitless supply of learning materials. Each flashcard is dynamically generated with a unique question and a custom-made image, providing a fresh experience every time.

This project was built to explore the capabilities of generative AI in an educational context while providing a real-world, useful application.

✨ Key Features
🧠 AI-Powered Content: Dynamically generates questions and card images using the Google Gemini API.

📚 Multiple Categories: Learn about animals, numbers, colors, and more.

🏆 Score Tracking: A simple and encouraging score system to track progress for each user.

👤 User Authentication: Secure login and signup to save scores and maintain a personal learning journey.

🎨 Kid-Friendly UI: A bright, simple, and engaging interface designed for children.

📱 Responsive Design: Fully functional on desktop, tablets, and mobile devices.

🛠️ Tech Stack
This project is built with a modern and scalable tech stack:

Frontend: React

Styling: Tailwind CSS

AI Model: Google Gemini API

Authentication & Database: Firebase (for user management and score storage)

Deployment: Vercel / Netlify

🔧 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Make sure you have the following installed on your machine:

Node.js (v18 or later)

npm or yarn

Git

Installation
Clone the repository:

git clone [https://github.com/ranawatharsh/flashnest.git](https://github.com/ranawatharsh/flashnest.git)

Navigate to the project directory:

cd flashnest

Install NPM packages:

npm install

Set up your environment variables:
Create a file named .env.local in the root of your project and add the following configuration. This is crucial for connecting to the Gemini API and Firebase.

# Google Gemini API Key
VITE_GEMINI_API_KEY='YOUR_GEMINI_API_KEY'

# Firebase Configuration
VITE_FIREBASE_API_KEY='YOUR_FIREBASE_API_KEY'
VITE_FIREBASE_AUTH_DOMAIN='YOUR_AUTH_DOMAIN'
VITE_FIREBASE_PROJECT_ID='YOUR_PROJECT_ID'
VITE_FIREBASE_STORAGE_BUCKET='YOUR_STORAGE_BUCKET'
VITE_FIREBASE_MESSAGING_SENDER_ID='YOUR_SENDER_ID'
VITE_FIREBASE_APP_ID='YOUR_APP_ID'

Running the App
Once the installation is complete, you can run the development server:

npm run dev

Open http://localhost:5173 (or the port shown in your terminal) to view it in your browser.

📖 Usage
Sign Up / Log In: Create a new account or log in to an existing one.

Choose a Category: From the dashboard, select a category you want to learn about (e.g., "Animals").

Learn with Flashcards: The app will present AI-generated flashcards with an image and a question.

Answer and Score: Answer the questions and see your score update in real-time. Your progress is saved to your account.
