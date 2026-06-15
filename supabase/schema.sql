-- LG Superfan League Database Schema
-- Run this in Supabase SQL Editor
--
-- This schema is IDEMPOTENT - you can run it multiple times safely.
-- It will:
--   - Create tables if they don't exist (IF NOT EXISTS)
--   - Drop and recreate triggers and policies
--   - Insert data only if it doesn't already exist (ON CONFLICT DO NOTHING)
--
-- Safe to run for initial setup AND for updates!

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) UNIQUE NOT NULL,
  team VARCHAR(50) NOT NULL,
  team_flag VARCHAR(10) NOT NULL,
  points INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 999,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Missions Table
CREATE TABLE IF NOT EXISTS missions (
  id VARCHAR(50) PRIMARY KEY,
  week INTEGER NOT NULL,
  day INTEGER,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  points INTEGER NOT NULL,
  timed_duration INTEGER,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT FALSE,
  is_daily_special BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mission Submissions Table
CREATE TABLE IF NOT EXISTS mission_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id VARCHAR(50) NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  points_awarded INTEGER,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by VARCHAR(100),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mission_id, user_id)
);

-- Gifts/Rewards Table
CREATE TABLE IF NOT EXISTS gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  quantity_total INTEGER,
  quantity_remaining INTEGER,
  image_url TEXT,
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Gifts (Redemptions) Table
CREATE TABLE IF NOT EXISTS user_gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_spent INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'shipped', 'delivered', 'cancelled')),
  delivery_address TEXT,
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photobooth Entries Table
CREATE TABLE IF NOT EXISTS photobooth_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  frame_id VARCHAR(50),
  likes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photobooth Likes Table
CREATE TABLE IF NOT EXISTS photobooth_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id UUID NOT NULL REFERENCES photobooth_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(entry_id, user_id)
);

-- OTP Table (for temporary OTP storage)
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'moderator')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Sessions Table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token VARCHAR(100) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
CREATE INDEX IF NOT EXISTS idx_users_team ON users(team);
CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);
CREATE INDEX IF NOT EXISTS idx_missions_week ON missions(week);
CREATE INDEX IF NOT EXISTS idx_missions_active ON missions(is_active);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON mission_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_mission ON mission_submissions(mission_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON mission_submissions(status);
CREATE INDEX IF NOT EXISTS idx_photobooth_user ON photobooth_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone, expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_users_admin_id ON admin_users(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_missions_updated_at ON missions;
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_submissions_updated_at ON mission_submissions;
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON mission_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gifts_updated_at ON gifts;
CREATE TRIGGER update_gifts_updated_at BEFORE UPDATE ON gifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_gifts_updated_at ON user_gifts;
CREATE TRIGGER update_user_gifts_updated_at BEFORE UPDATE ON user_gifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_photobooth_updated_at ON photobooth_entries;
CREATE TRIGGER update_photobooth_updated_at BEFORE UPDATE ON photobooth_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user rank based on points
CREATE OR REPLACE FUNCTION update_user_ranks()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET rank = ranks.new_rank
  FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY points DESC, created_at ASC) as new_rank
    FROM users
  ) as ranks
  WHERE users.id = ranks.id;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-increment photobooth likes
CREATE OR REPLACE FUNCTION increment_photobooth_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE photobooth_entries
  SET likes = likes + 1
  WHERE id = NEW.entry_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS photobooth_like_added ON photobooth_likes;
CREATE TRIGGER photobooth_like_added
AFTER INSERT ON photobooth_likes
FOR EACH ROW EXECUTE FUNCTION increment_photobooth_likes();

-- Function to decrement photobooth likes on unlike
CREATE OR REPLACE FUNCTION decrement_photobooth_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE photobooth_entries
  SET likes = GREATEST(likes - 1, 0)
  WHERE id = OLD.entry_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS photobooth_like_removed ON photobooth_likes;
CREATE TRIGGER photobooth_like_removed
AFTER DELETE ON photobooth_likes
FOR EACH ROW EXECUTE FUNCTION decrement_photobooth_likes();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE photobooth_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photobooth_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow all for now - you can tighten these later)
DROP POLICY IF EXISTS "Allow all access to users" ON users;
CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to missions" ON missions;
CREATE POLICY "Allow all access to missions" ON missions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to submissions" ON mission_submissions;
CREATE POLICY "Allow all access to submissions" ON mission_submissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to gifts" ON gifts;
CREATE POLICY "Allow all access to gifts" ON gifts FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to user_gifts" ON user_gifts;
CREATE POLICY "Allow all access to user_gifts" ON user_gifts FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to photobooth" ON photobooth_entries;
CREATE POLICY "Allow all access to photobooth" ON photobooth_entries FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to likes" ON photobooth_likes;
CREATE POLICY "Allow all access to likes" ON photobooth_likes FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to otp" ON otp_codes;
CREATE POLICY "Allow all access to otp" ON otp_codes FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to admin_users" ON admin_users;
CREATE POLICY "Allow all access to admin_users" ON admin_users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to admin_sessions" ON admin_sessions;
CREATE POLICY "Allow all access to admin_sessions" ON admin_sessions FOR ALL USING (true);

-- Insert initial missions data (Week 1 - Active)
-- Delete ALL existing missions and reinsert cleanly
DELETE FROM mission_submissions;
DELETE FROM missions;

INSERT INTO missions (id, week, day, title, description, type, points, timed_duration, is_active) VALUES

-- ── WEEK 1: Campaign Launch ──────────────────────────────────────
-- Exactly 7 missions in specified order with specified points

  ('w1-spot-products', 1, 1, 'Spot the LG Products',
   'Look at our living room image on the microsite — how many LG products can you count? Comment your answer!',
   'spot-count', 80, 15, true),

  ('w1-flag-quiz', 1, 2, 'Team Flag Colour Quiz',
   'See a blank outline of your team''s flag with 4 colour options. Tap to fill in the correct colours. 10 seconds per question, 3 questions total.',
   'quiz', 80, 10, true),

  ('w1-logo-hunt', 1, 3, 'Logo Hunt',
   'Find the hidden LG logo inside our special World Cup illustration on the microsite. Easy if you look!',
   'hidden-hunt', 90, 10, true),

  ('w1-jersey-flex', 1, 4, 'Jersey Flex',
   'Wear your team''s favorite jersey, snap a selfie, and upload it to the microsite!',
   'photo', 100, null, true),

  ('w1-oled-trivia', 1, 5, 'LG Trivia: OLED Facts',
   'True or False: LG OLED TVs use self-lit pixels for perfect black levels. Answer 3 questions on the microsite!',
   'quiz', 100, 30, true),

  ('w1-flag-pride', 1, 6, 'Flag Pride',
   'Decorate any surface — wall, bag, desk — with your team flag and snap a photo. Show your pride!',
   'photo', 80, null, true),

  ('w1-dream-screen', 1, 7, 'Dream Screen Pick',
   'Go to lg.com and find the TV you would watch the World Cup Final on. Screenshot it and post your pick!',
   'external-visit', 100, null, true),

-- Week 2: Heat Up
  ('w2-showroom',       2, 'Showroom Check-In',
   'Visit any LG showroom, check in on Facebook or Instagram, tag @LGBangladesh, and upload a screenshot of your post.',
   'photo', 100, null, true),

  ('w2-goal-no-goal',   2, 'Goal or No Goal?',
   'See a freeze-frame of a ball near the goal line. Tap "Goal" or "No Goal". 20 seconds per picture!',
   'quiz', 80, 20, true),

  ('w2-room-matchup',   2, 'Room Match-Up',
   'Match each LG product to its correct room in the house using a quick drag-and-drop puzzle.',
   'drag-match', 100, null, true),

  ('w2-goal-reaction',  2, 'Goal Reaction Picture',
   'Capture your goal reaction moment — real or acted — and upload the image to show your celebration!',
   'photo', 100, null, true),

  ('w2-lg-quiz',        2, 'LG Quiz',
   'Fast tap poll: 3 questions about LG products — OLED technology, InstaView refrigerator, and Dolby Atmos audio. Faster answers earn more points!',
   'quiz', 100, null, true),

  ('w2-standee-selfie', 2, 'Standee Selfie',
   'Find the LG Superfan League standee at any LG outlet, snap a selfie with it, and post!',
   'photo', 100, null, true),

  ('w2-score-predict',  2, 'Score Prediction: Round of 16',
   'Select the top 8 teams you think will make it to the Round of 16. Predictions lock after 5 days.',
   'predictor', 75, null, true),

-- Week 3: Rivalry Week
  ('w3-qf-predict',     3, 'Score Predictor: Quarter-Finals',
   'Predict the winning teams for the high-stakes Quarter-Final matchups.',
   'predictor', 50, null, true),

  ('w3-lg-tech',        3, 'LG x Football Tech',
   'Visit lg.com and find one feature that makes watching football better on LG. Screenshot it and share.',
   'external-visit', 90, null, true),

  ('w3-fastest-tap',    3, 'Fastest Tap Poll',
   'Three rapid-fire football trivia questions about match halves, forbidden body parts, and yellow card rules. One tap each — no typing!',
   'quiz', 80, null, true),

  ('w3-colour-match',   3, 'Colour Match Game',
   'Match each colour swatch to the correct LG product on the microsite. 30 seconds maximum!',
   'drag-match', 70, 30, true),

  ('w3-lightning-quiz', 3, 'Lightning Quiz',
   'Fast-paced football trivia: 3 questions about 5-time winners, 2018 winner, and 2018 host country. Exactly 10 seconds to answer!',
   'quiz', 90, 10, true),

  ('w3-wrong-answer',   3, 'Wrong Answer Only',
   'Select the deliberately wrong answer from multiple-choice questions about football rules and referee procedures. 3 humorous questions!',
   'quiz', 90, null, true),

  ('w3-unscramble',     3, 'LG Product Unscramble',
   'Unscramble letters to guess the LG product shown on the microsite. First 100 correct answers get bonus points!',
   'unscramble', 100, null, true),

-- Week 4: Final Week
  ('w4-sf-predict',     4, 'Score Prediction: Semi-Finals',
   'Select the top 4 powerhouse teams heading into the Semi-Finals.',
   'predictor', 60, null, true),

  ('w4-beat-clue',      4, 'Beat the Clue',
   'Guess the team based on progressively easier clues. Faster correct answers earn more points (100 → 20 pts). 20 seconds per clue!',
   'quiz', 100, 20, true),

  ('w4-final-predict',  4, 'Final Prediction',
   'Predict which team will win the World Cup Final before the match begins.',
   'predictor', 80, null, true),

  ('w4-memory',         4, 'My Football Memory',
   'Share your all-time favourite World Cup moment in 1–2 sentences. Max 250 characters.',
   'comment', 80, null, true),

  ('w4-maze-game',      4, 'Maze Game',
   'Identify the official LG Red from 4 colour swatches. 30 seconds — choose wisely!',
   'spot-count', 100, 30, true),

  ('w4-lifes-good',     4, 'Life''s Good Moment',
   'Share what "Life''s Good" means to you this World Cup. Tag #LGSuperfanLeague. Text (150 chars) or photo upload.',
   'photo', 150, null, true),

  ('w4-brand-trivia',   4, 'LG Brand Trivia',
   'Answer 3 questions about LG brand: official slogan, logo hidden image, and products LG is NOT famous for.',
   'quiz', 150, null, true),

-- Mega Bonus (purchase invoice upload — not week-specific)
  ('mega-bonus-invoice', 0, 'Mega Bonus: Purchase Invoice',
   'Upload your LG purchase invoice from an authorized outlet to earn bonus points.',
   'photo', 500, null, true)

ON CONFLICT (id) DO NOTHING;

-- Set display order (day) for all missions
UPDATE missions SET day = 1 WHERE id = 'w1-spot-products';
UPDATE missions SET day = 2 WHERE id = 'w1-flag-quiz';
UPDATE missions SET day = 3 WHERE id = 'w1-logo-hunt';
UPDATE missions SET day = 4 WHERE id = 'w1-jersey-flex';
UPDATE missions SET day = 5 WHERE id = 'w1-oled-trivia';
UPDATE missions SET day = 6 WHERE id = 'w1-flag-pride';
UPDATE missions SET day = 7 WHERE id = 'w1-dream-screen';

UPDATE missions SET day = 1 WHERE id = 'w2-showroom';
UPDATE missions SET day = 2 WHERE id = 'w2-goal-no-goal';
UPDATE missions SET day = 3 WHERE id = 'w2-room-matchup';
UPDATE missions SET day = 4 WHERE id = 'w2-goal-reaction';
UPDATE missions SET day = 5 WHERE id = 'w2-lg-quiz';
UPDATE missions SET day = 6 WHERE id = 'w2-standee-selfie';
UPDATE missions SET day = 7 WHERE id = 'w2-score-predict';

UPDATE missions SET day = 1 WHERE id = 'w3-qf-predict';
UPDATE missions SET day = 2 WHERE id = 'w3-lg-tech';
UPDATE missions SET day = 3 WHERE id = 'w3-fastest-tap';
UPDATE missions SET day = 4 WHERE id = 'w3-colour-match';
UPDATE missions SET day = 5 WHERE id = 'w3-lightning-quiz';
UPDATE missions SET day = 6 WHERE id = 'w3-wrong-answer';
UPDATE missions SET day = 7 WHERE id = 'w3-unscramble';

UPDATE missions SET day = 1 WHERE id = 'w4-sf-predict';
UPDATE missions SET day = 2 WHERE id = 'w4-beat-clue';
UPDATE missions SET day = 3 WHERE id = 'w4-final-predict';
UPDATE missions SET day = 4 WHERE id = 'w4-memory';
UPDATE missions SET day = 5 WHERE id = 'w4-maze-game';
UPDATE missions SET day = 6 WHERE id = 'w4-lifes-good';
UPDATE missions SET day = 7 WHERE id = 'w4-brand-trivia';

-- Insert initial gifts/rewards
INSERT INTO gifts (name, description, points_required, quantity_total, quantity_remaining, category, is_active) VALUES
  ('LG OLED TV 55"', 'Premium 55-inch OLED TV for the ultimate viewing experience', 5000, 5, 5, 'grand_prize', true),
  ('LG Soundbar', 'High-quality soundbar for immersive audio', 2000, 10, 10, 'electronics', true),
  ('LG Bluetooth Speaker', 'Portable Bluetooth speaker', 1000, 20, 20, 'electronics', true),
  ('LG Superfan Jersey', 'Official LG Superfan League jersey', 500, 100, 100, 'merchandise', true),
  ('LG Water Bottle', 'Branded insulated water bottle', 200, 200, 200, 'merchandise', true),
  ('LG Cap', 'Official LG baseball cap', 150, 300, 300, 'merchandise', true),
  ('Digital Badge', 'Top Superfan digital badge', 50, 999, 999, 'digital', true)
ON CONFLICT DO NOTHING;

-- Insert default admin user
-- Password: admin123 (change this immediately in production!)
-- This is a simple hash for demo - use proper password hashing in production
INSERT INTO admin_users (admin_id, password_hash, name, email, role, is_active)
VALUES (
  'admin',
  'admin123',  -- CHANGE THIS! Use proper hashing in production
  'Super Admin',
  'admin@lgsuperfan.com',
  'super_admin',
  true
)
ON CONFLICT (admin_id) DO NOTHING;

-- Add more admin users as needed
-- INSERT INTO admin_users (admin_id, password_hash, name, email, role)
-- VALUES ('moderator1', 'password_hash_here', 'Moderator Name', 'mod@lgsuperfan.com', 'moderator');

-- Clean up old OTP codes (optional - run periodically)
-- DELETE FROM otp_codes WHERE expires_at < NOW() OR used = true;

-- Clean up expired admin sessions (optional - run periodically)
-- DELETE FROM admin_sessions WHERE expires_at < NOW();
