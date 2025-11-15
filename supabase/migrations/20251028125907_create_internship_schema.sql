/*
  # Create Republikweb Internship Website Schema

  ## Overview
  This migration creates the complete database schema for the Republikweb internship portal,
  including tables for positions, applications, testimonials, gallery items, blog posts, and admin users.

  ## New Tables

  ### 1. `positions`
  Stores available internship positions with details
  - `id` (uuid, primary key)
  - `title` (text) - Position name (e.g., "Programmer", "Content Creator")
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Detailed position description
  - `requirements` (text) - Position requirements
  - `is_active` (boolean) - Whether position is currently accepting applications
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `applications`
  Stores internship applications from candidates
  - `id` (uuid, primary key)
  - `position_id` (uuid, foreign key to positions)
  - `full_name` (text) - Applicant's full name
  - `email` (text) - Contact email
  - `phone` (text) - Phone number
  - `school_university` (text) - Educational institution
  - `major` (text) - Field of study
  - `cv_url` (text) - Link to uploaded CV/portfolio
  - `motivation` (text) - Why they want to join
  - `status` (text) - Application status: 'pending', 'reviewed', 'accepted', 'rejected'
  - `created_at` (timestamptz)

  ### 3. `testimonials`
  Stores testimonials from past interns
  - `id` (uuid, primary key)
  - `name` (text) - Intern's name
  - `position` (text) - Their internship position
  - `photo_url` (text) - Profile photo URL
  - `content` (text) - Testimonial content
  - `rating` (int) - Rating out of 5
  - `is_published` (boolean) - Whether to show on website
  - `created_at` (timestamptz)

  ### 4. `gallery_items`
  Stores photos/videos from internship activities
  - `id` (uuid, primary key)
  - `title` (text) - Item title
  - `media_url` (text) - URL to photo/video
  - `media_type` (text) - 'image' or 'video'
  - `caption` (text) - Description
  - `is_published` (boolean)
  - `display_order` (int) - Sort order
  - `created_at` (timestamptz)

  ### 5. `blog_posts`
  Stores blog articles about digital careers
  - `id` (uuid, primary key)
  - `title` (text) - Post title
  - `slug` (text, unique) - URL-friendly identifier
  - `content` (text) - Post content (markdown)
  - `excerpt` (text) - Short summary
  - `cover_image_url` (text) - Featured image
  - `author` (text) - Author name
  - `is_published` (boolean)
  - `published_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 6. `admin_users`
  Stores admin user credentials for dashboard access
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique)
  - `full_name` (text)
  - `role` (text) - Admin role: 'super_admin', 'admin'
  - `created_at` (timestamptz)

  ## Security
  
  ### Row Level Security (RLS)
  All tables have RLS enabled with appropriate policies:
  
  1. **Public read access** for published content (positions, testimonials, gallery, blog)
  2. **Public insert access** for applications (anonymous users can apply)
  3. **Admin-only access** for managing content and viewing applications
  4. **Authenticated admin access** for admin_users table

  ## Important Notes
  - Applications can be submitted by anyone (no auth required)
  - All admin operations require authentication
  - Published content is publicly visible
  - Default values ensure data integrity
*/

-- Create positions table
CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id uuid REFERENCES positions(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  school_university text NOT NULL,
  major text NOT NULL,
  cv_url text NOT NULL,
  motivation text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  photo_url text,
  content text NOT NULL,
  rating int DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  media_url text NOT NULL,
  media_type text DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  caption text,
  is_published boolean DEFAULT false,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  cover_image_url text,
  author text DEFAULT 'Republikweb Team',
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policies for positions table
CREATE POLICY "Anyone can view active positions"
  ON positions FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all positions"
  ON positions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert positions"
  ON positions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update positions"
  ON positions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete positions"
  ON positions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies for applications table
CREATE POLICY "Anyone can submit applications"
  ON applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete applications"
  ON applications FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies for testimonials table
CREATE POLICY "Anyone can view published testimonials"
  ON testimonials FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies for gallery_items table
CREATE POLICY "Anyone can view published gallery items"
  ON gallery_items FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all gallery items"
  ON gallery_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert gallery items"
  ON gallery_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update gallery items"
  ON gallery_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete gallery items"
  ON gallery_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies for blog_posts table
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies for admin_users table
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Super admins can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can delete admin users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.role = 'super_admin'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_applications_position_id ON applications(position_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery_items(display_order);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON blog_posts(published_at DESC);

-- Insert sample positions
INSERT INTO positions (title, slug, description, requirements, is_active) VALUES
('Programmer', 'programmer', 'Bergabunglah dengan tim development kami dan kembangkan keterampilan programming Anda. Anda akan belajar membuat website dan aplikasi menggunakan teknologi modern seperti React, Node.js, dan database management.', 'Mahasiswa/i aktif jurusan IT/Computer Science atau SMK RPL, Memahami dasar HTML/CSS/JavaScript, Passion dalam coding dan problem solving, Dapat bekerja dalam tim', true),
('Content Creator', 'content-creator', 'Tuangkan kreativitas Anda dalam membuat konten digital yang menarik. Anda akan belajar content planning, copywriting, dan strategi konten untuk berbagai platform digital.', 'Kreatif dan update dengan tren digital, Memiliki kemampuan menulis yang baik, Familiar dengan social media platforms, Portfolio konten (optional)', true),
('Video Editor', 'video-editor', 'Wujudkan ide kreatif menjadi video yang memukau. Anda akan belajar video editing, motion graphics, dan storytelling visual menggunakan tools professional.', 'Mahasiswa/i atau fresh graduate, Menguasai software editing (Adobe Premiere, After Effects, CapCut, dll), Kreatif dan detail oriented, Portfolio video (wajib)', true),
('Digital Marketing', 'digital-marketing', 'Pelajari strategi marketing di era digital. Anda akan belajar social media marketing, ads management, analytics, dan campaign strategy untuk meningkatkan brand awareness.', 'Tertarik dengan digital marketing, Memahami dasar social media management, Analytical thinking dan data-driven, Komunikatif dan proaktif', true),
('SEO Specialist', 'seo-specialist', 'Kuasai seni optimasi mesin pencari. Anda akan belajar keyword research, on-page/off-page SEO, technical SEO, dan strategi untuk meningkatkan ranking website di Google.', 'Memahami dasar SEO dan cara kerja search engine, Analytical dan detail oriented, Familiar dengan Google Analytics/Search Console, Passion dalam digital marketing', true),
('UI/UX Designer', 'ui-ux-designer', 'Ciptakan pengalaman digital yang user-friendly. Anda akan belajar user research, wireframing, prototyping, dan design system menggunakan tools seperti Figma.', 'Mahasiswa/i jurusan Design/IT atau terkait, Menguasai Figma atau Adobe XD, Memahami prinsip dasar UI/UX, Portfolio design (wajib)', true);

-- Insert sample testimonials
INSERT INTO testimonials (name, position, photo_url, content, rating, is_published) VALUES
('Andi Pratama', 'Programmer Intern', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200', 'Pengalaman magang di Republikweb benar-benar membuka wawasan saya tentang dunia web development. Mentornya sangat supportive dan proyeknya real-world!', 5, true),
('Siti Nurhaliza', 'Content Creator Intern', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200', 'Selama 3 bulan magang, saya belajar banyak tentang content strategy dan copywriting. Tim yang solid dan lingkungan kerja yang fun. Highly recommended!', 5, true),
('Budi Santoso', 'Digital Marketing Intern', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200', 'Magang di Republikweb memberikan saya pengalaman hands-on dalam mengelola campaign digital. Ilmu yang didapat sangat applicable untuk karir saya ke depan.', 5, true);

-- Insert sample gallery items
INSERT INTO gallery_items (title, media_url, media_type, caption, is_published, display_order) VALUES
('Team Meeting', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'Weekly team sync untuk diskusi project dan knowledge sharing', true, 1),
('Workspace', 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'Ruang kerja yang nyaman dan kondusif untuk produktivitas', true, 2),
('Team Building', 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'Kegiatan team building untuk mempererat hubungan antar tim', true, 3),
('Learning Session', 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'Sesi training dan mentoring dengan senior developer', true, 4);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, cover_image_url, author, is_published, published_at) VALUES
('5 Tips Memulai Karir sebagai Web Developer', '5-tips-memulai-karir-web-developer', 'Di era digital ini, profesi web developer semakin diminati. Berikut 5 tips untuk memulai karir Anda:\n\n1. **Kuasai Fundamental** - Pelajari HTML, CSS, dan JavaScript dengan baik\n2. **Build Portfolio** - Buat project pribadi untuk showcase skill Anda\n3. **Join Community** - Bergabung dengan komunitas developer untuk networking\n4. **Keep Learning** - Technology terus berkembang, stay updated\n5. **Practice, Practice, Practice** - Konsistensi adalah kunci\n\nMulai perjalanan Anda hari ini!', 'Panduan lengkap untuk memulai karir sebagai web developer profesional', 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800', 'Tim Republikweb', true, now()),
('Kenapa SEO Penting untuk Bisnis Online', 'kenapa-seo-penting-untuk-bisnis-online', 'Search Engine Optimization (SEO) adalah kunci sukses bisnis online di era modern.\n\n**Mengapa SEO Penting?**\n\n- Meningkatkan visibility di search engine\n- Traffic organik yang sustainable\n- Build credibility dan trust\n- Cost-effective dibanding iklan berbayar\n- Long-term investment untuk bisnis\n\n**Tips Dasar SEO:**\n1. Keyword research yang tepat\n2. Optimize on-page elements\n3. Create quality content\n4. Build backlinks\n5. Monitor dan analyze performance\n\nMulai optimasi website Anda sekarang!', 'Memahami pentingnya SEO dan bagaimana implementasinya untuk bisnis online', 'https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg?auto=compress&cs=tinysrgb&w=800', 'Tim Republikweb', true, now());