// backend/routes/parking.js
// ─────────────────────────────────────────────
//  All API routes for parking spots & reviews
// ─────────────────────────────────────────────

const express  = require('express');
const router   = express.Router();
const supabase = require('../db/supabase');


// ─────────────────────────────────────────────
//  GET /api/parking
//  Returns all parking spots
//  Optional query params:
//    ?search=T.Nagar
//    ?type=Metro
//    ?open24=true
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { search, type, open24 } = req.query;

    let query = supabase.from('parking_spots').select('*');

    // Filter by type (Metro / Multi-level / Open lot)
    if (type && type !== 'All') {
      query = query.eq('type', type);
    }

    // Filter by open 24 hours
    if (open24 === 'true') {
      query = query.eq('is_open_24', true);
    }

    // Filter by search term (name or area)
    if (search) {
      query = query.or(`name.ilike.%${search}%,area.ilike.%${search}%`);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) throw error;

    res.json({ success: true, count: data.length, data });

  } catch (err) {
    console.error('GET /api/parking error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ─────────────────────────────────────────────
//  GET /api/parking/:id
//  Returns a single parking spot by ID
// ─────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('parking_spots')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, error: 'Parking spot not found' });

    res.json({ success: true, data });

  } catch (err) {
    console.error('GET /api/parking/:id error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ─────────────────────────────────────────────
//  POST /api/parking
//  Add a new parking spot (Admin only)
//  Body: { name, area, type, lat, lng, fee,
//          hours, is_open_24, address, capacity }
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, area, type, lat, lng, fee, hours, is_open_24, address, capacity } = req.body;

    // Basic validation
    if (!name || !lat || !lng) {
      return res.status(400).json({ success: false, error: 'name, lat, and lng are required' });
    }

    const { data, error } = await supabase
      .from('parking_spots')
      .insert([{ name, area, type, lat, lng, fee, hours, is_open_24, address, capacity, rating: 0, reviews: 0 }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, message: 'Parking spot added!', data });

  } catch (err) {
    console.error('POST /api/parking error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ─────────────────────────────────────────────
//  PUT /api/parking/:id
//  Update a parking spot (Admin only)
// ─────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('parking_spots')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, message: 'Parking spot updated!', data });

  } catch (err) {
    console.error('PUT /api/parking/:id error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ─────────────────────────────────────────────
//  DELETE /api/parking/:id
//  Delete a parking spot (Admin only)
// ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('parking_spots')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Parking spot deleted!' });

  } catch (err) {
    console.error('DELETE /api/parking/:id error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ─────────────────────────────────────────────
//  GET /api/parking/:id/reviews
//  Get all reviews for a parking spot
// ─────────────────────────────────────────────
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('parking_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, count: data.length, data });

  } catch (err) {
    console.error('GET reviews error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


// ─────────────────────────────────────────────
//  POST /api/parking/:id/reviews
//  Submit a review for a parking spot
//  Body: { author_name, rating, comment }
// ─────────────────────────────────────────────
router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { author_name, rating, comment } = req.body;

    if (!author_name || !rating) {
      return res.status(400).json({ success: false, error: 'author_name and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }

    // Insert the review
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ parking_id: id, author_name, rating, comment }])
      .select()
      .single();

    if (error) throw error;

    // Recalculate average rating for the parking spot
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('parking_id', id);

    const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);

    await supabase
      .from('parking_spots')
      .update({ rating: parseFloat(avgRating), reviews: allReviews.length })
      .eq('id', id);

    res.status(201).json({ success: true, message: 'Review submitted!', data });

  } catch (err) {
    console.error('POST review error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;
