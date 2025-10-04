import { supabase } from '../lib/supabase'

export interface DashboardStats {
  total_students: number
  students_at_risk: number
  students_inconsistent: number
  students_on_track: number
  avg_xp: number
  total_interviews: number
  avg_interview_score: number
}

export interface LoginTrend {
  period: string
  value: number
}

export interface InterviewScoreTrend {
  period: string
  value: number
}

export const analyticsService = {
  async getAdvisorDashboardStats(advisorId: string): Promise<DashboardStats | null> {
    if (!supabase) {
      console.error('Supabase not configured')
      return null
    }

    const { data, error } = await supabase
      .rpc('get_advisor_dashboard_stats', { advisor_id: advisorId })

    if (error) {
      console.error('Error fetching dashboard stats:', error)
      return null
    }

    return data
  },

  async getLoginTrends(days: number = 30): Promise<LoginTrend[]> {
    if (!supabase) {
      console.error('Supabase not configured')
      return []
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('students')
      .select('last_login')
      .gte('last_login', startDate.toISOString())

    if (error) {
      console.error('Error fetching login trends:', error)
      return []
    }

    const loginsByDay: Record<string, number> = {}

    data?.forEach(student => {
      const date = new Date(student.last_login).toISOString().split('T')[0]
      loginsByDay[date] = (loginsByDay[date] || 0) + 1
    })

    return Object.entries(loginsByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, value]) => ({ period, value }))
  },

  async getInterviewScoreTrends(days: number = 30): Promise<InterviewScoreTrend[]> {
    if (!supabase) {
      console.error('Supabase not configured')
      return []
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('mock_interviews')
      .select('score, completed_at')
      .gte('completed_at', startDate.toISOString())
      .order('completed_at', { ascending: true })

    if (error) {
      console.error('Error fetching interview trends:', error)
      return []
    }

    const scoresByDay: Record<string, { total: number; count: number }> = {}

    data?.forEach(interview => {
      const date = new Date(interview.completed_at).toISOString().split('T')[0]
      if (!scoresByDay[date]) {
        scoresByDay[date] = { total: 0, count: 0 }
      }
      scoresByDay[date].total += interview.score
      scoresByDay[date].count += 1
    })

    return Object.entries(scoresByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, { total, count }]) => ({
        period,
        value: Math.round(total / count)
      }))
  },

  async getXPTrends(days: number = 30): Promise<LoginTrend[]> {
    if (!supabase) {
      console.error('Supabase not configured')
      return []
    }

    const { data, error } = await supabase
      .from('students')
      .select('xp, updated_at')
      .order('updated_at', { ascending: true })

    if (error) {
      console.error('Error fetching XP trends:', error)
      return []
    }

    const xpByDay: Record<string, number> = {}

    data?.forEach(student => {
      const date = new Date(student.updated_at).toISOString().split('T')[0]
      xpByDay[date] = (xpByDay[date] || 0) + student.xp
    })

    return Object.entries(xpByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-days)
      .map(([period, value]) => ({ period, value }))
  }
}
