

# Admin Login - Separate URL with Authentication

## 🎯 Overview

The admin panel now has:
- ✅ **Separate URL**: `/admin` (different from user app)
- ✅ **Login Required**: Admin ID + Password
- ✅ **Session Management**: 24-hour sessions
- ✅ **Database Storage**: Admin credentials in database
- ✅ **Security**: Password verification, session tokens

---

## 🔐 Access Admin Panel

### Admin URL:
```
https://your-app-url.com/admin
```

### Default Credentials:
```
Admin ID: admin
Password: admin123
```

**⚠️ IMPORTANT: Change password immediately in production!**

---

## 📋 Database Tables

### 1. admin_users
Stores admin credentials and info:
```sql
- id: UUID
- admin_id: VARCHAR (unique login ID)
- password_hash: TEXT (password - use proper hashing in production!)
- name: VARCHAR (admin's full name)
- email: VARCHAR
- role: VARCHAR (admin, super_admin, moderator)
- is_active: BOOLEAN
- last_login: TIMESTAMP
```

### 2. admin_sessions
Tracks active login sessions:
```sql
- id: UUID
- admin_id: UUID (references admin_users)
- session_token: VARCHAR (unique session token)
- expires_at: TIMESTAMP (24 hours)
```

---

## 🚀 Setup Instructions

### Step 1: Update Database Schema

Run the updated `schema.sql` which includes:
- admin_users table
- admin_sessions table
- Default admin user (admin/admin123)

**In Supabase SQL Editor:**
1. Open `/workspaces/default/code/supabase/schema.sql`
2. Copy ALL contents
3. Paste and Run

This creates:
- ✅ Admin users table
- ✅ Admin sessions table
- ✅ Default admin user

### Step 2: Verify Admin User Created

**Check in Table Editor:**
1. Navigate to Table Editor
2. Open `admin_users` table
3. Should see 1 row:
   - admin_id: `admin`
   - password_hash: `admin123` (plain text for demo)
   - name: `Super Admin`
   - role: `super_admin`
   - is_active: `true`

---

## 🎮 How to Use

### Login Flow:

1. **Open Admin URL**
   ```
   https://your-app-url.com/admin
   ```

2. **Enter Credentials**
   - Admin ID: `admin`
   - Password: `admin123`

3. **Click Login**
   - Validates credentials against database
   - Creates 24-hour session
   - Redirects to admin panel

4. **Use Admin Panel**
   - Manage missions
   - Approve submissions
   - View analytics
   - All admin features available

5. **Logout**
   - Click "Logout" button (top-right)
   - Session deleted
   - Redirected to login page

### Session Management:

- **Duration**: 24 hours
- **Storage**: localStorage + database
- **Auto-check**: Verifies session on page load
- **Expiry**: Auto-logout after 24 hours

---

## 👥 Adding More Admins

### Via SQL:

```sql
INSERT INTO admin_users (admin_id, password_hash, name, email, role, is_active)
VALUES (
  'moderator1',           -- Login ID
  'secure_password',      -- Password (use proper hashing!)
  'Moderator Name',       -- Full name
  'mod@lgsuperfan.com',  -- Email
  'moderator',            -- Role
  true                    -- Is active
);
```

### Via Table Editor:

1. Go to Table Editor → admin_users
2. Click "Insert row"
3. Fill in:
   - admin_id: `newadmin`
   - password_hash: `password123`
   - name: `New Admin Name`
   - email: `email@example.com`
   - role: `admin`
   - is_active: `true`
4. Click Save

---

## 🔐 Security Features

### Current (Demo):
- ✅ Separate admin login page
- ✅ Database credential verification
- ✅ Session tokens
- ✅ Session expiry (24 hours)
- ✅ Active/inactive admin status
- ⚠️ Plain text passwords (for demo only!)

### For Production (Required):

1. **Password Hashing**
   ```sql
   -- Use bcrypt or similar
   -- Example with pgcrypto extension:
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   
   -- Hash password on insert:
   INSERT INTO admin_users (admin_id, password_hash, name)
   VALUES ('admin', crypt('password', gen_salt('bf')), 'Admin Name');
   
   -- Verify password:
   SELECT * FROM admin_users 
   WHERE admin_id = 'admin' 
   AND password_hash = crypt('input_password', password_hash);
   ```

2. **HTTPS Only**
   - Never send credentials over HTTP
   - Enforce HTTPS in production

3. **Rate Limiting**
   - Limit login attempts
   - Lock account after X failed attempts
   - Add CAPTCHA

4. **Session Security**
   - Use cryptographically secure tokens
   - Implement CSRF protection
   - Secure cookie flags

5. **Audit Logging**
   - Log all admin actions
   - Track who changed what
   - Monitor suspicious activity

---

## 🎨 Admin Login Page Features

### Visual Design:
- Purple gradient background (LG brand)
- Shield icon (admin identity)
- Clean, professional form
- Error messages with icons
- Loading states

### UX Features:
- Auto-focus on Admin ID field
- Clear error messages
- Default credentials shown (for demo)
- "Back to User App" link
- Disabled inputs while loading

### Security UX:
- Password field (hidden input)
- Clear error messages (no hints)
- Session persistence
- Auto-logout on expiry

---

## 📊 Admin Roles

### super_admin (Full Access):
- ✅ All mission CRUD operations
- ✅ Approve/reject submissions
- ✅ View all analytics
- ✅ Manage other admins
- ✅ System settings

### admin (Standard Access):
- ✅ Mission CRUD operations
- ✅ Approve/reject submissions
- ✅ View analytics
- ❌ Cannot manage other admins

### moderator (Limited Access):
- ✅ Approve/reject submissions
- ✅ View analytics
- ❌ Cannot create/edit missions
- ❌ Cannot manage admins

---

## 🔄 Session Flow

```
┌─────────────────────────────────────┐
│ 1. Admin enters credentials         │
│    ↓                                 │
│ 2. Check admin_users table           │
│    ↓                                 │
│ 3. Verify admin_id + password        │
│    ↓                                 │
│ 4. Create session token              │
│    ↓                                 │
│ 5. Store in admin_sessions table     │
│    ↓                                 │
│ 6. Store token in localStorage       │
│    ↓                                 │
│ 7. Update last_login timestamp       │
│    ↓                                 │
│ 8. Redirect to admin panel           │
└─────────────────────────────────────┘

On page load:
┌─────────────────────────────────────┐
│ 1. Check localStorage for token      │
│    ↓                                 │
│ 2. Verify token in admin_sessions    │
│    ↓                                 │
│ 3. Check expiry date                 │
│    ↓                                 │
│ 4. If valid → Show admin panel       │
│ 5. If invalid → Show login page      │
└─────────────────────────────────────┘
```

---

## 🚨 Troubleshooting

### Can't login with default credentials:
1. Check admin_users table exists
2. Verify default admin was created
3. Check admin_id and password_hash match
4. Ensure is_active = true
5. Check browser console for errors

### Session not persisting:
1. Check localStorage in browser DevTools
2. Verify admin_sessions table has entry
3. Check session expiry date
4. Clear localStorage and login again

### "Invalid Admin ID or Password":
1. Double-check spelling
2. Check is_active = true in database
3. Verify password exactly matches
4. Check admin_users table in Supabase

### Admin panel shows login again:
1. Session expired (24 hours)
2. localStorage cleared
3. Session deleted from database
4. Admin deactivated

---

## 📱 URLs Summary

### User App:
```
https://your-app-url.com/
```
- Phone + OTP login
- Name + Team selection
- Missions, Leaderboard, Photobooth
- Public access

### Admin Panel:
```
https://your-app-url.com/admin
```
- Admin ID + Password login
- Mission management
- Submission approval
- Analytics
- Restricted access

---

## 📋 Files Created/Updated

### New Files:
- ✅ `src/app/AdminApp.tsx` - Admin app wrapper
- ✅ `src/app/components/AdminLogin.tsx` - Login page
- ✅ `src/app/MainApp.tsx` - Main user app (separated for routing)
- ✅ `ADMIN_LOGIN_SETUP.md` - This documentation

### Updated Files:
- ✅ `supabase/schema.sql` - Added admin tables
- ✅ `src/app/components/AdminPanel.tsx` - Added logout
- ✅ `src/app/App.tsx` - Now uses react-router for URL routing
- ✅ `src/app/components/AdminButton.tsx` - Links to /admin route
- ✅ `src/app/components/AdminLogin.tsx` - Links back to / route

### Database:
- ✅ admin_users table
- ✅ admin_sessions table
- ✅ Default admin user created

---

## ✅ Verification Checklist

After setup:
- [ ] admin_users table exists
- [ ] admin_sessions table exists
- [ ] Default admin user created (admin/admin123)
- [ ] Can access /admin URL
- [ ] Can login with default credentials
- [ ] Session persists on refresh
- [ ] Logout works
- [ ] Admin panel loads after login

---

## 🎯 Summary

**Before:**
- Hash-based admin access (#admin)
- No authentication
- No separate page

**Now:**
- Separate URL route (/admin)
- Login required (Admin ID + Password)
- Session management (24 hours)
- Database-backed authentication
- Role-based access
- Logout functionality
- React Router for clean URL routing

**Default Access:**
```
URL: https://your-app-url.com/admin
Admin ID: admin
Password: admin123
```

**Next Steps:**
1. Run updated schema.sql
2. Access /admin
3. Login with default credentials
4. Change password for production!

---

**Professional admin authentication is now live!** 🛡️
