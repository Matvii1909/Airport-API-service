import { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flight as FlightIcon,
  LocationOn as AirportIcon,
  FlightTakeoff as AirplaneIcon,
  Route as RouteIcon,
} from '@mui/icons-material'
import { format } from 'date-fns'
import api from '../services/api'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [flights, setFlights] = useState([])
  const [airports, setAirports] = useState([])
  const [airplanes, setAirplanes] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [flightsRes, airportsRes, airplanesRes, routesRes] = await Promise.all([
        api.get('/airport/flights/'),
        api.get('/airport/airports/'),
        api.get('/airport/airplanes/'),
        api.get('/airport/routes/'),
      ])
      
      setFlights(flightsRes.data)
      setAirports(airportsRes.data)
      setAirplanes(airplanesRes.data)
      setRoutes(routesRes.data)
    } catch (error) {
      setError('Failed to fetch data')
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type)
    setEditingItem(item)
    setFormData(item ? { ...item } : {})
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingItem(null)
    setFormData({})
  }

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await api.put(`/airport/${dialogType}/${editingItem.id}/`, formData)
      } else {
        await api.post(`/airport/${dialogType}/`, formData)
      }
      fetchData()
      handleCloseDialog()
    } catch (error) {
      setError(`Failed to ${editingItem ? 'update' : 'create'} ${dialogType}`)
      console.error('Error submitting form:', error)
    }
  }

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/airport/${type}/${id}/`)
        fetchData()
      } catch (error) {
        setError(`Failed to delete ${type}`)
        console.error('Error deleting item:', error)
      }
    }
  }

  const renderFlightsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Flights</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('flights')}
          >
            Add Flight
          </Button>
        </Box>
      </Grid>
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
              <IconButton
                size="small"
                onClick={() => handleOpenDialog('flights', flight)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete('flights', flight.id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  const renderAirportsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Airports</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('airports')}
          >
            Add Airport
          </Button>
        </Box>
      </Grid>
      {airports.map((airport) => (
        <Grid item xs={12} md={6} lg={4} key={airport.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {airport.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                City: {airport.closest_big_city}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton
                size="small"
                onClick={() => handleOpenDialog('airports', airport)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete('airports', airport.id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  const renderAirplanesTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Airplanes</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('airplanes')}
          >
            Add Airplane
          </Button>
        </Box>
      </Grid>
      {airplanes.map((airplane) => (
        <Grid item xs={12} md={6} lg={4} key={airplane.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {airplane.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rows: {airplane.rows}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Seats per row: {airplane.seats_in_row}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Capacity: {airplane.capacity}
              </Typography>
              {airplane.types && airplane.types.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {airplane.types.map((type) => (
                    <Chip key={type.id} label={type.name} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </Box>
              )}
            </CardContent>
            <CardActions>
              <IconButton
                size="small"
                onClick={() => handleOpenDialog('airplanes', airplane)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete('airplanes', airplane.id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  const renderRoutesTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Routes</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('routes')}
          >
            Add Route
          </Button>
        </Box>
      </Grid>
      {routes.map((route) => (
        <Grid item xs={12} md={6} lg={4} key={route.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {route.source.name} → {route.destination.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Distance: {route.distance} km
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton
                size="small"
                onClick={() => handleOpenDialog('routes', route)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete('routes', route.id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  const renderDialog = () => {
    const getDialogTitle = () => {
      const action = editingItem ? 'Edit' : 'Add'
      const item = dialogType.slice(0, -1) // Remove 's' from plural
      return `${action} ${item.charAt(0).toUpperCase() + item.slice(1)}`
    }

    const renderForm = () => {
      switch (dialogType) {
        case 'flights':
          return (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Route</InputLabel>
                <Select
                  value={formData.route || ''}
                  label="Route"
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                >
                  {routes.map((route) => (
                    <MenuItem key={route.id} value={route.id}>
                      {route.source.name} → {route.destination.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Airplane</InputLabel>
                <Select
                  value={formData.airplane || ''}
                  label="Airplane"
                  onChange={(e) => setFormData({ ...formData, airplane: e.target.value })}
                >
                  {airplanes.map((airplane) => (
                    <MenuItem key={airplane.id} value={airplane.id}>
                      {airplane.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Departure Time"
                type="datetime-local"
                value={formData.departure_time || ''}
                onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Arrival Time"
                type="datetime-local"
                value={formData.arrival_time || ''}
                onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </>
          )
        case 'airports':
          return (
            <>
              <TextField
                fullWidth
                label="Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Closest Big City"
                value={formData.closest_big_city || ''}
                onChange={(e) => setFormData({ ...formData, closest_big_city: e.target.value })}
              />
            </>
          )
        case 'airplanes':
          return (
            <>
              <TextField
                fullWidth
                label="Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Rows"
                type="number"
                value={formData.rows || ''}
                onChange={(e) => setFormData({ ...formData, rows: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Seats per Row"
                type="number"
                value={formData.seats_in_row || ''}
                onChange={(e) => setFormData({ ...formData, seats_in_row: e.target.value })}
              />
            </>
          )
        case 'routes':
          return (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Source Airport</InputLabel>
                <Select
                  value={formData.source || ''}
                  label="Source Airport"
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                >
                  {airports.map((airport) => (
                    <MenuItem key={airport.id} value={airport.id}>
                      {airport.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Destination Airport</InputLabel>
                <Select
                  value={formData.destination || ''}
                  label="Destination Airport"
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                >
                  {airports.map((airport) => (
                    <MenuItem key={airport.id} value={airport.id}>
                      {airport.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Distance (km)"
                type="number"
                value={formData.distance || ''}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              />
            </>
          )
        default:
          return null
      }
    }

    return (
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{getDialogTitle()}</DialogTitle>
        <DialogContent>
          {renderForm()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Panel
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="admin tabs">
          <Tab icon={<FlightIcon />} label="Flights" />
          <Tab icon={<AirportIcon />} label="Airports" />
          <Tab icon={<AirplaneIcon />} label="Airplanes" />
          <Tab icon={<RouteIcon />} label="Routes" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {activeTab === 0 && renderFlightsTab()}
          {activeTab === 1 && renderAirportsTab()}
          {activeTab === 2 && renderAirplanesTab()}
          {activeTab === 3 && renderRoutesTab()}
        </Box>
      )}

      {renderDialog()}
    </Box>
  )
}

export default AdminPage 