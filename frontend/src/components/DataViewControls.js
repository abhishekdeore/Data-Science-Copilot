import React, { useState } from 'react';
import { 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Stack,
  Divider
} from '@mui/material';

function DataViewControls({ totalRows, onViewChange }) {
  const [viewType, setViewType] = useState('head');
  const [numRows, setNumRows] = useState(10);
  const [startRow, setStartRow] = useState(0);

  const handleViewTypeChange = (event) => {
    setViewType(event.target.value);
  };

  const handleNumRowsChange = (event) => {
    setNumRows(Math.max(1, Math.min(100, parseInt(event.target.value) || 10)));
  };

  const handleStartRowChange = (event) => {
    setStartRow(Math.max(0, Math.min(totalRows - 1, parseInt(event.target.value) || 0)));
  };

  const handleApply = () => {
    onViewChange({
      type: viewType,
      n: numRows,
      start: startRow
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>Data View Controls</Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>View Type</InputLabel>
          <Select
            value={viewType}
            label="View Type"
            onChange={handleViewTypeChange}
          >
            <MenuItem value="head">Head (First Rows)</MenuItem>
            <MenuItem value="tail">Tail (Last Rows)</MenuItem>
            <MenuItem value="range">Custom Range</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          label="Number of Rows"
          type="number"
          value={numRows}
          onChange={handleNumRowsChange}
          InputProps={{ inputProps: { min: 1, max: 100 } }}
          sx={{ width: 150 }}
        />
        
        {viewType === 'range' && (
          <TextField
            label="Start Row"
            type="number"
            value={startRow}
            onChange={handleStartRowChange}
            InputProps={{ inputProps: { min: 0, max: totalRows - 1 } }}
            sx={{ width: 150 }}
          />
        )}
        
        <Button 
          variant="contained" 
          onClick={handleApply}
        >
          Apply View
        </Button>
      </Stack>
      
      <Typography variant="body2" color="text.secondary">
        {viewType === 'head' && `Showing first ${numRows} rows of ${totalRows} total rows`}
        {viewType === 'tail' && `Showing last ${numRows} rows of ${totalRows} total rows`}
        {viewType === 'range' && `Showing ${numRows} rows starting from row ${startRow} (of ${totalRows} total rows)`}
      </Typography>
    </Box>
  );
}

export default DataViewControls;