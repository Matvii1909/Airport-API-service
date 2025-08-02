import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if user is admin (is_staff or is_superuser)
  if (!user || (!user.is_staff && !user.is_superuser)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute 