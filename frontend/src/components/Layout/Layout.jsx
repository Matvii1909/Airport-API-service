import { Outlet } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material'
import useAuthStore from '../../store/authStore'

const Layout = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Airport Booking System
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Home
          </Button>
          <Button color="inherit" onClick={() => navigate('/flights')}>
            Flights
          </Button>
                         {isAuthenticated ? (
                 <>
                   <Button color="inherit" onClick={() => navigate('/orders')}>
                     My Orders
                   </Button>
                   {user && (user.is_staff || user.is_superuser) && (
                     <Button 
                       color="inherit" 
                       onClick={() => navigate('/admin')}
                       startIcon={<AdminIcon />}
                     >
                       Admin
                     </Button>
                   )}
                   <Button color="inherit" onClick={handleLogout}>
                     Logout
                   </Button>
                 </>
               ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default Layout 