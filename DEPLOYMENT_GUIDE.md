# Deployment Guide - LG Superfan League

## Current Status

✅ **Frontend**: Fully functional in demo mode  
⏳ **Backend**: Not deployed yet (using mock data)

---

## How to Deploy the Backend

### Step 1: Deploy Supabase Edge Function

The app is currently running in **demo mode** because the Supabase Edge Function hasn't been deployed yet.

To deploy the backend:

1. **Open Make Settings**
   - Click the settings icon in the Make interface
   - Navigate to the "Supabase" section

2. **Deploy Edge Function**
   - Click "Deploy Edge Function" or "Deploy Server"
   - Wait for deployment to complete (usually 30-60 seconds)

3. **Verify Deployment**
   - The app will automatically connect to the backend
   - The demo mode notice will disappear
   - Check browser console for "OTP sent successfully" messages

### Step 2: Test Backend Connection

After deployment, test these features:

1. **OTP Flow**
   - Enter a phone number
   - Check Supabase logs for generated OTP code
   - Enter the OTP to verify

2. **Team Selection**
   - Select a team
   - Verify user data is saved in Supabase KV store

3. **Mission Submission**
   - Complete a mission
   - Check admin panel for pending submissions

---

## Demo Mode Features

While the backend is not deployed, the app works in demo mode:

### What Works:
✅ All UI screens and navigation  
✅ Phone number input  
✅ OTP verification (accepts any 4-digit code)  
✅ Team selection  
✅ Dashboard and mission browsing  
✅ Mission modals (all types)  
✅ Leaderboard display (mock data)  
✅ Photobooth UI  
✅ Admin panel UI  

### What Doesn't Work:
❌ Real OTP generation and SMS  
❌ Data persistence (refreshing loses data)  
❌ Mission submission approval  
❌ Real-time leaderboard updates  
❌ Cross-device data sync  

---

## Deployment Checklist

### Pre-Deployment
- [ ] Review admin panel features
- [ ] Test all mission types
- [ ] Verify LG branding is correct
- [ ] Check responsive design on mobile

### Deployment
- [ ] Deploy Supabase Edge Function from Make settings
- [ ] Verify health check endpoint: `https://{projectId}.supabase.co/functions/v1/make-server-53581c36/health`
- [ ] Test OTP flow end-to-end
- [ ] Confirm data saves to Supabase KV store

### Post-Deployment
- [ ] Activate Week 1 missions in admin panel
- [ ] Test mission submission and approval
- [ ] Monitor Supabase logs for errors
- [ ] Set up error tracking (if needed)

---

## Monitoring Backend

### View Logs
1. Go to Supabase Dashboard
2. Navigate to Edge Functions → Server Logs
3. Monitor for:
   - OTP generation logs
   - User registration
   - Mission submissions
   - Error messages

### Check Database
1. Go to Supabase Dashboard
2. Navigate to Database → KV Store
3. Look for keys like:
   - `otp:{phone}` - Temporary OTP codes
   - `user:{phone}` - User profiles
   - `submission:{phone}:{missionId}` - Mission submissions

---

## Troubleshooting

### "Network Error" messages
**Cause**: Edge Function not deployed  
**Solution**: Deploy from Make settings

### OTP not received
**Cause**: SMS service not configured  
**Solution**: Check Supabase logs for generated OTP code (demo mode)

### Data not persisting
**Cause**: Backend not deployed or KV store issue  
**Solution**: Deploy Edge Function and verify Supabase connection

### CORS errors
**Cause**: Edge Function CORS misconfigured  
**Solution**: Already configured correctly in code, redeploy if needed

---

## Production Considerations

For a production deployment, you'll need:

### 1. SMS Service Integration
- Twilio, AWS SNS, or local SMS provider
- Add API credentials to Supabase secrets
- Update `/send-otp` route to call SMS API

### 2. Security Enhancements
- Add rate limiting (10 requests/min per IP)
- Implement CAPTCHA on registration
- Add JWT authentication
- Enable Supabase RLS (Row Level Security)
- Sanitize all user inputs

### 3. File Storage
- Set up Supabase Storage buckets
- Configure image upload size limits (max 5MB)
- Add image compression
- Scan uploads for malicious content

### 4. Monitoring & Analytics
- Set up error tracking (Sentry)
- Add analytics (Google Analytics/Mixpanel)
- Configure uptime monitoring
- Set up alerts for critical errors

### 5. Performance
- Enable Supabase caching
- Add CDN for static assets
- Optimize image delivery
- Implement pagination for leaderboards

---

## Environment Variables

The following are auto-configured by Make:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side key (keep secret!)

For production, you may need to add:

- `SMS_API_KEY` - For OTP delivery
- `SMS_API_SECRET` - SMS service credentials
- `ADMIN_SECRET` - For admin authentication
- `JWT_SECRET` - For token signing

---

## Next Steps

1. **Deploy the backend** from Make settings
2. **Test the complete flow** with real data
3. **Activate Week 1 missions** in admin panel
4. **Monitor initial usage** for 24-48 hours
5. **Collect user feedback** and iterate

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Hono Framework**: https://hono.dev/
- **Admin Guide**: See `ADMIN_GUIDE.md`
- **Project Summary**: See `PROJECT_SUMMARY.md`

---

**Note**: The app is fully functional in demo mode for testing and development. Deploy the backend when you're ready for production use with real user data.
