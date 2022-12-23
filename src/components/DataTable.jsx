import React from 'react'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  // { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'date',
    headerName: 'Date',
    width: 100,
    editable: false,
  },
  {
    field: 'province',
    headerName: 'Province',
    width: 150,
    editable: false,
  },
  {
    field: 'active',
    headerName: 'Active Cases',
    type: 'number',
    width: 170,
    editable: false,
  },
  {
    field: 'confirmed',
    headerName: 'Confirmed Cases',
    type: 'number',
    width: 150,
    editable: false,
  },
  {
    field: 'deaths',
    headerName: 'Deaths',
    type: 'number',
    width: 130,
    editable: false,
  },
  {
    field: 'fatality_rate',
    headerName: 'Fatality Rate',
    type: 'number',
    width: 150,
    editable: false,
  },
  
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];


const DataTable = () => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  )
}

export default DataTable
