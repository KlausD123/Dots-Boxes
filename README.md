# 🎮 Dots and Boxes Game 

## 📌 About the Project
This project is a **Dots and Boxes game** made using **HTML, CSS, and JavaScript**.  
The game can be played in two modes:
- **Play with Friend**
- **Play with AI**

This project is created as a **student learning project** to understand game logic, JavaScript programming, and basic AI behavior.

---

## 🕹️ Game Rules
- The game board contains **12 × 12 dots**.
- Players take turns connecting **two adjacent dots**.
- Only **horizontal and vertical lines** are allowed.
- When a player completes a **box (4 sides)**:
  - The box is assigned to that player.
  - The player gets **one extra turn**.
- The game ends when **all lines are drawn**.
- The player with the **maximum boxes wins**.

---

## 🤖 AI Features
The AI is designed using **rule-based logic**:
- It **always completes a box** if possible.
- It tries to **avoid giving easy boxes** to the opponent.
- It can **chain multiple boxes** in one turn.
- AI response time is **less than 2 seconds**.

This makes the AI challenging but still fast.

---

## 🧰 Technologies Used
- **HTML** – game structure  
- **CSS** – styling and UI  
- **JavaScript** – game logic and AI  
- **Canvas API** – drawing dots, lines, and boxes  

---

## 📂 Project Structure

- `index.html` – Main HTML file  
- `style.css` – Game styling  
- `script.js` – Complete game logic and AI  
- `README.md` – Project documentation  
