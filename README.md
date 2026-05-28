# 🅿️ Chennai Parking Finder — Full Stack App

## 📁 Project Structure

```
parking-app/
├── frontend/
│   └── index.html          ← Your UI (connects to backend API)
├── backend/
│   ├── server.js           ← Main Node.js server
│   ├── routes/
│   │   └── parking.js      ← All API routes
│   └── db/
│       ├── supabase.js     ← Database connection
│       └── schema.sql      ← Run this in Supabase
├── .env                    ← Your secret keys (never share this!)
├── package.json
└── README.md
```

---

## 🚀 Setup Guide (Step by Step)

### STEP 1 — Install Node.js
Download from https://nodejs.org and install it.
Check it works by running in terminal:
```
node --version
```

---

### STEP 2 — Set up Supabase (free database)

1. Go to https://supabase.com and sign up (free)
2. Click **New Project** → name it `chennai-parking`
3. Go to **SQL Editor** (left sidebar)
4. Copy everything from `backend/db/schema.sql`
5. Paste it and click **Run**
6. Your database tables are now created with all 8 parking spots!

---

### STEP 3 — Get your Supabase API keys

1. In Supabase, go to **Settings → API**
2. Copy your **Project URL** (looks like `https://xxxx.supabase.co`)
3. Copy your **anon/public key** (long string starting with `eyJ...`)

---

### STEP 4 — Add keys to .env file

Open `.env` and replace the placeholders:

```
SUPABASE_URL=https://your-actual-project-id.supabase.co
SUPABASE_KEY=your-actual-anon-key-here
PORT=3000
```

---

### STEP 5 — Install packages and run the backend

Open terminal in the `parking-app` folder and run:

```bash
npm install
npm start
```

You should see:
```
✅  Server running at http://localhost:3000
📋  API docs at   http://localhost:3000/
```

---

### STEP 6 — Open the frontend

Open `frontend/index.html` in your browser.
The app will now **fetch live data from your backend** instead of hardcoded data!

---

## 🌐 API Endpoints

| Method | URL | What it does |
|--------|-----|--------------|
| GET | `/api/parking` | Get all parking spots |
| GET | `/api/parking?search=T.Nagar` | Search by name/area |
| GET | `/api/parking?type=Metro` | Filter by type |
| GET | `/api/parking?open24=true` | Only 24hr spots |
| GET | `/api/parking/:id` | Get one spot |
| POST | `/api/parking` | Add new spot |
| PUT | `/api/parking/:id` | Update a spot |
| DELETE | `/api/parking/:id` | Delete a spot |
| GET | `/api/parking/:id/reviews` | Get reviews |
| POST | `/api/parking/:id/reviews` | Submit a review |

---

## ☁️ Deploy Online (Free)

### Deploy Backend → Vercel
1. Go to https://vercel.com and sign up
2. Install Vercel CLI: `npm install -g vercel`
3. In the `parking-app` folder run: `vercel`
4. Add your `.env` values in Vercel → Project → Settings → Environment Variables
5. Your backend is now live at `https://your-app.vercel.app`

### Update Frontend
In `frontend/index.html`, change line:
```js
const API_BASE = 'http://localhost:3000/api';
```
to:
```js
const API_BASE = 'https://your-app.vercel.app/api';
```

Now your app is fully live on the internet! 🎉

---

## 🔮 Future Features You Can Add

- [ ] User login (Supabase Auth)
- [ ] Save favourite parking spots
- [ ] Real-time slot availability
- [ ] Admin dashboard to manage spots
- [ ] Push notifications for parking availability
- [ ] Convert to mobile app with React Native
