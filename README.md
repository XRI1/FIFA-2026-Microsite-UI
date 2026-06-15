# LG Superfan League Bangladesh - FIFA 2026

A mobile-first gamification microsite for football fans to compete in missions, climb leaderboards, and win LG rewards during the FIFA 2026 World Cup.

![LG Brand](https://img.shields.io/badge/Brand-LG-C8002C?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)

---

## 🎯 Quick Start

### Demo Mode (No Backend Required)
The app is currently running in **demo mode** with mock data:

1. **Get Started** - Click on the landing page
2. **Enter Phone** - Any 11-digit number (e.g., 01712345678)
3. **Enter OTP** - Use any 4-digit code (e.g., 1234)
4. **Select Team** - Pick your favorite FIFA team
5. **Explore** - Browse missions, leaderboards, and photobooth

### Full Deployment (Backend Required)
To enable real data persistence:

1. Open Make settings
2. Deploy the Supabase Edge Function
3. Wait 30-60 seconds for deployment
4. Refresh the app - demo mode notice will disappear

📖 **See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions**

---

## ✨ Features

### 🏆 For Users
- **Phone + OTP Authentication** - Secure login flow
- **Team Selection** - Choose from 12 FIFA teams
- **40+ Missions** - 6 weeks of challenges (photo, quiz, predictor, etc.)
- **Leaderboards** - Individual and team rankings with real-time updates
- **Photobooth** - Create and share FIFA-themed photos
- **Points & Rewards** - Earn points for completed missions

### 👨‍💼 For Admins
- **Mission Management** - Create, edit, activate/deactivate missions
- **Submission Review** - Approve/reject user submissions
- **Analytics Dashboard** - Completion rates, team distribution, engagement
- **User Management** - View user profiles and activity
- **Real-time Monitoring** - Live activity feed

---

## 📱 Screens

1. **Landing Page** - Campaign overview and features
2. **Phone Input** - Mobile number entry
3. **OTP Verification** - 4-digit code with resend
4. **Team Selection** - 12 FIFA teams with flags
5. **Dashboard** - User hub with tabs
6. **Missions** - Browse and complete challenges
7. **Leaderboards** - Individual and team rankings
8. **Photobooth** - Photo creation and gallery
9. **Admin Panel** - Control center (access via `#admin`)

---

## 🎮 Mission Types

| Type | Description | Example |
|------|-------------|---------|
| 📸 **Photo Upload** | Take and upload photos | Standee selfie, match setup |
| 🎬 **Video Upload** | Record short videos | Goal celebrations |
| ❓ **Quiz/MCQ** | Multiple choice questions | LG product trivia |
| 🔍 **Spot & Count** | Find items in images | Count LG products |
| 🎯 **Drag & Match** | Interactive matching | Match teams to colors |
| 🔤 **Unscramble** | Word puzzles | Unscramble product names |
| 🕵️ **Hidden Hunt** | Find hidden objects | Locate hidden jerseys |
| 💬 **Comment** | Creative text posts | Share team pride |
| ⚽ **Score Predictor** | Predict match outcomes | Guess final scores |
| 🎨 **Fan Art** | Upload artwork | LG x FIFA fan art |
| 📍 **External Visit** | Check-in at locations | Showroom visits |
| ⚡ **Rapid Tap** | Time-limited polls | Quick answer challenges |

---

## 🗓️ Campaign Schedule

| Week | Theme | Missions | Points |
|------|-------|----------|--------|
| **1** | Launch | 7 missions | 900 pts |
| **2** | Engagement | 7 missions | 1,200 pts |
| **3** | Mid-Campaign | 7 missions | 1,300 pts |
| **4** | Momentum | 6 missions | 1,100 pts |
| **5** | Semi-Finals | 6 missions | 1,200 pts |
| **6** | Grand Finale | 4 missions | 1,150 pts |

**Total: 37 missions, 6,850 points available**

---

## 🎨 Design System

### Brand Colors
- **Primary**: LG Red (`#C8002C`)
- **Secondary**: LG Gray, Deep Purple, Purple, Bright Purple
- **Accent**: Yellow, Bright Green, Green

### Typography
- **Font**: Montserrat (weights 300-800)
- **Style**: Modern, legible, mobile-optimized

### Components
- **Rounded corners**: 12px radius
- **Shadows**: Subtle elevation
- **Animations**: Smooth transitions, confetti on success
- **Responsive**: Mobile-first, scales to desktop

---

## 🏗️ Tech Stack

### Frontend
- React 18.3.1
- Tailwind CSS v4
- Lucide Icons
- Motion (Framer Motion)
- Canvas Confetti

### Backend
- Supabase Edge Functions
- Deno Runtime
- Hono Web Framework
- Supabase KV Store

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Main application
│   │   ├── components/             # UI components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── PhoneInput.tsx
│   │   │   ├── OTPVerification.tsx
│   │   │   ├── TeamSelection.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MissionsList.tsx
│   │   │   ├── MissionModal.tsx
│   │   │   ├── LeaderboardView.tsx
│   │   │   ├── PhotoboothView.tsx
│   │   │   ├── AdminPanel.tsx
│   │   │   └── DemoModeNotice.tsx
│   │   └── types/
│   │       └── mission.ts          # Mission data & types
│   └── styles/
│       ├── theme.css               # LG brand colors
│       └── fonts.css               # Montserrat font
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx           # API routes
│           └── kv_store.tsx        # Database utils
├── ADMIN_GUIDE.md                  # Admin documentation
├── DEPLOYMENT_GUIDE.md             # Deployment instructions
├── PROJECT_SUMMARY.md              # Technical details
└── README.md                       # This file
```

---

## 🔧 API Endpoints

All endpoints prefixed with `/make-server-53581c36/`

### Authentication
- `POST /send-otp` - Send OTP to phone
- `POST /verify-otp` - Verify OTP code
- `POST /select-team` - Save team selection

### Missions
- `POST /submit-mission` - Submit mission
- `GET /user-missions/:phone` - Get user submissions

### Leaderboards
- `GET /leaderboard/individual` - Individual rankings
- `GET /leaderboard/team` - Team rankings

### Admin
- `POST /admin/review-submission` - Approve/reject

---

## 🔐 Admin Access

Access the admin panel by adding `#admin` to the URL:

```
https://your-app-url.com#admin
```

**Admin Features:**
- Mission CRUD operations
- Submission review and approval
- Analytics and engagement metrics
- User activity monitoring

---

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 8+)

---

## 🚀 Deployment

### Current Status
- ✅ **Frontend**: Running in demo mode
- ⏳ **Backend**: Not deployed (using mock data)

### Deploy Backend
1. Open Make settings
2. Click "Deploy Edge Function"
3. Wait for deployment
4. Test OTP flow

📖 **Full guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📊 Analytics & Monitoring

### Key Metrics to Track
- User registrations
- Mission completion rates
- Daily active users
- Team distribution
- Points awarded
- Submission approval time

### Recommended Tools
- Google Analytics / Mixpanel
- Sentry (error tracking)
- Uptime Robot (monitoring)

---

## 🔒 Security Notes

⚠️ **Current Implementation** (Demo/Prototype):
- Basic OTP validation
- No rate limiting
- Simple admin access

⚠️ **Production Requirements**:
- JWT authentication
- Rate limiting
- CAPTCHA
- Input sanitization
- HTTPS only
- File upload scanning

---

## 📚 Documentation

- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Complete admin instructions
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment steps
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Technical details

---

## 🎯 Next Steps

1. ✅ Preview the app in demo mode
2. 📤 Deploy Supabase Edge Function
3. 🎮 Activate Week 1 missions
4. 📊 Monitor user engagement
5. 🏆 Announce winners weekly

---

## 🤝 Support

For questions or issues:
- Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Review [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
- Check browser console for errors
- Review Supabase logs

---

## 📄 License

© 2026 LG Electronics Bangladesh. All rights reserved.

---

**Built with ❤️ for LG Superfans**

*Life's Good with LG!*
