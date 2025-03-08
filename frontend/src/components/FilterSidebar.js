// src/components/FilterSidebar.js
import React from 'react';
import { Box, Typography, Divider, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileUpload from './FileUpload';
import CustomCleaningOptions from './CustomCleaningOptions';
import DataViewControls from './DataViewControls';

function FilterSidebar({ onFileUpload, onCleanData, stats, filename, onViewChange }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Data Wrangling Tools
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Use these tools to clean and transform your dataset.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Upload New File</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FileUpload onFileUpload={onFileUpload} />
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Data View Controls</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DataViewControls 
            totalRows={stats?.rows || 0} 
            onViewChange={onViewChange} 
          />
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Data Cleaning Operations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CustomCleaningOptions 
            onClean={onCleanData} 
            stats={stats} 
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default FilterSidebar;