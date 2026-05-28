// backend/server.js
// ─────────────────────────────────────────────
//  Chennai Parking Finder — Main Server
//  This is the entry point of the backend.
//  Run: node backend/server.js
// ─────────────────────────────────────────────

require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const parkingRoute = require('./routes/parking');

const app  = express();
const PORT = process.env.PORT || 3000;


// ─────────────────────────────────────────────
//  Middleware
// ─────────────────────────────────────────────

// Allow frontend (HTML file / Vercel) to call this server
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());


// ─────────────────────────────────────────────
//  Routes
// ─────────────────────────────────────────────

// Health check — visit http://localhost:3000/
app.get('/', (req, res) => {
  res.json({
    message: '🅿️  Chennai Parking Finder API is running!',
    version: '1.0.0',
    endpoints: {
      getAllParking   : 'GET  /api/parking',
      searchParking  : 'GET  /api/parking?search=T.Nagar&type=Metro&open24=true',
      getSingleSpot  : 'GET  /api/parking/:id',
      addSpot        : 'POST /api/parking',
      updateSpot     : 'PUT  /api/parking/:id',
      deleteSpot     : 'DELETE /api/parking/:id',
      getReviews     : 'GET  /api/parking/:id/reviews',
      submitReview   : 'POST /api/parking/:id/reviews',
    }
  });
});

// All parking-related routes live under /api/parking
app.use('/api/parking', parkingRoute);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.path} not found` });
});


// ─────────────────────────────────────────────
//  Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  Server running at http://localhost:${PORT}`);
  console.log(`📋  API docs at   http://localhost:${PORT}/\n`);
});
