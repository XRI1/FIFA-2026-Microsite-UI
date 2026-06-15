import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-53581c36/health", (c) => {
  return c.json({ status: "ok" });
});

// OTP Generation and Storage
app.post("/make-server-53581c36/send-otp", async (c) => {
  try {
    const { phone } = await c.req.json();

    if (!phone) {
      return c.json({ error: "Phone number is required" }, 400);
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP with expiration (5 minutes)
    const otpKey = `otp:${phone}`;
    await kv.set(otpKey, otp);

    console.log(`OTP generated for ${phone}: ${otp}`);
    // In production, send OTP via SMS service

    return c.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return c.json({ error: "Failed to send OTP" }, 500);
  }
});

// OTP Verification
app.post("/make-server-53581c36/verify-otp", async (c) => {
  try {
    const { phone, otp } = await c.req.json();

    if (!phone || !otp) {
      return c.json({ error: "Phone and OTP are required" }, 400);
    }

    // Verify OTP
    const otpKey = `otp:${phone}`;
    const storedOtp = await kv.get(otpKey);

    if (!storedOtp || storedOtp !== otp) {
      return c.json({ error: "Invalid or expired OTP" }, 400);
    }

    // Check if user exists
    const userKey = `user:${phone}`;
    const existingUser = await kv.get(userKey);

    if (existingUser) {
      // Delete used OTP
      await kv.del(otpKey);
      return c.json({ success: true, isNewUser: false, user: existingUser });
    }

    // Delete used OTP
    await kv.del(otpKey);
    return c.json({ success: true, isNewUser: true });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return c.json({ error: "Failed to verify OTP" }, 500);
  }
});

// Team Selection
app.post("/make-server-53581c36/select-team", async (c) => {
  try {
    const { phone, teamId } = await c.req.json();

    if (!phone || !teamId) {
      return c.json({ error: "Phone and team ID are required" }, 400);
    }

    const teamData: Record<string, { name: string; flag: string }> = {
      arg: { name: 'Argentina', flag: '🇦🇷' },
      bra: { name: 'Brazil', flag: '🇧🇷' },
      ger: { name: 'Germany', flag: '🇩🇪' },
      fra: { name: 'France', flag: '🇫🇷' },
      esp: { name: 'Spain', flag: '🇪🇸' },
      eng: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      por: { name: 'Portugal', flag: '🇵🇹' },
      ned: { name: 'Netherlands', flag: '🇳🇱' },
      ita: { name: 'Italy', flag: '🇮🇹' },
      bel: { name: 'Belgium', flag: '🇧🇪' },
      uru: { name: 'Uruguay', flag: '🇺🇾' },
      mex: { name: 'Mexico', flag: '🇲🇽' },
    };

    const team = teamData[teamId];
    if (!team) {
      return c.json({ error: "Invalid team ID" }, 400);
    }

    // Create user profile
    const user = {
      name: '',
      phone,
      team: team.name,
      teamFlag: team.flag,
      points: 0,
      rank: 999,
      createdAt: new Date().toISOString(),
    };

    const userKey = `user:${phone}`;
    await kv.set(userKey, user);

    // Update team member count
    const teamCountKey = `team:${team.name}:count`;
    const currentCount = await kv.get(teamCountKey) || 0;
    await kv.set(teamCountKey, currentCount + 1);

    return c.json({ success: true, user });
  } catch (error) {
    console.error("Error selecting team:", error);
    return c.json({ error: "Failed to save team selection" }, 500);
  }
});

// Submit Mission
app.post("/make-server-53581c36/submit-mission", async (c) => {
  try {
    const { phone, missionId, data } = await c.req.json();

    if (!phone || !missionId || !data) {
      return c.json({ error: "Phone, mission ID, and data are required" }, 400);
    }

    const submission = {
      missionId,
      userId: phone,
      submittedAt: new Date().toISOString(),
      data,
      status: 'pending',
    };

    const submissionKey = `submission:${phone}:${missionId}`;
    await kv.set(submissionKey, submission);

    return c.json({ success: true, submission });
  } catch (error) {
    console.error("Error submitting mission:", error);
    return c.json({ error: "Failed to submit mission" }, 500);
  }
});

// Get User Missions
app.get("/make-server-53581c36/user-missions/:phone", async (c) => {
  try {
    const phone = c.req.param('phone');

    // Get all submissions for this user
    const submissions = await kv.getByPrefix(`submission:${phone}:`);

    return c.json({ success: true, submissions });
  } catch (error) {
    console.error("Error getting user missions:", error);
    return c.json({ error: "Failed to get user missions" }, 500);
  }
});

// Get Leaderboard
app.get("/make-server-53581c36/leaderboard/:type", async (c) => {
  try {
    const type = c.req.param('type'); // 'individual' or 'team'

    if (type === 'individual') {
      // Get all users
      const users = await kv.getByPrefix('user:');

      // Sort by points
      const sortedUsers = users
        .sort((a: any, b: any) => b.points - a.points)
        .map((user: any, index: number) => ({
          ...user,
          rank: index + 1,
        }));

      return c.json({ success: true, leaderboard: sortedUsers });
    } else {
      // Get team stats
      const teamCounts = await kv.getByPrefix('team:');
      return c.json({ success: true, leaderboard: teamCounts });
    }
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return c.json({ error: "Failed to get leaderboard" }, 500);
  }
});

// Admin: Approve/Reject Submission
app.post("/make-server-53581c36/admin/review-submission", async (c) => {
  try {
    const { submissionKey, status, points } = await c.req.json();

    if (!submissionKey || !status) {
      return c.json({ error: "Submission key and status are required" }, 400);
    }

    const submission = await kv.get(submissionKey);
    if (!submission) {
      return c.json({ error: "Submission not found" }, 404);
    }

    // Update submission status
    submission.status = status;
    await kv.set(submissionKey, submission);

    // If approved, award points
    if (status === 'approved' && points) {
      const userKey = `user:${submission.userId}`;
      const user = await kv.get(userKey);

      if (user) {
        user.points += points;
        await kv.set(userKey, user);
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Error reviewing submission:", error);
    return c.json({ error: "Failed to review submission" }, 500);
  }
});

Deno.serve(app.fetch);