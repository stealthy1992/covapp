import React, { useState, useEffect } from 'react'
import FormControl from '@mui/material/FormControl';
import { Grid, TextField, Box, Button, Typography } from '@mui/material'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { db } from '../firebase.config'
import { collection, query, addDoc } from 'firebase/firestore';

const SignUp = () => {

const [ userCreds, setUserCreds ] = useState({})
const [ firstName, setFirstName ] = useState('')
const [ lastName, setLastName ] = useState('')
const [ email, setEmail ] = useState('')
const [ password, setPassword ] = useState('')
const [ confirmPassword, setConfirmPassword ] = useState('')
const auth = getAuth();
const [ err, setErr ] = useState('')
const navigate = useNavigate()



const onSubmit = (e) => {
   e.preventDefault()
  //  setUserCreds({
  //   firstName: firstName,
  //   lastName: lastName,
  //   email: email
  //  })
   console.log(email, password)
   createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    const docRef = query(collection(db, "users"))
    addDoc(docRef, {
      firstName: firstName,
      lastName: lastName,
      email: email,
    })
    navigate('/dashboard', { state: {email: email, firstName: firstName, lastName: lastName}})
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    console.log(error.code)
    if(error.code === 'auth/weak-password')
    {
      setErr("Password should be atleast 6 characters long")
    }
    else if(error.code === 'auth/email-already-in-use')
    {
      setErr("Email already in use")
    }
    // setErr(error.message);
    // setErr(errorMessage)
    // ..
  });
}

useEffect(() => {
    console.log(userCreds)
},[userCreds])
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
                    <TextField id="firstname" label="First Name" variant="outlined" required onChange={(e) => setFirstName(e.target.value)}/>
                </Box>
                <Box mt={2}>
                    <TextField id="lastname" label="Last Name" variant="outlined" required onChange={(e) => setLastName(e.target.value)}/>
                </Box>
                <Box mt={2}>
                    <TextField id="email" label="Email" type="email "variant="outlined" required onChange={(e) => setEmail(e.target.value)}/>
                </Box>
                <Box mt={2}>
                    <TextField id="password" type="password" label="Password" variant="outlined" required onChange={(e) => setPassword(e.target.value)}/>
                </Box>
                <Box mt={2}>
                    <TextField id="confirmpassword" type="password" label="Confirm Password" variant="outlined" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                </Box>
                {err && <Box mt={2}>
                  <span style={{ color: "red" }} className="row">{err}</span>
                </Box>}
                <Box mt={2} justifyContent="center">
                <Button variant="contained" type="submit">Register</Button>
                </Box>
            </form>
            <Box mt={2} justifyContent="center">
                <Typography component="h2">Already a user? <Link to="/signin">Sign In</Link></Typography>
                
              </Box>
            </Grid>  
           
        </Grid> 
    </>
  )
}

export default SignUp
