# LG Superfan League Bangladesh - Admin Guide

## Overview

The LG Superfan League is a gamification platform for FIFA 2026, featuring:
- **User Authentication**: OTP-based phone verification
- **Team Selection**: Users choose from 12 FIFA teams
- **Missions System**: 6 weeks of varied mission types
- **Leaderboards**: Individual and team rankings
- **Photobooth**: Fan art and photo sharing
- **Admin Panel**: Complete mission and submission management

---

## Accessing the Platform

### User Access
- URL: `https://your-domain.com`
- Users authenticate with phone number + OTP

### Admin Access
- URL: `https://your-domain.com#admin`
- Add `#admin` to the URL to access the admin panel

---

## Admin Panel Features

### 1. Overview Dashboard
- **Statistics**: Total users, active missions, pending submissions, points awarded
- **Quick Actions**: Create mission, review submissions, view reports
- **Recent Activity**: Real-time feed of user actions

### 2. Mission Management
- **Create New Missions**: Click "Create Mission" button
- **Edit Missions**: Click edit icon on any mission
- **Toggle Active/Inactive**: Control mission availability
- **Delete Missions**: Remove missions (with confirmation)
- **Mission Fields**:
  - Title
  - Description
  - Type (Photo, Quiz, Predictor, etc.)
  - Week (1-6)
  - Points
  - Active status

### 3. Submission Review
- **Filter Views**: All, Pending, Approved, Rejected
- **Review Actions**:
  - View submission content
  - Approve (awards points to user)
  - Reject (with optional feedback)
- **Bulk Actions**: Select multiple submissions for batch processing

### 4. Analytics
- **Mission Completion Rates**: Track which missions are most popular
- **Team Distribution**: See which teams have the most supporters
- **Weekly Engagement**: Monitor user activity over time
- **Export Reports**: Download data for further analysis

---

## Mission Types Explained

### 1. **Photo Upload**
- Users upload photos (selfies, setups, etc.)
- Admin reviews and approves
- Examples: Standee Selfie, Match Night Setup

### 2. **Quiz/MCQ**
- Multiple choice questions
- Auto-graded or manual review
- Examples: LG Trivia, Product Knowledge

### 3. **Spot & Count**
- Users count specific items in an image
- Compare answer to correct count
- Example: Count LG products in image

### 4. **Drag & Match**
- Match items between two lists
- Interactive drag-and-drop
- Example: Match teams to flag colors

### 5. **Unscramble**
- Rearrange letters to form words
- Text input validation
- Example: Unscramble LG product names

### 6. **Hidden Hunt**
- Find hidden objects in an image
- Click/tap to locate items
- Example: Find hidden jerseys

### 7. **Comment/Post**
- User writes creative text
- Admin reviews for appropriateness
- Examples: Team pride posts, memories

### 8. **Score Predictor**
- Predict match scores
- Award points based on accuracy
- Example: Semi-final predictions

### 9. **Video/Reel**
- Upload short video clips
- Max 30 seconds
- Example: Goal celebration

### 10. **External Visit**
- Check-in at LG showrooms
- Verify via location or QR code
- Example: Showroom visits

### 11. **Fan Art**
- Upload creative artwork
- Featured in gallery
- Example: LG x FIFA fan art

### 12. **Rapid Tap**
- Quick response polls
- Time-limited
- Example: Fastest answer wins

---

## Weekly Mission Schedule

### Week 1: Campaign Launch
- Standee Selfie (100 pts)
- Match Night Setup (100 pts)
- Spot the LG Product (150 pts)
- Team Flag Color Quiz (200 pts)
- LG Trivia: FIFA Bond (150 pts)
- Flag Pride (100 pts)
- Dream Screen Pick (100 pts)

### Week 2: Engagement Build
- Showroom Check-In (200 pts)
- Goal Reaction Reel (250 pts)
- Room Match-Up (150 pts)
- Jersey Gang Photo (150 pts)
- LG Trivia: OLED Facts (150 pts)
- Halftime Mood Word (100 pts)
- Logo Hunt (200 pts)

### Week 3: Mid-Campaign Push
- Score Predictor (300 pts)
- LG x Football Tech (150 pts)
- Fastest Tap Poll (100 pts)
- LG Product Unscramble (150 pts)
- Goal or No Goal? (100 pts)
- LG Screen Match Night (200 pts)

### Week 4: Momentum
- Standee Product Spot (150 pts)
- My Football Memory (150 pts)
- LG Innovation Quiz (200 pts)
- Lightning Quiz (200 pts)
- Top Scorer Predict (250 pts)
- Colour Match Game (150 pts)

### Week 5: Semi-Finals Hype
- Semi-Final Hype Post (150 pts)
- LG Trivia: Global Reach (150 pts)
- Hidden Jersey Hunt (200 pts)
- Final Prediction (400 pts)
- LG Colour Quiz (100 pts)
- Life is Good Moment (200 pts)

### Week 6: Grand Finale
- Final Countdown (150 pts)
- LG Fan Art (300 pts)
- Watch Party Crew (200 pts)
- Final on LG Screen (500 pts)

---

## Backend API Endpoints

All endpoints are prefixed with `/make-server-53581c36/`

### Authentication
- `POST /send-otp` - Send OTP to phone number
- `POST /verify-otp` - Verify OTP code
- `POST /select-team` - Save user's team selection

### Missions
- `POST /submit-mission` - Submit mission completion
- `GET /user-missions/:phone` - Get user's submissions

### Leaderboards
- `GET /leaderboard/individual` - Get individual rankings
- `GET /leaderboard/team` - Get team rankings

### Admin
- `POST /admin/review-submission` - Approve/reject submission

---

## Database Structure (Supabase KV Store)

### Keys:
- `otp:{phone}` - Temporary OTP codes
- `user:{phone}` - User profiles
- `submission:{phone}:{missionId}` - Mission submissions
- `team:{teamName}:count` - Team member counts

---

## Best Practices

### For Mission Creation:
1. **Clear Instructions**: Make mission requirements obvious
2. **Appropriate Points**: Higher points for harder/creative missions
3. **Time Limits**: Use sparingly, for special missions only
4. **Weekly Themes**: Align missions with tournament progression

### For Submission Review:
1. **Quick Response**: Review submissions within 24 hours
2. **Fair Judgement**: Approve if user made genuine effort
3. **Consistent Standards**: Apply same criteria to all users
4. **Feedback**: Provide rejection reasons when applicable

### For User Engagement:
1. **Daily Missions**: Keep at least 1-2 missions active daily
2. **Variety**: Mix easy and challenging missions
3. **Rewards**: Announce top performers weekly
4. **Communication**: Update users on leaderboard changes

---

## Troubleshooting

### Users Can't Login:
- Check Supabase connection
- Verify backend is deployed
- Check OTP expiration (5 minutes)

### Submissions Not Appearing:
- Check network connectivity
- Verify backend route is correct
- Check browser console for errors

### Leaderboard Not Updating:
- Submissions must be approved to award points
- Manual point adjustment may be needed
- Check user object in database

---

## Security Notes

⚠️ **Important**: This is a prototype/demo system. For production:
- Implement proper user authentication (JWT tokens)
- Add rate limiting to prevent spam
- Sanitize all user inputs
- Use HTTPS only
- Add CAPTCHA to prevent bots
- Implement proper admin authentication
- Set up file upload size limits
- Scan uploaded files for malicious content

---

## Support

For technical issues or questions:
- Check browser console for error logs
- Verify Supabase Edge Function is deployed
- Review server logs in Supabase dashboard
- Test with different browsers/devices

---

## Future Enhancements

- Push notifications for new missions
- Social sharing integrations
- Team chat/forums
- Live match commentary
- Merchandise rewards integration
- Mobile app (iOS/Android)
- Multi-language support
