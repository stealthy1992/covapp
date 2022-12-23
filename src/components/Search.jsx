import React, {useEffect, useState }from 'react'
import { TextField, Button, Box, Grid, CircularProgress} from '@mui/material'
import { useResultContext } from '../context/ResultContextProvider'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DataGrid } from '@mui/x-data-grid';
import UserProfileDropdown from './UserProfileDropdown';
import { useNavigate } from 'react-router-dom'
import ProvinceStats from './ProvinceStats';


const Search = () => {

// Data Grid Columns

const columns = [
  // { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    editable: false,
  },
  {
    field: 'province',
    headerName: 'Province',
    width: 120,
    editable: false,
  },
  {
    field: 'active',
    headerName: 'Active Cases',
    type: 'number',
    width: 120,
    editable: false,
  },
  {
    field: 'confirmed',
    headerName: 'Confirmed Cases',
    type: 'number',
    width: 120,
    editable: false,
  },
  {
    field: 'deaths',
    headerName: 'Deaths',
    type: 'number',
    width: 120,
    editable: false,
  },
  {
    field: 'fatality_rate',
    headerName: 'Fatality Rate',
    type: 'number',
    width: 120,
    editable: false,
  },
  {
    field: 'action',
    headerName: 'Action',
    width: 180,
    renderCell: (params) => (
      <Button variant="contained" onClick={() => navigate('/provincestats', {state: {province: params.row.province}})}>
        View Stats
      </Button>
    ),
  },
  
];

// Data Grid Ends

const [ country, setCountry ] = useState('')
const { getResults, results, getStats, stats, isLoading } = useResultContext()
const [ rows, setRows ] = useState([])
const navigate = useNavigate()

const handleChange = (event) => {
    setCountry(event.target.value);
};

const onSubmit = () => {

    getStats(country)
}

useEffect(() => {

    setRows(stats)

},[stats])

useEffect(() => {
    getResults('/regions')
},[])
  return (
    <>
    <Grid container spacing={2}>
        <Grid item xs={4} mt={1}>
            <FormControl sx={{ m: 1, minWidth: 270 }} disabled={isLoading}>
                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={country}
                        label="Country"
                        onChange={handleChange}
                    >
                        {results?.data?.map(({iso, name}, index) => (
                            <MenuItem value={iso} key={index}>{name}</MenuItem>
                        ))}
                        
                    </Select>
            </FormControl>
        </Grid>
        <Grid item xs={7} mt={3}>
            <Button variant="contained" onClick={onSubmit} disabled={isLoading}>Submit</Button>
        </Grid>
        <Grid item xs={1} mt={3}>
            <UserProfileDropdown />
        </Grid>
    </Grid>
    {isLoading ? (<Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >

      <Grid item xs={3}>
        <CircularProgress />
      </Grid>   
      
    </Grid> 
    ) : (<Grid container spacing={2} mt={4}>
        <Grid item xs={12}>
        <Box sx={{ height: 660, width: '100%' }}>
        <DataGrid
            getRowId={row => row.id}
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            disableSelectionOnClick
        />
        </Box>
        </Grid>

    </Grid>)}
      
    </>
  )
}

export default Search
