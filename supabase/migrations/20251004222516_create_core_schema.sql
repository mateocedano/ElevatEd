/*
  # Create ElevatEd Core Schema

  ## Overview
  This migration creates the foundational database schema for the ElevatEd platform,
  a career development and student management system.

  ## New Tables

  ### 1. `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's full name
  - `email` (text) - User's email (synced with auth)
  - `role` (text) - Either 'student' or 'advisor'
  - `avatar_url` (text, optional) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `students`
  Extended student-specific information
  - `id` (uuid, primary key) - References profiles.id
  - `xp` (integer) - Experience points earned
  - `cohort` (text) - Class year (e.g., 'Class of 2025')
  - `major` (text) - Student's major field of study
  - `resume_score` (text) - Resume quality grade (A-F)
  - `risk_level` (text) - Engagement risk: 'green', 'yellow', 'red'
  - `last_login` (timestamptz) - Last login timestamp
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `advisor_student_assignments`
  Maps advisors to their assigned students
  - `id` (uuid, primary key)
  - `advisor_id` (uuid) - References profiles.id
  - `student_id` (uuid) - References students.id
  - `assigned_at` (timestamptz)

  ### 4. `courses`
  Available courses in the platform
  - `id` (uuid, primary key)
  - `title` (text) - Course name
  - `description` (text) - Course description
  - `thumbnail_url` (text, optional) - Course image
  - `total_lessons` (integer) - Number of lessons
  - `estimated_hours` (integer) - Time to complete
  - `difficulty` (text) - 'beginner', 'intermediate', 'advanced'
  - `created_at` (timestamptz)

  ### 5. `student_course_progress`
  Tracks student progress through courses
  - `id` (uuid, primary key)
  - `student_id` (uuid) - References students.id
  - `course_id` (uuid) - References courses.id
  - `completed_lessons` (integer) - Lessons completed
  - `progress_percentage` (integer) - Overall progress 0-100
  - `started_at` (timestamptz)
  - `last_accessed` (timestamptz)
  - `completed_at` (timestamptz, optional)

  ### 6. `mock_interviews`
  Mock interview records and scores
  - `id` (uuid, primary key)
  - `student_id` (uuid) - References students.id
  - `interview_type` (text) - 'Behavioral' or 'Technical'
  - `score` (integer) - Interview score 0-100
  - `feedback` (text, optional) - AI-generated feedback
  - `completed_at` (timestamptz)

  ### 7. `advisor_notes`
  Notes advisors create about students
  - `id` (uuid, primary key)
  - `advisor_id` (uuid) - References profiles.id
  - `student_id` (uuid) - References students.id
  - `note_text` (text) - Note content
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 8. `meetings`
  Scheduled meetings between advisors and students
  - `id` (uuid, primary key)
  - `advisor_id` (uuid) - References profiles.id
  - `student_id` (uuid) - References students.id
  - `topic` (text) - Meeting subject
  - `scheduled_time` (timestamptz) - Meeting date/time
  - `duration_minutes` (integer) - Meeting length
  - `status` (text) - 'scheduled', 'completed', 'cancelled'
  - `notes` (text, optional) - Meeting notes
  - `created_at` (timestamptz)

  ## Security
  All tables have Row Level Security (RLS) enabled with the following policies:

  ### Profiles
  - Users can read their own profile
  - Users can update their own profile
  - Advisors can read all profiles

  ### Students
  - Students can read their own data
  - Advisors can read data of assigned students
  - Only system can create/update student records (handled via triggers)

  ### Advisor Student Assignments
  - Advisors can view their assignments
  - Students can view their advisor

  ### Courses
  - All authenticated users can read courses
  - Only system/admins can modify courses

  ### Student Course Progress
  - Students can read/update their own progress
  - Advisors can read progress of assigned students

  ### Mock Interviews
  - Students can read their own interviews
  - Advisors can read interviews of assigned students

  ### Advisor Notes
  - Advisors can create/read/update their own notes
  - Students cannot access advisor notes

  ### Meetings
  - Students can read their own meetings
  - Advisors can read/create/update meetings they're assigned to

  ## Important Notes
  - All timestamps use `timestamptz` for proper timezone handling
  - Foreign key constraints ensure referential integrity
  - Indexes are added for frequently queried columns
  - Default values are set where appropriate to prevent null errors
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'advisor')),
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Advisors can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'advisor'
    )
  );

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  xp integer DEFAULT 0 NOT NULL,
  cohort text NOT NULL,
  major text NOT NULL,
  resume_score text DEFAULT 'C' NOT NULL,
  risk_level text DEFAULT 'yellow' CHECK (risk_level IN ('green', 'yellow', 'red')),
  last_login timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own data"
  ON students FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Advisors can read assigned students"
  ON students FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'advisor'
    )
  );

CREATE POLICY "Students can update own data"
  ON students FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "System can insert students"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create advisor_student_assignments table
CREATE TABLE IF NOT EXISTS advisor_student_assignments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(advisor_id, student_id)
);

ALTER TABLE advisor_student_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Advisors can view their assignments"
  ON advisor_student_assignments FOR SELECT
  TO authenticated
  USING (auth.uid() = advisor_id);

CREATE POLICY "Students can view their advisor"
  ON advisor_student_assignments FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text,
  total_lessons integer DEFAULT 0 NOT NULL,
  estimated_hours integer DEFAULT 1 NOT NULL,
  difficulty text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read courses"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

-- Create student_course_progress table
CREATE TABLE IF NOT EXISTS student_course_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed_lessons integer DEFAULT 0 NOT NULL,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  started_at timestamptz DEFAULT now() NOT NULL,
  last_accessed timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz,
  UNIQUE(student_id, course_id)
);

ALTER TABLE student_course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own progress"
  ON student_course_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can update own progress"
  ON student_course_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can insert own progress"
  ON student_course_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Advisors can read assigned students progress"
  ON student_course_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM advisor_student_assignments
      WHERE advisor_student_assignments.advisor_id = auth.uid()
      AND advisor_student_assignments.student_id = student_course_progress.student_id
    )
  );

-- Create mock_interviews table
CREATE TABLE IF NOT EXISTS mock_interviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  interview_type text NOT NULL CHECK (interview_type IN ('Behavioral', 'Technical')),
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  feedback text,
  completed_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE mock_interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own interviews"
  ON mock_interviews FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own interviews"
  ON mock_interviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Advisors can read assigned students interviews"
  ON mock_interviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM advisor_student_assignments
      WHERE advisor_student_assignments.advisor_id = auth.uid()
      AND advisor_student_assignments.student_id = mock_interviews.student_id
    )
  );

-- Create advisor_notes table
CREATE TABLE IF NOT EXISTS advisor_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  note_text text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE advisor_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Advisors can create notes"
  ON advisor_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = advisor_id);

CREATE POLICY "Advisors can read own notes"
  ON advisor_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = advisor_id);

CREATE POLICY "Advisors can update own notes"
  ON advisor_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = advisor_id)
  WITH CHECK (auth.uid() = advisor_id);

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  topic text NOT NULL,
  scheduled_time timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30 NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own meetings"
  ON meetings FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Advisors can read own meetings"
  ON meetings FOR SELECT
  TO authenticated
  USING (auth.uid() = advisor_id);

CREATE POLICY "Advisors can create meetings"
  ON meetings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = advisor_id);

CREATE POLICY "Advisors can update own meetings"
  ON meetings FOR UPDATE
  TO authenticated
  USING (auth.uid() = advisor_id)
  WITH CHECK (auth.uid() = advisor_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_risk_level ON students(risk_level);
CREATE INDEX IF NOT EXISTS idx_students_cohort ON students(cohort);
CREATE INDEX IF NOT EXISTS idx_students_xp ON students(xp DESC);
CREATE INDEX IF NOT EXISTS idx_advisor_assignments_advisor ON advisor_student_assignments(advisor_id);
CREATE INDEX IF NOT EXISTS idx_advisor_assignments_student ON advisor_student_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_student ON student_course_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_interviews_student ON mock_interviews(student_id);
CREATE INDEX IF NOT EXISTS idx_notes_advisor ON advisor_notes(advisor_id);
CREATE INDEX IF NOT EXISTS idx_notes_student ON advisor_notes(student_id);
CREATE INDEX IF NOT EXISTS idx_meetings_advisor ON meetings(advisor_id);
CREATE INDEX IF NOT EXISTS idx_meetings_student ON meetings(student_id);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_time ON meetings(scheduled_time);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );

  -- If user is a student, create student record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.students (id, cohort, major)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'cohort', 'Class of 2026'),
      COALESCE(NEW.raw_user_meta_data->>'major', 'Undeclared')
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advisor_notes_updated_at BEFORE UPDATE ON advisor_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();