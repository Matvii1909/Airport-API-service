import { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material'
import { format } from 'date-fns'
import api from '../services/api'

const FlightsPage = () => {
  const [flights, setFlights] = useState([])
  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    departure_date: '',
    route: '',
  })

  useEffect(() => {
    fetchAirports()
    fetchFlights()
  }, [])

  const fetchAirports = async () => {
    try {
      const response = await api.get('/airport/airports/')
      setAirports(response.data)
    } catch (error) {
      console.error('Error fetching airports:', error)
    }
  }

  const fetchFlights = async () => {
    setLoading(true)
    setError('')
    
    try {
      const params = new URLSearchParams()
      if (filters.departure_date) {
        params.append('departure_date', filters.departure_date)
      }
      if (filters.route) {
        params.append('route', filters.route)
      }

      const response = await api.get(`/airport/flights/?${params.toString()}`)
      setFlights(response.data)
    } catch (error) {
      setError('Failed to fetch flights')
      console.error('Error fetching flights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = () => {
    fetchFlights()
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Flights
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Departure Date"
              type="date"
              value={filters.departure_date}
              onChange={(e) => handleFilterChange('departure_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Route</InputLabel>
              <Select
                value={filters.route}
                label="Route"
                onChange={(e) => handleFilterChange('route', e.target.value)}
              >
                <MenuItem value="">All Routes</MenuItem>
                {airports.map((airport) => (
                  <MenuItem key={airport.id} value={airport.id}>
                    {airport.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {flights.map((flight) => (
            <Grid item xs={12} md={6} lg={4} key={flight.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {flight.route.source.name} → {flight.route.destination.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Airplane: {flight.airplane.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Departure: {format(new Date(flight.departure_time), 'PPp')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Arrival: {format(new Date(flight.arrival_time), 'PPp')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Distance: {flight.route.distance} km
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                  <Button size="small" color="primary">
                    Book Ticket
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && flights.length === 0 && (
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 4 }}>
          No flights found
        </Typography>
      )}
    </Box>
  )
}

export default FlightsPage 