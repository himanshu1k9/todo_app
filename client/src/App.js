import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function App() 
{
  const useAuth = useContext(AuthContext);

  const { isAuthenticated, loading } = useAuth;
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Routes>
      <Route path='/' element={< Home />} />
      <Route path='/login' element={< Login />} />
      <Route path='/register' element={< Register />} />
      <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : < Login />} />
    </Routes>
  );
}

export default App;
