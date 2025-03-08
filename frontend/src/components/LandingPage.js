// src/components/LandingPage.js
import React from 'react';
import { Box, Typography, Paper, Button, Container, Grid } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileUpload from './FileUpload';

function LandingPage({ onFileUpload }) {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Data Science Web Application
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Clean, transform, and analyze your data with ease
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <UploadFileIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Upload Your Data
            </Typography>
            <Typography color="text.secondary" paragraph align="center">
              Start by uploading a CSV file. We support files of various sizes and formats.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}>🧹</Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Clean Your Data
            </Typography>
            <Typography color="text.secondary" paragraph align="center">
              Handle missing values, remove duplicates, and transform columns with our intuitive interface.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}>📊</Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Analyze Results
            </Typography>
            <Typography color="text.secondary" paragraph align="center">
              View and export your cleaned data ready for analysis or machine learning.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          maxWidth: 600,
          mx: 'auto',
          mb: 8
        }}
      >
        <Typography variant="h5" gutterBottom>
          Get Started
        </Typography>
        <Typography color="text.secondary" paragraph align="center" sx={{ mb: 3 }}>
          Upload your CSV file to begin cleaning and analyzing your data.
        </Typography>
        <FileUpload onFileUpload={onFileUpload} />
      </Paper>
    </Container>
  );
}

export default LandingPage;