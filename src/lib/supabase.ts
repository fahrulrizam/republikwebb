import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Position = {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  position_id: string;
  full_name: string;
  email: string;
  phone: string;
  school_university: string;
  major: string;
  cv_url: string;
  motivation: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  content: string;
  rating: number;
  is_published: boolean;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};
