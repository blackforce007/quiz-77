# Black Force 007 — Quiz Game

**Black Force 007 — Quiz Game** is a fully client-side, mobile-friendly quiz application designed to enhance social awareness and understanding of human behavior. The game is built using HTML, CSS, and JavaScript, with questions stored in a JSON file. It features a modern, engaging UI with animations, sound feedback, and a leaderboard stored in localStorage. The game is ready to deploy on GitHub Pages and supports future enhancements like service workers and multiplayer functionality.

## Features

- **50 Social Awareness Questions**: Questions focus on body language, communication, empathy, social norms, and relationships, stored in `questions.json`.
- **Timer Options**: Choose between 15 or 30 seconds per question.
- **Point System**:
  - Base points: 10 per correct answer.
  - Time bonus: Up to 10 points based on remaining time.
  - Streak bonus: 2 points per consecutive correct answer.
- **Feedback System**: Correct answers highlighted in green with a checkmark (✅) and sound; wrong answers in red with a cross (❌) and sound.
- **Progress Tracker**: Displays 50 dots representing questions, with visual indicators for current, completed, correct, and wrong answers.
- **Results & Leaderboard**:
  - Detailed score breakdown (total score, correct answers, time/streak bonuses).
  - LocalStorage-based leaderboard showing top 10 scores with player names and dates.
  - Option to save high scores with a name input.
- **Share Functionality**: Share results via Web Share API (falls back to clipboard copy on unsupported browsers).
- **Restart Option**: Return to the start screen after the game ends.
- **Mobile-Friendly UI**: Responsive design with smooth animations and touch support.
- **Randomized Questions**: Questions are shuffled each game for replayability.
- **Auto-Next on Timeout**: Automatically proceeds to the next question when the timer runs out.

## File Structure

- `index.html`: Main HTML file with game structure and UI elements.
- `style.css`: Styling for the game, including mobile responsiveness, animations, and a dark-themed gaming aesthetic.
- `script.js`: Core game logic, including question loading, timer, scoring, feedback, leaderboard, and sharing.
- `questions.json`: Contains 50 questions with options and correct answers in Bangla.

## Setup Instructions

1. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/your-username/black-force-007-quiz.git
