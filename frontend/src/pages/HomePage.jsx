import { Typography, Box, Paper, Grid, Button, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import FlightIcon from '@mui/icons-material/Flight'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PersonIcon from '@mui/icons-material/Person'
import { testApiConnection } from '../utils/apiTest'

const HomePage = () => {
  const navigate = useNavigate()
  const [apiStatus, setApiStatus] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkApi = async () => {
      try {
        const isConnected = await testApiConnection()
        setApiStatus(isConnected)
      } catch (err) {
        console.error('API check error:', err)
        setError('Failed to connect to API')
        setApiStatus(false)
      }
    }
    checkApi()
  }, [])

  return (
    <Box>
      {/* Test message to see if React is working */}
      <Typography variant="h2" component="h1" gutterBottom align="center" color="primary">
        🛩️ Airport Booking System is Working!
      </Typography>
      
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Welcome to Airport Booking System
      </Typography>
      
      <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary">
        Book your flights with ease and comfort
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      )}
      {apiStatus !== null && !error && (
        <Alert 
          severity={apiStatus ? 'success' : 'error'} 
          sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}
        >
          {apiStatus ? 'Backend API is connected' : 'Backend API is not available'}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <FlightIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Search Flights
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Find available flights and book your tickets
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/flights')}
            >
              Browse Flights
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <ShoppingCartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              My Orders
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              View and manage your booking history
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/orders')}
            >
              View Orders
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Account
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Manage your account and preferences
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default HomePage 