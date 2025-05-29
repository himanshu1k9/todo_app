import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Paper, Typography, Box, Container } from "@mui/material";
import Layout from "../components/layouts/Layout";
import toast from "react-hot-toast";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(' ');
  const useAuth = useContext(AuthContext);
  const { setIsAuthenticated, setUser } = useAuth;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(' ');
    try {
     const res = await axios.post(`${process.env.REACT_APP_SERVER_PATH}/todo/login`, form, {
        withCredentials: true,
    });

      if(res.data.success) {
        toast.success(res.data.message, {duration: 3000});
        setIsAuthenticated(true);
        setUser(res.data.user)
        navigate("/dashboard");
      } else {
        toast.error(res.data.message, {duration: 3000});
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Log in failed');
    }
  };

  return (
   <Layout>
         <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          {error && <p style={{color: 'red'}}>{error}</p>}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
   </Layout>
  );
};

export default Login;
