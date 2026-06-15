# Name Feature Update - Unique User Names

## ✅ What Changed

### Database Updates:
- ✅ `name` field is now **REQUIRED** (NOT NULL)
- ✅ `name` field is now **UNIQUE** (no duplicates)
- ✅ Added index on `name` for fast lookups
- ✅ Name length: 3-100 characters
- ✅ Allowed characters: letters, numbers, spaces

### UI Updates:
- ✅ New **Name Input** screen after OTP verification
- ✅ Real-time name availability checking
- ✅ Visual feedback (✓ available, ✗ taken)
- ✅ Validation and error messages
- ✅ User names shown on leaderboard

---

## 🚀 New Registration Flow

### Before:
```
1. Phone Input
2. OTP Verification
3. Team Selection
4. Dashboard
```

### Now:
```
1. Phone Input
2. OTP Verification
3. Name Input ← NEW!
4. Team Selection
5. Dashboard
```

---

## 📝 Name Input Rules

### Requirements:
- ✅ Minimum 3 characters
- ✅ Maximum 100 characters
- ✅ Must be unique across all users
- ✅ Only letters, numbers, and spaces
- ✅ No special characters (auto-filtered)

### Examples:
✅ `RahulTheSuperfan`  
✅ `Priya123`  
✅ `LG Fan BD`  
❌ `ab` (too short)  
❌ `User@123` (no special chars)  
❌ `RahulTheSuperfan` (if already taken)  

---

## 🎨 Name Input Screen Features

### Real-time Validation:
- **While typing**: Shows character count
- **After 3 chars**: Checks database for availability
- **Available**: Green checkmark ✓
- **Taken**: Red X + error message
- **Checking**: Loading spinner

### Visual Feedback:
```
┌─────────────────────────────┐
│  Your Name                  │
│  ┌───────────────────────┐  │
│  │ RahulTheSuperfan    ✓ │  │ ← Green check if available
│  └───────────────────────┘  │
│  ✓ Name is available!       │
└─────────────────────────────┘

┌─────────────────────────────┐
│  Your Name                  │
│  ┌───────────────────────┐  │
│  │ ExistingUser        ✗ │  │ ← Red X if taken
│  └───────────────────────┘  │
│  ✗ This name is already taken
└─────────────────────────────┘
```

---

## 🔧 How to Update Your Database

### Option 1: Fresh Start (Recommended)

If you haven't created tables yet, just run the updated `schema.sql`:

```sql
-- The updated schema.sql already has:
name VARCHAR(100) UNIQUE NOT NULL
```

Run in Supabase SQL Editor:
1. Open `/workspaces/default/code/supabase/schema.sql`
2. Copy all contents
3. Paste and run

### Option 2: Update Existing Tables

If you already ran the old schema, run this update script:

```sql
-- File: SCHEMA_UPDATE_NAME.sql

-- 1. Update any existing NULL names
UPDATE users SET name = 'User_' || SUBSTRING(phone FROM 8) WHERE name IS NULL OR name = '';

-- 2. Make name NOT NULL
ALTER TABLE users ALTER COLUMN name SET NOT NULL;

-- 3. Add UNIQUE constraint
ALTER TABLE users ADD CONSTRAINT users_name_unique UNIQUE (name);

-- 4. Add index
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
```

Run in Supabase SQL Editor:
1. Copy from `/workspaces/default/code/SCHEMA_UPDATE_NAME.sql`
2. Paste and run

---

## 🧪 Testing the Name Feature

### Test 1: Create First User
1. Go through phone + OTP
2. Enter name: `TestUser1`
3. Should see: ✓ Name is available!
4. Continue to team selection
5. Check Table Editor → users → should see name `TestUser1`

### Test 2: Duplicate Name
1. Start registration with new phone
2. Complete phone + OTP
3. Enter same name: `TestUser1`
4. Should see: ✗ This name is already taken
5. Change to: `TestUser2`
6. Should see: ✓ Name is available!

### Test 3: Leaderboard Display
1. Complete registration for 2-3 users
2. Go to Dashboard → Leaderboard
3. Names should show instead of phone numbers
4. Each name should be unique

---

## 📊 Updated Database Schema

### Users Table (Updated):
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) UNIQUE NOT NULL,  ← NOW REQUIRED & UNIQUE
  team VARCHAR(50) NOT NULL,
  team_flag VARCHAR(10) NOT NULL,
  points INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 999,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Constraints:
- ✅ `users_phone_key` - Phone must be unique
- ✅ `users_name_unique` - Name must be unique ← NEW
- ✅ `users_pkey` - Primary key on id

### Indexes:
- ✅ `idx_users_phone` - Fast phone lookup
- ✅ `idx_users_name` - Fast name lookup ← NEW
- ✅ `idx_users_team` - Team grouping
- ✅ `idx_users_points` - Leaderboard sorting

---

## 🎮 User Experience Flow

### New User:
```
1. Enter phone: 01712345678
2. Receive OTP: 1234 (from console)
3. Enter OTP: 1234
4. NEW: Choose name screen appears
5. Type name: "RahulSuperfan"
6. See real-time check: ✓ Available
7. Click Continue
8. Select team: Argentina
9. Dashboard loads with name: "RahulSuperfan"
```

### Returning User:
```
1. Enter phone: 01712345678
2. Receive OTP: 5678
3. Enter OTP: 5678
4. Name input SKIPPED (already has name)
5. Dashboard loads immediately
```

---

## 💡 Name Availability Checking

### How It Works:
```typescript
// Real-time checking (debounced 500ms)
const checkNameAvailability = async (name) => {
  const { data } = await supabase
    .from('users')
    .select('name')
    .eq('name', name)
    .single();
  
  if (data exists) {
    return "Name taken ✗"
  } else {
    return "Name available ✓"
  }
}
```

### Visual States:
1. **Empty**: No indicator
2. **< 3 chars**: "X more characters"
3. **Checking**: Loading spinner
4. **Available**: Green ✓ + "Name is available!"
5. **Taken**: Red ✗ + "This name is already taken"

---

## 🔒 Security & Validation

### Client-side:
- ✅ Sanitize input (remove special chars)
- ✅ Length validation (3-100)
- ✅ Real-time uniqueness check
- ✅ Debounced queries (not spamming DB)

### Database-side:
- ✅ UNIQUE constraint (prevents duplicates)
- ✅ NOT NULL constraint (requires value)
- ✅ Type validation (VARCHAR 100)

### Error Handling:
- If name taken during submission → Error message
- If network fails → Allows retry
- If duplicate constraint violated → Shows helpful message

---

## 📱 Mobile Optimization

### Input Field:
- Large text (text-lg)
- Clear labels
- Real-time feedback
- Auto-focus on load
- Mobile keyboard optimized

### Validation Messages:
- Positioned below input
- Color-coded (green/red)
- Icons for clarity
- Brief and clear

---

## 🎯 Leaderboard Display

### Before:
```
1. You (01712345678)
2. User (01723456789)
3. User (01734567890)
```

### After:
```
1. RahulSuperfan (🇦🇷 Argentina)
2. PriyaBrazilFan (🇧🇷 Brazil)
3. LGChampion99 (🇩🇪 Germany)
```

Much more engaging and personalized!

---

## 🚨 Troubleshooting

### Issue: "Name already taken" but I can't see who has it
**Solution**: Name is truly taken. Try variations:
- Add numbers: `Rahul` → `Rahul123`
- Add team: `Rahul` → `RahulArgentina`
- Add title: `Rahul` → `RahulSuperfan`

### Issue: Can't submit name
**Check**:
- Name is at least 3 characters?
- Green checkmark showing?
- No special characters?
- Internet connected?

### Issue: Name check not working
**Solution**:
- Wait 500ms after typing
- Check browser console for errors
- Verify Supabase connection
- Try a different name

---

## 📋 Files Updated

### New Files:
- ✅ `src/app/components/NameInput.tsx` - Name input screen
- ✅ `SCHEMA_UPDATE_NAME.sql` - Update script
- ✅ `NAME_FEATURE_UPDATE.md` - This documentation

### Updated Files:
- ✅ `supabase/schema.sql` - UNIQUE constraint on name
- ✅ `src/app/App.tsx` - Added name-input state
- ✅ `src/app/components/Dashboard.tsx` - Shows user name
- ✅ `src/app/components/LeaderboardView.tsx` - Uses names

---

## ✅ Verification Checklist

After update, verify:

- [ ] Database schema updated (name is UNIQUE NOT NULL)
- [ ] Name input screen appears after OTP
- [ ] Real-time availability check works
- [ ] Can't submit duplicate name
- [ ] User name saves to database
- [ ] Name appears on leaderboard
- [ ] Name appears in dashboard
- [ ] Returning users skip name input

---

## 🎉 Summary

**What Changed**:
- Name is now required and unique
- New screen to collect name
- Real-time duplicate checking
- Better leaderboard experience

**Benefits**:
- More personalized experience
- Users can be recognized
- Better community feeling
- Professional leaderboard

**Time to Update**:
- Fresh install: 0 minutes (included in schema.sql)
- Existing database: 1 minute (run update script)

---

**Names make the competition personal!** 🏆
