import { supabase } from '../lib/supabase'

export interface Course {
  id: string
  title: string
  description: string
  thumbnail_url?: string
  total_lessons: number
  estimated_hours: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    if (!supabase) {
      console.error('Supabase not configured')
      return []
    }

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching courses:', error)
      return []
    }

    return data || []
  },

  async getCourseById(courseId: string): Promise<Course | null> {
    if (!supabase) {
      console.error('Supabase not configured')
      return null
    }

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching course:', error)
      return null
    }

    return data
  },

  async enrollInCourse(studentId: string, courseId: string): Promise<boolean> {
    if (!supabase) {
      console.error('Supabase not configured')
      return false
    }

    const { error } = await supabase
      .from('student_course_progress')
      .insert({
        student_id: studentId,
        course_id: courseId,
        completed_lessons: 0,
        progress_percentage: 0
      })

    if (error) {
      console.error('Error enrolling in course:', error)
      return false
    }

    return true
  },

  async updateCourseProgress(
    studentId: string,
    courseId: string,
    completedLessons: number,
    totalLessons: number
  ): Promise<boolean> {
    if (!supabase) {
      console.error('Supabase not configured')
      return false
    }

    const progressPercentage = Math.round((completedLessons / totalLessons) * 100)

    const { error } = await supabase
      .from('student_course_progress')
      .update({
        completed_lessons: completedLessons,
        progress_percentage: progressPercentage,
        last_accessed: new Date().toISOString(),
        completed_at: progressPercentage === 100 ? new Date().toISOString() : null
      })
      .eq('student_id', studentId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error updating progress:', error)
      return false
    }

    return true
  }
}
