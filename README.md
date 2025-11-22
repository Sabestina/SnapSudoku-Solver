# SnapSudoku Solver 🧩

SnapSudoku is a modern, AI-powered Progressive Web App (PWA) that helps you solve Sudoku puzzles instantly. By leveraging Google's **Gemini 3 Pro** model, it can recognize Sudoku grids from images/camera photos and solve them using a high-performance backtracking algorithm.

## ✨ Features

*   **📸 AI Recognition**: Upload a photo or take a picture of a physical Sudoku book; Gemini AI extracts the numbers automatically.
*   **⚡️ Instant Solver**: Solves standard 9x9 grids in milliseconds.
*   **📱 PWA Ready**: Installable on Android (Play Store), iOS, and Desktop. Works like a native app.
*   **📵 Offline Capable**: The solving algorithm and manual entry work completely offline. (AI features require internet).
*   **🛡 Input Validation**: Checks for valid Sudoku rules before attempting to solve.

## 🛠 Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI**: Google Gemini API (`gemini-3-pro-preview`)
*   **PWA**: Service Workers, Web App Manifest

## 🚀 Getting Started

### 1. Prerequisites
You need a Google Gemini API Key. Get it from [Google AI Studio](https://aistudio.google.com/).

### 2. Installation

```bash
# Install dependencies (if using a local node environment)
npm install
```

### 3. Running the App

You must set your API key in the environment.

```bash
# Set your API key
export API_KEY="your_gemini_api_key_here"

# Start the server
npm start
```

## 📲 Building for Android (Play Store)

This app is optimized for **PWABuilder**. To package it for the Google Play Store:

1.  **Deploy** the app to a public HTTPS URL (e.g., GitHub Pages, Vercel, Netlify).
2.  **Screenshots**: Replace the placeholder URLs in `manifest.json` with actual screenshots of your app running. This is **required** for the Play Store.
    *   *Tip*: Take a screenshot on your phone (approx 1080x1920) and one on desktop (1920x1080).
3.  **Visit [PWABuilder.com](https://www.pwabuilder.com/)**.
4.  Enter your deployed URL.
5.  Click **Build for Android Store**.
6.  Follow the steps to generate your `.aab` bundle and signing key.
7.  Upload the `.aab` to the Google Play Console.

## 📁 Project Structure

*   `src/App.tsx`: Main UI logic.
*   `src/services/geminiService.ts`: Handles communication with Google Gemini API.
*   `src/services/sudokuSolver.ts`: The pure algorithmic solver.
*   `src/sw.js`: Service Worker for offline caching.
*   `public/manifest.json`: App metadata for stores/installability.
