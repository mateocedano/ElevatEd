/*
  # Add Helper Functions and Seed Data

  ## Overview
  This migration adds utility functions for common operations and seeds the database
  with initial course data to get the platform started.

  ## New Functions

  ### 1. `increment_student_xp`
  Safely increments a student's XP by a specified amount
  - Parameters: student_id (uuid), xp_amount (integer)
  - Returns: void
  - Used when students complete lessons or activities

  ### 2. `calculate_risk_level`
  Automatically calculates and updates student risk levels based on:
  - Last login time (inactive > 7 days = higher risk)
  - XP progress (low XP = higher risk)
  - Interview scores (low scores = higher risk)
  - Runs as a scheduled job or can be called manually

  ### 3. `get_advisor_dashboard_stats`
  Returns aggregated statistics for an advisor's dashboard
  - Parameters: advisor_id (uuid)
  - Returns: JSON with student counts, risk levels, avg XP, etc.

  ## Seed Data

  ### Courses
  Adds 5 starter courses covering common career development topics:
  1. Resume Building Fundamentals
  2. Interview Mastery
  3. LinkedIn Optimization
  4. Technical Interview Prep
  5. Networking Strategies

  ## Important Notes
  - Helper functions use SECURITY DEFINER to allow necessary operations
  - Risk level calculation considers multiple factors for accurate assessment
  - Seed data provides immediate value for new users
*/

-- Function to increment student XP
CREATE OR REPLACE FUNCTION increment_student_xp(
  student_id uuid,
  xp_amount integer
)
RETURNS void AS $$
BEGIN
  UPDATE students
  SET xp = xp + xp_amount,
      updated_at = now()
  WHERE id = student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate and update risk levels
CREATE OR REPLACE FUNCTION calculate_risk_level(student_id uuid)
RETURNS text AS $$
DECLARE
  days_since_login integer;
  student_xp integer;
  avg_interview_score numeric;
  risk text;
BEGIN
  -- Get days since last login
  SELECT EXTRACT(DAY FROM (now() - last_login))
  INTO days_since_login
  FROM students
  WHERE id = student_id;
  
  -- Get student XP
  SELECT xp INTO student_xp
  FROM students
  WHERE id = student_id;
  
  -- Get average interview score
  SELECT AVG(score) INTO avg_interview_score
  FROM mock_interviews
  WHERE mock_interviews.student_id = calculate_risk_level.student_id;
  
  -- Calculate risk level
  IF days_since_login > 7 OR student_xp < 5000 OR (avg_interview_score IS NOT NULL AND avg_interview_score < 60) THEN
    risk := 'red';
  ELSIF days_since_login > 3 OR student_xp < 10000 OR (avg_interview_score IS NOT NULL AND avg_interview_score < 75) THEN
    risk := 'yellow';
  ELSE
    risk := 'green';
  END IF;
  
  -- Update the student record
  UPDATE students
  SET risk_level = risk,
      updated_at = now()
  WHERE id = student_id;
  
  RETURN risk;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get advisor dashboard statistics
CREATE OR REPLACE FUNCTION get_advisor_dashboard_stats(advisor_id uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_students', COUNT(DISTINCT asa.student_id),
    'students_at_risk', COUNT(DISTINCT CASE WHEN s.risk_level = 'red' THEN s.id END),
    'students_inconsistent', COUNT(DISTINCT CASE WHEN s.risk_level = 'yellow' THEN s.id END),
    'students_on_track', COUNT(DISTINCT CASE WHEN s.risk_level = 'green' THEN s.id END),
    'avg_xp', COALESCE(AVG(s.xp), 0),
    'total_interviews', COUNT(mi.id),
    'avg_interview_score', COALESCE(AVG(mi.score), 0)
  ) INTO result
  FROM advisor_student_assignments asa
  LEFT JOIN students s ON s.id = asa.student_id
  LEFT JOIN mock_interviews mi ON mi.student_id = s.id
  WHERE asa.advisor_id = get_advisor_dashboard_stats.advisor_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed courses
INSERT INTO courses (title, description, total_lessons, estimated_hours, difficulty) VALUES
(
  'Resume Building Fundamentals',
  'Learn how to create a compelling resume that gets noticed by recruiters. Master the art of highlighting your skills, experience, and achievements in a clear and professional format.',
  12,
  8,
  'beginner'
),
(
  'Interview Mastery',
  'Develop the confidence and skills needed to excel in job interviews. Practice common questions, learn behavioral interview techniques, and understand what employers are looking for.',
  15,
  10,
  'intermediate'
),
(
  'LinkedIn Optimization',
  'Transform your LinkedIn profile into a powerful personal branding tool. Learn networking strategies, content creation, and how to attract recruiters and opportunities.',
  10,
  6,
  'beginner'
),
(
  'Technical Interview Prep',
  'Prepare for technical interviews with comprehensive coding challenges, system design questions, and problem-solving strategies used by top tech companies.',
  20,
  25,
  'advanced'
),
(
  'Networking Strategies',
  'Build meaningful professional relationships that advance your career. Learn effective networking techniques, elevator pitches, and how to maintain valuable connections.',
  8,
  5,
  'beginner'
)
ON CONFLICT DO NOTHING;

-- Create a scheduled job trigger to update risk levels (optional, can be run manually)
-- This would typically be set up as a cron job in production
CREATE OR REPLACE FUNCTION update_all_risk_levels()
RETURNS void AS $$
DECLARE
  student_record RECORD;
BEGIN
  FOR student_record IN SELECT id FROM students LOOP
    PERFORM calculate_risk_level(student_record.id);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;