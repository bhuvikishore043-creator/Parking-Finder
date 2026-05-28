// backend/db/supabase.js
// ─────────────────────────────────────────────
//  Supabase Database Connection
//  This file creates ONE connection to Supabase
//  and exports it so all routes can use it.
// ─────────────────────────────────────────────

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl  = process.env.SUPABASE_URL;
const supabaseKey  = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
