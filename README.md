🎮 Dots and Boxes Game (JavaScript)
📌 Project Overview

This project is a Dots and Boxes game developed using HTML, CSS, and JavaScript.
The game supports:

Two-player mode (Play with Friend)

Single-player mode (Play with AI)

The AI is designed to be smart and fast, and it can complete boxes when possible.

This project was created as a learning project to understand:

JavaScript logic

Canvas drawing

Game state management

Basic AI decision-making

🕹️ Game Rules

The board consists of dots arranged in a grid (12 × 12).

Players take turns connecting two adjacent dots using a line.

Only horizontal or vertical lines are allowed.

When a player completes a box (4 sides):

The box is marked with the player’s name (A or B).

The player gets one extra turn.

The game ends when all possible lines are drawn.

The player with more boxes wins.

🤖 AI Behavior

The AI in this game is not random. It follows these rules:

Always completes a box if possible.

Avoids moves that give the opponent an easy box.

Plays very fast (response time < 2 seconds).

Can chain multiple boxes in one turn.

This makes the AI challenging and suitable for practice.

🧱 Technologies Used

HTML – structure of the game

CSS – styling and appearance

JavaScript – game logic and AI

HTML Canvas – drawing the board, lines, and boxes

📂 Project Structure
dots-and-boxes/
│
├── index.html     # Main HTML file
├── style.css      # Styling of the game
├── script.js      # Complete game logic and AI
└── README.md      # Project documentation
