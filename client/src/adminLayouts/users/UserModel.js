import * as React from 'react';
import Button from '@mui/material/Button';
import MDButton from '../../components/MDButton';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { userContext } from '../../AuthContext';
import {useState, useContext} from "react"
import axios from "axios"



const UserModel = ({setCreate}) => {

  const [formstate, setformstate] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    dateOfBirth: "",
    city: "",
    state: "",
    aadhaarCardNumber: "",
    password: "",
    role: "",
  });
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
    
  const getDetails = useContext(userContext);

  const [reRender, setReRender] = useState(true);



  const handleClose = () => {
    setCreate(false);
  };


  async function formSubmit() {
    setformstate(formstate);
    console.log(formstate)

    const { firstName, lastName, email, mobile, gender, dateOfBirth, city, state, aadhaarCardNumber, password, role} = formstate;

    // const res = await axios.post(`${baseUrl}api/v1/users`, {
    //   withCredentials: true,
    //   headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Credentials": true
    //   },
    //   body: JSON.stringify({

    // });

    const res = await fetch(`${baseUrl}api/v1/users`, {
      method: "POST",
      credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        firstName, lastName, email, mobile, gender, dateOfBirth, city, state, aadhaarCardNumber, password, role })
      })
  // });
  
  const data = await res.json();
           
    // const data = res.data;
    console.log(data);
    if(data.status === 422 || data.error || !data){ 
        window.alert(data.error);
        console.log("Invalid Entry");
    }else{
        window.alert("User Created Successfully");
        console.log("entry succesfull");
    }
    setCreate(false);
    // reRender ? setReRender(false) : setReRender(true)

}

  return (
    <>

        <TextField
          id="outlined-basic" label="First Name" variant="standard"
          sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.firstName = e.target.value}}/>

        <TextField
          id="outlined-basic" label="Last Name" variant="standard" 
          sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.lastName = e.target.value}}/>
        

        <TextField
          id="outlined-basic" label="Email ID" variant="standard" type="email"
          sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.email = e.target.value}}/>

        
        <TextField
          id="outlined-basic" label="Mobile No" variant="standard" type="number" 
          sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.mobile = e.target.value}}/>
        
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Gender"
            sx={{ margin: 1, padding: 1, width: "300px" }}
            onChange={(e)=>{formstate.gender = e.target.value}}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>


        <TextField
          id="outlined-basic" label="Date of Birth" variant="standard" type="date"
          sx={{ margin: 1, padding: 2, width: "300px" }} onChange={(e)=>{formstate.dateOfBirth = e.target.value}}/>
        
        <TextField
          id="outlined-basic" label="City" variant="standard" 
          sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.city = e.target.value}}/>

        <TextField
          id="outlined-basic" label="State" variant="standard" 
          sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.state = e.target.value}}/>
        
        <TextField
          id="outlined-basic" label="Aadhaar Card Number" variant="standard" type="number"
          sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.aadhaarCardNumber = e.target.value}}/>

        <TextField
          id="outlined-basic" label="Password" variant="standard" 
          sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.password = e.target.value}}/>
        
        <TextField
          id="outlined-basic" label="Role" variant="standard" 
          sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.role = e.target.value}}/>

      <Button autoFocus onClick={formSubmit}>
        Save
      </Button>
      <Button onClick={handleClose} autoFocus>
        Close
      </Button>

    </>
  );
}

export default UserModel;