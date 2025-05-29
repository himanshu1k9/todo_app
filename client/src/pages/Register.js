import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Paper, Typography, Box, Container } from "@mui/material";
import Layout from "../components/layouts/Layout";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_PATH}/todo/user`, form, {withCredentials:true});
      if(res.data?.success) {
        navigate("/login");
      } else {
        setError(res.data?.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occured while registering the user.');
      alert("Registration failed!");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          {error && <p style={{color: 'red'}}>{error}</p>}
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            required
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
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
            Register
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
    </Layout>
  );
};

export default Register;
