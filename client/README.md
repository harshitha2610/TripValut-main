# ✈️ TripVault

TripVault is a full-stack travel memory journal application where users can securely register, log in, and manage their travel memories. The application allows authenticated users to create, view, update, and delete their trips through a clean and professional dashboard.

This project was built as part of the **CodGen Full Stack (MERN) Virtual Internship**.

---

## 🚀 Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Logged-in User Details
- Logout

### 🗺️ Trip Management

- Create a new trip
- View all personal trips
- View individual trip details
- Edit existing trips
- Delete trips
- Trip title and destination
- Start and end dates
- Trip description
- Trip rating

### 📊 Dashboard

- Professional and clean dashboard UI
- Total trips statistics
- Average trip rating
- Number of destinations
- Trip cards
- Empty state for users without trips
- Loading and error states
- Responsive design

### 🔒 Security

- JWT-based authentication
- Protected trip APIs
- Users can access only their own trips
- Owner-only update and delete operations
- Environment variables for sensitive credentials

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors

---

## 📂 Project Structure

```text
tripvault/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Dashboard.css
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   │   ├── User.js
│   │   └── Trip.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── tripRoutes.js
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md