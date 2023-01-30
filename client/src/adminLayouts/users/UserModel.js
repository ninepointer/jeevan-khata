import * as React from 'react';
import Button from '@mui/material/Button';
import MDBox from '../../components/MDBox';
import MDTypography from '../../components/MDTypography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MDButton from '../../components/MDButton';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { userContext } from '../../AuthContext';
import {useState, useContext, useEffect} from "react"
import axios from "axios"
import { textAlign } from '@mui/system';



const UserModel = ({setCreate}) => {

  const gender = [
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Female',
      label: 'Female',
    },
  ];

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
    address: "",
  });
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:8080/"
    
  const getDetails = useContext(userContext);

  const [roleDetail, setRoleDetail] = useState([]);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/roles`)
    .then((res)=>{
      setRoleDetail(res.data.data)
      console.log("res.data.data", res.data.data)
    })
    .catch(()=>{
      console.log("Fail to fetch data")
    })
  },[])


  const handleClose = () => {
    setCreate(false);
  };


  async function formSubmit() {
    setformstate(formstate);
    console.log(formstate)

    const { firstName, lastName, email, mobile, gender, dateOfBirth, city, state, aadhaarCardNumber, password, role, address} = formstate;

      const res = await fetch(`${baseUrl}api/v1/users`, {
        method: "POST",
        credentials:"include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        firstName, lastName, email, mobile, gender, dateOfBirth, city, state, aadhaarCardNumber, password, role, address })
      })
  
  const data = await res.json();
    console.log(data);
    if(data.status === 422 || data.error || !data){ 
        window.alert(data.error);
        console.log("Invalid Entry");
    }else{
        window.alert("User Created Successfully");
        console.log("entry succesfull");
    }
    setCreate(false);

}

function settingRole(e){
  roleDetail.map((elem)=>{
    if(elem.roleName === e.target.value){
      // setRole(e.target.value);
      formstate.role = elem._id
    }
  })
}

  return (
    <>
        <MDBox pt={3} pb={3}>
        <MDTypography variant="h6" fontWeight="medium" borderRadius="10px" color="white" backgroundColor="#afb0b2" marginLeft="15px">
          &nbsp;&nbsp;Create User
        </MDTypography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch',margin: 1, padding: 1, width: "250px" },
          }}
          noValidate
          autoComplete="off"
        >
        <TextField
          id="filled-basic" label="First Name" variant="filled"
          sx={{margin: 1, padding: 1, width: "250px"}} onChange={(e)=>{formstate.firstName = e.target.value}}
          />

        <TextField
          id="filled-basic" label="Last Name" variant="filled"
          sx={{margin: 1, padding: 1, width: "250px"}} onChange={(e)=>{formstate.lastName = e.target.value}}/>
        

        <TextField
          id="filled-basic" label="Email ID" variant="filled"
          sx={{margin: 1, padding: 1, width: "250px"}} onChange={(e)=>{formstate.email = e.target.value}}/>

        
        <TextField
          id="filled-basic" label="Mobile No." variant="filled"
          sx={{margin: 1, padding: 1, width: "250px"}} onChange={(e)=>{formstate.mobile = e.target.value}}/>
        
        <TextField
          id="filled-basic"
          select
          label="Gender"
          defaultValue=""
          helperText="Please select your gender"
          variant="filled"
          sx={{margin: 4, padding: 2, width: "200px"}}
          onChange={(e)=>{formstate.gender = e.target.value}}
        >
          {gender.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>


        <TextField
          id="filled-basic" label="Date of Birth" variant="filled" type="date"
          sx={{ margin: 4, padding: 2, width: "200px"}} onChange={(e)=>{formstate.dateOfBirth = e.target.value}}/>
        
        <TextField
          id="filled-basic" label="City" variant="filled" 
          sx={{ margin: 4, padding: 2, width: "200px"}} onChange={(e)=>{formstate.city = e.target.value}}/>

        <TextField
          id="filled-basic" label="State" variant="filled" 
          sx={{ margin: 4, padding: 2, width: "200px"}} onChange={(e)=>{formstate.state = e.target.value}}/>
        
        <TextField
          id="filled-basic" label="Aadhaar Card Number" variant="filled" type="number"
          sx={{ margin: 4, padding: 2, width: "200px"}} onChange={(e)=>{formstate.aadhaarCardNumber = e.target.value}}/>

        <TextField
          id="filled-basic" label="Password" variant="filled" 
          sx={{ margin: 4, padding: 2, width: "200px"}} onChange={(e)=>{formstate.password = e.target.value}}/>
        
        <TextField
          id="filled-basic"
          select
          label="Role"
          defaultValue=""
          helperText="Please select role"
          variant="filled"
          sx={{margin: 4, padding: 2, width: "200px"}}
          onChange={(e)=>{settingRole(e)}}
        >
          {roleDetail.map((option) => (
            <MenuItem key={option.roleName} value={option.roleName}>
              {option.roleName}
            </MenuItem>
          ))}
        </TextField>


        <TextField
          id="filled-basic" label="Address" variant="filled" 
          sx={{ margin: 4, padding: 2, width: "200px"}} onChange={(e)=>{formstate.address = e.target.value}}/>
      </Box>
      <Button autoFocus onClick={formSubmit}>
        Save
      </Button>
      <Button onClick={handleClose} autoFocus>
        Close
      </Button>
      </MDBox>

    </>
  );
}

export default UserModel;