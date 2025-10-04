import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createDemoUser() {
  console.log('Creating demo user...')

  const { data, error } = await supabase.auth.admin.createUser({
    email: 'demo@elevated.app',
    password: 'DemoPassword123!',
    email_confirm: true,
    user_metadata: {
      full_name: 'Demo User',
      role: 'student'
    }
  })

  if (error) {
    console.error('Error creating demo user:', error.message)
    return
  }

  console.log('Demo user created successfully:', data.user.id)

  console.log('Setting up demo user data...')
  const { error: setupError } = await supabase.rpc('setup_demo_user_data', {
    demo_user_id: data.user.id
  })

  if (setupError) {
    console.error('Error setting up demo data:', setupError.message)
    return
  }

  console.log('Demo user fully configured!')
  console.log('Email: demo@elevated.app')
  console.log('Password: DemoPassword123!')
}

createDemoUser()
