import React, { useEffect, useState } from 'react'
import { useProvinceStatsContext } from '../context/ProvinceStatsContextProviders'
import { useLocation } from 'react-router-dom'
import logo from '../images/logo.png'
import { Container, Grid, Box, TextField, CircularProgress, Typography } from '@mui/material'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import UserProfileDropdown from './UserProfileDropdown'


const ProvinceStats = () => {

const {getResultsByProvince, provinceStats, getResultByDate, provinceStatsByDate, isLoading} = useProvinceStatsContext()
const location = useLocation()
const [ value, setValue ] = useState(null)
const [ date , setDate ] = useState('')
const [ data, setData ] = useState([])
const maxDate = new Date()


useEffect(() => {
  console.log(provinceStatsByDate)
  setData([
    {
          name: 'Active Cases',
          Today: provinceStatsByDate.todayActiveCases,
          Previous: provinceStatsByDate.previousActiveCases,
          
        },
        {
          name: 'Confirmed Cases',
          Today: provinceStatsByDate.todayConfirmedCases,
          Previous: provinceStatsByDate.previousConfirmedCases,
        },
        {
          name: 'Deaths',
          Today: provinceStatsByDate.todayDeaths,
          Previous: provinceStatsByDate.previousDeaths,
        },
        {
          name: 'Recovered',
          Today: provinceStatsByDate.todayRecovered,
          Previous: provinceStatsByDate.previousRecovered,
        },
  ])
},[provinceStatsByDate])

useEffect(() => {
  setDate(new Date(value).toISOString().substring(0, 10))
},[value])

useEffect(() => {
  getResultByDate(location.state.province, date)
},[date])

useEffect(() => {
    getResultsByProvince(location.state.province)
    // console.log(location.state.province)
},[])

  return (
    <>
        <Container maxWidth="lg">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ height: '10vh'}}>
                    <img src={logo} alt="logo"/>
                </Box>
              </Grid>
              <Grid item xs={7}>
                <Box sx={{ height: '10vh'}} mt={3}>
                  
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                              
                              label="Select a Date"
                              value={value}
                              onChange={(newValue) => {
                              setValue(newValue);
                              }}
                              renderInput={(params) => <TextField {...params} />}
                              maxDate={maxDate}
                          />
                      </LocalizationProvider>
                </Box>
              </Grid>
              <Grid item xs={1} mt={3}>
                  <UserProfileDropdown />
              </Grid>
            </Grid>
          </Container>

          <Container maxWidth="lg">
          <Grid container spacing={2}>
        
            <Grid item xs={12}>
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  style={{ minHeight: '100vh' }}
                >
                
                
                { isLoading ? <CircularProgress /> : (
                  <>
                    <Typography component="h5">Showing stats for {location.state.province}</Typography>
                    <Grid item xs={3}>
                    <Box sx={{ height: '100vh'}}>
                    <BarChart
                    width={700}
                    height={700}
                    data={data}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Previous" stackId="a" fill="#8884d8" />
                  <Bar dataKey="Today" stackId="a" fill="#82ca9d" />
                  </BarChart>
                  </Box>
                  </Grid>
                </>
                )}     
                
              </Grid> 
                
              </Grid>
          </Grid>
          
          
          </Container>
    </>
  )
}

export default ProvinceStats
