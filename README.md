# 🎓 NexaLearn: Full-Stack AI Learning Assistant
### *Empowering BCA Students with AI-Driven Education*

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-indigo?style=for-the-badge&logo=openai&logoColor=white)](https://openrouter.ai/)

---

## 🌟 Overview

**NexaLearn** is a comprehensive, full-stack educational platform designed specifically for Bachelor of Computer Applications (BCA) students. It leverages advanced AI models (via OpenRouter/Gemini) to provide personalized explanations, dynamic flashcards, and smart study planning. 

The platform is divided into a student-facing learning dashboard and a powerful administrative panel for curriculum management.

---

## ✨ Key Features

### 👨‍🎓 Student Features
- **🤖 AI Explanation (Learning Page)**: Get instant, contextual explanations for any BCA topic in English, Hindi, or Hinglish.
- **🧠 Smart Flashcards**: Dynamically generated cards based on the official syllabus. Track your mastery with "Mark as Learned".
- **📈 Progress Analytics**: Visual indicators of subject-wise and unit-wise completion percentages.
- **🔊 Text-to-Speech**: Listen to AI explanations on the go with built-in TTS support.
- **📄 Export to Text**: Save your learning sessions as `.txt` files for offline revision.

### 🔐 Admin Panel Features (New)
- **📊 Admin Dashboard**: High-level stats on total users, syllabus modules, and system health.
- **📚 Syllabus Manager**: 
  - Manage curriculum with a **Semester -> Subject -> Unit** hierarchy.
  - Grouped view by semester for easy organization.
  - Quick-add subjects and units with dynamic topic management.
- **👥 User Management**:
  - View all registered students and their details.
  - Promote/Demote users to Admin roles.
  - **Add New Admins**: Create administrative accounts with custom email/password.
  - Securely delete inactive or unauthorized users.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens), BCrypt.js, Google OAuth |
| **AI Integration** | OpenRouter API (Gemini/GPT Models) |
| **Deployment** | Vercel (Frontend & Serverless Backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account
- OpenRouter API Key

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/adrsy6394/learning-bca.git
   cd learning-bca
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create a .env file in /server
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   OPENROUTER_API_KEY=your_key
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. **Setup Frontend**
   ```bash
   cd ../nexa-learn
   npm install
   # Create a .env file in /nexa-learn
   VITE_MAIN_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_id
   ```

### Running Locally
- **Start Backend**: `cd server && npm run dev`
- **Start Frontend**: `cd nexa-learn && npm run dev`

---

## 📂 Project Structure

```text
learning-bca/
├── nexa-learn/            # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI & Feature components
│   │   ├── context/       # Auth & Global State
│   │   ├── pages/         # LearningPage, Flashcards, Admin, etc.
│   │   └── App.jsx        # Routing logic
├── server/                # Backend (Node + Express)
│   ├── src/
│   │   ├── config/        # DB Connection
│   │   ├── controller/    # Business Logic (Auth, Admin, AI)
│   │   ├── models/        # Mongoose Schemas (User, Syllabus)
│   │   └── routes/        # API Endpoints
│   └── index.js           # Main Entry Point
```

---

## 🤝 Contribution

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p><strong>Built with ❤️ for BCA students everywhere.</strong></p>
  <p>Happy Learning! 🎓</p>
</div>
