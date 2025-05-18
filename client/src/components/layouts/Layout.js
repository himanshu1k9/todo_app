import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box, Container } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Container sx={{ flex: 1, mt: 4, mb: 4 }}>{children}</Container>
      <Footer />
    </Box>
  );
};

export default Layout;
