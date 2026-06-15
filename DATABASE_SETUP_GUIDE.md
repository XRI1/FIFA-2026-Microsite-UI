# Database Setup Guide - LG Superfan League

## Quick Setup

The database schema is now **idempotent** - you can run it multiple times without errors!

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy & Run Schema
1. Open `supabase/schema.sql`
2. Copy **ALL** contents
3. Paste into Supabase SQL Editor
4. Click **RUN** (bottom right)

### Step 3: Verify Tables Created
Go to **Table Editor** and verify you see:
- ✅ users
- ✅ missions (with 42 missions across 6 weeks)
- ✅ mission_submissions
- ✅ gifts (7 rewards)
- ✅ user_gifts
- ✅ photobooth_entries
- ✅ photobooth_likes
- ✅ otp_codes
- ✅ admin_users (1 default admin)
- ✅ admin_sessions

---

## What's Different Now?

### ✅ Safe for All Users
The schema now handles existing database objects gracefully:

**Before:**
```sql
CREATE TRIGGER update_users_updated_at...
-- ERROR: trigger already exists
```

**Now:**
```sql
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at...
-- ✓ Works every time!
```

### Changes Made:

1. **Tables**: Use `CREATE TABLE IF NOT EXISTS`
2. **Triggers**: Drop existing triggers before creating (`DROP TRIGGER IF EXISTS`)
3. **Policies**: Drop existing policies before creating (`DROP POLICY IF EXISTS`)
4. **Functions**: Use `CREATE OR REPLACE FUNCTION`
5. **Data Inserts**: Use `ON CONFLICT DO NOTHING` to avoid duplicates

---

## Database Contents After Setup

### Users Table
- Empty initially
- Users created when they register via phone + OTP

### Missions Table (42 missions)
- **Week 1**: 7 missions (900 points)
- **Week 2**: 7 missions (1,000 points)
- **Week 3**: 7 missions (1,150 points)
- **Week 4**: 7 missions (1,150 points)
- **Week 5**: 7 missions (1,250 points)
- **Week 6**: 7 missions (1,350 points)

**All weeks are active by default** (is_active = true)

### Gifts Table (7 rewards)
1. LG OLED TV 55" - 5,000 points
2. LG Soundbar - 2,000 points
3. LG Bluetooth Speaker - 1,000 points
4. LG Superfan Jersey - 500 points
5. LG Water Bottle - 200 points
6. LG Cap - 150 points
7. Digital Badge - 50 points

### Admin Users Table
**Default Admin:**
- Admin ID: `admin`
- Password: `admin123`
- Role: `super_admin`
- Status: Active

⚠️ **IMPORTANT**: Change the default password in production!

---

## Updating the Database

If you need to add new missions or make changes:

1. **Edit** `supabase/schema.sql`
2. **Run the entire file again** in SQL Editor
3. Existing data won't be duplicated (thanks to `ON CONFLICT DO NOTHING`)
4. New missions will be added
5. Triggers and policies will be refreshed

---

## Troubleshooting

### "relation does not exist" Error
- Make sure you've enabled the RLS policies
- Verify tables were created in the correct schema (public)

### "permission denied" Error
- Check that RLS is enabled
- Verify the "Allow all access" policies exist

### Duplicate Key Errors
- This should NOT happen with the new schema
- If it does, check that `ON CONFLICT DO NOTHING` is present in INSERT statements

### Missing Missions
1. Check the `missions` table in Table Editor
2. Verify `is_active = true` for the weeks you want visible
3. Re-run the schema if missions are missing

---

## Production Checklist

Before going live:

- [ ] Change admin password from `admin123`
- [ ] Review RLS policies (currently set to "allow all")
- [ ] Set up proper password hashing for admin_users
- [ ] Configure OTP SMS provider
- [ ] Set mission `is_active` based on campaign schedule
- [ ] Test user registration flow
- [ ] Test mission submission flow
- [ ] Test admin approval flow

---

## Schema Version
- **Last Updated**: June 8, 2026
- **Version**: 2.0 (Idempotent)
- **Total Missions**: 42
- **Total Rewards**: 7

---

**The database is ready! Run the schema and start building!** 🚀
