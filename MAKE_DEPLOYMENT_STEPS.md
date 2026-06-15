# Make Settings - Deployment Steps

## 🎯 What You Need to Do

I cannot directly access Make's UI settings, so you need to manually deploy the Supabase Edge Function. Here's exactly what to look for:

---

## 📍 Finding Make Settings

Look for one of these in the Make interface:

### Option 1: Settings Icon
- Look for a ⚙️ gear/cog icon
- Usually in the top-right corner
- Or in a sidebar menu

### Option 2: Menu
- Click hamburger menu (≡)
- Look for "Settings" option
- Or "Project Settings"

### Option 3: Bottom Bar
- Check the bottom toolbar
- Look for "Settings" or "Configure"

---

## 📤 Deploying Supabase Edge Function

### Once in Settings:

1. **Find Supabase Section**
   - Look for tabs or sections labeled:
     - "Supabase"
     - "Backend"
     - "Database"
     - "Functions"

2. **Look for Deploy Button**
   The button might say:
   - 🚀 "Deploy Edge Function"
   - 📤 "Deploy Server"
   - ▶️ "Deploy Backend"
   - 🔄 "Deploy Functions"

3. **Click to Deploy**
   - Single click should start deployment
   - You'll see a progress indicator
   - Wait 30-60 seconds

4. **Success Confirmation**
   - Look for a success message
   - Might say "Deployment successful"
   - Or show a green checkmark ✅

---

## ✅ What Gets Deployed

When you click deploy, Make will upload:

```
/supabase/functions/server/index.tsx
```

This contains all the API routes:
- `/send-otp` - Generate OTP codes
- `/verify-otp` - Validate OTP
- `/select-team` - Save team choice
- `/submit-mission` - Submit missions
- `/leaderboard/individual` - User rankings
- `/leaderboard/team` - Team rankings
- `/admin/review-submission` - Approve/reject

---

## 🧪 Test Deployment Success

### Method 1: Check Demo Mode Notice
1. Refresh your app
2. If deployment succeeded, the yellow "Demo Mode" banner should **disappear**
3. If it's still there, deployment may have failed

### Method 2: Browser Console Test
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this command:

```javascript
fetch('https://ldkmmheswiykeueyxpay.supabase.co/functions/v1/make-server-53581c36/health')
  .then(r => r.json())
  .then(d => console.log('Backend status:', d))
  .catch(e => console.log('Backend not deployed:', e))
```

**Expected result if deployed**: 
```json
Backend status: { status: "ok" }
```

**Expected result if NOT deployed**:
```
Backend not deployed: TypeError: Failed to fetch
```

### Method 3: Test OTP Flow
1. Enter a phone number in the app
2. Click "Send OTP"
3. Open browser console
4. Look for one of these messages:
   - ✅ "OTP sent successfully" → Deployed!
   - ❌ "Backend not available, using demo mode" → Not deployed

### Method 4: Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Login to your account
3. Select project: `ldkmmheswiykeueyxpay`
4. Navigate to: **Edge Functions**
5. Look for function named: `make-server-53581c36` or `server`
6. Check status: Should show "Active" or "Deployed"

---

## 🔧 Troubleshooting Deployment

### Can't Find Settings
- Try right-clicking in the Make workspace
- Look for keyboard shortcuts (might be Cmd/Ctrl+,)
- Check Make documentation
- Contact Make support

### Deploy Button Grayed Out
- You might not have permission
- Check if you're the project owner
- Try refreshing the Make interface

### Deployment Fails
- Check for error messages
- Look at Supabase dashboard for errors
- Verify Supabase project is active
- Try deploying again

### Deployment Takes Too Long (>5 min)
- Refresh the Make interface
- Check Supabase dashboard manually
- Try deploying again
- Contact Make support

---

## 📊 After Successful Deployment

### What Changes:
1. ✅ Demo mode banner disappears
2. ✅ Real OTP codes generated (check Supabase logs)
3. ✅ Data saves to Supabase KV Store
4. ✅ Mission submissions persist
5. ✅ Leaderboards update with real data
6. ✅ Admin panel can approve submissions

### What to Do Next:
1. **Test OTP Flow**
   - Enter phone number
   - Check Supabase logs for OTP
   - Enter the OTP
   - Verify team selection saves

2. **Test Mission Submission**
   - Complete a mission
   - Check admin panel for submission
   - Approve it
   - Verify points awarded

3. **Monitor for Errors**
   - Keep Supabase logs open
   - Watch for any error messages
   - Check browser console

4. **Announce Launch**
   - Share app URL with users
   - Week 1 missions are ready!

---

## 📋 Quick Reference

**Your Supabase Project ID**: `ldkmmheswiykeueyxpay`

**Health Check URL**:
```
https://ldkmmheswiykeueyxpay.supabase.co/functions/v1/make-server-53581c36/health
```

**Supabase Dashboard**:
```
https://supabase.com/dashboard/project/ldkmmheswiykeueyxpay
```

**Admin Panel**:
```
your-app-url#admin
```

---

## 🆘 Need Help?

If you're stuck:

1. **Check Make Documentation**
   - Look for "Supabase" or "Deploy" guides
   - Search for "Edge Functions"

2. **Contact Make Support**
   - Explain you need to deploy Supabase Edge Function
   - Provide project details

3. **Check This Project**
   - `DEPLOYMENT_GUIDE.md` - Full guide
   - `README.md` - Overview
   - `ADMIN_GUIDE.md` - Admin instructions

---

## ✅ Summary

**What you need to do:**
1. Open Make Settings (⚙️)
2. Find Supabase section
3. Click "Deploy Edge Function" button
4. Wait 30-60 seconds
5. Verify deployment (refresh app, check for demo mode banner)

**What happens automatically:**
- Backend code uploads to Supabase
- API endpoints become active
- App switches from demo mode to live mode
- Week 1 missions already active (no action needed)

**Time required:** ~2 minutes total

---

**Current Status**: 
- ✅ Code ready
- ✅ Week 1 missions active
- ⏳ Waiting for you to click Deploy in Make settings
- 🎯 Then ready to launch!
