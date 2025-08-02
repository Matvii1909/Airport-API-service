import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  Link,
} from '@mui/material'
import useAuthStore from '../store/authStore'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await login(formData)
      navigate('/')
    } catch (error) {
      setError('Invalid email or password')
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link href="/register" underline="hover">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default LoginPage 