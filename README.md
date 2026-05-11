# PayFlow — Full-Stack Razorpay Payment Gateway

PayFlow is a production-ready, full-stack eCommerce payment gateway application built with React, Node.js, and PostgreSQL. It features a modern, premium UI with glassmorphism effects and secure payment processing via the Razorpay Node.js SDK.

## 🚀 Features

- **Modern Frontend**: Built with React.js and Vite for blazing-fast performance.
- **Secure Backend**: Express.js REST API with HMAC SHA256 signature verification.
- **Database Integration**: PostgreSQL with Sequelize ORM for reliable data persistence.
- **Razorpay Integration**: Complete payment flow from order creation to verification.
- **Premium UI**: Dark-themed design with Inter typography and smooth animations.
- **Responsive**: Mobile-first design that works perfectly on all devices.
- **Error Handling**: Centralized error management on both frontend and backend.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Axios, React Router, Vanilla CSS
- **Backend**: Node.js, Express.js, Razorpay SDK, Sequelize ORM
- **Database**: PostgreSQL
- **Deployment**: Vercel (Frontend), Render (Backend & Database)

## 📦 Project Structure

```text
├── backend/            # Express.js API
│   ├── config/         # Database configuration
│   ├── controllers/    # Route handlers
│   ├── models/         # Sequelize models
│   ├── routes/         # API endpoints
│   ├── services/       # Razorpay logic
│   └── ...
└── frontend/           # React application
    ├── src/
    │   ├── components/ # UI Components
    │   ├── services/   # API calls
    │   └── ...
```

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd payment-gateway
```

### 2. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and fill in your credentials.
4. Start the server: `npm run dev`

### 3. Frontend Setup
1. Navigate to the frontend directory: `cd ../frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and fill in your credentials.
4. Start the dev server: `npm run dev`

## 💳 Testing Payments

To test the payment flow:
1. Ensure both frontend and backend are running.
2. Use the following test card details on the Razorpay popup:
   - **Card Number**: `4111 1111 1111 1111`
   - **Expiry**: Any future date
   - **CVV**: Any 3 digits
   - **OTP**: Any 4-6 digits (usually `123456`)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
