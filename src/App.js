import logo from './logo.svg';
import './App.css';
import { useResultContext} from './context/ResultContextProvider'
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Grid } from '@mui/material';
import Container from '@mui/material/Container';
import Search from './components/Search'
import DataTable from './components/DataTable';
import SignUp from './components/SignUp';
import { db } from './firebase.config'

function App() {

  // useEffect(() => {
  //   getResults()
  // },[])

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SignUp />
          </Grid>
        </Grid>
      </Container>
    </>
    
  );
}

export default App;
