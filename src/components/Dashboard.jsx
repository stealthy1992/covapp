import React, { useEffect, useState } from 'react'
import Search from './Search'
import { Grid, Container, Box} from '@mui/material'
import { useLocation } from 'react-router-dom'
import SignIn from './SignIn'
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import logo from '../images/logo.png'
import MyBreadcrumbs from './MyBreadcrumbs'

const Dashboard = () => {
const location = useLocation()
const auth = getAuth()
const [ token, setToken ] = useState()
const navigate = useNavigate()



if(!auth.currentUser) 
return <SignIn />

return (
        <>
          <Container maxWidth="lg">
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Box sx={{ height: '10vh'}}>
                    <img src={logo} alt="logo"/>
                </Box>
              </Grid>
              <Grid item xs={10}>
                <MyBreadcrumbs />
                <Box sx={{ height: '100vh'}}>
                  <Search />
                </Box>
              </Grid>
              
            </Grid>
            
          </Container>
        </>
      )
}

export default Dashboard
