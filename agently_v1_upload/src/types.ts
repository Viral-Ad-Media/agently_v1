/**
 * Agently Core Types
 */

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  phone?: string;
}

export interface VoiceAgent {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  voice_id: string;
  provider: 'openai' | 'elevenlabs';
  tone: string;
  persona: string;
  min_minutes_used?: number;
}

export interface CallLog {
  id: string;
  agent_id: string;
  customer_number: string;
  status: 'completed' | 'failed' | 'in-progress';
  direction: 'inbound' | 'outbound';
  duration: number;
  recorded_at: string;
  summary?: string;
  transcript?: string;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  tags: string[];
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'call' | 'lead' | 'system' | 'billing';
  is_read: boolean;
  created_at: string;
}
