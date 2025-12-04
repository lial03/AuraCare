# AuraCare: A Mental Health Support Web Application

## 🌟 Project Overview

**AuraCare** is a full-stack web application designed to provide proactive mental health support for adolescents and young adults. It bridges the gap between formal clinical services and informal peer support by offering a user-friendly, non-stigmatizing platform for daily emotional self-management.

The core functionality of AuraCare revolves around three pillars:

1.  **Proactive Mood Tracking:** Users can log their daily mood and journal entries.
2.  **Data-Driven Insights:** The application visualizes mood trends and generates context-aware insights to promote self-awareness.
3.  **Automated Peer Support:** Users can register a trusted support circle and, in times of distress, automatically notify them via email with a single click.

This project was developed as part of the SWE3090A course, demonstrating proficiency in modern web development technologies and adherence to the principles outlined in the project proposal.

## 🚀 Key Features

- **Secure Authentication:** User registration and login using email or phone number, secured with JWT and `bcrypt`.
- **Mood Logging:** Simple interface for daily mood logging with optional notes.
- **Personalized Dashboard:** Visualization of mood history and trends using **Recharts**.
- **Dynamic Insights:** Algorithmic analysis of mood patterns to provide actionable, context-aware recommendations (e.g., identifying downward trends or potential triggers).
- **Support Circle Management:** Ability to add and remove trusted contacts.
- **Emergency Notification:** One-click activation to send an urgent email notification to the entire support circle.
- **Journaling:** Dedicated space for private reflection and historical review of entries.

## 🛠️ Technology Stack

AuraCare is built on a modern MERN-stack architecture, ensuring a scalable, robust, and responsive application.

| Component          | Technology                      | Purpose                                                                              |
| :----------------- | :------------------------------ | :----------------------------------------------------------------------------------- |
| **Frontend**       | **React.js** (with Vite)        | Building the user interface and handling client-side logic.                          |
| **Backend**        | **Node.js** with **Express.js** | Handling API endpoints, business logic, and server-side operations.                  |
| **Database**       | **MongoDB** (via Mongoose)      | Flexible, scalable storage for user profiles, mood logs, and support contacts.       |
| **Visualization**  | **Recharts**                    | Rendering interactive and informative mood trend charts.                             |
| **Authentication** | **JWT** & **Bcrypt**            | Secure user session management and password hashing.                                 |
| **Notification**   | **Nodemailer** & **Mailgun**    | Reliable, cost-effective service for sending urgent support notifications via email. |

## ⚙️ Installation and Setup

### Prerequisites

- Node.js (v18+)
- MongoDB Instance (Local or Cloud-hosted, e.g., MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/lial03/AuraCare.git
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
