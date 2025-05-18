import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #4a90e2, #145ea8)",
          color: "white",
          textAlign: "center",
          py: 6, 
        }}
      >
        <Container>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
            Welcome to MERN Todo App
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Organize your tasks, stay productive, and achieve more with our simple yet powerful todo app.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/login")}
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            onClick={() => navigate("/register")}
          >
            Create Account
          </Button>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;
