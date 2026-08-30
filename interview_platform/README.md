# ⬡ PrepAI – AI-Based Interview Preparation Platform

A full-stack web application that helps students and job seekers prepare for interviews through AI-powered mock sessions, technical quizzes, aptitude tests, and personalised feedback.

---

## 📁 Project Structure

```
interview_platform/
├── frontend/                  # HTML, CSS, JavaScript UI
│   ├── index.html             # Landing page
│   ├── css/
│   │   └── style.css          # Global stylesheet
│   ├── js/
│   │   ├── landing.js         # Landing page interactions
│   │   ├── auth.js            # Login / Register logic
│   │   ├── dashboard.js       # Dashboard data loading
│   │   ├── mock-interview.js  # Mock interview engine + AI feedback
│   │   ├── technical-quiz.js  # MCQ quiz with timer
│   │   ├── aptitude-test.js   # Aptitude MCQ test
│   │   ├── hr-prep.js         # HR question bank + STAR guide
│   │   └── performance.js     # Analytics charts (Chart.js)
│   └── pages/
│       ├── login.html
│       ├── register.html
│       ├── dashboard.html
│       ├── mock-interview.html
│       ├── technical-quiz.html
│       ├── aptitude-test.html
│       ├── hr-prep.html
│       ├── performance.html
│       ├── history.html
│       └── profile.html
│
├── backend/                   # Python Flask REST API
│   ├── app.py                 # Flask application entry point
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example           # Environment variable template
│   ├── routes/
│   │   ├── auth.py            # /api/auth/* – login, register, logout
│   │   ├── questions.py       # /api/questions/* – question bank CRUD
│   │   ├── sessions.py        # /api/sessions/* – practice sessions
│   │   ├── feedback.py        # /api/feedback/* – AI feedback engine
│   │   └── users.py           # /api/users/* – profile management
│   ├── utils/
│   │   ├── db.py              # MySQL connection helper
│   │   ├── auth_helper.py     # JWT token utilities
│   │   └── feedback_engine.py # AI scoring & feedback logic
│   └── models/                # (reserved for ORM models)
│
└── database/
    └── schema.sql             # MySQL schema + seed data
```

---

## 🚀 Setup & Installation

### Prerequisites
- Python 3.10+
- MySQL 8.0+
- A modern web browser

---

### 1. Database Setup

```bash
# Log into MySQL
mysql -u root -p

# Run the schema (creates DB, tables, and seed data)
mysql -u root -p < database/schema.sql
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials and secret key

# Start server
python app.py
# Server runs at http://localhost:5000
```

---

### 3. Frontend

The frontend is **pure HTML/CSS/JS** – no build step needed.

**Option A – Serve via Flask (recommended)**
Flask serves the frontend automatically when you run `python app.py`.
Open `http://localhost:5000` in your browser.

**Option B – Direct file access (demo mode)**
Open `frontend/index.html` directly in a browser.
All features work in demo mode using `localStorage` (no backend needed).

---

## 🌐 API Endpoints

### Auth `/api/auth/`
| Method | Endpoint    | Description             |
|--------|-------------|-------------------------|
| POST   | `/register` | Create new account      |
| POST   | `/login`    | Login, returns JWT      |
| GET    | `/me`       | Get current user info   |
| POST   | `/logout`   | Logout (client clears token) |

### Questions `/api/questions/`
| Method | Endpoint   | Description                        |
|--------|------------|------------------------------------|
| GET    | `/`        | List questions (filter by domain)  |
| GET    | `/<id>`    | Get single question                |
| GET    | `/random`  | Get random question set            |
| POST   | `/`        | Add a question                     |

### Sessions `/api/sessions/`
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/`                 | List user sessions       |
| POST   | `/`                 | Create session           |
| GET    | `/<id>`             | Get session details      |
| PUT    | `/<id>/complete`    | Mark session complete    |
| GET    | `/stats`            | Performance statistics   |

### Feedback `/api/feedback/`
| Method | Endpoint | Description                         |
|--------|----------|-------------------------------------|
| POST   | `/`      | Analyse answer, return AI feedback  |
| POST   | `/save`  | Save response + feedback to DB      |

### Users `/api/users/`
| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | `/profile`          | Get user profile     |
| PUT    | `/profile`          | Update profile       |
| PUT    | `/change-password`  | Change password      |
| DELETE | `/`                 | Delete account       |

---

## 🎯 Features

| Feature | Description |
|---|---|
| 🤖 AI Feedback | Scores answers on Clarity, Depth, Confidence, Relevance |
| 💬 Mock Interview | Open-ended Q&A across Programming, HR, Technical domains |
| 📝 Technical Quiz | MCQ with timer – DSA, OOP, DBMS, OS, Networking |
| 🔢 Aptitude Test | Quantitative, Logical Reasoning, Verbal Ability |
| 👥 HR Prep | STAR-method coaching, behavioral question bank |
| 📊 Performance | Score trends, domain breakdowns, AI recommendations |
| 📜 History | Full session log with filtering |
| 👤 Profile | Account management, domain/experience settings |

---

## 🛠 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Python 3, Flask |
| Database | MySQL 8 |
| Auth | JWT (PyJWT) + bcrypt (Werkzeug) |
| Charts | Chart.js |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts (Syne + DM Sans) |

---

## 🔒 Security

- Passwords are **bcrypt-hashed** via Werkzeug
- API endpoints protected with **JWT Bearer tokens**
- SQL injection prevented via **parameterised queries** (PyMySQL)
- CORS enabled for development (restrict in production)

---

## 📜 License

This project is submitted as an academic project. All rights reserved.
