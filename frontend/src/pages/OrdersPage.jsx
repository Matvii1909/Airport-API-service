import { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material'
import { format } from 'date-fns'
import api from '../services/api'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await api.get('/airport/orders/')
      setOrders(response.data.results || response.data)
    } catch (error) {
      setError('Failed to fetch orders')
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

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
          {orders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Order #{order.id}
                    </Typography>
                    <Chip 
                      label={format(new Date(order.created_at), 'PP')} 
                      size="small" 
                      color="primary" 
                    />
                  </Box>
                  
                  {order.tickets && order.tickets.map((ticket, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Ticket {index + 1}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Flight: {ticket.flight.route.source.name} → {ticket.flight.route.destination.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Airplane: {ticket.flight.airplane.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Seat: Row {ticket.row}, Seat {ticket.seat}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Departure: {format(new Date(ticket.flight.departure_time), 'PPp')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Arrival: {format(new Date(ticket.flight.arrival_time), 'PPp')}
                      </Typography>
                    </Paper>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && orders.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No orders found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start by booking your first flight!
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default OrdersPage 