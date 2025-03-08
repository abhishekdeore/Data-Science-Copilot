// src/components/FileUpload.js
import React, { useState } from 'react';
import { Button, Box, Typography, Paper, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function FileUpload({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        setSelectedFile(file);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '2px dashed #ccc',
          borderRadius: 2,
          backgroundColor: '#fafafa',
          cursor: 'pointer',
          mb: 2
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" align="center" gutterBottom>
          Drag & Drop your CSV file here
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
          or
        </Typography>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Browse Files
          <VisuallyHiddenInput type="file" accept=".csv" onChange={handleFileChange} />
        </Button>
        
        {selectedFile && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Selected: {selectedFile.name}
          </Typography>
        )}
      </Paper>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleUpload}
        disabled={!selectedFile}
        fullWidth
        size="large"
      >
        Upload and Analyze
      </Button>
    </Box>
  );
}

export default FileUpload;