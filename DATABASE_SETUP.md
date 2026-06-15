# Database Setup Guide - Supabase Tables

## ✅ Benefits of Using Database Tables (vs Edge Functions)

With database tables, you get:
- ✅ **No Edge Function needed** - Direct database access
- ✅ **Faster performance** - No API roundtrips
- ✅ **Better scalability** - Database handles optimization
- ✅ **Built-in features** - Triggers, indexes, constraints
- ✅ **Easier management** - Direct SQL queries
- ✅ **Real-time subscriptions** - Live updates possible

---

## 📋 Tables Included

### 1. **users** - User Profiles
Stores user accounts, team selection, points, and ranking.

### 2. **missions** - Mission Definitions
All missions with details, status, and rewards.

### 3. **mission_submissions** - User Mission Completions
Tracks which users completed which missions and approval status.

### 4. **gifts** - Rewards Catalog
Available prizes and their point requirements.

### 5. **user_gifts** - Reward Redemptions
Tracks which rewards users have claimed.

### 6. **photobooth_entries** - Photo Gallery
User-uploaded photos with frames and captions.

### 7. **photobooth_likes** - Photo Likes
Tracks which users liked which photos.

### 8. **otp_codes** - Temporary OTP Storage
Stores one-time passwords for authentication.

---

## 🚀 How to Set Up the Database

### Step 1: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Login to your account
3. Select your project: `ldkmmheswiykeueyxpay`

### Step 2: Run the SQL Schema

1. **Navigate to SQL Editor**:
   - In the left sidebar, click **"SQL Editor"**
   - Or go to: Database → SQL Editor

2. **Create New Query**:
   - Click **"+ New Query"** button

3. **Copy the Schema**:
   - Open `/workspaces/default/code/supabase/schema.sql`
   - Copy ALL the contents (it's a long file!)

4. **Paste and Run**:
   - Paste into the SQL Editor
   - Click **"Run"** or press `Ctrl/Cmd + Enter`
   - Wait for execution (may take 10-30 seconds)

5. **Verify Success**:
   - You should see "Success. No rows returned"
   - Check the "Messages" tab for any errors

### Step 3: Verify Tables Were Created

1. **Navigate to Table Editor**:
   - Click **"Table Editor"** in the left sidebar

2. **Check for Tables**:
   You should see these 8 tables:
   - ✅ users
   - ✅ missions
   - ✅ mission_submissions
   - ✅ gifts
   - ✅ user_gifts
   - ✅ photobooth_entries
   - ✅ photobooth_likes
   - ✅ otp_codes

3. **Check Initial Data**:
   - Click on **"missions"** table
   - Should see 7 Week 1 missions already inserted
   - Click on **"gifts"** table
   - Should see 7 rewards already inserted

---

## 🧪 Test the Setup

### Test 1: Check Missions Table
1. Go to Table Editor → missions
2. Filter by: `week` equals `1`
3. Should see 7 missions
4. All should have `is_active` = `true`

### Test 2: Check Gifts Table
1. Go to Table Editor → gifts
2. Should see 7 rewards ranging from 50 to 5000 points
3. All should have `is_active` = `true`

### Test 3: Run a Test Query
In SQL Editor, run:
```sql
SELECT COUNT(*) as total_missions FROM missions WHERE is_active = true;
```
Result should show: `7`

---

## 🔄 What Happens Now

### In Your App:

1. **No More Edge Functions Needed!**
   - Direct database queries from frontend
   - Faster response times
   - No deployment delays

2. **OTP Flow**:
   - OTP generated and stored in `otp_codes` table
   - Console shows generated code
   - User enters code to verify

3. **User Registration**:
   - New user inserted into `users` table
   - Team selection saved
   - Persists forever (until you delete)

4. **Missions**:
   - Loaded from `missions` table
   - Only active missions shown
   - Week 1 already activated

5. **Submissions**:
   - Stored in `mission_submissions` table
   - Status: pending, approved, or rejected
   - Admin can review in admin panel

---

## 📊 Understanding the Schema

### Users Table Structure:
```sql
users (
  id UUID PRIMARY KEY,           -- Auto-generated
  phone VARCHAR(20) UNIQUE,      -- Phone number (login)
  name VARCHAR(100),             -- Optional user name
  team VARCHAR(50),              -- Selected FIFA team
  team_flag VARCHAR(10),         -- Team emoji flag
  points INTEGER DEFAULT 0,      -- Total points earned
  rank INTEGER DEFAULT 999,      -- Leaderboard rank
  created_at TIMESTAMP,          -- When user joined
  updated_at TIMESTAMP           -- Last update
)
```

### Missions Table Structure:
```sql
missions (
  id VARCHAR(50) PRIMARY KEY,    -- e.g., 'w1-standee-selfie'
  week INTEGER,                  -- 1-6
  title VARCHAR(200),            -- Mission name
  description TEXT,              -- Instructions
  type VARCHAR(50),              -- 'photo', 'quiz', etc.
  points INTEGER,                -- Reward amount
  is_active BOOLEAN,             -- If users can access
  timed_duration INTEGER,        -- Optional time limit
  data JSONB,                    -- Extra mission config
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Mission Submissions Table Structure:
```sql
mission_submissions (
  id UUID PRIMARY KEY,           -- Auto-generated
  mission_id VARCHAR(50),        -- Links to missions.id
  user_id UUID,                  -- Links to users.id
  submitted_at TIMESTAMP,        -- When submitted
  data JSONB,                    -- Submission content (photo, answer, etc.)
  status VARCHAR(20),            -- 'pending', 'approved', 'rejected'
  points_awarded INTEGER,        -- Points given (if approved)
  reviewed_at TIMESTAMP,         -- When admin reviewed
  reviewed_by VARCHAR(100),      -- Admin who reviewed
  rejection_reason TEXT          -- Why rejected (if applicable)
)
```

---

## 🔒 Security (Row Level Security)

The schema includes RLS (Row Level Security) policies that:
- Currently allow all access (for development)
- Can be tightened later for production
- Protect against unauthorized access

### To Tighten Security Later:
You can update RLS policies to:
- Users can only see their own data
- Only admins can approve submissions
- Only authenticated users can submit missions

---

## 🛠️ Useful SQL Queries

### Check Active Missions:
```sql
SELECT week, COUNT(*) as count 
FROM missions 
WHERE is_active = true 
GROUP BY week 
ORDER BY week;
```

### View Recent Submissions:
```sql
SELECT u.phone, m.title, s.status, s.submitted_at
FROM mission_submissions s
JOIN users u ON s.user_id = u.id
JOIN missions m ON s.mission_id = m.id
ORDER BY s.submitted_at DESC
LIMIT 10;
```

### Top 10 Leaderboard:
```sql
SELECT phone, team, points, rank
FROM users
ORDER BY points DESC, created_at ASC
LIMIT 10;
```

### Pending Submissions Count:
```sql
SELECT COUNT(*) as pending_count
FROM mission_submissions
WHERE status = 'pending';
```

### Team Distribution:
```sql
SELECT team, COUNT(*) as members, SUM(points) as total_points
FROM users
GROUP BY team
ORDER BY total_points DESC;
```

---

## 📈 Managing Missions

### Activate Week 2 Missions (via SQL):
```sql
UPDATE missions
SET is_active = true
WHERE week = 2;
```

### Add a New Mission (via SQL):
```sql
INSERT INTO missions (id, week, title, description, type, points, is_active)
VALUES (
  'w7-bonus-mission',
  7,
  'Bonus Challenge',
  'Special bonus mission for dedicated fans',
  'photo',
  500,
  true
);
```

### Deactivate All Week 1 Missions:
```sql
UPDATE missions
SET is_active = false
WHERE week = 1;
```

---

## 🎁 Managing Rewards

### Add a New Gift:
```sql
INSERT INTO gifts (name, description, points_required, quantity_total, quantity_remaining, category, is_active)
VALUES (
  'LG Wireless Earbuds',
  'Premium wireless earbuds with noise cancellation',
  1500,
  15,
  15,
  'electronics',
  true
);
```

### Mark Gift as Out of Stock:
```sql
UPDATE gifts
SET quantity_remaining = 0, is_active = false
WHERE name = 'LG OLED TV 55"';
```

---

## 🚨 Troubleshooting

### Error: "relation does not exist"
**Solution**: The table wasn't created. Re-run the schema.sql

### Error: "duplicate key value"
**Solution**: Data already exists. Either:
- Drop tables first: `DROP TABLE IF EXISTS table_name CASCADE;`
- Or use `ON CONFLICT` in your INSERT statements

### No missions showing in app
**Solution**: 
1. Check Table Editor → missions
2. Verify `is_active = true`
3. Check browser console for errors
4. Verify Supabase client connection

### OTP not working
**Solution**:
1. Check browser console for generated OTP
2. Use that exact code
3. Check `otp_codes` table for entries
4. Verify expiration time hasn't passed (5 minutes)

---

## 🔄 Migration from KV Store (if applicable)

If you had data in the KV store before, you'll need to:

1. **Export KV data** (manually)
2. **Transform to SQL INSERT statements**
3. **Import into respective tables**

This is usually not necessary for a fresh start.

---

## ✅ Verification Checklist

After setup, verify:

- [ ] All 8 tables created
- [ ] 7 Week 1 missions in `missions` table
- [ ] 7 rewards in `gifts` table
- [ ] OTP generation working (check console)
- [ ] User registration working (check `users` table)
- [ ] Mission submissions saving (check `mission_submissions` table)
- [ ] No errors in browser console
- [ ] App loads without "demo mode" notice

---

## 📚 Next Steps

1. ✅ **Tables are set up** - Ready to use
2. 🧪 **Test the app** - Create account, submit missions
3. 👨‍💼 **Use admin panel** - Approve submissions
4. 📊 **Monitor tables** - Watch data populate
5. 🚀 **Go live** - Share with users!

---

## 📞 Support

If you run into issues:
- Check Supabase Logs (Logs & Reports section)
- Review browser console for errors
- Verify table structure in Table Editor
- Test with SQL queries in SQL Editor

---

**Database setup complete! No Edge Functions needed.** 🎉
