import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../lib/store';

function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect to login but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
