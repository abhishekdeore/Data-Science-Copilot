import React, { useState } from 'react';
import { 
  Box, Typography, Button, Divider, Checkbox, FormControlLabel, 
  FormGroup, TextField, Select, MenuItem, InputLabel, FormControl,
  Paper, Tabs, Tab, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function CustomCleaningOptions({ onClean, stats }) {
  const [tabValue, setTabValue] = useState(0);
  const [duplicateSettings, setDuplicateSettings] = useState({
    dropDuplicates: false,
  });
  
  const [missingSetting, setMissingSetting] = useState([]);
  
  const [columnsToDrop, setColumnsToDrop] = useState([]);
  
  // For custom missing value replacements
  const [customReplacementValue, setCustomReplacementValue] = useState('');
  const [selectedMissingValueType, setSelectedMissingValueType] = useState('null');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('replace');
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleDuplicateChange = (event) => {
    setDuplicateSettings({
      ...duplicateSettings,
      [event.target.name]: event.target.checked
    });
  };
  
  const handleColumnSelectionChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setColumnsToDrop(prev => [...prev, value]);
    } else {
      setColumnsToDrop(prev => prev.filter(col => col !== value));
    }
  };
  
  const addMissingValueRule = () => {
    if (!selectedColumn) return;
    
    const newRule = {
      column: selectedColumn,
      missingType: selectedMissingValueType,
      action: selectedStrategy,
      replacement: selectedStrategy === 'replace' ? customReplacementValue : null
    };
    
    setMissingSetting(prev => [...prev, newRule]);
    
    // Reset form
    setSelectedColumn('');
    setCustomReplacementValue('');
  };
  
  const removeMissingValueRule = (index) => {
    setMissingSetting(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleCleanData = () => {
    const operations = {
      drop_duplicates: duplicateSettings.dropDuplicates,
      drop_columns: columnsToDrop,
      missing_value_operations: missingSetting
    };
    
    onClean(operations);
  };
  
  return (
    <Box>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="cleaning options tabs">
        <Tab label="Missing Values" />
        <Tab label="Duplicates" />
        <Tab label="Columns" />
      </Tabs>
      
      {/* Missing Values Tab */}
      <Box role="tabpanel" hidden={tabValue !== 0} sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Specify how to handle missing values
        </Typography>
        
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Column</InputLabel>
              <Select
                value={selectedColumn}
                label="Column"
                onChange={(e) => setSelectedColumn(e.target.value)}
              >
                <MenuItem value=""><em>Select a column</em></MenuItem>
                {stats?.column_names?.map(column => (
                  <MenuItem key={column} value={column}>{column}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Missing Value Type</InputLabel>
              <Select
                value={selectedMissingValueType}
                label="Missing Value Type"
                onChange={(e) => setSelectedMissingValueType(e.target.value)}
              >
                <MenuItem value="null">Null</MenuItem>
                <MenuItem value="nan">NaN</MenuItem>
                <MenuItem value="empty">Empty string</MenuItem>
                <MenuItem value="na">N/A or NA</MenuItem>
                <MenuItem value="custom">Custom text</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Action</InputLabel>
              <Select
                value={selectedStrategy}
                label="Action"
                onChange={(e) => setSelectedStrategy(e.target.value)}
              >
                <MenuItem value="drop">Drop row</MenuItem>
                <MenuItem value="replace">Replace with value</MenuItem>
                <MenuItem value="mean">Replace with mean</MenuItem>
                <MenuItem value="median">Replace with median</MenuItem>
                <MenuItem value="mode">Replace with mode</MenuItem>
              </Select>
            </FormControl>
            
            {selectedStrategy === 'replace' && (
              <TextField
                fullWidth
                label="Replacement Value"
                value={customReplacementValue}
                onChange={(e) => setCustomReplacementValue(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
            
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={addMissingValueRule}
              disabled={!selectedColumn}
            >
              Add Rule
            </Button>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Applied Rules:
          </Typography>
          
          {missingSetting.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Column</TableCell>
                    <TableCell>Missing Type</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {missingSetting.map((rule, index) => (
                    <TableRow key={index}>
                      <TableCell>{rule.column}</TableCell>
                      <TableCell>{rule.missingType}</TableCell>
                      <TableCell>{rule.action}</TableCell>
                      <TableCell>{rule.replacement || '-'}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => removeMissingValueRule(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No rules defined yet. Add rules above.
            </Typography>
          )}
        </Paper>
      </Box>
      
      {/* Duplicates Tab */}
      <Box role="tabpanel" hidden={tabValue !== 1} sx={{ mt: 2 }}>
        <Paper sx={{ p: 2 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={duplicateSettings.dropDuplicates}
                  onChange={handleDuplicateChange}
                  name="dropDuplicates"
                />
              }
              label={`Remove duplicate rows (${stats?.duplicate_rows || 0} found)`}
            />
          </FormGroup>
        </Paper>
      </Box>
      
      {/* Columns Tab */}
      <Box role="tabpanel" hidden={tabValue !== 2} sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Select columns to remove
        </Typography>
        
        <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
          <FormGroup>
            {stats?.column_names?.map(column => (
              <FormControlLabel
                key={column}
                control={
                  <Checkbox
                    checked={columnsToDrop.includes(column)}
                    onChange={handleColumnSelectionChange}
                    value={column}
                  />
                }
                label={column}
              />
            ))}
          </FormGroup>
        </Paper>
        
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            {columnsToDrop.length} columns selected for removal
          </Typography>
        </Box>
      </Box>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleCleanData}
        sx={{ mt: 3 }}
        disabled={!duplicateSettings.dropDuplicates && 
                 columnsToDrop.length === 0 && 
                 missingSetting.length === 0}
        fullWidth
      >
        Apply All Cleaning Operations
      </Button>
    </Box>
  );
}

export default CustomCleaningOptions;