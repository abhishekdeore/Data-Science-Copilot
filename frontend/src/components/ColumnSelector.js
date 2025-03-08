import React, { useState } from 'react';
import { 
  FormControl, 
  FormGroup, 
  FormControlLabel, 
  Checkbox,
  Typography, 
  Box, 
  Button,
  Paper,
  Divider
} from '@mui/material';

function ColumnSelector({ columns, onColumnsSelected }) {
  const [selectedColumns, setSelectedColumns] = useState([]);

  const handleColumnChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedColumns(prev => [...prev, name]);
    } else {
      setSelectedColumns(prev => prev.filter(col => col !== name));
    }
  };

  const handleApply = () => {
    onColumnsSelected(selectedColumns);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Select Columns to Drop</Typography>
      
      <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
        <FormGroup>
          {columns.map(column => (
            <FormControlLabel
              key={column}
              control={
                <Checkbox
                  checked={selectedColumns.includes(column)}
                  onChange={handleColumnChange}
                  name={column}
                />
              }
              label={column}
            />
          ))}
        </FormGroup>
      </Paper>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2">
          {selectedColumns.length} columns selected for removal
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleApply}
          disabled={selectedColumns.length === 0}
        >
          Apply Column Removal
        </Button>
      </Box>
    </Box>
  );
}

export default ColumnSelector;