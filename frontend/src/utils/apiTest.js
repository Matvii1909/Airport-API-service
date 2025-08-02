// Utility to test API connection
export const testApiConnection = async () => {
  try {
    const response = await fetch('/api/airport/airports/')
    if (response.ok) {
      console.log('✅ API connection successful')
      return true
    } else {
      console.error('❌ API connection failed:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ API connection error:', error)
    return false
  }
}

// Test authentication
export const testAuth = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.log('ℹ️ No auth token found')
      return false
    }

    const response = await fetch('/api/user/me/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      console.log('✅ Authentication successful')
      return true
    } else {
      console.log('❌ Authentication failed')
      return false
    }
  } catch (error) {
    console.error('❌ Authentication error:', error)
    return false
  }
} 