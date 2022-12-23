import React, { useState, useEffect } from 'react'
import FormControl from '@mui/material/FormControl';
import { Grid, TextField, Box, Button, Typography } from '@mui/material'
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {

const [ email, setEmail ] = useState('')
const [ password, setPassword ] = useState('')
const auth = getAuth();
const [ err, setErr ] = useState()
const navigate = useNavigate()

const onSubmit = (e) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    navigate('/dashboard', {state: { email: email }})
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    setErr(error.message)
  });

}
  return (
    <>
    <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
            >

            <Grid item xs={3}>
            <form onSubmit={onSubmit}>
                <Box mt={2}>
                    <TextField id="email" label="Email" type="email "variant="outlined" required onChange={(e) => setEmail(e.target.value)}/>
                </Box>
                <Box mt={2}>
                    <TextField id="password" type="password" label="Password" variant="outlined" required onChange={(e) => setPassword(e.target.value)}/>
                </Box>
                {err && <Box mt={2}>
                  <span style={{ color: "red" }} className="row">{err}</span>
                </Box>}
                <Box mt={2} justifyContent="center">
                <Button variant="contained" type="submit">Sign In</Button>
                </Box>
            </form>
            </Grid>  
           
        </Grid> 
    </>
  )
}

export default SignIn
