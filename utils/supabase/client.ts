import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper types
export interface User {
  id: string;
  phone: string;
  name?: string;
  team: string;
  team_flag: string;
  points: number;
  rank: number;
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  week: number;
  day?: number;
  title: string;
  description: string;
  type: string;
  points: number;
  timed_duration?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  is_daily_special?: boolean;
  data?: any;
  created_at: string;
  updated_at: string;
}

export interface MissionSubmission {
  id: string;
  mission_id: string;
  user_id: string;
  submitted_at: string;
  data: any;
  status: 'pending' | 'approved' | 'rejected';
  points_awarded?: number;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Gift {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  quantity_total?: number;
  quantity_remaining?: number;
  image_url?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserGift {
  id: string;
  user_id: string;
  gift_id: string;
  redeemed_at: string;
  points_spent: number;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  delivery_address?: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PhotoboothEntry {
  id: string;
  user_id: string;
  image_url: string;
  caption?: string;
  frame_id?: string;
  likes: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
