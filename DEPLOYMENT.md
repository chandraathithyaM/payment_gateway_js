# Deployment Guide — PayFlow

Follow these steps to deploy PayFlow to production using Render and Vercel.

## 1. Database Setup (Render)

1. Log in to [Render](https://render.com/).
2. Click **New** > **PostgreSQL**.
3. Name your database (e.g., `payflow_db`).
4. Choose the **Free** tier.
5. Once created, copy the **Internal Database URL** for the backend service and the **External Database URL** for local testing.

## 2. Backend Deployment (Render)

1. Click **New** > **Web Service**.
2. Connect your GitHub repository.
3. **Environment**: `Node`.
4. **Build Command**: `cd backend && npm install`.
5. **Start Command**: `cd backend && node server.js`.
6. Add the following **Environment Variables**:
   - `PORT`: `5000` (or leave as default)
   - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`: Use details from your Render PostgreSQL instance.
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID.
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret.
   - `FRONTEND_URL`: Your Vercel frontend URL (you'll update this later).
   - `NODE_ENV`: `production`.

## 3. Frontend Deployment (Vercel)

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New** > **Project**.
3. Connect your GitHub repository.
4. **Framework Preset**: Vite.
5. **Root Directory**: `frontend`.
6. Add the following **Environment Variables**:
   - `VITE_API_URL`: Your Render backend service URL.
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID.
7. Click **Deploy**.

## 4. Final Configuration & CORS

1. After Vercel deployment, copy your frontend URL (e.g., `https://payflow-frontend.vercel.app`).
2. Go back to Render, find your Backend Web Service, and update the `FRONTEND_URL` environment variable with your Vercel URL.
3. **CRITICAL**: If you are using Vercel Preview or Branch deployments, you must add those specific URLs to the `allowedOrigins` array in `backend/app.js` or configure the CORS middleware to allow them.
4. Restart the backend service on Render to apply environment variable and code changes.

## 🔒 Security Best Practices

- Always use environment variables for secrets.
- Never commit `.env` files to Git.
- Ensure `NODE_ENV` is set to `production` on Render to enable SSL for the database connection.
