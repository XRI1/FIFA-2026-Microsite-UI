import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LandingPage } from './components/LandingPage';
import { PhoneInput } from './components/PhoneInput';
import { OTPVerification } from './components/OTPVerification';
import { NameInput } from './components/NameInput';
import { TeamSelection } from './components/TeamSelection';
import { Dashboard } from './components/Dashboard';
import { AdminButton } from './components/AdminButton';
import { supabase } from '../../utils/supabase/client';

type AppState = 'landing' | 'phone' | 'otp' | 'name-input' | 'team-selection' | 'dashboard';

interface UserData {
  name: string;
  phone: string;
  team: string;
  teamFlag: string;
  points: number;
  rank: number;
}

export function MainApp() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    phone: '',
    team: '',
    teamFlag: '',
    points: 0,
    rank: 999,
  });

  // Load user session from localStorage on mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('user_data');
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        setUserData(parsedData);
        setPhoneNumber(parsedData.phone);
        setUserName(parsedData.name);
        setAppState('dashboard');
      } catch (err) {
        console.error('Error loading saved user data:', err);
      }
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (userData.phone && userData.name) {
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
  }, [userData]);

  const handlePhoneSubmit = async (phone: string) => {
    setPhoneNumber(phone);

    try {
      // Check if user already exists
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

      if (existingUser && !userError) {
        // Existing user - skip name input, go straight to team selection after OTP
        setUserName(existingUser.name);
        setUserData({
          name: existingUser.name,
          phone: existingUser.phone,
          team: existingUser.team,
          teamFlag: existingUser.team_flag,
          points: existingUser.points,
          rank: existingUser.rank,
        });
      }

      console.log(` OTP screen (dummy mode) for ${phone}`);
      setAppState('otp');
    } catch (err) {
      console.error('Error in phone submit:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const handleOTPVerified = async () => {
    try {
      // Check if user exists
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phoneNumber)
        .single();

      if (existingUser && !error) {
        // Existing user - go to dashboard
        setUserData({
          name: existingUser.name,
          phone: existingUser.phone,
          team: existingUser.team,
          teamFlag: existingUser.team_flag,
          points: existingUser.points,
          rank: existingUser.rank,
        });
        setAppState('dashboard');
      } else {
        // New user - go to name input
        setAppState('name-input');
      }
    } catch (err) {
      console.error('Error checking user:', err);
      // Default to name input for new users
      setAppState('name-input');
    }
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setAppState('team-selection');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    setAppState('landing');
    setPhoneNumber('');
    setUserName('');
    setUserData({
      name: '',
      phone: '',
      team: '',
      teamFlag: '',
      points: 0,
      rank: 999,
    });
  };

  const handleTeamSelected = async (team: string, teamFlag: string) => {
    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phoneNumber)
        .single();

      if (existingUser) {
        // Update existing user
        const { data, error } = await supabase
          .from('users')
          .update({
            team,
            team_flag: teamFlag,
            updated_at: new Date().toISOString()
          })
          .eq('phone', phoneNumber)
          .select()
          .single();

        if (error) {
          console.error('Error updating user:', error);
          alert('Failed to update team. Please try again.');
          return;
        }

        console.log(' User team updated:', data);

        setUserData({
          name: data.name,
          phone: data.phone,
          team: data.team,
          teamFlag: data.team_flag,
          points: data.points,
          rank: data.rank,
        });
      } else {
        // Create new user
        const { data, error } = await supabase
          .from('users')
          .insert({
            phone: phoneNumber,
            name: userName,
            team,
            team_flag: teamFlag,
            points: 0,
            rank: 999,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating user:', error);
          alert('Failed to create account. Please try again.');
          return;
        }

        console.log(' New user created:', data);

        setUserData({
          name: data.name,
          phone: data.phone,
          team: data.team,
          teamFlag: data.team_flag,
          points: data.points,
          rank: data.rank,
        });
      }

      setAppState('dashboard');
    } catch (err) {
      console.error('Error in team selection:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const renderCurrentView = () => {
    switch (appState) {
      case 'landing':
        return <LandingPage onGetStarted={() => setAppState('phone')} />;
      case 'phone':
        return <PhoneInput onSubmit={handlePhoneSubmit} />;
      case 'otp':
        return (
          <OTPVerification
            phoneNumber={phoneNumber}
            onVerified={handleOTPVerified}
            onBack={() => setAppState('phone')}
          />
        );
      case 'name-input':
        return (
          <NameInput
            onSubmit={handleNameSubmit}
            onBack={() => setAppState('otp')}
          />
        );
      case 'team-selection':
        return (
          <TeamSelection
            onTeamSelected={handleTeamSelected}
            onBack={() => setAppState(userName ? 'otp' : 'name-input')}
          />
        );
      case 'dashboard':
        return <Dashboard user={userData} onLogout={handleLogout} />;
      default:
        return <LandingPage onGetStarted={() => setAppState('phone')} />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={appState}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {renderCurrentView()}
        </motion.div>
      </AnimatePresence>
      {appState !== 'dashboard' && <AdminButton />}
    </>
  );
}
