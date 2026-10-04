# 🚀 Complete Deployment Guide: Netlify + Render + Cloud Database

This project is configured for seamless deployment:
- **Frontend**: [Netlify](https://www.netlify.com/) (React + Vite SPA)
- **Backend**: [Render](https://render.com/) (Docker PHP 8.2 Apache)
- **Database**: [TiDB Cloud Serverless](https://tidbcloud.com/) (Free MySQL 8.0 compatible, 5GB storage, zero credit card)

---

## Step 1: Set Up Cloud MySQL Database (TiDB Cloud - Free)

We recommend **TiDB Cloud Serverless** because it is 100% MySQL compatible, completely free forever (up to 5GB storage), requires no credit card, and sets up in under 60 seconds.

1. Go to **[https://tidbcloud.com](https://tidbcloud.com/)** and sign in (using GitHub or Google).
2. Click **Create Cluster** and select **Serverless (Free)**.
3. Choose your preferred region (e.g., AWS us-east-1 or ap-southeast-1) and click **Create**.
4. In the cluster overview:
   - Note the **Root Password** generated (copy it and keep it safe).
   - Click **Connect** and select **General** / **MySQL CLI**.
   - You will see your credentials:
     - **Host**: e.g., `gateway01.us-east-1.prod.aws.tidbcloud.com`
     - **Port**: `4000`
     - **User**: e.g., `2AbCdEf.root`
     - **Database**: `test` (or create `travel_planner`)
     - **SSL**: Enabled (`DB_SSL=true`)
5. **Import Schema & Seed Data**:
   - In the TiDB Cloud Console, click **SQL Editor** in the left sidebar.
   - Open [`database/complete_production_database.sql`](./database/complete_production_database.sql) in VS Code or text editor.
   - Copy the entire SQL content and paste it into the TiDB SQL Editor, then click **Run**.
   - *All tables, 8 destinations, 24 places, 23 hotels, and trips are now populated!*

*(Alternative free MySQL options: [Aiven for MySQL](https://aiven.io/mysql), [Clever Cloud MySQL](https://www.clever-cloud.com/), or [Railway MySQL](https://railway.app/).)*

---

## Step 2: Deploy Backend on Render

1. Go to **[https://render.com](https://render.com/)** and sign in with GitHub.
2. Click **New +** in the top bar and select **Web Service**.
3. Choose your repository: `ansarimazhar07/TRAVEL-JOURNEY-PLANNAR`.
4. Configure the Web Service:
   - **Name**: `travel-journey-backend` (or any name you prefer)
   - **Region**: Oregon (or closest to your DB region)
   - **Runtime**: **Docker** *(Render detects the root `Dockerfile` automatically)*
   - **Instance Type**: **Free**
5. Scroll down to **Environment Variables** and add the following:

   | Key | Value | Notes |
   |---|---|---|
   | `PORT` | `10000` | Render default web port |
   | `DB_HOST` | `<your-cloud-host>` | e.g. `gateway01.us-east-1.prod.aws.tidbcloud.com` |
   | `DB_PORT` | `4000` | `4000` for TiDB Cloud, `3306` for default MySQL |
   | `DB_NAME` | `test` | or `travel_planner` |
   | `DB_USER` | `<your-cloud-user>` | from TiDB / Cloud DB |
   | `DB_PASS` | `<your-cloud-password>` | from TiDB / Cloud DB |
   | `DB_SSL` | `true` | Required for TiDB / Aiven |
   | `FRONTEND_URL` | `https://*.netlify.app` | Updated to your specific Netlify URL after Step 3 |
   | `GEMINI_API_KEY` | `<your-gemini-api-key>` | Optional: Gemini AI key |
   | `RAILRADAR_API_KEY`| `<your-railradar-api-key>` | RailRadar Train Status Key |

6. Click **Deploy Web Service**.
7. Wait 2-3 minutes for the build to finish. Once live, Render gives you a URL such as:
   `https://travel-journey-backend-xxxx.onrender.com`
8. **Verify your backend**:
   Open `https://travel-journey-backend-xxxx.onrender.com/` in your browser. You should see:
   ```json
   {
     "service": "Travel Journey Planner API",
     "status": "online",
     "database": {
       "status": "connected",
       "message": "Successfully connected to database (...)"
     }
   }
   ```

---

## Step 3: Deploy Frontend on Netlify

1. Go to **[https://app.netlify.com](https://app.netlify.com/)** and sign in with GitHub.
2. Click **Add new site** -> **Import an existing project**.
3. Select **GitHub** and choose `TRAVEL-JOURNEY-PLANNAR`.
4. Netlify will automatically detect [`netlify.toml`](./netlify.toml):
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Click **Add environment variables**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://travel-journey-backend-xxxx.onrender.com` *(Your Render backend URL from Step 2, no trailing slash)*
6. Click **Deploy site**.
7. Netlify will build and deploy in ~30 seconds. Your frontend is now live at:
   `https://your-site-name.netlify.app`

---

## Step 4: Final Quick Check

1. Open your Netlify site URL.
2. Check that:
   - Destinations, Places, and Hotels load with cards and images.
   - Live Train Status (/live-train-status) works with Indian Railway train numbers (e.g. `12951`, `12009`).
   - Train Search (/train-search) works between stations (e.g. `NDLS` to `MMCT`).
   - Auth (Sign up / Login) and Trip Planner work and persist across browser refreshes.
