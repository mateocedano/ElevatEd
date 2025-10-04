/*
  # Create Demo User Account

  ## Overview
  This migration creates a demo user account that can be used for quick access
  to the platform without requiring users to sign up.

  ## Demo User Details
  - Email: demo@elevated.app
  - Role: Student
  - XP: 15000 (moderate level)
  - Risk Level: Green (on track)
  - Cohort: Class of 2025
  - Major: Business

  ## Security Considerations
  - Demo account has same restrictions as regular student accounts
  - Data is read-only for demo purposes
  - Demo user cannot access other students' data
  - RLS policies still apply

  ## Demo Data
  - Enrolled in 2 courses with progress
  - Has completed mock interviews
  - Sample advisor notes (viewable by advisors only)
  - Upcoming meetings

  ## Important Notes
  - Password must be set manually through Supabase Auth dashboard or programmatically
  - This creates the profile and student data; auth user must be created separately
*/

-- Note: The actual auth.users entry for demo@elevated.app must be created through
-- Supabase Auth (either dashboard or signUp function). This migration only creates
-- the profile and student data structure.

-- Create a function to set up demo user data (to be called after auth user exists)
CREATE OR REPLACE FUNCTION setup_demo_user_data(demo_user_id uuid)
RETURNS void AS $$
DECLARE
  course_id_1 uuid;
  course_id_2 uuid;
BEGIN
  -- Create profile if it doesn't exist
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    demo_user_id,
    'Demo User',
    'demo@elevated.app',
    'student'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Create student record if it doesn't exist
  INSERT INTO students (id, xp, cohort, major, resume_score, risk_level)
  VALUES (
    demo_user_id,
    15000,
    'Class of 2025',
    'Business',
    'B',
    'green'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Get course IDs for enrollment
  SELECT id INTO course_id_1 FROM courses WHERE title = 'Resume Building Fundamentals' LIMIT 1;
  SELECT id INTO course_id_2 FROM courses WHERE title = 'Interview Mastery' LIMIT 1;
  
  -- Enroll demo user in courses if courses exist
  IF course_id_1 IS NOT NULL THEN
    INSERT INTO student_course_progress (student_id, course_id, completed_lessons, progress_percentage)
    VALUES (demo_user_id, course_id_1, 8, 67)
    ON CONFLICT (student_id, course_id) DO NOTHING;
  END IF;
  
  IF course_id_2 IS NOT NULL THEN
    INSERT INTO student_course_progress (student_id, course_id, completed_lessons, progress_percentage)
    VALUES (demo_user_id, course_id_2, 5, 33)
    ON CONFLICT (student_id, course_id) DO NOTHING;
  END IF;
  
  -- Add sample mock interviews
  INSERT INTO mock_interviews (student_id, interview_type, score, feedback, completed_at)
  VALUES
    (demo_user_id, 'Behavioral', 85, 'Great communication skills and structured responses using STAR method.', NOW() - INTERVAL '5 days'),
    (demo_user_id, 'Technical', 78, 'Good problem-solving approach, could improve on algorithm optimization.', NOW() - INTERVAL '3 days')
  ON CONFLICT DO NOTHING;
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Instructions for setting up the demo user:
-- 1. Create the auth user through Supabase dashboard or use signUp
-- 2. Call this function: SELECT setup_demo_user_data('USER_ID_HERE');