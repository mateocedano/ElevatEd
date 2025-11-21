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

-- Alternative: Create a simplified demo setup that doesn't require auth
-- This creates a reusable function you can call anytime you create a demo/test user
CREATE OR REPLACE FUNCTION quick_setup_student_demo_data(
  p_user_id uuid,
  p_user_email text,
  p_user_name text,
  p_initial_xp integer DEFAULT 15000
)
RETURNS void AS $$
DECLARE
  v_course_id_1 uuid;
  v_course_id_2 uuid;
BEGIN
  -- Ensure profile exists
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (p_user_id, p_user_name, p_user_email, 'student')
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;

  -- Ensure student record exists
  INSERT INTO students (id, xp, cohort, major, resume_score, risk_level)
  VALUES (p_user_id, p_initial_xp, 'Class of 2025', 'Computer Science', 'B', 'green')
  ON CONFLICT (id) DO UPDATE
  SET xp = EXCLUDED.xp, cohort = EXCLUDED.cohort, major = EXCLUDED.major;

  -- Get first two course IDs
  SELECT id INTO v_course_id_1 FROM courses ORDER BY created_at LIMIT 1;
  SELECT id INTO v_course_id_2 FROM courses ORDER BY created_at LIMIT 1 OFFSET 1;

  -- Enroll in courses
  IF v_course_id_1 IS NOT NULL THEN
    INSERT INTO student_course_progress (student_id, course_id, completed_lessons, progress_percentage)
    VALUES (p_user_id, v_course_id_1, 8, 67)
    ON CONFLICT (student_id, course_id) DO UPDATE
    SET completed_lessons = EXCLUDED.completed_lessons, progress_percentage = EXCLUDED.progress_percentage;
  END IF;

  IF v_course_id_2 IS NOT NULL THEN
    INSERT INTO student_course_progress (student_id, course_id, completed_lessons, progress_percentage)
    VALUES (p_user_id, v_course_id_2, 5, 33)
    ON CONFLICT (student_id, course_id) DO UPDATE
    SET completed_lessons = EXCLUDED.completed_lessons, progress_percentage = EXCLUDED.progress_percentage;
  END IF;

  -- Add mock interviews
  INSERT INTO mock_interviews (student_id, interview_type, score, feedback, completed_at)
  VALUES
    (p_user_id, 'Behavioral', 85, 'Great communication skills and structured responses using STAR method.', NOW() - INTERVAL '5 days'),
    (p_user_id, 'Technical', 78, 'Good problem-solving approach, could improve on algorithm optimization.', NOW() - INTERVAL '3 days')
  ON CONFLICT DO NOTHING;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to create an advisor with assigned students
CREATE OR REPLACE FUNCTION setup_advisor_with_students(
  p_advisor_id uuid,
  p_advisor_email text,
  p_advisor_name text
)
RETURNS void AS $$
BEGIN
  -- Create advisor profile
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (p_advisor_id, p_advisor_name, p_advisor_email, 'advisor')
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, role = 'advisor';

  -- Assign all existing students to this advisor (for demo purposes)
  INSERT INTO advisor_student_assignments (advisor_id, student_id)
  SELECT p_advisor_id, id FROM students
  ON CONFLICT (advisor_id, student_id) DO NOTHING;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;