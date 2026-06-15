export type MissionType =
  | 'photo'
  | 'quiz'
  | 'spot-count'
  | 'drag-match'
  | 'unscramble'
  | 'hidden-hunt'
  | 'comment'
  | 'predictor'
  | 'video'
  | 'external-visit'
  | 'fan-art'
  | 'social-checkin'
  | 'creative'
  | 'rapid-tap';

export interface Mission {
  id: string;
  week: number;
  day?: number;
  title: string;
  description: string;
  type: MissionType;
  points: number;
  timedDuration?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  isDailySpecial?: boolean;
  data?: Record<string, any>;
}

export interface MissionSubmission {
  missionId: string;
  userId: string;
  submittedAt: string;
  data: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  points?: number;
}

export const MISSIONS_DATA: Mission[] = [
  // Week 1
  { id: 'w1-standee-selfie', week: 1, title: 'Standee Selfie', description: 'Take a selfie with an LG standee at any store', type: 'photo', points: 100, isActive: true },
  { id: 'w1-match-night-setup', week: 1, title: 'Match Night Setup', description: 'Share your perfect match-watching setup', type: 'photo', points: 100, isActive: true },
  { id: 'w1-spot-product', week: 1, title: 'Spot the LG Product', description: 'Find and count LG products in the image', type: 'spot-count', points: 150, isActive: true, data: { correctCount: 8 } },
  { id: 'w1-flag-quiz', week: 1, title: 'Team Flag Color Quiz', description: 'Match teams with their flag colors', type: 'drag-match', points: 200, isActive: true },
  { id: 'w1-lg-trivia', week: 1, title: 'LG Trivia: FIFA Bond', description: 'Test your knowledge about LG and FIFA', type: 'quiz', points: 150, isActive: true },
  { id: 'w1-flag-pride', week: 1, title: 'Flag Pride', description: 'Post about your team with pride', type: 'comment', points: 100, isActive: true },
  { id: 'w1-dream-screen', week: 1, title: 'Dream Screen Pick', description: 'Choose your dream LG screen for watching matches', type: 'quiz', points: 100, isActive: true },

  // Week 2
  { id: 'w2-showroom-checkin', week: 2, title: 'Showroom Check-In', description: 'Visit an LG showroom and check in', type: 'external-visit', points: 200, isActive: false },
  { id: 'w2-goal-reaction', week: 2, title: 'Goal Reaction Reel', description: 'Record your best goal celebration', type: 'video', points: 250, isActive: false },
  { id: 'w2-room-matchup', week: 2, title: 'Room Match-Up', description: 'Match LG products to their ideal rooms', type: 'drag-match', points: 150, isActive: false },
  { id: 'w2-jersey-gang', week: 2, title: 'Jersey Gang Photo', description: 'Group photo with your team jerseys', type: 'photo', points: 150, isActive: false },
  { id: 'w2-oled-facts', week: 2, title: 'LG Trivia: OLED Facts', description: 'Learn about LG OLED technology', type: 'quiz', points: 150, isActive: false },
  { id: 'w2-halftime-mood', week: 2, title: 'Halftime Mood Word', description: 'Share your halftime feeling in one word', type: 'comment', points: 100, isActive: false },
  { id: 'w2-logo-hunt', week: 2, title: 'Logo Hunt', description: 'Find hidden LG logos in the image', type: 'hidden-hunt', points: 200, isActive: false },

  // Week 3
  { id: 'w3-score-predictor', week: 3, title: 'Score Predictor', description: 'Predict the match score', type: 'predictor', points: 300, isActive: false },
  { id: 'w3-tech-quiz', week: 3, title: 'LG x Football Tech', description: 'How does LG enhance the football experience?', type: 'quiz', points: 150, isActive: false },
  { id: 'w3-fastest-tap', week: 3, title: 'Fastest Tap Poll', description: 'Quick poll - tap your answer fast!', type: 'rapid-tap', points: 100, timedDuration: 10, isActive: false },
  { id: 'w3-unscramble', week: 3, title: 'LG Product Unscramble', description: 'Unscramble LG product names', type: 'unscramble', points: 150, isActive: false },
  { id: 'w3-goal-or-not', week: 3, title: 'Goal or No Goal?', description: 'Quick decision game', type: 'quiz', points: 100, isActive: false },
  { id: 'w3-screen-match', week: 3, title: 'LG Screen Match Night', description: 'Share watching on LG screen', type: 'photo', points: 200, isActive: false },
  { id: 'w3-score-predictor2', week: 3, title: 'Score Predictor', description: 'Predict another match score', type: 'predictor', points: 300, isActive: false },

  // Week 4
  { id: 'w4-standee-spot', week: 4, title: 'Standee Product Spot', description: 'Identify products on LG standee', type: 'spot-count', points: 150, isActive: false },
  { id: 'w4-football-memory', week: 4, title: 'My Football Memory', description: 'Share your favorite football memory', type: 'comment', points: 150, isActive: false },
  { id: 'w4-innovation-quiz', week: 4, title: 'LG Innovation Quiz', description: 'Test your LG product knowledge', type: 'quiz', points: 200, isActive: false },
  { id: 'w4-lightning-quiz', week: 4, title: 'Lightning Quiz', description: 'Fast-paced trivia challenge', type: 'quiz', points: 200, timedDuration: 30, isActive: false },
  { id: 'w4-top-scorer', week: 4, title: 'Top Scorer Predict', description: 'Who will score the most goals?', type: 'predictor', points: 250, isActive: false },
  { id: 'w4-color-match', week: 4, title: 'Colour Match Game', description: 'Match team colors correctly', type: 'drag-match', points: 150, isActive: false },

  // Week 5
  { id: 'w5-semi-hype', week: 5, title: 'Semi-Final Hype Post', description: 'Build excitement for semi-finals', type: 'comment', points: 150, isActive: false },
  { id: 'w5-global-reach', week: 5, title: 'LG Trivia: Global Reach', description: 'LG around the world', type: 'quiz', points: 150, isActive: false },
  { id: 'w5-jersey-hunt', week: 5, title: 'Hidden Jersey Hunt', description: 'Find hidden jerseys in the scene', type: 'hidden-hunt', points: 200, isActive: false },
  { id: 'w5-final-predict', week: 5, title: 'Final Prediction', description: 'Predict the final match winner', type: 'predictor', points: 400, isActive: false },
  { id: 'w5-color-quiz', week: 5, title: 'LG Colour Quiz', description: 'Identify LG brand colors', type: 'quiz', points: 100, isActive: false },
  { id: 'w5-life-good', week: 5, title: "Life is Good Moment", description: 'Share your Life is Good moment', type: 'creative', points: 200, isActive: false },

  // Week 6
  { id: 'w6-final-countdown', week: 6, title: 'Final Countdown', description: 'Share your excitement for the final', type: 'comment', points: 150, isActive: false },
  { id: 'w6-fan-art', week: 6, title: 'LG Fan Art', description: 'Create LG x FIFA fan art', type: 'fan-art', points: 300, isActive: false },
  { id: 'w6-watch-party', week: 6, title: 'Watch Party Crew', description: 'Group photo at watch party', type: 'photo', points: 200, isActive: false },
  { id: 'w6-final-lg-screen', week: 6, title: 'Final on LG Screen', description: 'Watch the final on LG screen', type: 'photo', points: 500, isActive: false },
];
