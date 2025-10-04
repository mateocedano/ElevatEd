# Demo User Setup Instructions

The demo user account has been configured but needs to be created in Supabase Auth.

## Option 1: Create Demo User via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add User** > **Create new user**
4. Enter the following details:
   - **Email**: `demo@elevated.app`
   - **Password**: `DemoPassword123!`
   - **Auto Confirm User**: ✅ (checked)
5. Click **Create User**
6. Copy the generated User ID
7. Run the following SQL in the **SQL Editor**:

```sql
SELECT setup_demo_user_data('PASTE_USER_ID_HERE');
```

Replace `PASTE_USER_ID_HERE` with the actual UUID from step 6.

## Option 2: Create Demo User via Code

If you have the service role key, you can create the demo user programmatically:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SERVICE_ROLE_KEY'  // NOT the anon key
)

async function createDemoUser() {
  // Create the user
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
    console.error('Error:', error)
    return
  }

  // Set up demo data
  await supabase.rpc('setup_demo_user_data', {
    demo_user_id: data.user.id
  })

  console.log('Demo user created successfully!')
}

createDemoUser()
```

## Demo User Details

Once created, users can access the platform with:

- **Email**: demo@elevated.app
- **Password**: DemoPassword123!

The demo account includes:
- 15,000 XP (moderate level)
- Green risk level (on track)
- Class of 2025, Business major
- 2 courses in progress (Resume Building 67%, Interview Mastery 33%)
- 2 completed mock interviews with scores
- All standard student permissions

## Security Notes

- The demo account has the same Row Level Security restrictions as regular student accounts
- Demo users can only see their own data
- Demo users cannot access other students' information
- The password should be changed if used in production

## Testing Demo Access

After setup, click the **Quick Demo Access** button on the login page to automatically sign in with the demo credentials.
