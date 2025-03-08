// src/App.js
import React, { useState } from 'react';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, Typography, IconButton, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LandingPage from './components/LandingPage';
import FilterSidebar from './components/FilterSidebar';
import DataContent from './components/DataContent';
import axios from 'axios';

// Set the API URL (use localhost for development)
const API_URL = 'http://localhost:8080';

// Define drawer width
const drawerWidth = 350; // Increased width for sidebar

function App() {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [stats, setStats] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [viewOptions, setViewOptions] = useState({
    type: 'head',
    n: 10,
    start: 0
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to fetch data with view options
  const fetchDataWithView = async (filename, options) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/data-view/${filename}?type=${options.type}&n=${options.n}&start=${options.start}`
      );
      setData(response.data.data);
    } catch (err) {
      setError('Error loading data view: ' + (err.response?.data?.error || 'Please try again.'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // File upload handler
  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    const formData = new FormData();
    formData.append('file', uploadedFile);
    
    try {
      const response = await axios.post(`${API_URL}/upload`, formData);
      setFilename(response.data.filename);
      setStats(response.data.stats);
      
      await fetchDataWithView(response.data.filename, viewOptions);
      setSuccessMessage('File uploaded and analyzed successfully!');
      // Open sidebar when file is uploaded
      setSidebarOpen(true);
    } catch (err) {
      setError('Error uploading file: ' + (err.response?.data?.error || 'Please try again.'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Data cleaning handler
  const handleCleanData = async (operations) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await axios.post(`${API_URL}/clean`, {
        filename: filename,
        operations: operations
      });
      
      setFilename(response.data.cleaned_filename);
      
      let successMsg = `Data cleaned successfully!`;
      if (response.data.rows_removed > 0) {
        successMsg += ` Removed ${response.data.rows_removed} rows.`;
      }
      if (response.data.columns_removed > 0) {
        successMsg += ` Removed ${response.data.columns_removed} columns.`;
      }
      
      setSuccessMessage(successMsg);
      
      await fetchDataWithView(response.data.cleaned_filename, viewOptions);
      
      try {
        const uploadResponse = await axios.get(`${API_URL}/upload-stats/${response.data.cleaned_filename}`);
        setStats(uploadResponse.data.stats);
      } catch (statsErr) {
        console.warn('Could not fetch updated stats:', statsErr);
      }
    } catch (err) {
      setError('Error cleaning data: ' + (err.response?.data?.error || 'Please try again.'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // View change handler
  const handleViewChange = (newViewOptions) => {
    setViewOptions(newViewOptions);
    if (filename) {
      fetchDataWithView(filename, newViewOptions);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Determine if we should show landing page or data page
  const showLandingPage = !stats;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {!showLandingPage && (
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={toggleSidebar}
              sx={{ mr: 2 }}
            >
              {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Data Science Web App
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar - only show after file upload */}
      {!showLandingPage && (
        <Drawer
          variant="persistent"
          open={sidebarOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              paddingTop: '64px' // Height of AppBar
            },
          }}
        >
          <Box sx={{ overflow: 'auto', p: 2 }}>
            <FilterSidebar 
              onFileUpload={handleFileUpload}
              onCleanData={handleCleanData}
              stats={stats}
              filename={filename}
              onViewChange={handleViewChange}
            />
          </Box>
        </Drawer>
      )}
      
      {/* Main content - conditionally rendered based on page */}
      {showLandingPage ? (
        // Landing page - full width without sidebar margins
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            width: '100%',
            pt: 8, // Account for AppBar height
          }}
        >
          <LandingPage onFileUpload={handleFileUpload} />
        </Box>
      ) : (
        // Data page - with adjusted margins for sidebar
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            p: 2,
            pl: 1,
            pt: 8, // Account for AppBar height
            ml: sidebarOpen ? `${drawerWidth}px` : 0,
            transition: theme => theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <DataContent 
            data={data}
            stats={stats}
            loading={loading}
            error={error}
            successMessage={successMessage}
          />
        </Box>
      )}
    </Box>
  );
}

export default App;