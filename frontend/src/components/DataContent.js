// In DataContent.js, modify the structure to make the overview fixed
import React from 'react';
import { Box, Paper, Typography, Alert, CircularProgress, Stack } from '@mui/material';
import ExcelStyleTable from './ExcelStyleTable';

function DataContent({ data, stats, loading, error, successMessage }) {
  return (
    <Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {stats && !loading && (
        <Stack spacing={2} sx={{ position: 'relative' }}>
          {/* Fixed Dataset Overview */}
          <Paper 
            sx={{ 
              p: 2, 
              mb: 2, 
              position: 'sticky',
              top: 0,
              zIndex: 10,
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant="h6">Dataset Overview</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="subtitle2">Rows:</Typography>
                <Typography variant="body1">{stats.rows}</Typography>
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="subtitle2">Columns:</Typography>
                <Typography variant="body1">{stats.columns}</Typography>
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="subtitle2">Duplicate Rows:</Typography>
                <Typography variant="body1">{stats.duplicate_rows}</Typography>
              </Box>
            </Box>
          </Paper>
          
          {/* Data Preview Section */}
          <Box>
            <Typography variant="h6" gutterBottom>Data Preview</Typography>
            <ExcelStyleTable data={data} />
          </Box>
        </Stack>
      )}
    </Box>
  );
}

export default DataContent;