// src/components/ExcelStyleTable.js
import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Box, styled
} from '@mui/material';

// Styled components for Excel-like appearance
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '2px 6px',
  fontSize: '0.875rem',
  border: `1px solid ${theme.palette.divider}`,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '180px'
}));

const StyledTableHeaderCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: '#f1f1f1',
  fontWeight: 'bold',
  position: 'sticky',
  top: 0,
  zIndex: 2
}));

const StyledTableRow = styled(TableRow)(({ theme, index }) => ({
  backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
  '&:hover': {
    backgroundColor: '#e6f7ff',
  },
}));

function ExcelStyleTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
          No data to display. Please upload a file.
        </Paper>
      </Box>
    );
  }

  // Get column headers from the first row
  const columns = Object.keys(data[0]);

  return (
    <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
        <Table stickyHeader size="small" sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableHeaderCell key={column}>
                  {column}
                </StyledTableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <StyledTableRow key={rowIndex} index={rowIndex}>
                {columns.map((column) => (
                  <StyledTableCell key={`${rowIndex}-${column}`}>
                    {row[column] !== null ? String(row[column]) : ''}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ExcelStyleTable;