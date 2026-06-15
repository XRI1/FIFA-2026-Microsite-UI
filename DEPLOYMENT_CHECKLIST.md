# Deployment Checklist

## ✅ Pre-Deployment (Already Done)

- [x] Week 1 missions activated (7 missions, 900 points)
- [x] Backend code ready (`/supabase/functions/server/index.tsx`)
- [x] Frontend integrated with Supabase
- [x] Demo mode implemented as fallback
- [x] Error handling in place

---

## 📤 Deployment Steps (You Must Do)

### 1. Deploy Supabase Edge Function

**From Make Settings:**
1. Click ⚙️ Settings icon
2. Go to "Supabase" tab
3. Click "Deploy Edge Function" button
4. Wait 30-60 seconds for deployment
5. Look for success confirmation

**What Gets Deployed:**
- `/supabase/functions/server/index.tsx`
- All API routes:
  - `/send-otp` - OTP generation
  - `/verify-otp` - OTP validation
  - `/select-team` - Team selection
  - `/submit-mission` - Mission submissions
  - `/leaderboard/*` - Rankings
  - `/admin/*` - Admin operations

---

## ✅ Post-Deployment Verification

### 2. Test Backend Connection

**A. Health Check**
Open browser console and run:
```javascript
fetch('https://ldkmmheswiykeueyxpay.supabase.co/functions/v1/make-server-53581c36/health')
  .then(r => r.json())
  .then(console.log)
```

Expected result: `{ status: "ok" }`

**B. OTP Flow**
1. Refresh the app
2. Enter phone: `01712345678`
3. Click "Send OTP"
4. Open Supabase Dashboard → Edge Functions → Logs
5. Look for: `OTP generated for 01712345678: XXXX`
6. Enter that 4-digit code
7. Should proceed to team selection ✅

**C. Team Selection**
1. Select any team
2. Check Supabase Dashboard → Database → KV Store
3. Look for key: `user:01712345678`
4. Should contain user profile ✅

**D. Mission Submission**
1. Complete a mission in the app
2. Check KV Store for key: `submission:01712345678:w1-standee-selfie`
3. Should show submission data ✅

---

## 🎮 Week 1 Missions Status

All 7 missions are ACTIVE and ready:

| Mission | Type | Points | Status |
|---------|------|--------|--------|
| Standee Selfie | Photo | 100 | ✅ Active |
| Match Night Setup | Photo | 100 | ✅ Active |
| Spot the LG Product | Spot & Count | 150 | ✅ Active |
| Team Flag Color Quiz | Drag & Match | 200 | ✅ Active |
| LG Trivia: FIFA Bond | Quiz | 150 | ✅ Active |
| Flag Pride | Comment | 100 | ✅ Active |
| Dream Screen Pick | Quiz | 100 | ✅ Active |

**Total: 900 points available**

---

## 🔍 Troubleshooting

### Issue: "Demo Mode" notice still showing
**Cause**: Backend not deployed or deployment failed  
**Fix**: 
- Check Make settings for deployment status
- Look for error messages
- Try deploying again
- Check Supabase dashboard for function status

### Issue: OTP not generating
**Cause**: Edge Function not running  
**Fix**:
- Check Supabase → Edge Functions → Logs
- Look for error messages
- Verify function is deployed
- Check CORS settings (already configured)

### Issue: Data not saving
**Cause**: KV Store permissions or Edge Function error  
**Fix**:
- Check Supabase logs for errors
- Verify service role key is set
- Check browser console for API errors

---

## 📊 Admin Panel Access

### View Active Missions
1. Navigate to: `your-app-url#admin`
2. Click "Missions" tab
3. Should see all Week 1 missions with "Active" badge

### Review Submissions
1. In admin panel, click "Submissions" tab
2. Filter by "Pending"
3. Click "Approve" to award points
4. Points automatically added to user total

---

## 🔐 Supabase Dashboard Access

### View Logs
1. Go to: https://supabase.com/dashboard
2. Select project: `ldkmmheswiykeueyxpay`
3. Navigate to: Edge Functions → Server Logs
4. Monitor for:
   - OTP generation logs
   - User registrations
   - Mission submissions
   - Errors

### View Database
1. Same dashboard
2. Navigate to: Database → KV Store
3. Search for keys:
   - `otp:*` - Temporary OTP codes
   - `user:*` - User profiles
   - `submission:*` - Mission submissions
   - `team:*:count` - Team member counts

---

## 📱 Mobile Testing

After deployment, test on:
- [ ] iOS Safari
- [ ] Chrome Mobile (Android)
- [ ] Different screen sizes
- [ ] Portrait and landscape modes

---

## 🚀 Go Live Checklist

Before announcing to users:

- [ ] Backend deployed successfully
- [ ] OTP flow tested end-to-end
- [ ] Week 1 missions confirmed active
- [ ] Admin panel accessible
- [ ] Mission submission works
- [ ] Leaderboard updates correctly
- [ ] Mobile devices tested
- [ ] Error tracking set up (optional)

---

## 📞 Support Resources

If you need help:
- **Make Support**: Contact Make support team
- **Supabase Docs**: https://supabase.com/docs/guides/functions
- **This Project**: Check `README.md`, `ADMIN_GUIDE.md`, `DEPLOYMENT_GUIDE.md`

---

## ⏭️ Next Steps After Deployment

1. **Week 1 Launch**
   - Announce campaign start
   - Share app URL with users
   - Monitor initial submissions

2. **Daily Monitoring**
   - Review pending submissions (target: < 24 hours)
   - Check Supabase logs for errors
   - Monitor user engagement

3. **Weekly Schedule**
   - **Week 2**: Activate Week 2 missions (via admin panel)
   - **Week 3-6**: Activate as campaign progresses
   - Announce weekly leaderboard winners

---

**Current Status**: ⏳ Waiting for Edge Function deployment

**Once deployed**: ✅ All systems ready for launch!
