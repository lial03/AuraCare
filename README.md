# AuraCare: A Mental Health Support Web Application

## 🌟 Project Overview

**AuraCare** is a full-stack web application designed to provide proactive mental health support for adolescents and young adults. It bridges the gap between formal clinical services and informal peer support by offering a user-friendly, non-stigmatizing platform for daily emotional self-management.

The core functionality of AuraCare revolves around three pillars:

1.  **Proactive Mood Tracking:** Users can log their daily mood and journal entries.
2.  **Data-Driven Insights:** The application visualizes mood trends and generates context-aware insights to promote self-awareness.
3.  **Automated Peer Support:** Users can register a trusted support circle and, in times of distress, automatically notify them via email with a single click.

## 🚀 Key Features

- **Secure Authentication & Account Management:** User registration/login, secure password management (`bcrypt`), and the ability to **Change Password** and **Permanently Delete** their account and all associated data.
- **Mood & Journal Logging:** Simple interface for daily mood logging with optional notes.
- **AI Journal Analysis:** **New feature** that provides a summary, tone, and theme for reflective journal entries using AI.
- **Personalized Dashboard & Dynamic Insights:** Visualization of mood history and trends (**Recharts**) and **algorithmic/AI analysis** to provide actionable, context-aware recommendations (e.g., identifying downward trends or potential triggers).
- **Support Circle & Communication:** Ability to manage trusted contacts, display their **email verification status**, and use **AI-generated proactive check-in scripts** for low-pressure communication.
- **Emergency Notification:** One-click activation to send an urgent email notification to the entire support circle.
- **Journaling:** Dedicated space for private reflection and historical review of entries.

## 🛠️ Technology Stack

AuraCare is built on a modern MERN-stack architecture, ensuring a scalable, robust, and responsive application.

| Component          | Technology                              | Purpose                                                                              |
| :----------------- | :-------------------------------------- | :----------------------------------------------------------------------------------- |
| **AI/LLM**         | **Google Gemini API** (`@google/genai`) | Generating journal analyses, dynamic insights, and proactive communication scripts.  |
| **Frontend**       | **React.js** (with Vite)                | Building the user interface and handling client-side logic.                          |
| **Backend**        | **Node.js** with **Express.js**         | Handling API endpoints, business logic, and server-side operations.                  |
| **Database**       | **MongoDB** (via Mongoose)              | Flexible, scalable storage for user profiles, mood logs, and support contacts.       |
| **Visualization**  | **Recharts**                            | Rendering interactive and informative mood trend charts.                             |
| **Authentication** | **JWT** & **Bcrypt**                    | Secure user session management and password hashing.                                 |
| **Notification**   | **Nodemailer** & **Mailgun**            | Reliable, cost-effective service for sending urgent support notifications via email. |

## ⚙️ Installation and Setup

### Prerequisites

- Node.js (v18+)
- MongoDB Instance (Local or Cloud-hosted, e.g., MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone [https://github.com/lial03/AuraCare.git](https://github.com/lial03/AuraCare.git)
cd AuraCare
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following environment variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_strong_secret_key
MAILGUN_SMTP_LOGIN=your_mailgun_smtp_login
MAILGUN_SMTP_PASSWORD=your_mailgun_smtp_password
MAILGUN_SENDER_EMAIL=your_sender_email@example.com
AI_API_KEY=your_gemini_api_key
```

Run the backend server:

```bash
node server.js
# or for development with auto-restart:
# npm run dev
```

### 3. Frontend Setup

```bash
cd .. # Go back to the root AuraCare directory
npm install
```

Create a `.env` file in the root `AuraCare` directory (for the frontend) and add the following:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the frontend application:

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`.

## 🤝 Contribution

This project is maintained by [Lina Mukashumbusho].

_Note: Replace bracketed placeholders with actual values._
