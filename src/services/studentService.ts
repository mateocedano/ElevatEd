import { supabase } from '../lib/supabase'

export interface Student {
  id: string
  full_name: string
  email: string
  xp: number
  cohort: string
  major: string
  resume_score: string
  risk_level: 'green' | 'yellow' | 'red'
  last_login: string
}

export interface StudentProgress {
  student_id: string
  course_id: string
  completed_lessons: number
  progress_percentage: number
  last_accessed: string
}

export interface MockInterview {
  id: string
  student_id: string
  interview_type: 'Behavioral' | 'Technical'
  score: number
  completed_at: string
}

export interface AdvisorNote {
  id: string
  advisor_id: string
  student_id: string
  note_text: string
  created_at: string
}

export interface Meeting {
  id: string
  advisor_id: string
  student_id: string
  topic: string
  scheduled_time: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export const studentService = {
  async getStudentsByAdvisor(advisorId: string): Promise<Student[]> {
    if (!supabase) {
      console.error('Supabase not configured')
      return []
    }

    const { data, error } = await supabase
      .from('students')
      .select(`
        id,
        xp,
        cohort,
        major,
        resume_score,
        risk_level,
        last_login,
        profiles!inner(
          full_name,
          email
        )
      `)
      .order('xp', { ascending: false })

    if (error) {
      console.error('Error fetching students:', error)
      return []
    }

    return (data || []).map((student: any) => ({
      id: student.id,
      full_name: student.profiles.full_name,
      email: student.profiles.email,
      xp: student.xp,
      cohort: student.cohort,
      major: student.major,
      resume_score: student.resume_score,
      risk_level: student.risk_level,
      last_login: student.last_login
    }))
  },

  async getStudentById(studentId: string): Promise<Student | null> {
    if (!supabase) {
      console.error('Supabase not configured')
      return null
    }

    const { data, error } = await supabase
      .from('students')
      .select(`
        id,
        xp,
        cohort,
        major,
        resume_score,
        risk_level,
        last_login,
        profiles!inner(
          full_name,
          email
        )
      `)
      .eq('id', studentId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching student:', error)
      return null
    }

    if (!data) return null

    return {
      id: data.id,
      full_name: data.profiles.full_name,
      email: data.profiles.email,
      xp: data.xp,
      cohort: data.cohort,
      major: data.major,
      resume_score: data.resume_score,
      risk_level: data.risk_level,
      last_login: data.last_login
    }
  },

  async getStudentProgress(studentId: string): Promise<StudentProgress[]> {
    if (!supabase) {
      console.error('Supabase not configured')
      return []
    }

    const { data, error } = await supabase
      .from('student_course_progress')
      .select('*')
      .eq('student_id', studentId)

    if (error) {
      console.error('Error fetching progress:', error)
      return []
    }

    return data || []
  },

  async getStudentInterviews(studentId: string): Promise<MockInterview[]> {
    if (!supabase) {
      console.error('Supabase not configured')
      return []
    }

    const { data, error } = await supabase
      .from('mock_interviews')
      .select('*')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('Error fetching interviews:', error)
      return []
    }

    return data || []
  },

  async getAdvisorNotes(advisorId: string, studentId: string): Promise<AdvisorNote[]> {
    if (!supabase) {
      console.error('Supabase not configured')
      return []
    }

    const { data, error } = await supabase
      .from('advisor_notes')
      .select('*')
      .eq('advisor_id', advisorId)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', error)
      return []
    }

    return data || []
  },

  async createAdvisorNote(advisorId: string, studentId: string, noteText: string): Promise<boolean> {
    if (!supabase) {
      console.error('Supabase not configured')
      return false
    }

    const { error } = await supabase
      .from('advisor_notes')
      .insert({
        advisor_id: advisorId,
        student_id: studentId,
        note_text: noteText
      })

    if (error) {
      console.error('Error creating note:', error)
      return false
    }

    return true
  },

  async getStudentMeetings(studentId: string): Promise<Meeting[]> {
    if (!supabase) {
      console.error('Supabase not configured')
      return []
    }

    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('student_id', studentId)
      .order('scheduled_time', { ascending: true })

    if (error) {
      console.error('Error fetching meetings:', error)
      return []
    }

    return data || []
  },

  async updateStudentXP(studentId: string, xpToAdd: number): Promise<boolean> {
    if (!supabase) {
      console.error('Supabase not configured')
      return false
    }

    const { error } = await supabase.rpc('increment_student_xp', {
      student_id: studentId,
      xp_amount: xpToAdd
    })

    if (error) {
      console.error('Error updating XP:', error)
      return false
    }

    return true
  },

  async updateLastLogin(studentId: string): Promise<boolean> {
    if (!supabase) {
      console.error('Supabase not configured')
      return false
    }

    const { error } = await supabase
      .from('students')
      .update({ last_login: new Date().toISOString() })
      .eq('id', studentId)

    if (error) {
      console.error('Error updating last login:', error)
      return false
    }

    return true
  }
}
