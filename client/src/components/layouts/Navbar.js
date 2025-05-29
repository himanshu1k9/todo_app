import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const useAuth = useContext(AuthContext);
  const { setIsAuthenticated, user, isAuthenticated, setUser, loading  } = useAuth;
  const handleLogout = async () =>
  {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_PATH}/todo/logout`, {withCredentials: true});
    if(res.data.success)
    {
      toast.success(res.data.message, {duration: 3000});
      setIsAuthenticated(false);
      setUser({});
      navigate('/login');
    }
  }

  if (loading) {
    return (
      <AppBar position="sticky" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="inherit" size={24} />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="sticky" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          MERN Todo
        </Typography>
        <Box>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
              <div style={{ 
                  display: 'inline-block', 
                  height: '40px', 
                  width: '40px',  
                  borderRadius: '50%', 
                  backgroundColor: '#ccc', 
                  textAlign: 'center',
                  lineHeight: '40px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: 'black'
                }}>
                  {user?.userName?.charAt(0)?.toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
